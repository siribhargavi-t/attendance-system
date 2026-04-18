const User = require("../models/User");
const Student = require("../models/student");
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
    rollNumber = rollNumber ? rollNumber.trim().toUpperCase() : "";
    password = password.trim(); 

    // Validate role
    const validRoles = ["student", "faculty", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role selected." });
    }

    // Role-specific roll number check
    if (role === "student") {
      const existingStudent = await Student.findOne({ rollNumber });
      if (existingStudent) {
        return res.status(400).json({ message: `Roll Number ${rollNumber} is already registered.` });
      }
    }

    // Password length
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    console.log("Register request:", { name, email, role, rollNumber });

    // Check existing user email
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
      rollNumber,
      department: branch || "",
      class: year && section ? `${year} - ${section}` : year || section || ""
    });
    await user.save();

    // If student, also create a record in the Student collection
    if (role === "student") {
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
        if (studentErr.code === 11000) {
          const field = Object.keys(studentErr.keyValue || {})[0] || "field";
          const value = Object.values(studentErr.keyValue || {})[0] || rollNumber;
          console.error(`Duplicate Student record on ${field}:`, value);
          await User.findByIdAndDelete(user._id);
          return res.status(400).json({ message: `Student registration failed: The ${field} '${value}' is already in use.` });
        }
        console.error("Student profile creation error DETAILS:", {
          message: studentErr.message,
          name: studentErr.name,
          code: studentErr.code,
          keyValue: studentErr.keyValue,
          errors: studentErr.errors
        });
        // Rollback user creation if student profile fails
        await User.findByIdAndDelete(user._id);
        return res.status(500).json({ message: "Failed to create student profile. Please try again." });
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

    // Normalize
    email = email.toLowerCase().trim();
    password = password ? password.trim() : "";

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
    let isPlainMatch = false;
    let authMethod = "none";

    try {
      if (user.password && (user.password.startsWith("$2a$") || user.password.startsWith("$2b$") || user.password.startsWith("$2y$"))) {
        authMethod = "bcrypt";
        // Perform direct comparison to rule out Mongoose method issues
        isMatch = await bcrypt.compare(password, user.password);
      } else {
        console.log(`ℹ️ Non-bcrypt password detected for ${email}, attempting plain-text match.`);
        isPlainMatch = (password === user.password);
        authMethod = "plain-text";
      }
    } catch (err) {
      console.error(`❌ Comparison error for ${email}:`, err.message);
      isMatch = false;
    }

    if (!isMatch && !isPlainMatch) {
      const hashPrefix = user.password ? user.password.substring(0, 7) : "none";
      const hasHiddenChars = /[\s\u0000-\u001F\u007F-\u009F]/.test(password);
      
      // Masked input check
      const inputFirst = password ? password[0] : "?";
      const inputLast = password ? password[password.length - 1] : "?";

      console.log(`❌ Login Failed: Password mismatch for user ${email}. (Auth: ${authMethod}, Len: ${password?.length}, HashLen: ${user.password?.length}, Prefix: ${hashPrefix}, Start: ${inputFirst}, End: ${inputLast}, Hidden: ${hasHiddenChars})`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log(`✅ Login Success: ${email} (${user.role})`);

    // Fetch extra details if student
    let extraData = {};
    if (user.role === "student") {
      const studentProfile = await Student.findOne({ user: user._id });
      if (studentProfile) {
        extraData = {
          rollNumber: studentProfile.rollNumber,
          branch: studentProfile.branch,
          year: studentProfile.year,
          section: studentProfile.section
        };
      }
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
      rollNumber: user.rollNumber || extraData.rollNumber || "",
      class: user.class || (extraData.year ? `${extraData.year} - ${extraData.section}` : ""),
      department: user.department || extraData.branch || "",
      branch: extraData.branch || user.department || "",
      year: extraData.year || "",
      section: extraData.section || "",
      adminRole: user.adminRole || "",
      image: user.image || "",
      banner: user.banner || "",
      token,
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