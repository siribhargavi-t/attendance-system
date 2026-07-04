const Attendance = require("../models/Attendance");
const Notification = require("../models/Notification");
const cacheManager = require("../utils/cacheManager");

// 1. Mark Attendance (Create)
const markAttendance = async (req, res) => {
  try {
    const { studentName, studentEmail, rollNumber, className, time, subject, date, status } = req.body;

    // ✅ Validation
    if (!studentName || !studentEmail || !rollNumber || !className || !time || !subject || !date || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const attendance = new Attendance({
      studentName,
      studentEmail,
      rollNumber,
      className,
      time,
      subject,
      date,
      status,
    });

    await attendance.save();

    // Invalidate Admin Dashboard analytics cache
    await cacheManager.del("admin:dashboard:stats");

    res.status(201).json({
      message: "Attendance marked successfully",
      data: attendance
    });

  } catch (err) {
    console.error("❌ Mark Attendance Error:", err); // 🔥 IMPORTANT
    res.status(500).json({ message: "Failed to mark attendance" });
  }
};


// 2. Get Attendance
const getAttendance = async (req, res) => {
  try {
    const { studentEmail, subject } = req.query;

    const filter = {};
    if (studentEmail) filter.studentEmail = studentEmail;
    if (subject) filter.subject = subject;

    const records = await Attendance.find(filter);

    res.json(records);

  } catch (err) {
    console.error("❌ Get Attendance Error:", err);
    res.status(500).json({ message: "Failed to fetch attendance records" });
  }
};


// 3. Update Attendance
const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Attendance.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    // Invalidate Admin Dashboard analytics cache
    await cacheManager.del("admin:dashboard:stats");

    res.json(updated);

  } catch (err) {
    console.error("❌ Update Error:", err);
    res.status(500).json({ message: "Failed to update attendance" });
  }
};


// 4. Delete Attendance
const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Attendance.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    // Invalidate Admin Dashboard analytics cache
    await cacheManager.del("admin:dashboard:stats");

    res.json({ message: "Attendance deleted successfully" });

  } catch (err) {
    console.error("❌ Delete Error:", err);
    res.status(500).json({ message: "Failed to delete attendance" });
  }
};


// 5. Attendance Percentage
const getAttendancePercentage = async (req, res) => {
  try {
    const { studentEmail } = req.params;

    if (!studentEmail) {
      return res.status(400).json({ message: "studentEmail is required" });
    }

    const total = await Attendance.countDocuments({ studentEmail });

    if (total === 0) {
      return res.json({ percentage: 0 });
    }

    const present = await Attendance.countDocuments({
      studentEmail,
      status: "Present"
    });

    const percentage = (present / total) * 100;

    res.json({
      percentage: Number(percentage.toFixed(2))
    });

  } catch (err) {
    console.error("❌ Percentage Error:", err);
    res.status(500).json({ message: "Failed to calculate attendance percentage" });
  }
};

// 6. Get Notifications
const getNotifications = async (req, res) => {
  try {
    const { email } = req.params;
    const notifs = await Notification.find({ studentEmail: email });
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// 7. Bulk Mark Attendance (ACID Transaction + Batch Insert)
const markAttendanceBulk = async (req, res) => {
  const mongoose = require("mongoose");
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { records } = req.body;

    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: "Invalid records payload" });
    }

    // Validate each record has required fields
    for (const r of records) {
      if (!r.studentName || !r.studentEmail || !r.subject || !r.date || !r.status) {
        throw new Error("Missing required fields in one or more records");
      }
    }

    // Perform batch insert inside the transaction session
    const insertedRecords = await Attendance.insertMany(records, { session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Invalidate Admin Dashboard analytics cache
    await cacheManager.del("admin:dashboard:stats");

    res.status(201).json({
      success: true,
      message: `${insertedRecords.length} attendance records marked successfully (ACID transaction committed).`,
      count: insertedRecords.length
    });

  } catch (err) {
    // Rollback transaction on failure
    await session.abortTransaction();
    session.endSession();

    console.error("❌ Bulk Attendance Transaction Aborted:", err.message);
    res.status(500).json({ message: "Failed to mark attendance (Transaction rolled back).", error: err.message });
  }
};

module.exports = {
  markAttendance,
  markAttendanceBulk,
  getAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendancePercentage,
  getNotifications,
};