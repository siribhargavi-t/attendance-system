import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";   // adjust path
import { motion } from "framer-motion";
import { FiCalendar, FiFileText, FiUser, FiSend } from "react-icons/fi";
import MainLayout from "../../components/Layout/MainLayout";

const NewLeave = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const studentName = user?.name || "";
  const studentEmail = user?.email || "";

  const [facultyList, setFacultyList] = useState([]);
  const [faculty, setFaculty] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [fileBase64, setFileBase64] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Reactive dark mode — works with OS night-light toggle too
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const textColor = isDark ? "#f1f5f9" : "#1e293b";
  const mutedColor = isDark ? "#94a3b8" : "#64748b";
  const inputBg = isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.85)";
  const inputBorder = isDark ? "rgba(255,255,255,0.18)" : "rgba(102,126,234,0.3)";

  useEffect(() => {
    setLoading(true);
    API.get("/api/admin/faculty").then((res) => {
        const list = res?.data || [];
        setFacultyList(list);
        if (list.length > 0) {
          setFaculty(list[0]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch faculty:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // file handler
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setFileBase64(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setFileBase64(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields first
    if (!faculty?.email || !faculty?.name) {
      alert("Please select a faculty member.");
      return;
    }

    const trimmedReason = reason.trim();
    if (!fromDate || !toDate || !trimmedReason) {
      alert("Please fill in all required fields (Faculty, From Date, To Date, Reason).");
      return;
    }

    // Date order check
    if (new Date(fromDate) > new Date(toDate)) {
      alert("From Date cannot be after To Date.");
      return;
    }

    setSubmitting(true);

    try {
      await API.post("/api/leave", {
        studentName,
        studentEmail: studentEmail.toLowerCase().trim(),
        facultyName: faculty.name,
        facultyEmail: faculty.email.toLowerCase().trim(),
        fromDate,
        toDate,
        reason: trimmedReason,
        document: fileBase64 || null,
      });

      alert("Leave request submitted successfully!");
      navigate("/student/leave-list");
    } catch (err) {
      alert(
        err?.response?.data?.message ||
        "Failed to submit leave request. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    background: inputBg,
    backdropFilter: "blur(12px)",
    border: `1px solid ${inputBorder}`,
    borderRadius: "12px",
    padding: "12px 16px",
    color: textColor,
    width: "100%",
    outline: "none",
    marginTop: 4,
    fontSize: "14px",
  };

  const labelStyle = {
    fontSize: "13px",
    fontWeight: 600,
    color: mutedColor,
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "4px",
  };

  return (
    <MainLayout>
      <motion.div
        className="max-w-lg mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="shimmer-border rounded-2xl mb-6"
          style={{
            background: "linear-gradient(135deg, rgba(102,126,234,0.15), rgba(118,75,162,0.12))",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.2)",
            padding: "24px 28px",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="text-4xl">📝</div>
            <div>
              <h1 className="text-xl font-bold gradient-text">New Leave Request</h1>
              <p style={{ color: mutedColor, fontSize: 14 }}>Fill in the details below to submit your leave</p>
            </div>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8"
          style={{
            background: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.78)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Faculty */}
            <div>
              <label style={labelStyle}>
                <FiUser size={14} /> Select Faculty
              </label>
              {loading ? (
                <p style={{ color: mutedColor, fontSize: 14, marginTop: 8 }}>Loading faculty...</p>
              ) : (
                <select
                  value={faculty?.email || ""}
                  onChange={(e) => {
                    const selected = facultyList.find(
                      (f) => f.email === e.target.value
                    );
                    setFaculty(selected);
                  }}
                  style={inputStyle}
                  required
                >
                    {facultyList.length === 0 ? (
                      <option value="">No faculty registered</option>
                    ) : (
                      facultyList.map((f, i) => (
                        <option
                          key={i}
                          value={f.email}
                          style={{ background: isDark ? "#1e293b" : "#fff", color: isDark ? "#f1f5f9" : "#1e293b" }}
                        >
                          {f.name}
                        </option>
                      ))
                    )}
                  </select>
                )}
                {faculty && (
                  <div style={{ fontSize: 12, color: mutedColor, marginTop: 4 }}>
                    📧 {faculty.email}
                  </div>
                )}
                {facultyList.length === 0 && !loading && (
                   <p style={{ color: "#f5576c", fontSize: 12, marginTop: 4 }}>
                     ⚠️ No real faculty accounts found in the system.
                   </p>
                )}
              </div>

            {/* From Date */}
            <div>
              <label style={labelStyle}>
                <FiCalendar size={14} /> From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            {/* To Date */}
            <div>
              <label style={labelStyle}>
                <FiCalendar size={14} /> To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            {/* Reason */}
            <div>
              <label style={labelStyle}>
                <FiFileText size={14} /> Reason
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
                placeholder="Describe the reason for your leave..."
                required
              />
            </div>

            {/* Document – OPTIONAL */}
            <div>
              <label style={labelStyle}>
                📎 Supporting Document{" "}
                <span style={{ fontWeight: 400, fontSize: 11, opacity: 0.7 }}>(optional)</span>
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                style={{ ...inputStyle, padding: "8px 12px", cursor: "pointer" }}
              />
              <p style={{ fontSize: 11, color: mutedColor, marginTop: 4 }}>
                📌 You may attach a PDF or image as proof. This is not mandatory.
              </p>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-glow-blue w-full flex items-center justify-center gap-2"
              style={{ padding: "14px", fontSize: "15px", opacity: submitting ? 0.7 : 1 }}
            >
              <FiSend size={16} />
              {submitting ? "Submitting..." : "Submit Leave Request"}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
};

export default NewLeave;