import React, { useState, useEffect } from "react";
import API from "../../services/api";   // adjust path
import { motion } from "framer-motion";
import MainLayout from "../../components/Layout/MainLayout";
import { FiCheck, FiX, FiCalendar, FiUser, FiFileText, FiMail } from "react-icons/fi";

const FacultyLeaveRequests = () => {
  const isDark = document.documentElement.classList.contains("dark");
  const textColor = isDark ? "#f8fafc" : "#0f172a";
  const mutedColor = isDark ? "#94a3b8" : "#64748b";
  const cardBg = isDark ? "rgba(15, 23, 42, 0.82)" : "rgba(255, 255, 255, 0.85)";
  const cardBorder = isDark ? "rgba(102, 126, 234, 0.15)" : "rgba(0, 0, 0, 0.08)";

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const facultyEmail = userData.email || "";

    API.get(`/api/leave?facultyEmail=${facultyEmail}`)
      .then((res) => setRequests(res.data))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDecision = async (id, status) => {
    try {
      await API.put(`/api/leave/${id}`, { status });
      setRequests((prev) =>
        prev.map((req) => (req._id === id ? { ...req, status } : req))
      );
      alert(`Leave ${status} and notification sent.`);
    } catch {
      alert("Failed to update leave status.");
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!emailSubject.trim() || !emailMessage.trim()) return;

    try {
      setSendingEmail(true);
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const token = userData.token;

      await API.post("/api/faculty/send-email", {
        studentEmail: selectedStudent.studentEmail,
        subject: emailSubject,
        message: emailMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Email sent successfully!");
      setShowEmailModal(false);
      setEmailSubject("");
      setEmailMessage("");
    } catch (err) {
      console.error(err);
      alert("Failed to send email. Please try again.");
    } finally {
      setSendingEmail(false);
    }
  };

  const openEmailModal = (req) => {
    setSelectedStudent(req);
    setEmailSubject(`Regarding your leave request: ${req.reason.substring(0, 20)}...`);
    setShowEmailModal(true);
  };

  const StatusPill = ({ status }) => {
    const configs = {
      Approved: {
        bg: "linear-gradient(135deg, #11998e, #38ef7d)",
        text: "✅ Approved",
      },
      Rejected: {
        bg: "linear-gradient(135deg, #f093fb, #f5576c)",
        text: "❌ Rejected",
      },
      Pending: {
        bg: "linear-gradient(135deg, #f59e0b, #fcd34d)",
        text: "⏳ Pending",
      },
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
        className="max-w-4xl mx-auto space-y-6"
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
            background: "linear-gradient(135deg, rgba(102,126,234,0.15), rgba(118,75,162,0.12))",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.2)",
            padding: "24px 28px",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="text-4xl">📋</div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Leave Requests</h1>
              <p style={{ color: mutedColor, fontSize: 14 }}>
                Review and manage student leave applications
              </p>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div style={{ color: mutedColor, textAlign: "center", padding: 40 }}>
            Loading leave requests...
          </div>
        ) : requests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 text-center"
            style={{ background: cardBg }}
          >
            <div className="text-5xl mb-3">📭</div>
            <p style={{ color: mutedColor }}>No leave requests found.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {requests.map((req, idx) => (
              <motion.div
                key={req._id || req.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="glass-card p-6 border transition-all"
                style={{ background: cardBg, borderColor: cardBorder, boxShadow: isDark ? "0 10px 40px rgba(0,0,0,0.3)" : "none" }}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Info */}
                  <div className="space-y-2 flex-1">
                    {/* Student */}
                    <div className="flex items-center gap-2">
                      <FiUser size={14} style={{ color: "#667eea" }} />
                      <span className="font-bold text-base" style={{ color: textColor }}>
                        {req.studentName || "Unknown Student"}
                      </span>
                      <span style={{ color: mutedColor, fontSize: 13 }}>
                        · {req.studentEmail}
                      </span>
                      {/* Email Trigger Icon */}
                      <button 
                         onClick={() => openEmailModal(req)}
                         className="p-1.5 rounded-lg hover:bg-blue-500/10 transition-colors"
                         title="Send Email to Student"
                      >
                         <FiMail size={16} color="#667eea" />
                      </button>
                    </div>

                    {/* Faculty Name */}
                    <div className="flex items-center gap-2 text-sm">
                      <span style={{ color: mutedColor }}>Faculty:</span>
                      <span className="font-semibold" style={{ color: textColor }}>
                        {req.facultyName || req.facultyEmail || "—"}
                      </span>
                    </div>

                    {/* Dates */}
                    <div className="flex items-center gap-4 text-sm flex-wrap">
                      <div className="flex items-center gap-1" style={{ color: mutedColor }}>
                        <FiCalendar size={13} />
                        <span>From:</span>
                        <span style={{ color: textColor, fontWeight: 600 }}>
                          {req.fromDate ? new Date(req.fromDate).toLocaleDateString() : "—"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1" style={{ color: mutedColor }}>
                        <FiCalendar size={13} />
                        <span>To:</span>
                        <span style={{ color: textColor, fontWeight: 600 }}>
                          {req.toDate ? new Date(req.toDate).toLocaleDateString() : "—"}
                        </span>
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="flex items-start gap-2 text-sm">
                      <FiFileText size={13} style={{ color: mutedColor, marginTop: 2 }} />
                      <div>
                        <span style={{ color: mutedColor }}>Reason: </span>
                        <span style={{ color: textColor }}>{req.reason}</span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2 mt-1">
                      <StatusPill status={req.status} />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {(!req.status || req.status === "Pending") && (
                    <div className="flex gap-3 flex-shrink-0 items-start mt-1">
                      <motion.button
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-xl"
                        style={{
                          background: "linear-gradient(135deg, #11998e, #38ef7d)",
                          boxShadow: "0 4px 15px rgba(17,153,142,0.4)",
                        }}
                        onClick={() => handleDecision(req._id || req.id, "Approved")}
                      >
                        <FiCheck size={16} /> Approve
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-xl"
                        style={{
                          background: "linear-gradient(135deg, #f093fb, #f5576c)",
                          boxShadow: "0 4px 15px rgba(245,87,108,0.4)",
                        }}
                        onClick={() => handleDecision(req._id || req.id, "Rejected")}
                      >
                        <FiX size={16} /> Reject
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Email Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md rounded-3xl overflow-hidden shimmer-border"
              style={{ background: cardBg, backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold gradient-text" style={{ color: textColor }}>Compose Email</h2>
                  <button onClick={() => setShowEmailModal(false)} style={{ color: mutedColor }}><FiX size={20}/></button>
                </div>
                
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: mutedColor }}>Recipient</p>
                  <p className="text-sm font-semibold p-3 rounded-xl bg-blue-500/5" style={{ color: textColor, border: "1px solid rgba(102,126,234,0.2)" }}>
                    {selectedStudent?.studentName} ({selectedStudent?.studentEmail})
                  </p>
                </div>

                <form onSubmit={handleSendEmail} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: mutedColor }}>Subject</label>
                    <input 
                      type="text" 
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full p-3 rounded-xl outline-none transition-all"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(102,126,234,0.3)", color: textColor }}
                      placeholder="Enter subject..."
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: mutedColor }}>Message</label>
                    <textarea 
                      rows={4}
                      value={emailMessage}
                      onChange={(e) => setEmailMessage(e.target.value)}
                      className="w-full p-3 rounded-xl outline-none transition-all resize-none"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(102,126,234,0.3)", color: textColor }}
                      placeholder="Write your message here..."
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      type="submit" 
                      disabled={sendingEmail}
                      className="flex-1 py-3 rounded-xl font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                      style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", boxShadow: "0 8px 20px rgba(102,126,234,0.3)" }}
                    >
                      {sendingEmail ? "Sending..." : "Send Email"}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowEmailModal(false)}
                      className="px-6 py-3 rounded-xl font-bold transition-all border"
                      style={{ color: textColor, borderColor: "rgba(102,126,234,0.2)" }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </MainLayout>
  );
};

export default FacultyLeaveRequests;

