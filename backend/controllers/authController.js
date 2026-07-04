const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    email = email.trim().toLowerCase();
    password = password.trim();
    role = role?.toLowerCase() || "student";

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({
      error: err.message,
    });
  }
};


// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    console.log("🔥 LOGIN API HIT"); // ✅ moved to TOP

    // ✅ safe destructuring
    let { email, password, role } = req.body || {};

    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    email = email.trim().toLowerCase();
    password = password.trim();
    role = role.toLowerCase();

    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user.role !== role) {
      return res.status(400).json({
        message: `Wrong role selected. This account is "${user.role}"`,
      });
    }

    // ✅ safeguard JWT
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined");
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      role: user.role,
      email: user.email,
      name: user.name,
      _id: user._id,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({
      error: err.message,
    });
  }
};