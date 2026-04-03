const express = require('express');
const router = express.Router();
const { 
    markAttendance, 
    getAttendanceByStudentId, 
    getAllAttendance, 
    getAttendanceSummary, 
    getStudentAttendanceReport, 
    getMonthlyAttendanceReport,
    getMyAttendance,
    getMyAttendanceReport
} = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');

// PROTECTED ROUTES (for logged-in users)
router.post('/mark', authMiddleware, markAttendance);
router.get('/my-records', authMiddleware, getMyAttendance);
router.get('/my-report', authMiddleware, getMyAttendanceReport);


// PUBLIC / ADMIN ROUTES
router.get('/', getAllAttendance);
router.get('/summary', getAttendanceSummary);
router.get('/monthly', getMonthlyAttendanceReport);
router.get('/student/:studentId', getStudentAttendanceReport);
router.get('/:studentId', getAttendanceByStudentId);


module.exports = router;
