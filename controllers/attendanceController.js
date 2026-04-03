const Attendance = require('../models/Attendance');
const Student = require('../models/student');

const markAttendance = async (req, res) => {
  try {
    const { studentId, status } = req.body;

    // 1. Validate input
    if (!studentId || !status) {
      return res.status(400).json({ success: false, message: 'Student ID and status are required.' });
    }

    // 2. Check if the student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }
    
    // 3. Check if attendance for this student on this date already exists to prevent duplicates
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to the beginning of the day

    const existingAttendance = await Attendance.findOne({
        studentId,
        date: { $gte: today }
    });

    if (existingAttendance) {
        return res.status(409).json({ success: false, message: 'Attendance already marked for this student today.' });
    }

    // 4. Create and save the new attendance record
    const newAttendance = new Attendance({
      studentId,
      status,
      // The 'date' will be set to the current date by default from the schema
    });

    await newAttendance.save();

    // 5. Return success response
    res.status(201).json({ success: true, message: 'Attendance marked successfully.', attendance: newAttendance });

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

module.exports = {
  markAttendance,
  getAttendanceByStudentId,
  getAllAttendance
};