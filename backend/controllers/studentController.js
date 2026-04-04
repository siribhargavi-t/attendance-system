const Attendance = require('../models/Attendance');
const Student = require('../models/student');
const User = require('../models/User');

const getDashboardStats = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user.id });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found.' });
        }

        const totalDaysCount = await Attendance.countDocuments({ studentId: student._id });
        const presentCount = await Attendance.countDocuments({ studentId: student._id, status: 'present' });
        const percentage = totalDaysCount > 0 ? (presentCount / totalDaysCount) * 100 : 0;

        // Fetch last 7 days trend
        const trend = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setUTCHours(0, 0, 0, 0);
            date.setUTCDate(date.getUTCDate() - i);
            const nextDay = new Date(date);
            nextDay.setUTCDate(date.getUTCDate() + 1);

            const dayPresent = await Attendance.countDocuments({
                studentId: student._id,
                status: 'present',
                date: { $gte: date, $lt: nextDay }
            });
            const dayTotal = await Attendance.countDocuments({
                studentId: student._id,
                date: { $gte: date, $lt: nextDay }
            });

            trend.push({
                date: date.toLocaleDateString('en-US', { weekday: 'short' }),
                present: dayPresent,
                total: dayTotal,
                percentage: dayTotal > 0 ? (dayPresent / dayTotal) * 100 : 0
            });
        }

        res.status(200).json({
            success: true,
            stats: {
                totalDays: totalDaysCount,
                present: presentCount,
                absent: totalDaysCount - presentCount,
                percentage: percentage.toFixed(2),
                trend
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