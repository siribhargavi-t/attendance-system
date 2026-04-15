const express = require('express');
const router = express.Router();
const { 
  markAttendance, 
  getAttendance, 
  updateAttendance, 
  deleteAttendance,
  getAttendancePercentage
} = require('../controllers/attendanceController');

// POST /api/attendance/ → Mark attendance
router.post('/', markAttendance);

// GET /api/attendance/percentage/:studentEmail
router.get('/percentage/:studentEmail', getAttendancePercentage);

// GET /api/attendance/ → Get all attendance
router.get('/', getAttendance);

// PUT /api/attendance/:id → Update attendance by ID
router.put('/:id', updateAttendance);

// DELETE /api/attendance/:id → Delete attendance by ID
router.delete('/:id', deleteAttendance);

module.exports = router;
