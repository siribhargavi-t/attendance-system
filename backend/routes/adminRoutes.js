const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getWeeklyAttendance,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware'); // Change 'admin' to 'authorize'

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', protect, authorize('admin'), getDashboardStats); // Use authorize('admin')

// @desc    Get weekly attendance data for chart
// @route   GET /api/admin/weekly-attendance
// @access  Private/Admin
router.get(
  '/weekly-attendance',
  protect,
  authorize('admin'),
  getWeeklyAttendance
);
router.get("/students", protect, authorize("admin"), async (req, res) => {
  const students = await User.find({ role: "student" }).select("-password");
  res.json(students);
});
router.post("/", protect, async (req, res) => {
  const { studentId, status } = req.body;

  const attendance = await Attendance.create({
    studentId,
    status,
    date: new Date(),
  });

  res.json(attendance);
});

module.exports = router;