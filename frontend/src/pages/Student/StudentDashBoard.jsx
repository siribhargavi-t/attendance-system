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
  const [riskStatus, setRiskStatus] = useState("Good");
  const [projectedMax, setProjectedMax] = useState(null);
  const [classesRemaining, setClassesRemaining] = useState(0);
  const [trendData, setTrendData] = useState([]);

  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const token = localStorage.getItem("token");
  const studentName = user.name || "Student";

  const isDark = document.documentElement.classList.contains("dark");
  const textColor = isDark ? "#e2e8f0" : "#1e293b";

  useEffect(() => {
    if (!token) return;

    API.get("/api/student/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        const { totalDays, present, absent, percentage, riskStatus, projectedMaxPercentage, classesRemaining, trend } = res.data.stats;

        setStats([
          { label: "Total Classes", value: totalDays },
          { label: "Present", value: present },
          { label: "Absent", value: absent },
          { label: "Attendance %", value: `${percentage}%` },
        ]);

        setAttendancePercent(parseFloat(percentage));
        setRiskStatus(riskStatus || "Good");
        setProjectedMax(parseFloat(projectedMaxPercentage));
        setClassesRemaining(classesRemaining || 0);
        setTrendData(trend || []);
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

        {/* Predictive Analytics Banner */}
        {attendancePercent !== null && (
          <div 
            className="p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-6"
            style={{
              background: isDark ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.75)",
              borderColor: riskStatus === "Good" 
                ? "rgba(34,197,94,0.3)" 
                : riskStatus === "At Risk" 
                ? "rgba(234,179,8,0.3)" 
                : "rgba(239,68,68,0.3)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.03)"
            }}
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {riskStatus === "Good" ? "🛡️" : riskStatus === "At Risk" ? "⚠️" : "🚨"}
                </span>
                <h3 className="text-lg font-bold" style={{
                  color: riskStatus === "Good" 
                    ? "#22c55e" 
                    : riskStatus === "At Risk" 
                    ? "#eab308" 
                    : "#ef4444"
                }}>
                  Attendance Profile: {riskStatus === "Good" ? "Safe & Eligible" : riskStatus === "At Risk" ? "At Risk Warning" : "Critically Ineligible (Defaulter)"}
                </h3>
              </div>
              <p className="text-sm" style={{ color: isDark ? "#94a3b8" : "#475569" }}>
                {riskStatus === "Good" && "Excellent! Your attendance is healthy. Maintain your routine to remain fully eligible for exams."}
                {riskStatus === "At Risk" && `Your attendance is currently below 75%. You can still recover: you must attend at least ${needed} of the remaining ${classesRemaining} classes.`}
                {riskStatus === "Defaulter" && `Critical: Even if you attend all remaining ${classesRemaining} classes, your maximum attendance will top out at ${projectedMax}%. Please contact admin.`}
              </p>
            </div>
            
            {/* Projected Max Mini Card */}
            <div className="p-4 rounded-xl text-center md:text-right border bg-black/5 dark:bg-white/5" style={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)" }}>
              <p className="text-xs uppercase font-bold tracking-wider" style={{ color: isDark ? "#94a3b8" : "#64748b" }}>Projected Max %</p>
              <p className="text-3xl font-black mt-1" style={{ color: textColor }}>{projectedMax}%</p>
              <p className="text-[10px] mt-1" style={{ color: isDark ? "#64748b" : "#94a3b8" }}>if you attend all remaining classes</p>
            </div>
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

        {/* Attendance Trend Chart */}
        <div 
          className="p-6 rounded-2xl border"
          style={{
            background: isDark ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.75)",
            borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.02)"
          }}
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: textColor }}>
            <FiTrendingUp className="text-blue-500" /> Attendance Trend Over Time
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <XAxis dataKey="date" stroke={isDark ? "#64748b" : "#94a3b8"} style={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} stroke={isDark ? "#64748b" : "#94a3b8"} style={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{
                  background: isDark ? "#1e293b" : "#ffffff",
                  borderColor: isDark ? "#334155" : "#e2e8f0",
                  borderRadius: 10,
                  color: textColor
                }}
              />
              <Line 
                type="monotone" 
                dataKey="percent" 
                stroke="#6366f1" 
                strokeWidth={3}
                dot={{ r: 4, stroke: "#6366f1", strokeWidth: 2, fill: isDark ? "#0f172a" : "#fff" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </motion.div>
    </MainLayout>
  );
};

export default StudentDashboard;