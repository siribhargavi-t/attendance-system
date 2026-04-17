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

    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    const isPlainMatch = password === user.password; // Fallback for plain-text dev passwords

    if (!isMatch && !isPlainMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

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
      token, // <-- Critical fix: actually send the token!
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

module.exports = { register, login };