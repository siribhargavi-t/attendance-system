const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');
const bcrypt = require('bcryptjs');

// ================== DASHBOARD ==================
const getDashboardStats = async (req, res) => {
  try {
    // ✅ Students & Faculty
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalFaculty = await User.countDocuments({ role: 'faculty' });

    // ✅ Classes (based on subjects instead of Class model)
    const subjects = await Attendance.distinct("subject");
    const totalClasses = subjects.length;

    // ✅ Attendance calculation (FIXED CASE)
    const totalAttendanceRecords = await Attendance.countDocuments();
    const presentRecords = await Attendance.countDocuments({ status: 'Present' });

    const averageAttendance =
      totalAttendanceRecords > 0
        ? ((presentRecords / totalAttendanceRecords) * 100).toFixed(2)
        : "0.00";

    // ✅ Subject-wise stats (NEW)
    const subjectStats = await Attendance.aggregate([
      {
        $group: {
          _id: "$subject",
          total: { $sum: 1 },
          present: {
            $sum: {
              $cond: [{ $eq: ["$status", "Present"] }, 1, 0],
            },
          },
        },
      },
    ]);

    const subjectPerformance = subjectStats.map((s) => ({
      subject: s._id,
      percentage: s.total === 0 ? 0 : ((s.present / s.total) * 100).toFixed(2),
    }));

    res.status(200).json({
      totalStudents,
      totalFaculty,
      totalClasses,
      averageAttendance,
      subjectPerformance,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add this function if missing
const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("name email rollNumber class");
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students" });
  }
};

const getSubjectAttendanceStats = async (req, res) => {
  // Your logic here
  res.json({ message: "Subject attendance stats" });
};

module.exports = {
  getDashboardStats,
  getStudents,
  getSubjectAttendanceStats,
};