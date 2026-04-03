const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAttendanceReport,
  getAttendanceByStudentId // Assuming you have this controller
} = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware'); // Assuming you have auth middleware

// --- CORRECT ORDER ---

// 1. Specific route for reports should come first.
router.get('/report', authMiddleware, getAttendanceReport); // This is line 13

// 2. Route to mark attendance
router.post('/', authMiddleware, markAttendance);

// 3. Dynamic route for a specific student should come last.
// Commenting this out to prevent crash until it is implemented.
// router.get('/:studentId', authMiddleware, getAttendanceByStudentId);


module.exports = router;
