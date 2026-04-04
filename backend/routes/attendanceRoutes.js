const express = require('express');
const router = express.Router();
<<<<<<< HEAD
=======
const {
  markAttendance,
  getAttendanceReport,
  getAttendanceByStudentId,
  getAttendance 
} = require('../controllers/attendanceController');
>>>>>>> b2b64c2c5d26d77d57d74e0be84e8a11b0fc16ef
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { reviewAttendanceRequest, markAttendance, markBulk } = require('../controllers/attendanceController');

<<<<<<< HEAD
// All custom overrides / manual additions
router.post('/mark', authMiddleware, adminMiddleware, markAttendance);
router.post('/mark-bulk', authMiddleware, adminMiddleware, markBulk);
router.post('/review-request', authMiddleware, adminMiddleware, reviewAttendanceRequest);
=======
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
>>>>>>> b2b64c2c5d26d77d57d74e0be84e8a11b0fc16ef

module.exports = router;
