const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const router = express.Router();

// ✅ Attendance Schema
const attendanceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    periods: {
        1: { type: String, default: "Absent" },
        2: { type: String, default: "Absent" },
        3: { type: String, default: "Absent" },
        4: { type: String, default: "Absent" },
        5: { type: String, default: "Absent" },
        6: { type: String, default: "Absent" },
        7: { type: String, default: "Absent" }
    },
    date: { type: Date, default: Date.now }
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

// ✅ Middleware: Authenticate User
const authenticateUser = (req, res, next) => {
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

// ✅ Middleware: Authenticate and Verify Staff Role
const authenticateStaff = (req, res, next) => {
    if (req.user.role !== "staff") {
        return res.status(403).json({ message: "Only staff can manage attendance." });
    }
    next();
};

// ✅ Mark Attendance (Only Staff)
router.post("/mark", authenticateUser, authenticateStaff, async (req, res) => {
    try {
        const { name, periods } = req.body;
        if (!name) return res.status(400).json({ message: "Student name is required." });

        const newRecord = new Attendance({ name, periods });
        await newRecord.save();

        res.status(201).json({ message: "Attendance marked successfully!", attendance: newRecord });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Fetch Attendance (Students see their own, Staff sees all)
router.get("/", authenticateUser, async (req, res) => {
    try {
        let records;
        if (req.user.role === "staff") {
            records = await Attendance.find().sort({ date: -1 }); // Staff can see all records
        } else {
            records = await Attendance.find({ name: req.user.name }).sort({ date: -1 }); // Students see their own records
        }
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Update Attendance (Only Staff)
router.put("/:id", authenticateUser, authenticateStaff, async (req, res) => {
    try {
        const { name, periods } = req.body;

        const updatedRecord = await Attendance.findByIdAndUpdate(
            req.params.id,
            { name, periods },
            { new: true, runValidators: true }
        );

        if (!updatedRecord) {
            return res.status(404).json({ message: "Attendance record not found." });
        }

        res.status(200).json({ message: "Attendance updated successfully!", attendance: updatedRecord });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Delete an Attendance Record (Only Staff)
router.delete("/:id", authenticateUser, authenticateStaff, async (req, res) => {
    try {
        const record = await Attendance.findByIdAndDelete(req.params.id);
        if (!record) return res.status(404).json({ message: "Record not found." });

        res.status(200).json({ message: "Attendance record deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
