const Attendance = require('../models/Attendance');
const Student = require('../models/student');
const User = require('../models/User');

const getDashboardStats = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user.id });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found.' });
        }

        const totalDays = await Attendance.countDocuments({ studentId: student._id });
        const present = await Attendance.countDocuments({ studentId: student._id, status: 'present' });
        const percentage = totalDays > 0 ? (present / totalDays) * 100 : 100;

        res.status(200).json({
            success: true,
            stats: {
                totalDays,
                present,
                absent: totalDays - present,
                percentage: percentage.toFixed(2)
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getMyAttendance = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user.id });
        const attendance = await Attendance.find({ studentId: student._id })
            .populate('subjectId', 'name code')
            .sort({ date: -1 });

        res.status(200).json({ success: true, attendance });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const submitAttendanceRequest = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user.id });
        const { attendanceId, changeReason, documentUrl } = req.body;

        const attendance = await Attendance.findOne({ _id: attendanceId, studentId: student._id });
        if (!attendance) {
            return res.status(404).json({ success: false, message: 'Attendance record not found.' });
        }

        attendance.changeRequest = true;
        attendance.changeReason = changeReason;
        attendance.documentUrl = documentUrl || '';
        attendance.requestStatus = 'pending';

        await attendance.save();

        res.status(200).json({ success: true, message: 'Request submitted successfully.', attendance });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    getDashboardStats,
    getMyAttendance,
    submitAttendanceRequest
};

// Example: Fetch student dashboard stats in useEffect