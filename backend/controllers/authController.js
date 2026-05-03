const User = require("../models/User");
const Student = require("../models/student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= LOGIN =================
const login = async (req, res) => {
  try {
    let { email, password, role } = req.body;

    // Normalize input
    email = email.toLowerCase().trim();
    password = password?.trim();
    role = role?.toLowerCase().trim();

    // Find user (do NOT filter by role)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Always require role and enforce match AFTER password check
    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }
    if (user.role !== role) {
      return res.status(401).json({
        message: `Wrong role selected. This account is ${user.role}`,
      });
    }

    // Extra student data
    let extraData = {};
    if (user.role === "student") {
      const studentProfile = await Student.findOne({ user: user._id });
      if (studentProfile) {
        extraData = {
          rollNumber: studentProfile.rollNumber,
          branch: studentProfile.branch,
          year: studentProfile.year,
          section: studentProfile.section,
        };
      }
    }

    // Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    // Response
    res.json({
      role: user.role,
      email: user.email,
      name: user.name,
      _id: user._id,
      rollNumber: user.rollNumber || extraData.rollNumber || "",
      class:
        user.class ||
        (extraData.year ? `${extraData.year} - ${extraData.section}` : ""),
      department: user.department || extraData.branch || "",
      branch: extraData.branch || "",
      year: extraData.year || "",
      section: extraData.section || "",
      adminRole: user.adminRole || "",
      image: user.image || "",
      banner: user.banner || "",
      token,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { login };