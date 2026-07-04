const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');
const Student = require('../models/student');
const bcrypt = require('bcryptjs');
const cacheManager = require('../utils/cacheManager');

// ================== DASHBOARD ==================
const getDashboardStats = async (req, res) => {
  try {
    const cacheKey = "admin:dashboard:stats";
    const cachedStats = await cacheManager.get(cacheKey);

    if (cachedStats) {
      return res.status(200).json(cachedStats);
    }

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

    const responseData = {
      totalStudents,
      totalFaculty,
      totalClasses,
      averageAttendance,
      subjectPerformance,
    };

    // Cache the analytics data for 5 minutes (300 seconds)
    await cacheManager.setex(cacheKey, 300, responseData);

    res.status(200).json(responseData);

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

const addStudent = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    email = email.trim().toLowerCase();
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Student with this email already exists" });
    }

    // Default formatting for new students created by Admin:
    // Roll number: e.g. CS + last 3 digits of timestamp, class: 1st Year - SEC A
    const rollNumber = `CS${String(Date.now()).slice(-3)}`;
    const className = "1st Year - SEC A";

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'student',
      rollNumber,
      class: className
    });
    await user.save();

    const studentProfile = new Student({
      user: user._id,
      name: user.name,
      rollNumber,
      branch: "CSE",
      year: "1st Year",
      section: "A"
    });
    await studentProfile.save();

    res.status(201).json({ success: true, message: "Student added successfully", student: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add student", error: err.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Remove User
    await User.findByIdAndDelete(id);

    // Remove linked Student profile document
    await Student.findOneAndDelete({ user: id });

    res.json({ success: true, message: "Student deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete student", error: err.message });
  }
};

const getSubjectAttendanceStats = async (req, res) => {
  // Your logic here
  res.json({ message: "Subject attendance stats" });
};

module.exports = {
  getDashboardStats,
  getStudents,
  addStudent,
  deleteStudent,
  getSubjectAttendanceStats,
};