import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff, FiBookOpen, FiArrowRight } from "react-icons/fi";
import axios from "axios";

const ROLES = [
  { label: "Admin", emoji: "🛡️" },
  { label: "Student", emoji: "🎓" },
  { label: "Faculty", emoji: "👨‍🏫" },
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("student");
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  // Detect system dark / OS night-light
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mq.matches);
    const handler = (e) => setIsDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Role is auto-detected from DB — no need to send role from client
      const res = await axios.post("/api/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      localStorage.setItem("userData", JSON.stringify(res.data));

      const role = res.data.role;
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "student") navigate("/student/dashboard");
      else navigate("/faculty/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Colour tokens for light vs dark (night-light aware)
  const bg = isDark
    ? "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)"
    : "linear-gradient(135deg, #e0f0ff 0%, #eae4ff 50%, #ffe4f0 100%)";

  const cardBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.82)";
  const cardBorder = isDark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.9)";
  const textColor = isDark ? "#f1f5f9" : "#1e293b";
  const mutedColor = isDark ? "#94a3b8" : "#64748b";
  const inputBg = isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.95)";
  const inputBorder = isDark ? "rgba(255,255,255,0.18)" : "rgba(102,126,234,0.35)";
  const inputFocusBorder = "#667eea";
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
    boxSizing: "border-box",
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
        transition: "background 0.5s ease",
        padding: "24px 16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating orbs */}
      <div style={{
        position: "fixed", borderRadius: "50%", filter: "blur(80px)",
        opacity: isDark ? 0.25 : 0.2, pointerEvents: "none",
        width: 350, height: 350, background: "#7c3aed", top: "5%", left: "10%",
        animation: "orbFloat 8s ease-in-out infinite",
      }} />
      <div style={{
        position: "fixed", borderRadius: "50%", filter: "blur(80px)",
        opacity: isDark ? 0.2 : 0.15, pointerEvents: "none",
        width: 250, height: 250, background: "#06b6d4", top: "60%", right: "10%",
        animation: "orbFloat 8s ease-in-out infinite", animationDelay: "-3s",
      }} />
      <div style={{
        position: "fixed", borderRadius: "50%", filter: "blur(80px)",
        opacity: isDark ? 0.18 : 0.12, pointerEvents: "none",
        width: 200, height: 200, background: "#f59e0b", bottom: "10%", left: "40%",
        animation: "orbFloat 8s ease-in-out infinite", animationDelay: "-6s",
      }} />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        style={{
          width: "100%",
          maxWidth: 420,
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
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          {/* Icon circle */}
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 14px",
            boxShadow: "0 8px 24px rgba(102,126,234,0.45)",
          }}>
            <FiBookOpen size={28} color="#fff" />
          </div>
          <h1 style={{
            fontSize: 26, fontWeight: 800, margin: 0,
            background: "linear-gradient(135deg, #667eea, #f093fb)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            AttendPro
          </h1>
          <p style={{ color: mutedColor, fontSize: 14, marginTop: 4 }}>
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

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
                  onClick={() => setRole(r.label.toLowerCase())}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    padding: "10px",
                    borderRadius: 12,
                    border: role === r.label.toLowerCase() ? "2px solid #667eea" : "1px solid #ccc",
                    background: role === r.label.toLowerCase() ? "#667eea" : "transparent",
                    color: role === r.label.toLowerCase() ? "#fff" : textColor,
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

          {/* Email */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: labelColor, display: "block", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <FiMail
                size={16}
                style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#667eea" }}
              />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                onFocus={(e) => { e.target.style.borderColor = inputFocusBorder; e.target.style.boxShadow = "0 0 0 3px rgba(102,126,234,0.2)"; }}
                onBlur={(e) => { e.target.style.borderColor = inputBorder; e.target.style.boxShadow = "none"; }}
                style={inputStyle}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: labelColor, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Password
              </label>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                style={{ background: "none", border: "none", color: "#667eea", fontSize: 12, cursor: "pointer", padding: 0 }}
              >
                Forgot password?
              </button>
            </div>
            <div style={{ position: "relative" }}>
              <FiLock
                size={16}
                style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#667eea" }}
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                onFocus={(e) => { e.target.style.borderColor = inputFocusBorder; e.target.style.boxShadow = "0 0 0 3px rgba(102,126,234,0.2)"; }}
                onBlur={(e) => { e.target.style.borderColor = inputBorder; e.target.style.boxShadow = "none"; }}
                style={{ ...inputStyle, paddingRight: 42 }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: mutedColor, padding: 0,
                }}
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>



          {/* Error */}
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

          {/* Submit */}
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
                  width: 16, height: 16, borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.4)",
                  borderTopColor: "#fff",
                  animation: "spin 0.7s linear infinite",
                }} />
                Signing in...
              </>
            ) : (
              <>Sign In <FiArrowRight size={16} /></>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 22 }}>
          <span style={{ color: mutedColor, fontSize: 13 }}>Don't have an account? </span>
          <button
            type="button"
            onClick={() => navigate("/register")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#667eea", fontSize: 13, fontWeight: 600,
              textDecoration: "underline",
            }}
          >
            Register
          </button>
        </div>
      </motion.div>

      {/* CSS animations injected inline */}
      <style>{`
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;
