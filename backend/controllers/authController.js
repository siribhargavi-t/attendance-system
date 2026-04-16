const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ================= REGISTER =================
const register = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    // ✅ normalize email (VERY IMPORTANT)
    email = email.toLowerCase().trim();

    console.log("Register request:", { name, email, role });

    // ✅ check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    console.log("User saved:", user); // 🔥 debug

    res.status(201).json({ message: "Registered successfully" });

  } catch (err) {
    // ✅ handle duplicate error
    if (err.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    }

    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Register failed" });
  }
};

// ================= LOGIN =================
const login = async (req, res) => {
  try {
    let { email, password, role } = req.body;

    // ✅ normalize email (VERY IMPORTANT)
    email = email.toLowerCase().trim();

    console.log("Login attempt:", { email, role });

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.role !== role) {
      return res.status(400).json({ message: "Role mismatch" });
    }

    if (!user.password) {
      return res.status(500).json({ message: "Password missing in DB" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    const isPlainMatch = password === user.password; // Fallback for manual db entries

    if (!isMatch && !isPlainMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      role: user.role,
      email: user.email,
      name: user.name,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

module.exports = { register, login };