import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";   // adjust path
import { motion } from "framer-motion";
import MainLayout from "../../components/Layout/MainLayout";
import { FiPlus, FiCalendar, FiFileText } from "react-icons/fi";

const LeaveList = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const studentEmail = user.email || "";

  const isDark = document.documentElement.classList.contains("dark");
  const textColor = isDark ? "#f1f5f9" : "#1e293b";
  const mutedColor = isDark ? "#94a3b8" : "#64748b";
  const cardBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.75)";

  useEffect(() => {
    if (!studentEmail) return;
    API.get(`/api/leave/student/${encodeURIComponent(studentEmail)}`).then((res) => setLeaveRequests(res.data))
      .catch(() => setLeaveRequests([]))
      .finally(() => setLoading(false));
  }, [studentEmail]);

  const StatusPill = ({ status }) => {
    const configs = {
      Approved: { bg: "linear-gradient(135deg, #11998e, #38ef7d)", text: "✅ Approved" },
      Rejected: { bg: "linear-gradient(135deg, #f093fb, #f5576c)", text: "❌ Rejected" },
      Pending: { bg: "linear-gradient(135deg, #f59e0b, #fcd34d)", text: "⏳ Pending" },
    };
    const cfg = configs[status || "Pending"] || configs.Pending;
    return (
      <span
        className="px-3 py-1 rounded-full text-white text-xs font-bold"
        style={{ background: cfg.bg }}
      >
        {cfg.text}
      </span>
    );
  };

  return (
    <MainLayout>
      <motion.div
        className="max-w-3xl mx-auto space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="shimmer-border rounded-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(79,172,254,0.18), rgba(17,153,142,0.14))",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.22)",
            padding: "24px 28px",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">📋</div>
              <div>
                <h1 className="text-2xl font-bold gradient-text-cyan">My Leave Requests</h1>
                <p style={{ color: mutedColor, fontSize: 14 }}>Track your submitted leave requests</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="btn-glow-blue flex items-center gap-2"
              onClick={() => navigate("/student/new-leave")}
            >
              <FiPlus size={18} /> New Leave
            </motion.button>
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div style={{ color: mutedColor, textAlign: "center", padding: 40 }}>Loading...</div>
        ) : leaveRequests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 text-center"
            style={{ background: cardBg }}
          >
            <div className="text-5xl mb-3">📭</div>
            <p style={{ color: mutedColor }} className="mb-4">No leave requests submitted yet.</p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              className="btn-glow-blue"
              onClick={() => navigate("/student/new-leave")}
            >
              Submit Your First Leave
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {leaveRequests.map((req, idx) => (
              <motion.div
                key={req._id || req.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="glass-card p-6"
                style={{ background: cardBg }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-2">
                    {/* Dates */}
                    <div className="flex items-center gap-4 flex-wrap text-sm">
                      <div className="flex items-center gap-1" style={{ color: mutedColor }}>
                        <FiCalendar size={14} />
                        <span>From:</span>
                        <span style={{ color: textColor, fontWeight: 700 }}>
                          {req.fromDate ? new Date(req.fromDate).toLocaleDateString() : "—"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1" style={{ color: mutedColor }}>
                        <FiCalendar size={14} />
                        <span>To:</span>
                        <span style={{ color: textColor, fontWeight: 700 }}>
                          {req.toDate ? new Date(req.toDate).toLocaleDateString() : "—"}
                        </span>
                      </div>
                    </div>

                    {/* Faculty */}
                    {req.facultyName && (
                      <div className="text-sm" style={{ color: mutedColor }}>
                        Faculty: <span style={{ color: textColor, fontWeight: 600 }}>{req.facultyName}</span>
                      </div>
                    )}

                    {/* Reason */}
                    <div className="flex items-start gap-2 text-sm">
                      <FiFileText size={13} style={{ color: mutedColor, marginTop: 2 }} />
                      <span style={{ color: textColor }}>{req.reason}</span>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <StatusPill status={req.status} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </MainLayout>
  );
};

export default LeaveList;