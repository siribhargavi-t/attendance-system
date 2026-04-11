const User = require('../models/User');
const Attendance = require('../models/Attendance');
const bcrypt = require('bcryptjs'); // Import bcryptjs

// @desc    Get dashboard stats (total students, today's attendance)
// @route   GET /api/admin/dashboard-stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });

        // FIX: Create a precise date range for the current day
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        // Count unique students marked present within the date range
        const todayPresentStudents = await Attendance.distinct('studentId', {
            date: { $gte: todayStart, $lte: todayEnd },
            status: 'present'
        });
        const todayAttendance = todayPresentStudents.length;

        // Overall percentage
        const totalRecords = await Attendance.countDocuments();
        const presentRecords = await Attendance.countDocuments({ status: 'present' });
        const overallPercentage = totalRecords > 0 ? (presentRecords / totalRecords) * 100 : 0;

        res.status(200).json({
            totalStudents,
            todayAttendance,
            overallPercentage: overallPercentage.toFixed(2)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private/Admin
const getStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password'); // Find all users with role 'student'
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add a new student
// @route   POST /api/admin/students
// @access  Private/Admin
const addStudent = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Create new user with role 'student'
        user = new User({
            name,
            email,
            password,
            role: 'student'
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Return new user (without password)
        const userResponse = { _id: user._id, name: user.name, email: user.email, role: user.role };
        res.status(201).json(userResponse);

    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a student
// @route   DELETE /api/admin/students/:id
// @access  Private/Admin
const deleteStudent = async (req, res) => {
    try {
        const student = await User.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        await student.remove();
        res.status(200).json({ message: 'Student removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = {
    getDashboardStats,
    getStudents,
    addStudent, // <-- EXPORT THE NEW FUNCTION
};