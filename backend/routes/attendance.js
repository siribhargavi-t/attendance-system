const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const Attendance = require('../models/Attendance'); // Import the Attendance model

// Placeholder controller functions.
// In a real app, these would be in 'controllers/attendanceController.js'
const markAttendance = (req, res) => {
    res.status(200).json({ success: true, message: 'Attendance marked (placeholder)' });
};

const getAttendance = (req, res) => {
    res.status(200).json({ success: true, message: 'Fetched attendance (placeholder)' });
};

// Controller function for creating a new attendance record
const createAttendance = async (req, res) => {
    try {
        const { studentId, status } = req.body;

        // It's good practice to associate the record with the logged-in user if studentId isn't provided
        const finalStudentId = studentId || req.user.id;

        const attendance = await Attendance.create({
            studentId: finalStudentId,
            status,
            date: new Date(),
        });

        res.status(201).json(attendance);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Define routes
// A route for creating an attendance record (e.g., by a student)
router.route('/').post(protect, createAttendance);

// Example: A route for a student to view their own attendance
router.route('/').get(protect, authorize('student', 'admin'), getAttendance);

// Example: A route for an admin to mark attendance
router.route('/mark').post(protect, authorize('admin'), markAttendance);

module.exports = router;