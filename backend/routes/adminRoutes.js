const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Attendance = require("../models/Attendance");

// GET DASHBOARD STATS
router.get("/stats", async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalFaculty = await User.countDocuments({ role: "faculty" });

    const today = new Date().toISOString().split("T")[0];

    const presentToday = await Attendance.countDocuments({
      date: today,
      status: "present"
    });

    const absentToday = await Attendance.countDocuments({
      date: today,
      status: "absent"
    });

    res.json({
      totalStudents,
      totalFaculty,
      presentToday,
      absentToday
    });

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;