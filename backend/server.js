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


// Allow localhost origins for development and any production origins needed
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "http://localhost:8000",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl/Postman requests)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) || 
                      /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin) ||
                      /^https?:\/\/[a-zA-Z0-9-]+\.(onrender\.com|vercel\.app|netlify\.app|github\.io)$/.test(origin);
                      
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
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