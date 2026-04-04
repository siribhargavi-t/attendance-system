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

// @desc    Mark attendance for a student
// @route   POST /api/attendance
// @access  Private
const markAttendance = async (req, res) => {
<<<<<<< HEAD
=======
  try {
    const studentId = req.user.id; 
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }
    
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setUTCDate(today.getUTCDate() + 1);

    const existingAttendance = await Attendance.findOne({
        studentId,
        date: { $gte: today, $lt: tomorrow }
    });

    if (existingAttendance) {
      // If attendance exists, update it
      existingAttendance.status = status;
      await existingAttendance.save();
      return res.status(200).json({ success: true, message: 'Attendance updated', attendance: existingAttendance });
    } else {
      // If not, create a new record
      const newAttendance = new Attendance({
        studentId,
        status,
      });
      await newAttendance.save();
      return res.status(201).json({ success: true, message: 'Attendance marked', attendance: newAttendance });
    }

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get full attendance report
// @route   GET /api/attendance/report
// @access  Private
const getAttendanceReport = async (req, res) => {
  try {
    // This is already correct and populates the student's name and email.
    const report = await Attendance.find({}).populate('studentId', 'name email');
    res.status(200).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch attendance report.' });
  }
};

// Fetches all attendance records for the currently logged-in student
const getMyAttendance = async (req, res) => {
  try {
    const studentId = req.user.id; // Get studentId from token

    const attendance = await Attendance.find({ studentId }).sort({ date: -1 });

    if (!attendance) {
      return res.status(404).json({ success: false, message: 'No attendance records found for this student.' });
    }

    res.status(200).json({ success: true, attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAttendanceByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    const attendance = await Attendance.find({ studentId }).sort({ date: -1 });

    if (!attendance) {
      return res.status(404).json({ success: false, message: 'No attendance records found for this student.' });
    }

    res.status(200).json({ success: true, attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Fetches all attendance records and populates student details
const getAllAttendance = async (req, res) => {
>>>>>>> b2b64c2c5d26d77d57d74e0be84e8a11b0fc16ef
    try {
        const adminId = req.user.id; 
        const { studentId, subjectId, status, date } = req.body;

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
            date: { $gte: markDate, $lt: tomorrow }
        });

        // "teacher can able to change the attenedece of the student withh on a day itself"
        const now = new Date();
        const differenceInTime = now.getTime() - markDate.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);

        if (attendance) {
            if (differenceInDays > 1 && attendance.status !== status) {
                 // Might allow or deny based on strictness. Allowing for now but noting.
                 attendance.status = status;
            } else {
                 attendance.status = status;
            }
            attendance.markedBy = adminId;
            await attendance.save();
        } else {
            attendance = new Attendance({
                studentId,
                subjectId,
                status,
                date: markDate,
                markedBy: adminId
            });
            await attendance.save();
        }

        // Email logic
        if (status === 'absent') {
            const toEmails = [student.user.email];
            if (student.parentEmail) toEmails.push(student.parentEmail);
            await sendEmail(
                toEmails.join(','), 
                'Absence Alert', 
                `Dear ${student.name},\n\nYou were marked absent today for a subject.\nLog in to check your dashboard for details.\n\nRegards,\nAdmin`
            );
        }

        // Check threshold
        const settings = await Settings.findOne({});
        const threshold = settings ? settings.lowAttendanceThreshold : 75;
        await checkAndSendLowAttendanceEmail(student, subjectId, threshold);

        return res.status(200).json({ success: true, message: 'Attendance processed', attendance });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getAdminAllAttendance = async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find()
            .populate('studentId', 'name rollNumber')
            .populate('subjectId', 'name code')
            .sort({ date: -1 });

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
        const { subjectId, date, records } = req.body; // records: [{studentId, status}]

        if (!subjectId || !date || !Array.isArray(records)) {
            return res.status(400).json({ success: false, message: 'Invalid data format' });
        }

        const markDate = new Date(date);
        markDate.setUTCHours(0, 0, 0, 0);
        const tomorrow = new Date(markDate);
        tomorrow.setUTCDate(markDate.getUTCDate() + 1);

        const operations = records.map(record => ({
            updateOne: {
                filter: { studentId: record.studentId, subjectId, date: { $gte: markDate, $lt: tomorrow } },
                update: { $set: { status: record.status, markedBy: adminId, date: markDate } },
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

/**
 * @desc    Get attendance records, with optional filtering and pagination
 * @route   GET /api/attendance
 * @access  Private
 */
const getAttendance = async (req, res) => {
  try {
    // Extract all potential query parameters
    const { date, studentId, startDate, endDate } = req.query;
    const filter = {};

    // --- DATE FILTERING LOGIC ---
    if (startDate && endDate) {
      // Date range filter (takes precedence)
      const start = new Date(startDate);
      start.setUTCHours(0, 0, 0, 0);

      const end = new Date(endDate);
      end.setUTCHours(23, 59, 59, 999);

      filter.date = { $gte: start, $lte: end };
    } else if (date) {
      // Single day filter
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);
      
      filter.date = { $gte: startOfDay, $lte: endOfDay };
    }

    // Student ID filter
    if (studentId) {
      filter.studentId = studentId;
    }

    // --- PAGINATION LOGIC ---
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Get total number of documents that match the filter
    const total = await Attendance.countDocuments(filter);

    // Find records with filter, sort, skip, and limit
    const records = await Attendance.find(filter)
      .populate("studentId", "name email")
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      count: records.length,
      data: records,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  markAttendance,
<<<<<<< HEAD
  getAdminAllAttendance,
  getAdminStats,
  reviewAttendanceRequest,
  markBulk
=======
  getAttendanceReport,
  getMyAttendance,
  getAttendanceByStudentId,
  getAllAttendance,
  getAttendanceSummary,
  getMyAttendanceReport,
  getStudentAttendanceReport,
  getMonthlyAttendanceReport,
  getAdminAllAttendance,
  getAdminStats,
  getAttendance
>>>>>>> b2b64c2c5d26d77d57d74e0be84e8a11b0fc16ef
};