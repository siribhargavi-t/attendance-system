const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAttendanceReport,
  getAttendanceByStudentId,
  getAttendance 
} = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');

// Routes for the base path ('/api/attendance')
router.route('/')
  // Temporarily remove authMiddleware to debug
  .get(getAttendance)    // Handles GET /api/attendance
  .post(authMiddleware, markAttendance); // Handles POST /api/attendance

// Route for '/api/attendance/report'
router.route('/report')
  .get(authMiddleware, getAttendanceReport);

// Route for '/api/attendance/:studentId'
// Make sure getAttendanceByStudentId is implemented in your controller
// router.route('/:studentId')
//   .get(authMiddleware, getAttendanceByStudentId);

module.exports = router;
