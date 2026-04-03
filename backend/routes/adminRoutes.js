const express = require('express');
const router = express.Router();
const { getAdminAllAttendance, getAdminStats } = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');
// In a real app, you would also have an admin-specific middleware here

// @route   GET /api/admin/attendance
// @desc    Get all attendance records for all students
// @access  Private (Admin)
router.get('/attendance', authMiddleware, getAdminAllAttendance); // Assuming admins are also authenticated users

// @route   GET /api/admin/stats
// @desc    Get summary statistics for admins
// @access  Private (Admin)
router.get('/stats', authMiddleware, getAdminStats);

module.exports = router;