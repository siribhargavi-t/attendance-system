const Attendance = require('../models/Attendance');
const Student = require('../models/student');
const User = require('../models/User');

const getDashboardStats = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user.id });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found.' });
        }

        const totalDays = await Attendance.countDocuments({ studentEmail: req.user.email });
        const present = await Attendance.countDocuments({ studentEmail: req.user.email, status: 'Present' });
        const percentage = totalDays > 0 ? (present / totalDays) * 100 : 100;

        // Predictive Analytics (Assuming 40 total lectures in a standard semester)
        const totalClassesInSemester = Math.max(40, totalDays);
        const classesRemaining = Math.max(0, totalClassesInSemester - totalDays);
        const maxPossiblePresent = present + classesRemaining;
        const projectedMaxPercentage = (maxPossiblePresent / totalClassesInSemester) * 100;

        let riskStatus = "Good";
        if (percentage < 75) {
            if (projectedMaxPercentage < 75) {
                riskStatus = "Defaulter"; // Mathematically impossible to reach 75%
            } else {
                riskStatus = "At Risk"; // Below 75% currently, but can still recover
            }
        }

        res.status(200).json({
            success: true,
            stats: {
                totalDays,
                present,
                absent: totalDays - present,
                percentage: percentage.toFixed(2),
                riskStatus,
                projectedMaxPercentage: projectedMaxPercentage.toFixed(2),
                classesRemaining,
                totalClassesInSemester
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getMyAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({ studentEmail: req.user.email })
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