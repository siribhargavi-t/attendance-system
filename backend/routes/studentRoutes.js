const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  getDashboardStats,
  getMyAttendance,
  submitAttendanceRequest,
} = require("../controllers/studentController");

const { sendEmail } = require("../utils/emailService");

// 🔒 Apply auth middleware to all routes
router.use(protect);

// ================= DASHBOARD =================
router.get("/dashboard", getDashboardStats);

// ================= ATTENDANCE =================
router.get("/attendance", getMyAttendance);

// ================= REQUEST =================
router.post("/request", submitAttendanceRequest);

// ================= SEND WARNING EMAIL =================
router.post("/send-warning", async (req, res) => {
  try {
    const { studentName, studentEmail, reason, document } = req.body;

    // 🔍 Basic validation
    if (!studentName || !studentEmail || !reason) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, email, reason) are required",
      });
    }

    const principalEmail = "principal@example.com"; // 🔁 Replace with real email

    let message = `
Warning Request from ${studentName} (${studentEmail})

Reason:
${reason}
`;

    if (document) {
      message += `\nDocument preview (base64): ${document.substring(0, 30)}...\n`;
    }

    await sendEmail(
      principalEmail,
      "Student Warning Request",
      message
    );

    res.status(200).json({
      success: true,
      message: "Warning email sent successfully",
    });

  } catch (err) {
    console.error("SEND WARNING ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Failed to send warning email",
    });
  }
});

module.exports = router;