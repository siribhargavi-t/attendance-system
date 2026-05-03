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

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
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
    res.status(500).json({ message: "Server error" });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password;
    const role = req.body.role;

    // 1️⃣ Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 2️⃣ Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3️⃣ Role check
    if (user.role !== role) {
      return res.status(400).json({
        message: `Wrong role selected. This account is "${user.role}"`,
      });
    }

    // 4️⃣ REAL JWT TOKEN (IMPORTANT)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5️⃣ Response
    res.json({
      token,
      role: user.role,
      email: user.email,
      name: user.name,
      _id: user._id,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};