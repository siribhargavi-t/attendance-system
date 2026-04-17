import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import MainLayout from "../../components/Layout/MainLayout";
import Loader from "../../components/Loader";
import {
  FiUsers,
  FiUserCheck,
  FiBookOpen
} from "react-icons/fi";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";

const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalClasses: 0,
    averageAttendance: 0,
  });
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await axios.get("/api/admin/dashboard");
        setDashboardStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };

    const fetchAttendanceData = async () => {
      try {
        const res = await axios.get("/api/attendance/all");
        setAttendanceData(res.data);
      } catch (err) {
        console.error("Failed to fetch attendance data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
    fetchAttendanceData();
  }, []);

  const stats = [
    {
      label: "Total Students",
      value: dashboardStats.totalStudents,
      icon: <FiUsers size={32} />,
      cardClass: "stat-card-blue",
      emoji: "🎓",
    },
    {
      label: "Total Faculty",
      value: dashboardStats.totalFaculty,
      icon: <FiUserCheck size={32} />,
      cardClass: "stat-card-green",
      emoji: "👨‍🏫",
    },
    {
      label: "Total Classes",
      value: dashboardStats.totalClasses,
      icon: <FiBookOpen size={32} />,
      cardClass: "stat-card-indigo",
      emoji: "📚",
    },
  ];

  const getDayStr = (dateString) => {
    if (!dateString) return "Unknown";
    const d = new Date(dateString);
    if (isNaN(d.valueOf())) return "Unknown";
    return d.toLocaleDateString("en-US", { weekday: "short" });
  };

  const days = Array.from(new Set(attendanceData.map(rec => getDayStr(rec.date)))).sort();
  const classes = Array.from(new Set(attendanceData.map(rec => rec.subject))).filter(Boolean).sort();

  const lineData = days.map((day) => {
    const dayRecords = attendanceData.filter((rec) => getDayStr(rec.date) === day);
    const totalPresent = dayRecords.reduce((sum, rec) => sum + (rec.status === "Present" ? 1 : 0), 0);
    const totalStudents = dayRecords.length;
    return {
      day,
      attendance: totalStudents ? Math.round((totalPresent / totalStudents) * 100) : 0,
    };
  });

  const barData = classes.map((cls) => {
    const classRecords = attendanceData.filter((rec) => rec.subject === cls);
    const totalPresent = classRecords.reduce((sum, rec) => sum + (rec.status === "Present" ? 1 : 0), 0);
    const totalStudents = classRecords.length;
    return {
      class: cls,
      value: totalStudents ? Math.round((totalPresent / totalStudents) * 100) : 0,
    };
  });

  const totalPresent = attendanceData.reduce((sum, rec) => sum + (rec.status === "Present" ? 1 : 0), 0);
  const totalStudents = attendanceData.length;
  const totalAbsent = totalStudents - totalPresent;
  const pieData = [
    { name: "Present", value: totalPresent },
    { name: "Absent", value: totalAbsent },
  ];
  const COLORS = ["#11998e", "#f5576c"];

  if (loading) return <Loader />;

  const isDark = document.documentElement.classList.contains("dark");
  const chartBg = isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.7)";
  const textColor = isDark ? "#e2e8f0" : "#1e293b";

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="shimmer-border rounded-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(102,126,234,0.15), rgba(118,75,162,0.15))",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.2)",
            padding: "24px 32px",
          }}
        >
          <h1 className="text-3xl font-bold mb-1" style={{ color: isDark ? "#f1f5f9" : "#1e293b" }}>
            🏫 Admin Dashboard
          </h1>
          <p style={{ color: isDark ? "#94a3b8" : "#64748b" }}>
            Welcome back! Here's your institutional overview.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.12 + 0.2, duration: 0.5 }}
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className={`${stat.cardClass} p-6 flex flex-col items-center text-white`}>
                <div className="text-5xl mb-1 z-10">{stat.emoji}</div>
                <div className="text-4xl font-extrabold tracking-tight mt-1 z-10">{stat.value}</div>
                <div className="text-white/80 font-semibold uppercase tracking-widest mt-1 text-sm z-10">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Line Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="glass-card p-6"
            style={{ background: chartBg }}
          >
            <h2 className="font-bold text-lg mb-4 gradient-text">📈 Attendance per Day</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={lineData}>
                <XAxis dataKey="day" tick={{ fill: textColor, fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fill: textColor, fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: isDark ? "#1e293b" : "#fff", border: "none", borderRadius: 12, color: textColor }}
                />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="url(#blueGrad)"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#667eea" }}
                  activeDot={{ r: 8 }}
                />
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="glass-card p-6"
            style={{ background: chartBg }}
          >
            <h2 className="font-bold text-lg mb-4 gradient-text">📊 Attendance per Class</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <XAxis dataKey="class" tick={{ fill: textColor, fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fill: textColor, fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: isDark ? "#1e293b" : "#fff", border: "none", borderRadius: 12, color: textColor }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {barData.map((_, i) => (
                    <Cell key={i} fill={["#667eea", "#11998e", "#f093fb", "#4facfe"][i % 4]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.75, duration: 0.5 }}
          className="glass-card p-6"
          style={{ background: chartBg, maxWidth: 480 }}
        >
          <h2 className="font-bold text-lg mb-4 gradient-text">🥧 Overall Present vs Absent</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: isDark ? "#1e293b" : "#fff", border: "none", borderRadius: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
};

export default AdminDashboard;