import { useEffect, useState } from "react";
import API from "../../services/api";   // adjust path
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
  {
    label: "Total Classes",
    key: "Total Classes",
    icon: <FiBookOpen size={28} />,
    cardClass: "stat-card-indigo",
    emoji: "📚",
  },
  {
    label: "Present",
    key: "Present",
    icon: <FiUserCheck size={28} />,
    cardClass: "stat-card-green",
    emoji: "✅",
  },
  {
    label: "Absent",
    key: "Absent",
    icon: <FiUserX size={28} />,
    cardClass: "stat-card-orange",
    emoji: "❌",
  },
  {
    label: "Attendance %",
    key: "Attendance %",
    icon: <FiPercent size={28} />,
    cardClass: "stat-card-blue",
    emoji: "📊",
  },
];

const StudentDashboard = () => {
  const [stats, setStats] = useState([]);
  const [subjectAttendance, setSubjectAttendance] = useState([]);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [attendanceTrend, setAttendanceTrend] = useState([]);
  const [attendancePercent, setAttendancePercent] = useState(null);

  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const studentEmail = user.email || "";
  const studentName = user.name || "Student";

  const isDark = document.documentElement.classList.contains("dark");
  const chartBg = isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.75)";
  const textColor = isDark ? "#e2e8f0" : "#1e293b";

  useEffect(() => {
    if (!studentEmail) return;

API.get(`/api/attendance?studentEmail=${encodeURIComponent(studentEmail)}`).then(res => {
        const records = res.data;
        const total = records.length;
        const present = records.filter(r => r.status === "Present").length;
        const absent = total - present;
        const percentVal = total > 0 ? Math.round((present / total) * 100) : 0;

        setStats([
          { label: "Total Classes", value: total },
          { label: "Present", value: present },
          { label: "Absent", value: absent },
          { label: "Attendance %", value: `${percentVal}%` },
        ]);

        setAttendancePercent(percentVal);

        const subjMap = {};
        records.forEach(r => {
          if (!subjMap[r.subject]) subjMap[r.subject] = { total: 0, present: 0 };
          subjMap[r.subject].total++;
          if (r.status === "Present") subjMap[r.subject].present++;
        });
        const subjAtt = Object.keys(subjMap).map(subj => ({
          subject: subj,
          percent: Math.round((subjMap[subj].present / subjMap[subj].total) * 100)
        }));
        setSubjectAttendance(subjAtt);

        const sorted = [...records].sort((a, b) => new Date(b.date) - new Date(a.date));
        setRecentAttendance(sorted.slice(0, 5).map(r => ({
          date: r.date.split("T")[0] || new Date(r.date).toLocaleDateString(),
          subject: r.subject,
          status: r.status
        })));

        const dateMap = {};
        records.forEach(r => {
          const d = r.date.split("T")[0] || new Date(r.date).toLocaleDateString();
          if (!dateMap[d]) dateMap[d] = { total: 0, present: 0 };
          dateMap[d].total++;
          if (r.status === "Present") dateMap[d].present++;
        });
        const trend = Object.keys(dateMap).sort().slice(-7).map(d => ({
          date: d,
          percent: Math.round((dateMap[d].present / dateMap[d].total) * 100)
        }));
        setAttendanceTrend(trend);
      })
      .catch(err => {
        console.error("Failed to fetch attendance data", err);
        setAttendancePercent(null);
      });
  }, [studentEmail]);

  const bestSubject = subjectAttendance.length > 0
    ? subjectAttendance.reduce((best, subj) => subj.percent > best.percent ? subj : best, subjectAttendance[0])
    : null;
  const lowSubject = subjectAttendance.length > 0
    ? subjectAttendance.reduce((low, subj) => subj.percent < low.percent ? subj : low, subjectAttendance[0])
    : null;

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
        transition={{ duration: 0.6 }}
      >
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="shimmer-border rounded-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(79,172,254,0.2), rgba(17,153,142,0.15))",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.25)",
            padding: "28px 32px",
          }}
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl">🎓</div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: isDark ? "#f1f5f9" : "#1e293b" }}>
                Welcome back, <span className="gradient-text-cyan">{studentName}!</span>
              </h1>
              <p style={{ color: isDark ? "#94a3b8" : "#64748b" }} className="mt-1">
                Here's your attendance overview and analytics.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Alerts */}
        {attendancePercent !== null && attendancePercent < 75 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl p-4 flex items-center gap-3 font-semibold"
            style={{
              background: "linear-gradient(135deg, rgba(245,87,108,0.2), rgba(253,162,90,0.15))",
              border: "1px solid rgba(245,87,108,0.4)",
              color: isDark ? "#fca5a5" : "#b91c1c",
            }}
          >
            <span className="text-2xl">⚠️</span>
            <span>Your attendance is below 75%! Please attend more classes.</span>
          </motion.div>
        )}

        {needed > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl p-4 flex items-center gap-3 font-semibold"
            style={{
              background: "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.15))",
              border: "1px solid rgba(251,191,36,0.4)",
              color: isDark ? "#fde68a" : "#92400e",
            }}
          >
            <FiTrendingUp size={22} />
            <span>Attend <strong>{needed}</strong> more classes to reach 75% attendance.</span>
          </motion.div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STAT_CONFIGS.map((cfg, idx) => {
            const stat = stats.find(s => s.label === cfg.key);
            return (
              <motion.div
                key={cfg.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 + 0.2 }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className={`${cfg.cardClass} p-5 flex flex-col items-center text-white`}>
                  <div className="text-3xl mb-1 z-10">{cfg.emoji}</div>
                  <div className="text-3xl font-extrabold z-10">{stat?.value ?? "—"}</div>
                  <div className="text-white/80 text-xs font-semibold uppercase tracking-wider mt-1 z-10">
                    {cfg.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="glass-card p-6"
          style={{ background: chartBg }}
        >
          <h2 className="font-bold text-lg mb-4 gradient-text">📈 Attendance Trend (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={attendanceTrend}>
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: textColor }} stroke="#cbd5e1" />
              <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 12, fill: textColor }} stroke="#cbd5e1" />
              <Tooltip
                formatter={v => `${v}%`}
                labelFormatter={l => `Date: ${l}`}
                contentStyle={{ background: isDark ? "#1e293b" : "#fff", borderRadius: 12, border: "none", color: textColor }}
              />
              <Line
                type="monotone"
                dataKey="percent"
                stroke="#4facfe"
                strokeWidth={3}
                dot={{ r: 6, stroke: "#4facfe", strokeWidth: 2, fill: "#fff" }}
                activeDot={{ r: 8, fill: "#4facfe", stroke: "#fff", strokeWidth: 2 }}
                isAnimationActive={true}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Subject-wise Attendance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="glass-card p-6"
          style={{ background: chartBg }}
        >
          <h2 className="font-bold text-lg mb-5 gradient-text">📖 Subject-wise Attendance</h2>
          <div className="space-y-4">
            {subjectAttendance.length > 0 ? (
              subjectAttendance.map((subj, i) => {
                const gradients = [
                  "linear-gradient(90deg, #667eea, #764ba2)",
                  "linear-gradient(90deg, #11998e, #38ef7d)",
                  "linear-gradient(90deg, #f093fb, #f5576c)",
                  "linear-gradient(90deg, #4facfe, #00f2fe)",
                ];
                const grad = gradients[i % gradients.length];
                return (
                  <div key={subj.subject}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-sm" style={{ color: textColor }}>{subj.subject}</span>
                      <span
                        className="text-sm font-bold px-3 py-0.5 rounded-full text-white"
                        style={{ background: grad }}
                      >
                        {subj.percent}%
                      </span>
                    </div>
                    <div className="w-full rounded-full h-3 neu-inset overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${subj.percent}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="h-3 rounded-full"
                        style={{ background: grad }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ color: isDark ? "#94a3b8" : "#64748b" }}>No data available</div>
            )}
          </div>
        </motion.div>

        {/* Recent Attendance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="glass-card p-6"
          style={{ background: chartBg }}
        >
          <h2 className="font-bold text-lg mb-4 gradient-text">🕐 Recent Attendance</h2>
          <div className="overflow-x-auto">
            {recentAttendance.length > 0 ? (
              <table className="w-full text-sm colorful-table rounded-xl overflow-hidden">
                <thead>
                  <tr>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Subject</th>
                    <th className="py-3 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAttendance.map((rec, idx) => (
                    <tr
                      key={idx}
                      className="border-b transition"
                      style={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }}
                    >
                      <td className="py-3 px-4" style={{ color: textColor }}>{rec.date}</td>
                      <td className="py-3 px-4" style={{ color: textColor }}>{rec.subject}</td>
                      <td className="py-3 px-4">
                        <span
                          className="px-3 py-1 text-xs rounded-full font-semibold text-white"
                          style={{
                            background: rec.status === "Present"
                              ? "linear-gradient(135deg, #11998e, #38ef7d)"
                              : "linear-gradient(135deg, #f093fb, #f5576c)",
                          }}
                        >
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ color: isDark ? "#94a3b8" : "#64748b" }} className="text-center py-6">
                No data available
              </div>
            )}
          </div>
        </motion.div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="glass-card p-6"
          style={{ background: chartBg }}
        >
          <h2 className="font-bold text-lg mb-4 gradient-text">💡 Attendance Insights</h2>
          {bestSubject && lowSubject ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className="rounded-xl p-4"
                style={{
                  background: "linear-gradient(135deg, rgba(17,153,142,0.15), rgba(56,239,125,0.1))",
                  border: "1px solid rgba(17,153,142,0.3)",
                }}
              >
                <div className="text-2xl mb-1">🏆</div>
                <div className="font-semibold text-sm" style={{ color: isDark ? "#6ee7b7" : "#065f46" }}>Best Subject</div>
                <div className="font-bold text-lg" style={{ color: isDark ? "#a7f3d0" : "#047857" }}>
                  {bestSubject.subject}
                </div>
                <div style={{ color: isDark ? "#6ee7b7" : "#059669" }}>{bestSubject.percent}%</div>
              </div>
              <div
                className="rounded-xl p-4"
                style={{
                  background: "linear-gradient(135deg, rgba(245,87,108,0.15), rgba(240,147,251,0.1))",
                  border: "1px solid rgba(245,87,108,0.3)",
                }}
              >
                <div className="text-2xl mb-1">⚠️</div>
                <div className="font-semibold text-sm" style={{ color: isDark ? "#fca5a5" : "#991b1b" }}>Needs Attention</div>
                <div className="font-bold text-lg" style={{ color: isDark ? "#fca5a5" : "#b91c1c" }}>
                  {lowSubject.subject}
                </div>
                <div style={{ color: isDark ? "#f87171" : "#dc2626" }}>{lowSubject.percent}%</div>
              </div>
            </div>
          ) : (
            <div style={{ color: isDark ? "#94a3b8" : "#64748b" }}>No data available</div>
          )}
        </motion.div>
      </motion.div>
    </MainLayout>
  );
};

export default StudentDashboard;