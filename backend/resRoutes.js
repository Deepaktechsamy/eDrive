const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Ensure 'res_uploads' directory exists
const resUploadsPath = path.join(__dirname, "res_uploads");
if (!fs.existsSync(resUploadsPath)) {
    fs.mkdirSync(resUploadsPath);
}

// Serve 'res_uploads' as a static folder
router.use("/res_uploads", express.static(resUploadsPath));

// Multer Storage for Resource File Uploads
const resStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, resUploadsPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: resStorage });

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

// Upload Resource File (Staff Only)
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

// Fetch Resource File List
router.get("/files", verifyToken, (req, res) => {
    fs.readdir(resUploadsPath, (err, files) => {
        if (err) {
            return res.status(500).json({ message: "Failed to fetch files." });
        }
        res.status(200).json(files);
    });
});

// Delete Resource File (Staff Only)
router.delete("/delete/:fileName", verifyToken, (req, res) => {
    if (req.user.role !== "staff") {
        return res.status(403).json({ message: "Only staff can delete files." });
    }

    const filePath = path.join(resUploadsPath, req.params.fileName);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found." });
    }

    fs.unlinkSync(filePath);
    res.status(200).json({ message: "File deleted successfully." });
});

module.exports = router;
