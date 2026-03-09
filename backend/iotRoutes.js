const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Ensure 'iot_uploads' directory exists
const iotUploadsPath = path.join(__dirname, "iot_uploads");
if (!fs.existsSync(iotUploadsPath)) {
    fs.mkdirSync(iotUploadsPath);
}

// Serve 'iot_uploads' as a static folder
router.use("/iot_uploads", express.static(iotUploadsPath));

// Multer Storage for IoT File Uploads
const iotStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, iotUploadsPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: iotStorage });

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided." });

    try {
        const decoded = jwt.verify(token, "your_jwt_secret");
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token." });
    }
};

// Upload IoT File (Staff Only)
router.post("/upload", verifyToken, upload.single("file"), (req, res) => {
    if (req.user.role !== "staff") {
        return res.status(403).json({ message: "Only staff can upload files." });
    }

    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
    }

    res.status(200).json({
        message: "File uploaded successfully!",
        filePath: req.file.path
    });
});

// Fetch IoT File List
router.get("/files", verifyToken, (req, res) => {
    fs.readdir(iotUploadsPath, (err, files) => {
        if (err) {
            return res.status(500).json({ message: "Failed to fetch files." });
        }
        res.status(200).json(files);
    });
});

// Delete IoT File (Staff Only)
router.delete("/delete/:fileName", verifyToken, (req, res) => {
    if (req.user.role !== "staff") {
        return res.status(403).json({ message: "Only staff can delete files." });
    }

    const filePath = path.join(iotUploadsPath, req.params.fileName);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found." });
    }

    fs.unlinkSync(filePath);
    res.status(200).json({ message: "File deleted successfully." });
});

module.exports = router;
