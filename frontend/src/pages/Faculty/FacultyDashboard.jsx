import React, { useState } from "react";
import { motion } from "framer-motion";
import MainLayout from "../../components/Layout/MainLayout";
import { FiUsers, FiUserCheck, FiUserX, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const getSummary = (students) => {
  const total = students.length;
  const present = students.filter((s) => s.status === "Present").length;
  const absent = students.filter((s) => s.status === "Absent").length;
  return { total, present, absent };
};

const FacultyDashboard = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  const isDark = document.documentElement.classList.contains("dark");
  const textColor = isDark ? "#f8fafc" : "#0f172a";
  const mutedColor = isDark ? "#94a3b8" : "#64748b";
  const chartBg = isDark ? "rgba(15, 23, 42, 0.82)" : "rgba(255, 255, 255, 0.75)";
  const cardBorder = isDark ? "rgba(102, 126, 234, 0.15)" : "rgba(0, 0, 0, 0.08)";

  React.useEffect(() => {
    Promise.all([
      axios.get("/api/admin/students"),
      axios.get("/api/attendance/all")
    ]).then(([studentsRes, attendanceRes]) => {
      const allStudents = studentsRes.data;
      const allAttendance = attendanceRes.data;

      const today = new Date().toISOString().split("T")[0];
      const todayRecords = allAttendance.filter(r => r.date && r.date.startsWith(today));

      const mergedStudents = allStudents.map(student => {
        const rec = todayRecords.find(r => r.studentEmail === student.email);
        return {
          id: student._id,
          name: student.name,
          status: rec ? rec.status : "Not Marked"
        };
      });
      setStudents(mergedStudents);
    }).catch(err => console.error(err));
  }, []);

  const summary = getSummary(students);

  const cards = [
    {
      label: "Total Students",
      value: summary.total,
      icon: <FiUsers size={32} />,
      emoji: "👥",
      cardClass: "stat-card-blue",
    },
    {
      label: "Present Today",
      value: summary.present,
      icon: <FiUserCheck size={32} />,
      emoji: "✅",
      cardClass: "stat-card-green",
    },
    {
      label: "Absent Today",
      value: summary.absent,
      icon: <FiUserX size={32} />,
      emoji: "❌",
      cardClass: "stat-card-orange",
    },
  ];

  return (
    <MainLayout>
      <motion.div
        className="max-w-6xl mx-auto space-y-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="shimmer-border rounded-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(102,126,234,0.18), rgba(118,75,162,0.15))",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.25)",
            padding: "28px 32px",
          }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-5xl">👨‍🏫</div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: textColor }}>
                  Welcome back, <span className="gradient-text">Faculty!</span>
                </h1>
                <p style={{ color: mutedColor }} className="mt-1">
                  Here is your today's attendance overview.
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="btn-glow-blue flex items-center gap-2"
              onClick={() => navigate("/faculty/attendance")}
            >
              Mark Attendance <FiArrowRight />
            </motion.button>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.12 + 0.2 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className={`${card.cardClass} p-7 flex flex-col items-center text-white`}>
                <div className="text-5xl mb-2 z-10">{card.emoji}</div>
                <div className="text-4xl font-extrabold tracking-tight z-10">{card.value}</div>
                <div className="text-white/80 font-semibold uppercase tracking-widest mt-1 text-sm z-10">
                  {card.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Today's Student List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6 border"
          style={{ background: chartBg, borderColor: cardBorder, boxShadow: isDark ? "0 20px 50px rgba(0,0,0,0.3)" : "none" }}
        >
          <h2 className="font-bold text-lg mb-4 gradient-text">👨‍🎓 Today's Students</h2>
          {students.length === 0 ? (
            <p style={{ color: mutedColor }}>No students found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm colorful-table rounded-xl overflow-hidden">
                <thead>
                  <tr>
                    <th className="py-3 px-4 text-left">#</th>
                    <th className="py-3 px-4 text-left">Student Name</th>
                    <th className="py-3 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, idx) => (
                    <tr
                      key={s.id}
                      className="border-b transition"
                      style={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }}
                    >
                      <td className="py-3 px-4 font-medium" style={{ color: mutedColor }}>{idx + 1}</td>
                      <td className="py-3 px-4 font-semibold" style={{ color: textColor }}>{s.name}</td>
                      <td className="py-3 px-4">
                        <span
                          className="px-3 py-1 text-xs rounded-full font-semibold text-white"
                          style={{
                            background:
                              s.status === "Present"
                                ? "linear-gradient(135deg, #11998e, #38ef7d)"
                                : s.status === "Absent"
                                ? "linear-gradient(135deg, #f093fb, #f5576c)"
                                : "linear-gradient(135deg, #667eea, #764ba2)",
                          }}
                        >
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
            <div
            className="glass-card p-5 flex items-center gap-4 cursor-pointer border hover:shadow-xl transition-all"
            style={{ background: chartBg, borderColor: cardBorder }}
            onClick={() => navigate("/faculty/attendance")}
          >
            <div className="text-4xl">📝</div>
            <div>
              <div className="font-bold" style={{ color: textColor }}>Mark Attendance</div>
              <div className="text-sm" style={{ color: mutedColor }}>Record today's class attendance</div>
            </div>
          </div>
          <div
            className="glass-card p-5 flex items-center gap-4 cursor-pointer border hover:shadow-xl transition-all"
            style={{ background: chartBg, borderColor: cardBorder }}
            onClick={() => navigate("/faculty/leave-requests")}
          >
            <div className="text-4xl">📋</div>
            <div>
              <div className="font-bold" style={{ color: textColor }}>Leave Requests</div>
              <div className="text-sm" style={{ color: mutedColor }}>View and manage student leaves</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
};

export default FacultyDashboard;
