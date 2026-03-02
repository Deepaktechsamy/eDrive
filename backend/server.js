const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const iotRoutes = require("./iotRoutes"); // Import IoT Routes
const ssdRoutes = require("./ssdRoutes"); // Import SSD Routes
const psaRoutes = require("./psaRoutes"); // Import PSA Routes
const renenergyRoutes = require("./renenergyRoutes"); // Import Renewable Energy Routes
const semRoutes = require("./semRoutes"); // Import SEM Routes
const attendanceRoutes = require("./attendance");



const { generateResponse } = require("./gpt4all"); // ✅ Import GPT-4All function

  // Load environment variables
     // Enable CORS
 // Express framework





const blogRoutes = require("./blog");
const app = express();

const PORT = process.env.PORT || 5000;
const blogUploadsPath = path.join(__dirname, "bloguploads");
if (!fs.existsSync(blogUploadsPath)) {
    fs.mkdirSync(blogUploadsPath);
}


// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ensure 'uploads' directory exists
const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath);
}

// Serve 'uploads' as a static directory


app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/bloguploads", express.static(path.join(__dirname, "bloguploads")));

// Use IoT Routes
app.use("/api/iot", iotRoutes);
app.use("/api/ssd", ssdRoutes);
app.use("/api/psa", psaRoutes);
app.use("/api/renenergy", renenergyRoutes);
app.use("/api/sem", semRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/attendance", attendanceRoutes);





// ✅ API route for GPT-4All
app.post("/api/chat", async (req, res) => {
    const { prompt } = req.body;
    
    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required." });
    }

    try {
        const response = await generateResponse(prompt);
        res.json({ response });
    } catch (error) {
        res.status(500).json({ error: "Error processing request." });
    }
});




// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

// Allowed File Types
const fileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|txt|ppt|pptx|jpg|jpeg|png/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF, TXT, PPT, and image files are allowed!"), false);
    }
};

// Upload Middleware
const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // Max file size: 100MB
    fileFilter: fileFilter
});

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/mydb", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
.catch(err => console.log("Error connecting to MongoDB: ", err));

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "staff"], required: true }
});

const User = mongoose.model("User", userSchema);

// Signup Route
app.post("/api/signup", async (req, res) => {
    const { email, password, role, secretCode } = req.body;
    const correctSecretCode = "gokulraj"; // Hardcoded Secret Code

    if (!email || !password || !role) {
        return res.status(400).json({ message: "Email, password, and role are required." });
    }

    if (role === "staff" && secretCode !== correctSecretCode) {
        return res.status(403).json({ message: "Invalid secret code for staff." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: "Signup successful!" });
});

// Login Route
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required rafi." });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign({ email: user.email, role: user.role }, "your_jwt_secret", { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful!", token });
});

// Upload File Route (Staff Only)
app.post("/api/upload", upload.single("file"), async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided." });
    }

    try {
        const decodedToken = jwt.verify(token, "your_jwt_secret");

        if (decodedToken.role !== "staff") {
            return res.status(403).json({ message: "Only staff can upload files." });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        res.status(200).json({
            message: "File uploaded successfully!",
            filePath: req.file.path
        });

    } catch (error) {
        console.error("Error verifying token", error);
        res.status(401).json({ message: "Invalid token." });
    }
});

// Fetch File List
app.get("/api/files", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided." });
    }

    try {
        const decodedToken = jwt.verify(token, "your_jwt_secret");

        if (!["staff", "student"].includes(decodedToken.role)) {
            return res.status(403).json({ message: "Access denied." });
        }

        fs.readdir(uploadsPath, (err, files) => {
            if (err) {
                console.error("Error reading uploads directory:", err);
                return res.status(500).json({ message: "Failed to fetch files." });
            }

            res.status(200).json(files);
        });

    } catch (error) {
        console.error("Error verifying token", error);
        res.status(401).json({ message: "Invalid token." });
    }
});

// ✅ Secure Delete File Route
app.delete("/api/delete-file/:fileName", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided." });
    }

    try {
        const decodedToken = jwt.verify(token, "your_jwt_secret");
        if (decodedToken.role !== "staff") {
            return res.status(403).json({ message: "Only staff can delete files." });
        }

        const { fileName } = req.params;
        const safeFileName = path.basename(fileName); // Prevent path traversal attacks
        const filePath = path.join(uploadsPath, safeFileName);

        console.log("Deleting file:", safeFileName); // Debugging log

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "File not found." });
        }

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
                return res.status(500).json({ message: "Failed to delete file." });
            }
            res.status(200).json({ message: "File deleted successfully." });
        });

    } catch (error) {
        console.error("Error verifying token", error);
        res.status(401).json({ message: "Invalid token." });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
