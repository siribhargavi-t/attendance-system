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
// FIX: Authorize both 'admin' and 'faculty' to mark attendance
router.post('/mark', protect, authorize('admin', 'faculty'), markAttendance); 

// GET /api/attendance/student/me
router.get('/student/me', protect, authorize('student'), getMyAttendance);

// GET /api/attendance/student/:id (Can be kept for admin/faculty use if needed)
router.get('/student/:id', protect, authorize('admin', 'faculty'), getStudentAttendance);

// GET /api/attendance/percentage/:id
router.get('/percentage/:id', protect, authorize('admin', 'faculty'), getAttendancePercentage);

// GET /api/attendance/weekly
router.get('/weekly', protect, authorize('admin', 'faculty'), getWeeklyAttendance);

// GET /api/attendance/recent
router.get('/recent', protect, authorize('admin', 'faculty'), getRecentAttendance);

module.exports = router;
