const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
// FIX: Correct the path to the attendance routes file
const attendanceRoutes = require('./routes/attendanceRoutes');
const studentRoutes = require('./routes/studentRoutes');   
const authRoutes = require('./routes/authRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const adminRoutes = require('./routes/adminRoutes');
const profileRoutes = require('./routes/profileRoutes');
const path = require('path');
const notificationRoutes = require("./routes/notificationRoutes");
const mailRoutes = require('./routes/mailRoutes');

// FIX: Remove the path to let dotenv find the .env file automatically
require('dotenv').config();

// Connect to database
connectDB();

const app = express(); // <-- Move this line above all app.use() calls

const leaveRoutes = require("./routes/leaveRoutes");

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ FIXED CORS (FULL)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://attendance-system-phi-one.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ If you want to keep preflight handling, use:

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/mail', mailRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/attendance', attendanceRoutes); // <-- Attendance routes connected here
app.use('/api/leave', leaveRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/profile', profileRoutes);
app.use("/api/notifications", notificationRoutes);
app.get("/test", (req, res) => {
  res.send("Server working");
});
// =================== ADD THIS SECTION ===================
// Serve static assets if in production

// REMOVE production static serving completelyS

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
