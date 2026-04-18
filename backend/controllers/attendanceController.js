const Attendance = require('../models/Attendance');
const Student = require('../models/student');
const User = require('../models/User');
const Settings = require('../models/Settings');
const { sendEmail } = require('../utils/emailService');

const getAttendancePercentage = async (studentId, subjectId) => {
    let query = { studentId };
    if (subjectId) query.subjectId = subjectId;
    const totalDays = await Attendance.countDocuments(query);
    const present = await Attendance.countDocuments({ ...query, status: 'present' });
    return totalDays > 0 ? (present / totalDays) * 100 : 100; // default 100 if no classes
};

const checkAndSendLowAttendanceEmail = async (student, subjectId, threshold) => {
    const percentage = await getAttendancePercentage(student._id, null); // Overall or subject-specific
    if (percentage < threshold) {
        const user = await User.findById(student.user);
        const toEmails = [user.email];
        if (student.parentEmail) toEmails.push(student.parentEmail);
        
        await sendEmail(
            toEmails.join(','), 
            'Low Attendance Alert', 
            `Dear ${student.name},\n\nYour attendance has dropped to ${percentage.toFixed(2)}%, which is below the required threshold of ${threshold}%.\nPlease contact your teacher.\n\nRegards,\nAdmin`
        );
    }
};

const markAttendance = async (req, res) => {
    try {
        const adminId = req.user.id; 
        const { studentId, subjectId, status, date, startTime, endTime } = req.body;

        if (!studentId || !subjectId || !status || !date) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const student = await Student.findById(studentId).populate('user');
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found.' });
        }
        
        const markDate = new Date(date);
        markDate.setUTCHours(0, 0, 0, 0);

        const tomorrow = new Date(markDate);
        tomorrow.setUTCDate(markDate.getUTCDate() + 1);

        let attendance = await Attendance.findOne({
            studentId,
            subjectId,
            date: { $gte: markDate, $lt: tomorrow },
            startTime,
            endTime
        });

        // "teacher can able to change the attenedece of the student withh on a day itself"
        const now = new Date();
        const differenceInTime = now.getTime() - markDate.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);

        const markedAt = new Date(); // exact timestamp of this marking action

        if (attendance) {
            if (differenceInDays > 1 && attendance.status !== status) {
                 attendance.status = status;
            } else {
                 attendance.status = status;
            }
            attendance.markedBy = adminId;
            attendance.markedAt = markedAt;
            attendance.startTime = startTime;
            attendance.endTime = endTime;
            await attendance.save();
        } else {
            attendance = new Attendance({
                studentId,
                subjectId,
                status,
                date: markDate,
                markedBy: adminId,
                markedAt,
                startTime,
                endTime
            });
            await attendance.save();
        }

        // Email logic — only send if student's user account has an email
        if (status === 'absent' && student.user?.email) {
            const toEmails = [student.user.email];
            if (student.parentEmail) toEmails.push(student.parentEmail);
            // Fire-and-forget — don't block the response
            sendEmail(
                toEmails.join(','), 
                'Absence Alert', 
                `Dear ${student.name},\n\nYou were marked absent today for a subject.\nLog in to check your dashboard for details.\n\nRegards,\nAdmin`
            ).catch(e => console.error('Email error:', e));
        }

        // Check threshold (only if student user email exists)
        if (student.user?.email) {
            const settings = await Settings.findOne({});
            const threshold = settings ? settings.lowAttendanceThreshold : 75;
            checkAndSendLowAttendanceEmail(student, subjectId, threshold)
                .catch(e => console.error('Low attendance email error:', e));
        }

        return res.status(200).json({ success: true, message: 'Attendance processed', attendance });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getAdminAllAttendance = async (req, res) => {
    try {
        const query = {};

        // Optional date filter: ?date=YYYY-MM-DD  (matches records for that calendar day)
        if (req.query.date) {
            const d = new Date(req.query.date);
            d.setUTCHours(0, 0, 0, 0);
            const next = new Date(d);
            next.setUTCDate(d.getUTCDate() + 1);
            query.date = { $gte: d, $lt: next };
        }

        // Optional status filter: ?status=present | absent
        if (req.query.status && ['present', 'absent'].includes(req.query.status)) {
            query.status = req.query.status;
        }

        const attendanceRecords = await Attendance.find(query)
            .populate('studentId', 'name rollNumber branch')
            .populate('subjectId', 'name code')
            .sort({ markedAt: -1, date: -1 });

        res.status(200).json({ success: true, data: attendanceRecords });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAdminStats = async (req, res) => {
    try {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setUTCDate(today.getUTCDate() + 1);

        const dateQuery = { date: { $gte: today, $lt: tomorrow } };

        const [totalStudents, totalPresentToday, totalAbsentToday] = await Promise.all([
            Student.countDocuments(),
            Attendance.countDocuments({ ...dateQuery, status: 'present' }),
            Attendance.countDocuments({ ...dateQuery, status: 'absent' })
        ]);

        res.status(200).json({
            success: true,
            stats: { totalStudents, totalPresentToday, totalAbsentToday }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const reviewAttendanceRequest = async (req, res) => {
    try {
        const { id, action } = req.body; // action: 'approved' | 'rejected'
        const attendance = await Attendance.findById(id);
        
        if (!attendance) {
            return res.status(404).json({ success: false, message: 'Attendance record not found' });
        }

        attendance.requestStatus = action;
        if (action === 'approved') {
            attendance.status = 'present'; 
        }
        attendance.changeRequest = false; 
        
        await attendance.save();
        res.status(200).json({ success: true, message: `Request ${action}`, attendance });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const markBulk = async (req, res) => {
    try {
        const adminId = req.user.id;
        const { subjectId, date, startTime, endTime, records } = req.body; // records: [{studentId, status}]

        if (!subjectId || !date || !Array.isArray(records)) {
            return res.status(400).json({ success: false, message: 'Invalid data format' });
        }

        const markDate = new Date(date);
        markDate.setUTCHours(0, 0, 0, 0);
        const tomorrow = new Date(markDate);
        tomorrow.setUTCDate(markDate.getUTCDate() + 1);

        const now = new Date(); // exact timestamp for bulk marking
        const operations = records.map(record => ({
            updateOne: {
                filter: { studentId: record.studentId, subjectId, date: { $gte: markDate, $lt: tomorrow }, startTime, endTime },
                update: { $set: { status: record.status, markedBy: adminId, date: markDate, markedAt: now, startTime, endTime } },
                upsert: true
            }
        }));

        if (operations.length > 0) {
            await Attendance.bulkWrite(operations);
        }

        res.status(200).json({ success: true, message: `Bulk attendance marked for ${records.length} students` });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ── Fetch all records for a specific session (date + subject + time) ─────────
const getAttendanceBySession = async (req, res) => {
    try {
        const { date, subjectId, startTime, endTime } = req.query;
        if (!date || !subjectId) {
            return res.status(400).json({ success: false, message: 'date and subjectId are required' });
        }

        const markDate = new Date(date);
        markDate.setUTCHours(0, 0, 0, 0);
        const nextDay = new Date(markDate);
        nextDay.setUTCDate(markDate.getUTCDate() + 1);

        const query = { subjectId, date: { $gte: markDate, $lt: nextDay } };
        if (startTime) query.startTime = startTime;
        if (endTime)   query.endTime   = endTime;

        const records = await Attendance.find(query)
            .populate('studentId', 'name rollNumber branch')
            .populate('subjectId', 'name code')
            .sort({ 'studentId.name': 1 });

        res.status(200).json({ success: true, data: records });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ── Correct a single attendance record (flip status) ─────────────────────────
const correctAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, correctionNote } = req.body;

        if (!['present', 'absent'].includes(status)) {
            return res.status(400).json({ success: false, message: 'status must be present or absent' });
        }

        const record = await Attendance.findById(id);
        if (!record) {
            return res.status(404).json({ success: false, message: 'Attendance record not found' });
        }

        const previousStatus = record.status;
        record.status = status;
        record.markedBy = req.user.id;
        record.markedAt = new Date();
        if (correctionNote) record.correctionNote = correctionNote;

        await record.save();
        res.status(200).json({
            success: true,
            message: `Attendance corrected from ${previousStatus} → ${status}`,
            record
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
  markAttendance,
  getAdminAllAttendance,
  getAdminStats,
  reviewAttendanceRequest,
  markBulk,
  getAttendanceBySession,
  correctAttendance
};