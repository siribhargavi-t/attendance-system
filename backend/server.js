const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

// ================= DB =================
connectDB();

// ================= APP =================
const app = express();

// ================= MIDDLEWARE =================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://attendance-system-phi-one.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ================= ROUTES IMPORT =================
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const leaveRoutes = require("./routes/leaveRoutes");

// ⚠️ Optional routes (safe loading to prevent crash)
let profileRoutes, notificationRoutes, mailRoutes;

try {
  profileRoutes = require("./routes/profileRoutes");
} catch (err) {
  console.log("profileRoutes not loaded");
}

try {
  notificationRoutes = require("./routes/notificationRoutes");
} catch (err) {
  console.log("notificationRoutes not loaded");
}

try {
  mailRoutes = require("./routes/mailRoutes");
} catch (err) {
  console.log("mailRoutes not loaded");
}

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leave", leaveRoutes);

// Optional routes (only if valid)
if (profileRoutes) app.use("/api/profile", profileRoutes);
if (notificationRoutes) app.use("/api/notifications", notificationRoutes);
if (mailRoutes) app.use("/api/mail", mailRoutes);

// ================= TEST ROUTE =================
app.get("/test", (req, res) => {
  res.send("Server working");
});

// ================= START =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});