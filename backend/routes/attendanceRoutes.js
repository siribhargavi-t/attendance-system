const express = require('express');
const router = express.Router();
const { 
  markAttendance, 
  getStudentAttendance, 
  getAttendancePercentage, 
  getWeeklyAttendance,
  getRecentAttendance,
  getMyAttendance 
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware'); // Assuming you have this middleware

// POST /api/attendance/mark
router.post('/mark', protect, authorize('admin'), markAttendance); 

// GET /api/attendance/student/me  <-- ADD THIS NEW ROUTE
router.get('/student/me', protect, authorize('student'), getMyAttendance);

// GET /api/attendance/student/:id (Can be kept for admin use if needed)
router.get('/student/:id', protect, getStudentAttendance);

// GET /api/attendance/percentage/:id
router.get('/percentage/:id', protect, getAttendancePercentage);

// GET /api/attendance/weekly
router.get('/weekly', protect, getWeeklyAttendance);

// GET /api/attendance/recent
router.get('/recent', protect, getRecentAttendance);

module.exports = router;
