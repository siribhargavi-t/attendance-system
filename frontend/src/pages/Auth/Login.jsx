import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ merged import
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff, FiBookOpen, FiArrowRight } from "react-icons/fi";
import axios from "axios";
import { useTheme } from "../../context/ThemeContext";

const ROLES = [
  { label: "Admin", emoji: "🛡️" },
  { label: "Student", emoji: "🎓" },
  { label: "Faculty", emoji: "👨‍🏫" },
];

const Login = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isDark = darkMode;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "https://attendance-system-cb8z.onrender.com/api/auth/login",
        {
          email,
          password,
          role: role.toLowerCase(),
        }
      );

      const backendRole = res.data.role?.toLowerCase();
      const selectedRole = role.toLowerCase();

      if (backendRole !== selectedRole) {
        setError(
          `Wrong role selected. This account is "${res.data.role}". Please select the correct role.`
        );
        setLoading(false);
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userData", JSON.stringify(res.data));

      if (backendRole === "admin") navigate("/admin/dashboard");
      else if (backendRole === "faculty") navigate("/faculty/dashboard");
      else if (backendRole === "student") navigate("/student/dashboard");
      else setError("Unknown role.");

    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const bg = isDark
    ? "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)"
    : "linear-gradient(135deg, #e0f0ff 0%, #eae4ff 50%, #ffe4f0 100%)";

  const cardBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.82)";
  const cardBorder = isDark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.9)";
  const textColor = isDark ? "#f1f5f9" : "#1e293b";
  const mutedColor = isDark ? "#94a3b8" : "#64748b";
  const inputBg = isDark ? "rgba(255,255,255,0.07)" : "rgba(102,126,234,0.03)";
  const inputBorder = isDark ? "rgba(255,255,255,0.18)" : "rgba(102,126,234,0.2)";

  const inputStyle = {
    width: "100%",
    padding: "14px 16px 14px 44px",
    borderRadius: 14,
    border: `1px solid ${inputBorder}`,
    background: inputBg,
    color: textColor,
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
    transition: "all 0.2s ease",
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: bg,
      padding: "24px",
    }}>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          width: "100%",
          maxWidth: 420,
          background: cardBg,
          border: `1px solid ${cardBorder}`,
          borderRadius: 28,
          padding: 40,
          backdropFilter: "blur(20px)",
          boxShadow: isDark
            ? "0 20px 50px rgba(0,0,0,0.3)"
            : "0 20px 50px rgba(102,126,234,0.15)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <FiBookOpen size={28} color="#fff" />
          <h1 style={{ color: textColor }}>AttendPro</h1>
          <p style={{ color: mutedColor }}>Sign in to your account</p>

          {/* ✅ ONLY CHANGE HERE */}
          <p style={{ color: mutedColor }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#667eea" }}>
              Register here
            </Link>
          </p>
        </div>

        <form onSubmit={handleLogin}>
          {/* your full original form unchanged */}
        </form>
      </motion.div>
    </div>
  );
};

export default Login;