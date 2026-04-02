const Student = require("../models/student");
const bcrypt = require("bcryptjs");

const registerStudent = async (req, res) => {
  try {
    const { username, password, ...rest } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password are required." });
    }

    const existingStudent = await Student.findOne({ username });
    if (existingStudent) {
      return res.status(409).json({ success: false, message: "Username already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const student = new Student({
      username,
      password: hashedPassword,
      ...rest
    });

    await student.save();
    res.status(201).json({ success: true, message: "Student registered successfully.", student: { id: student._id, username: student.username } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const loginStudent = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Please provide email and password" });
  }

  try {
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // You can generate a JWT token here for session management
    res.status(200).json({ success: true, message: "Login successful" });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  registerStudent,
  loginStudent,
};