const express = require('express');
const router = express.Router();
const { markAttendance, getAttendanceByStudentId, getAllAttendance } = require('../controllers/attendanceController');

// Defines the POST route for marking attendance
// The full path will be /api/attendance/mark
router.post('/mark', markAttendance);

// Defines the GET route for fetching all attendance records
// The full path will be /api/attendance/
router.get('/', getAllAttendance);

// Defines the GET route for fetching attendance by student ID
// The full path will be /api/attendance/:studentId
router.get('/:studentId', getAttendanceByStudentId);

module.exports = router;
