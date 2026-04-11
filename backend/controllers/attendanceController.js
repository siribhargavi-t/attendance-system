const Attendance = require('../models/Attendance');
const User = require('../models/User'); // Assuming you have a User model
const Subject = require('../models/Subject'); // Assuming you have a Subject model
const { protect } = require('../middleware/authMiddleware'); // Assuming you have this middleware

// @desc    Mark attendance
// @route   POST /api/attendance/mark
// @access  Private (assuming only authenticated users can mark)
const markAttendance = async (req, res) => {
  // The request body should contain the ObjectId of the student
  const { studentId, subjectId, status, date } = req.body;

  // 1. Validate input
  if (!studentId || !subjectId || !status) {
    return res.status(400).json({ message: 'Please provide studentId, subjectId, and status.' });
  }

  try {
    // 2. Check if student exists
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    // 3. Normalize date to the start of the day
    const attendanceDate = new Date(date || new Date());
    attendanceDate.setHours(0, 0, 0, 0);

    // 4. Check for duplicate attendance using the correct field name
    const existingAttendance = await Attendance.findOne({
      studentId: studentId, // Use studentId for the query
      subjectId: subjectId,
      date: attendanceDate,
    });

    if (existingAttendance) {
      return res.status(409).json({ message: 'Attendance already marked for this student, subject, and date.' });
    }

    // 5. Create and save new attendance record
    const newAttendance = new Attendance({
      studentId: studentId, // Store the ID in the 'studentId' field
      subjectId: subjectId,
      status,
      date: attendanceDate,
      markedBy: req.user.id // Store who marked the attendance
    });

    await newAttendance.save();

    res.status(201).json({
      message: 'Attendance marked successfully.',
      attendance: newAttendance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get attendance records for a specific student
// @route   GET /api/attendance/student/:id
// @access  Private
const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.params.id;
    const query = { studentId: studentId }; // Query uses studentId

    const attendanceRecords = await Attendance.find(query)
      .populate('subjectId', 'name')
      .sort({ date: -1 });

    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get attendance percentage for a specific student
// @route   GET /api/attendance/percentage/:id
// @access  Private
const getAttendancePercentage = async (req, res) => {
    try {
        const studentId = req.params.id;
        // Ensure queries use the consistent 'studentId' field name
        const totalRecords = await Attendance.countDocuments({ studentId: studentId });
        const presentRecords = await Attendance.countDocuments({ studentId: studentId, status: 'present' });
        const percentage = totalRecords > 0 ? (presentRecords / totalRecords) * 100 : 0;
        res.status(200).json({ percentage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get weekly attendance report (present count per day)
// @route   GET /api/attendance/weekly
// @access  Private
const getWeeklyAttendance = async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const weeklyReport = await Attendance.aggregate([
            { $match: { date: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                    presentCount: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } },
                },
            },
            { $sort: { _id: 1 } },
            { $project: { _id: 0, date: '$_id', presentCount: 1 } }
        ]);

        res.status(200).json(weeklyReport);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get recent attendance records
// @route   GET /api/attendance/recent
// @access  Private
const getRecentAttendance = async (req, res) => {
    try {
        const recentRecords = await Attendance.find()
            .sort({ createdAt: -1 }) // Get the most recently created records
            .limit(5) // Limit to the latest 5
            .populate('studentId', 'name') // Populate student's name
            .populate('subjectId', 'name'); // Populate subject's name

        res.status(200).json(recentRecords);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get attendance data for the logged-in student
// @route   GET /api/attendance/student/me
// @access  Private/Student
const getMyAttendance = async (req, res) => {
    try {
        // The user's ID is attached to req.user by the authMiddleware
        const studentId = req.user.id;
        console.log(`Fetching data for student ID: ${studentId}`); // DEBUG LOG

        // Fetch all attendance records for this student using the correct field
        const attendanceRecords = await Attendance.find({ studentId: studentId })
            .populate('subjectId', 'name') // Populate subject name
            .sort({ date: -1 }); // Sort by most recent date

        // Calculate percentage
        const totalRecords = attendanceRecords.length;
        const presentRecords = attendanceRecords.filter(record => record.status === 'present').length;
        const percentage = totalRecords > 0 ? (presentRecords / totalRecords) * 100 : 0;

        console.log(`Found ${totalRecords} records, calculated percentage: ${percentage}%`); // DEBUG LOG

        // Send both records and percentage in one response
        res.status(200).json({
            attendanceData: attendanceRecords,
            percentage: percentage
        });

    } catch (error) {
        console.error('Error in getMyAttendance:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = {
  markAttendance,
  getStudentAttendance,
  getAttendancePercentage,
  getWeeklyAttendance,
  getRecentAttendance,
  getMyAttendance,
};