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


app.use(cors({
  origin: "*",  // 🔥 allow all (temporary fix)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.options("*", cors());   // handle preflight fully
// ================= SAFE ROUTE LOADER =================
function loadRoute(path, name) {
  try {
    const route = require(path);

    if (typeof route !== "function") {
      console.log(`❌ ${name} is NOT a router (invalid export)`);
      return null;
    }

    console.log(`✅ ${name} loaded`);
    return route;
  } catch (err) {
    console.log(`❌ Failed to load ${name}:`, err.message);
    return null;
  }
}

// ================= IMPORT ROUTES =================
const authRoutes = loadRoute("./routes/authRoutes", "authRoutes");
const studentRoutes = loadRoute("./routes/studentRoutes", "studentRoutes");
const facultyRoutes = loadRoute("./routes/facultyRoutes", "facultyRoutes");
const adminRoutes = loadRoute("./routes/adminRoutes", "adminRoutes");
const attendanceRoutes = loadRoute("./routes/attendanceRoutes", "attendanceRoutes");
const leaveRoutes = loadRoute("./routes/leaveRoutes", "leaveRoutes");
const profileRoutes = loadRoute("./routes/profileRoutes", "profileRoutes");
const notificationRoutes = loadRoute("./routes/notificationRoutes", "notificationRoutes");
const mailRoutes = loadRoute("./routes/mailRoutes", "mailRoutes");

// ================= MOUNT ROUTES =================
if (authRoutes) app.use("/api/auth", authRoutes);
if (studentRoutes) app.use("/api/student", studentRoutes);
if (facultyRoutes) app.use("/api/faculty", facultyRoutes);
if (adminRoutes) app.use("/api/admin", adminRoutes);
if (attendanceRoutes) app.use("/api/attendance", attendanceRoutes);
if (leaveRoutes) app.use("/api/leave", leaveRoutes);
if (profileRoutes) app.use("/api/profile", profileRoutes);
if (notificationRoutes) app.use("/api/notifications", notificationRoutes);
if (mailRoutes) app.use("/api/mail", mailRoutes);

// ================= TEST =================
app.get("/test", (req, res) => {
  res.send("Server working");
});

// ================= START =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});