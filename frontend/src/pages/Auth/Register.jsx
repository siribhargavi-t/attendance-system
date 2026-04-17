import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiBookOpen, FiArrowRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const ROLES = [
  { label: "Admin", emoji: "🛡️" },
  { label: "Student", emoji: "🎓" },
  { label: "Faculty", emoji: "👨‍🏫" },
];

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    role: "student",
    rollNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains("dark"));

  // Night‑light / OS dark mode detection (reactive)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mq.matches);
    const handler = (e) => setIsDark(e.matches);
    mq.addEventListener("change", handler);
    // Also watch class changes (in case app toggles a "dark" class)
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      mq.removeEventListener("change", handler);
      observer.disconnect();
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleRole = (role) => {
    setForm({ ...form, role });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // ---- Front‑end validation ----
    if (!form.name || !form.email || !form.password || !form.confirm || (form.role === 'student' && !form.rollNumber)) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    // role is always one of the three options, but normalise to lower case for the API
    const role = form.role.toLowerCase();

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/register", {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
        rollNumber: form.role === 'student' ? form.rollNumber.trim() : ""
      });
      setSuccess(res.data.message || "Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---- Design tokens ----
  const bg = isDark
    ? "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)"
    : "linear-gradient(135deg, #e0f0ff 0%, #eae4ff 50%, #ffe4f0 100%)";
  const cardBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.82)";
  const cardBorder = isDark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.9)";
  const textColor = isDark ? "#f1f5f9" : "#1e293b";
  const mutedColor = isDark ? "#94a3b8" : "#64748b";
  const inputBg = isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.95)";
  const inputBorder = isDark ? "rgba(255,255,255,0.18)" : "rgba(102,126,234,0.35)";
  const inputFocus = "#667eea";
  const labelColor = isDark ? "#94a3b8" : "#64748b";

  const inputStyle = {
    width: "100%",
    padding: "12px 16px 12px 42px",
    borderRadius: 12,
    border: `1px solid ${inputBorder}`,
    background: inputBg,
    color: textColor,
    fontSize: 14,
    outline: "none",
    backdropFilter: "blur(12px)",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: bg,
        padding: "24px 16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating orbs – purely decorative */}
      <div style={{
        position: "fixed",
        borderRadius: "50%",
        filter: "blur(80px)",
        opacity: isDark ? 0.25 : 0.2,
        pointerEvents: "none",
        width: 300,
        height: 300,
        background: "#7c3aed",
        top: "8%",
        left: "12%",
        animation: "orbFloat 8s ease-in-out infinite",
      }} />
      <div style={{
        position: "fixed",
        borderRadius: "50%",
        filter: "blur(80px)",
        opacity: isDark ? 0.2 : 0.15,
        pointerEvents: "none",
        width: 250,
        height: 250,
        background: "#06b6d4",
        top: "60%",
        right: "10%",
        animation: "orbFloat 8s ease-in-out infinite",
        animationDelay: "-3s",
      }} />
      <div style={{
        position: "fixed",
        borderRadius: "50%",
        filter: "blur(80px)",
        opacity: isDark ? 0.18 : 0.12,
        pointerEvents: "none",
        width: 200,
        height: 200,
        background: "#f59e0b",
        bottom: "12%",
        left: "40%",
        animation: "orbFloat 8s ease-in-out infinite",
        animationDelay: "-6s",
      }} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        style={{
          width: "100%",
          maxWidth: 460,
          background: cardBg,
          border: `1px solid ${cardBorder}`,
          borderRadius: 24,
          padding: "36px 36px 32px",
          backdropFilter: "blur(24px)",
          boxShadow: isDark
            ? "0 24px 80px rgba(0,0,0,0.5)"
            : "0 24px 80px rgba(102,126,234,0.18)",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 14px",
            boxShadow: "0 8px 24px rgba(102,126,234,0.45)",
          }}>
            <FiBookOpen size={28} color="#fff" />
          </div>
          <h1 style={{
            fontSize: 26,
            fontWeight: 800,
            margin: 0,
            background: "linear-gradient(135deg, #667eea, #f093fb)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            AttendPro
          </h1>
          <p style={{ color: mutedColor, fontSize: 14, marginTop: 4 }}>
            Create your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Name */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: labelColor, display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Name
            </label>
            <div style={{ position: "relative" }}>
              <FiUser
                size={16}
                style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#667eea" }}
              />
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                style={inputStyle}
                autoComplete="name"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: labelColor, display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Email
            </label>
            <div style={{ position: "relative" }}>
              <FiMail
                size={16}
                style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#667eea" }}
              />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                style={inputStyle}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: labelColor, display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <FiLock
                size={16}
                style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#667eea" }}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                style={{ ...inputStyle, paddingRight: 42 }}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: mutedColor,
                }}
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: labelColor, display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Confirm Password
            </label>
            <div style={{ position: "relative" }}>
              <FiLock
                size={16}
                style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#667eea" }}
              />
              <input
                type={showConfirm ? "text" : "password"}
                name="confirm"
                placeholder="Re‑enter password"
                value={form.confirm}
                onChange={handleChange}
                style={{ ...inputStyle, paddingRight: 42 }}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: mutedColor,
                }}
              >
                {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          {/* Role selection */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: labelColor, display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Role
            </label>
            <div className="flex gap-3">
              {ROLES.map((r) => (
                <button
                  key={r.label}
                  type="button"
                  onClick={() => handleRole(r.label.toLowerCase())}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    padding: "10px",
                    borderRadius: 12,
                    border: form.role === r.label.toLowerCase() ? "2px solid #667eea" : "1px solid #ccc",
                    background: form.role === r.label.toLowerCase() ? "#667eea" : "transparent",
                    color: form.role === r.label.toLowerCase() ? "#fff" : textColor,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <span>{r.emoji}</span> {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Roll Number (Conditional) */}
          <AnimatePresence>
            {form.role === "student" && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 0 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                style={{ overflow: "hidden" }}
              >
                <div style={{ paddingTop: 18 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: labelColor, display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    Roll Number
                  </label>
                  <div style={{ position: "relative" }}>
                    <FiArrowRight
                      size={16}
                      style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#667eea" }}
                    />
                    <input
                      type="text"
                      name="rollNumber"
                      placeholder="e.g. 21CS101"
                      value={form.rollNumber}
                      onChange={handleChange}
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                style={{
                  background: isDark ? "rgba(245,87,108,0.15)" : "rgba(245,87,108,0.1)",
                  border: "1px solid rgba(245,87,108,0.4)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  color: isDark ? "#fca5a5" : "#b91c1c",
                  fontSize: 13,
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                ⚠️ {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success banner */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                style={{
                  background: isDark ? "rgba(74,222,128,0.15)" : "rgba(74,222,128,0.1)",
                  border: "1px solid rgba(74,222,128,0.4)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  color: isDark ? "#6ee7b7" : "#15803d",
                  fontSize: 13,
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                ✅ {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.97 }}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 14,
              border: "none",
              background: loading
                ? "rgba(102,126,234,0.6)"
                : "linear-gradient(135deg, #667eea, #764ba2)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 6px 24px rgba(102,126,234,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "all 0.2s ease",
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.4)",
                  borderTopColor: "#fff",
                  animation: "spin 0.7s linear infinite",
                }} />
                Creating…
              </>
            ) : (
              <>Create Account <FiArrowRight size={16} /></>
            )}
          </motion.button>
        </form>

        {/* Footer link */}
        <div style={{ textAlign: "center", marginTop: 22, color: mutedColor, fontSize: 13 }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={{
              background: "none",
              border: "none",
              color: "#667eea",
              cursor: "pointer",
              fontWeight: 600,
              textDecoration: "underline",
            }}
          >
            Login
          </button>
        </div>
      </motion.div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Register;
