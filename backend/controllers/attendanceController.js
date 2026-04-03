const Attendance = require('../models/Attendance');
const Student = require('../models/student');

// @desc    Mark attendance for a student
// @route   POST /api/attendance
// @access  Private
const markAttendance = async (req, res) => {
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
    try {
        const { date } = req.query;
        const query = {};

        if (date) {
            // Converts query date to the start of the day
            const startDate = new Date(date);
            startDate.setUTCHours(0, 0, 0, 0);

            // Converts query date to the end of the day
            const endDate = new Date(date);
            endDate.setUTCHours(23, 59, 59, 999);
            
            // Uses $gte and $lte to filter within the date range
            query.date = { $gte: startDate, $lte: endDate };
        }

        const attendanceRecords = await Attendance.find(query).populate('studentId', 'name rollNumber'); // Populates with student's name and rollNumber
        res.status(200).json({ success: true, data: attendanceRecords });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching attendance records', error: error.message });
    }
};

// Gets a summary of attendance records
const getAttendanceSummary = async (req, res) => {
    try {
        const { date } = req.query;
        const query = {};

        if (date) {
            const startDate = new Date(date);
            startDate.setUTCHours(0, 0, 0, 0);

            const endDate = new Date(date);
            endDate.setUTCHours(23, 59, 59, 999);
            
            query.date = { $gte: startDate, $lte: endDate };
        }

        const total = await Attendance.countDocuments(query);
        const present = await Attendance.countDocuments({ ...query, status: 'present' });
        const absent = await Attendance.countDocuments({ ...query, status: 'absent' });

        res.status(200).json({
            success: true,
            summary: {
                total,
                present,
                absent
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching attendance summary', error: error.message });
    }
};

// Generates an attendance report for the currently logged-in student
const getMyAttendanceReport = async (req, res) => {
    try {
        // 1. Uses req.user.id from the token
        const studentId = req.user.id; 

        const query = { studentId };

        const totalDays = await Attendance.countDocuments(query);
        const present = await Attendance.countDocuments({ ...query, status: 'present' });
        const absent = await Attendance.countDocuments({ ...query, status: 'absent' });

        const percentage = totalDays > 0 ? (present / totalDays) * 100 : 0;

        // 2. Returns the report for the logged-in user
        res.status(200).json({
            success: true,
            report: {
                totalDays,
                present,
                absent,
                percentage: percentage.toFixed(2)
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error generating student report', error: error.message });
    }
};

// Generates an attendance report for a specific student
const getStudentAttendanceReport = async (req, res) => {
    try {
        const { studentId } = req.params;

        const query = { studentId };

        const totalDays = await Attendance.countDocuments(query);
        const present = await Attendance.countDocuments({ ...query, status: 'present' });
        const absent = await Attendance.countDocuments({ ...query, status: 'absent' });

        const percentage = totalDays > 0 ? (present / totalDays) * 100 : 0;

        res.status(200).json({
            success: true,
            report: {
                totalDays,
                present,
                absent,
                percentage: percentage.toFixed(2)
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error generating student report', error: error.message });
    }
};

// Generates a monthly attendance report
const getMonthlyAttendanceReport = async (req, res) => {
    try {
        const { year, month } = req.query;

        if (!year || !month) {
            return res.status(400).json({ success: false, message: 'Year and month are required query parameters.' });
        }

        // Month in JavaScript's Date is 0-indexed (0-11), so subtract 1
        const startDate = new Date(Date.UTC(year, month - 1, 1));
        const endDate = new Date(Date.UTC(year, month, 1)); // This gives the start of the next month

        const query = {
            date: {
                $gte: startDate,
                $lt: endDate // Use $lt to exclude the start of the next month
            }
        };

        const totalDays = await Attendance.countDocuments(query);
        const present = await Attendance.countDocuments({ ...query, status: 'present' });
        const absent = await Attendance.countDocuments({ ...query, status: 'absent' });

        const percentage = totalDays > 0 ? (present / totalDays) * 100 : 0;

        res.status(200).json({
            success: true,
            report: {
                month,
                year,
                totalDays,
                present,
                absent,
                percentage: percentage.toFixed(2)
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error generating monthly report', error: error.message });
    }
};

// Fetches all attendance records for an admin view
const getAdminAllAttendance = async (req, res) => {
    try {
        const { date } = req.query;
        const query = {};

        if (date) {
            const startDate = new Date(date);
            startDate.setUTCHours(0, 0, 0, 0);

            const endDate = new Date(date);
            endDate.setUTCHours(23, 59, 59, 999);
            
            query.date = { $gte: startDate, $lte: endDate };
        }

        const attendanceRecords = await Attendance.find(query)
            .populate('studentId', 'name') // Include student name
            .sort({ date: -1 }); // Sort by latest date first

        res.status(200).json({ success: true, data: attendanceRecords });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching attendance records', error: error.message });
    }
};

// Gets admin-level statistics
const getAdminStats = async (req, res) => {
    try {
        // Define date range for today
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setUTCDate(today.getUTCDate() + 1);

        const dateQuery = { date: { $gte: today, $lt: tomorrow } };

        // Run queries in parallel for efficiency
        const [totalStudents, totalPresentToday, totalAbsentToday] = await Promise.all([
            Student.countDocuments(), // Counts total students
            Attendance.countDocuments({ ...dateQuery, status: 'present' }), // Counts present today
            Attendance.countDocuments({ ...dateQuery, status: 'absent' })  // Counts absent today
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalStudents,
                totalPresentToday,
                totalAbsentToday
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching admin stats', error: error.message });
    }
};

module.exports = {
  markAttendance,
  getAttendanceReport,
  getMyAttendance,
  getAttendanceByStudentId,
  getAllAttendance,
  getAttendanceSummary,
  getMyAttendanceReport,
  getStudentAttendanceReport,
  getMonthlyAttendanceReport,
  getAdminAllAttendance,
  getAdminStats
};