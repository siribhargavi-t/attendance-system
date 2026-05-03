import { useEffect, useState } from "react";
import API from "../../services/api";
import { motion } from "framer-motion";
import MainLayout from "../../components/Layout/MainLayout";
import { FiBookOpen, FiUserCheck, FiUserX, FiPercent, FiTrendingUp } from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const STAT_CONFIGS = [
  { label: "Total Classes", key: "Total Classes", icon: <FiBookOpen size={28} />, cardClass: "stat-card-indigo", emoji: "📚" },
  { label: "Present", key: "Present", icon: <FiUserCheck size={28} />, cardClass: "stat-card-green", emoji: "✅" },
  { label: "Absent", key: "Absent", icon: <FiUserX size={28} />, cardClass: "stat-card-orange", emoji: "❌" },
  { label: "Attendance %", key: "Attendance %", icon: <FiPercent size={28} />, cardClass: "stat-card-blue", emoji: "📊" },
];

const StudentDashboard = () => {
  const [stats, setStats] = useState([]);
  const [attendancePercent, setAttendancePercent] = useState(null);

  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const token = localStorage.getItem("token");
  const studentName = user.name || "Student";

  const isDark = document.documentElement.classList.contains("dark");
  const chartBg = isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.75)";
  const textColor = isDark ? "#e2e8f0" : "#1e293b";

  useEffect(() => {
    if (!token) return;

    API.get("/api/student/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        const { totalDays, present, absent, percentage } = res.data.stats;

        setStats([
          { label: "Total Classes", value: totalDays },
          { label: "Present", value: present },
          { label: "Absent", value: absent },
          { label: "Attendance %", value: `${percentage}%` },
        ]);

        setAttendancePercent(parseFloat(percentage));
      })
      .catch((err) => {
        console.error("Failed to fetch dashboard stats", err);
        setAttendancePercent(null);
      });
  }, [token]);

  const totalClasses = stats.find(s => s.label === "Total Classes")?.value || 0;
  const presentClasses = stats.find(s => s.label === "Present")?.value || 0;

  let needed = 0;
  if (totalClasses > 0 && presentClasses / totalClasses < 0.75) {
    needed = Math.ceil((0.75 * totalClasses - presentClasses) / 0.25);
    if (needed < 0) needed = 0;
  }

  return (
    <MainLayout>
      <motion.div
        className="max-w-6xl mx-auto space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >

        {/* Welcome */}
        <div className="p-6 rounded-xl bg-gradient-to-r from-blue-400/20 to-green-400/20">
          <h2 className="text-xl font-bold">
            Welcome, {studentName}
          </h2>
        </div>

        {/* Alerts */}
        {attendancePercent !== null && attendancePercent < 75 && (
          <div className="p-4 bg-red-200 rounded">
            ⚠️ Attendance below 75%
          </div>
        )}

        {needed > 0 && (
          <div className="p-4 bg-yellow-200 rounded">
            Attend {needed} more classes to reach 75%
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STAT_CONFIGS.map((cfg) => {
            const stat = stats.find(s => s.label === cfg.key);
            return (
              <div key={cfg.label} className="p-4 bg-gray-200 rounded text-center">
                <div className="text-2xl">{cfg.emoji}</div>
                <div className="text-xl font-bold">{stat?.value ?? "-"}</div>
                <div>{cfg.label}</div>
              </div>
            );
          })}
        </div>

        {/* Chart placeholder (optional) */}
        <div className="p-6 rounded bg-white">
          <h3 className="mb-2">Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={[]}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="percent" stroke="#4facfe" />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </motion.div>
    </MainLayout>
  );
};

export default StudentDashboard;