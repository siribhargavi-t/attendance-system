const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { reviewAttendanceRequest, markAttendance, markBulk } = require('../controllers/attendanceController');

// All custom overrides / manual additions
router.post('/mark', authMiddleware, adminMiddleware, markAttendance);
router.post('/mark-bulk', authMiddleware, adminMiddleware, markBulk);
router.post('/review-request', authMiddleware, adminMiddleware, reviewAttendanceRequest);

module.exports = router;
