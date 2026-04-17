const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ================= REGISTER =================
const register = async (req, res) => {
  try {
    let { name, email, password, role, rollNumber, branch, year, section } = req.body;

    // Validate all required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Role-specific validation
    if (role.toLowerCase() === "student" && !rollNumber) {
      return res.status(400).json({ message: "Roll Number is required for students." });
    }

    // Normalize
    name = name.trim();
    email = email.toLowerCase().trim();
    role = role.toLowerCase().trim();
    rollNumber = rollNumber ? rollNumber.trim() : "";

    // Validate role
    const validRoles = ["student", "faculty", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role selected." });
    }

    // Password length
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    console.log("Register request:", { name, email, role, rollNumber });

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      rollNumber
    });
    await user.save();

    // If student, also create a record in the Student collection
    if (role === "student") {
      const Student = require("../models/student");
      try {
        await Student.create({
          user: user._id,
          name: user.name,
          rollNumber: user.rollNumber,
          branch: branch || "General",
          year: year || "1st Year",
          section: section || "A"
        });
      } catch (studentErr) {
        console.error("Student profile creation error:", studentErr);
      }
    }

    console.log("User saved:", user._id, email, role);
    res.status(201).json({ message: "Account created successfully! Please log in." });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
};

// ================= LOGIN =================
const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // Normalize email
    email = email.toLowerCase().trim();

    console.log("Login attempt:", { email });

    // Find by email only — role is determined from DB, not client
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.log(`❌ Login Failed: User with email ${email} not found.`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.password) {
      console.log(`❌ Login Failed: Password field missing for user ${email}.`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    let isMatch = false;
    try {
      // bcrypt.compare will return false if the second arg is not a valid hash
      // We wrap in try-catch to be safe
      isMatch = await bcrypt.compare(password, user.password);
    } catch (err) {
      console.log(`ℹ️ Non-bcrypt password detected for ${email}, attempting plain-text match.`);
      isMatch = false;
    }

    const isPlainMatch = password === user.password; // Fallback for plain-text dev passwords

    if (!isMatch && !isPlainMatch) {
      console.log(`❌ Login Failed: Password mismatch for user ${email}.`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log(`✅ Login Success: ${email} (${user.role})`);

    // Generate JWT
    const jwt = require("jsonwebtoken");
    const secret = process.env.JWT_SECRET || 'attendance_system_secret_key_2024';
    const token = jwt.sign({ id: user._id, role: user.role }, secret, {
      expiresIn: "7d",
    });

    res.json({
      role: user.role,
      email: user.email,
      name: user.name,
      _id: user._id,
      rollNumber: user.rollNumber || "",
      class: user.class || "",
      department: user.department || "",
      adminRole: user.adminRole || "",
      image: user.image || "",
      banner: user.banner || "",
      token, // <-- Critical fix: actually send the token!
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

// ================= UPDATE PASSWORD =================
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new passwords are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters." });
    }

    // Find user and include password field
    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password." });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully!" });
  } catch (err) {
    console.error("UPDATE PASSWORD ERROR:", err);
    res.status(500).json({ message: "Failed to update password." });
  }
};

module.exports = { register, login, updatePassword };