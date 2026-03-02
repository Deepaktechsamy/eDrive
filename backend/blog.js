const express = require("express");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const fs = require("fs");

const router = express.Router();

// ✅ Ensure Upload Directory Exists
const uploadDir = path.join(__dirname, "../bloguploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Blog Schema
const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    role: { type: String, enum: ["student", "staff"], required: true },
    image: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Blog = mongoose.model("Blog", blogSchema);

// ✅ Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueFilename = Date.now() + path.extname(file.originalname);
        cb(null, uniqueFilename);
    }
});

// ✅ File filter to accept only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only images (JPEG, JPG, PNG) are allowed"), false);
    }
};

const upload = multer({ storage, fileFilter });

// ✅ Serve uploaded images as static files
router.use("/bloguploads", express.static(path.join(__dirname, "../bloguploads")));

// ✅ Create a new blog post
router.post("/create", upload.single("image"), async (req, res) => {
    try {
        const { title, content, author, role } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: "Image is required" });
        }

        console.log("Uploaded File:", req.file);

        const imageFilename = req.file.filename;
        const imageUrl = `http://localhost:5000/bloguploads/${imageFilename}`;

        const newBlog = new Blog({
            title,
            content,
            author,
            role,
            image: imageUrl
        });

        await newBlog.save();
        res.status(201).json({ message: "✅ Blog created successfully", blog: newBlog });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get all blog posts
router.get("/", async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get a single blog post by ID
router.get("/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Delete a blog post
router.delete("/:id", async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }
        res.status(200).json({ message: "✅ Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;


