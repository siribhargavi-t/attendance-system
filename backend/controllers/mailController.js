const User = require("../models/User");
const { sendEmail } = require("../utils/emailService");

// @desc    Get potential recipients based on role
// @route   GET /api/mail/recipients
// @access  Private
exports.getRecipients = async (req, res) => {
  try {
    const role = req.user.role;
    let recipients = [];

    if (role === "student") {
      // Students see registered Faculty
      recipients = await User.find({ role: "faculty" }).select("name email");
    } else if (role === "faculty") {
      // Faculty see registered Students
      recipients = await User.find({ role: "student" }).select("name email");
    } else if (role === "admin") {
      // Admins see everyone
      recipients = await User.find({ role: { $in: ["student", "faculty"] } }).select("name email role");
    }

    res.status(200).json(recipients);
  } catch (err) {
    console.error("❌ FETCH RECIPIENTS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch recipient list." });
  }
};

// @desc    Send email to a specific recipient
// @route   POST /api/mail/send
// @access  Private
exports.sendMail = async (req, res) => {
  try {
    const { toEmail, subject, message } = req.body;

    if (!toEmail || !subject || !message) {
      return res.status(400).json({ message: "Recipient, subject, and message are required." });
    }

    // Build professional body
    const emailBody = `
      Hello,

      You have received a new message via AttendPro from ${req.user.name} (${req.user.role}).

      --------------------------------------------------
      ${message}
      --------------------------------------------------

      This is an automated notification. Please reply directly to ${req.user.email} if required.
    `;

    await sendEmail(toEmail, subject, emailBody);

    res.status(200).json({ message: "Email delivered successfully!" });

  } catch (err) {
    console.error("❌ SEND MAIL ERROR:", err);
    res.status(500).json({ message: "Failed to deliver email. Check SMTP settings." });
  }
};
