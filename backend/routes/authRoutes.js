const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.login = async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password;
    const role = req.body.role;

    // 🔥 Step 1: Find ONLY by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 🔥 Step 2: Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 🔥 Step 3: Check role AFTER login
    if (user.role !== role) {
      return res.status(400).json({
        message: `Wrong role selected. This account is "${user.role}"`,
      });
    }

    // ✅ Success
    res.json({
      token: "your_token_here",
      role: user.role,
      email: user.email,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};