require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5001; // changed to 5001 to bypass macOS AirPlay control receiver

// middleware
app.use(cors());
app.use(express.json());

// routes
const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes"); 
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use('/api/admin', adminRoutes);

const User = require('./models/User');
const bcrypt = require('bcryptjs');

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    console.log("Connected to MongoDB");
    try {
        const adminCount = await User.countDocuments({ role: 'admin' });
        if (adminCount === 0) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);
            const defaultAdmin = new User({
                username: 'admin',
                email: 'admin@system.com',
                password: hashedPassword,
                role: 'admin',
                isSuperAdmin: true
            });
            await defaultAdmin.save();
            console.log("Default admin account created: [admin / password123]");
        }
    } catch (err) {
        console.error("Error seeding default admin:", err);
    }
})
.catch(err => console.log(err));

// server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});