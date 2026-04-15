const Leave = require("../models/Leave");
const { sendEmail } = require("../utils/emailService");
const Notification = require("../models/Notification");

// 1. Create a new leave request
exports.createLeave = async (req, res) => {
  try {
    const {
      studentName,
      studentEmail,
      facultyName, // <-- must be here!
      facultyEmail,
      fromDate,
      toDate,
      reason,
      document,
    } = req.body;

    if (!studentName || !studentEmail || !facultyName || !facultyEmail || !fromDate || !toDate || !reason) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }
    if (new Date(fromDate) > new Date(toDate)) {
      return res.status(400).json({ message: "From Date cannot be after To Date" });
    }

    const leave = new Leave({
      studentName,
      studentEmail,
      facultyName,
      facultyEmail,
      fromDate,
      toDate,
      reason,
      document,
      status: "Pending",
    });

    await leave.save();
    res.status(201).json(leave);
  } catch (err) {
    res.status(500).json({ message: "Failed to create leave request" });
  }
};


// 2. Get leaves by student
exports.getLeavesByStudent = async (req, res) => {
  try {
    const { studentEmail } = req.params;

    const leaves = await Leave.find({ studentEmail }).sort({ createdAt: -1 });

    res.json(leaves);

  } catch (err) {
    console.error("❌ GET STUDENT LEAVES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch leave requests" });
  }
};


// 3. Get all leaves (faculty)
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });

    res.json(leaves);

  } catch (err) {
    console.error("❌ GET ALL LEAVES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch leave requests" });
  }
};


// 4. Update leave status + send email
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const leave = await Leave.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    // ✅ Send email
    await sendEmail(
      leave.studentEmail,
      "Leave Request Status",
      `Your leave from ${new Date(leave.fromDate).toDateString()} to ${new Date(leave.toDate).toDateString()} is ${status}.`
    );

    // After updating leave status:
    await Notification.create({
      studentEmail: leave.studentEmail,
      message: `Your leave is ${status}`,
      read: false
    });

    res.json({
      message: `Leave ${status}`,
      data: leave,
    });

  } catch (err) {
    console.error("❌ UPDATE LEAVE ERROR:", err);
    res.status(500).json({ message: "Failed to update leave request" });
  }
};