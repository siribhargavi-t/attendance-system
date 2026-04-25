import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  // ✅ FIXED LOGIN FUNCTION
  const handleLogin = async (e) => {
    e.preventDefault(); // 🔥 VERY IMPORTANT

    console.log("LOGIN CLICKED");

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "https://attendance-system-cb8z.onrender.com/api/auth/login",
        {
          email,
          password,
          role, // ✅ include role if backend uses it
        }
      );

      console.log("LOGIN SUCCESS:", res.data);

      // ✅ Save token if exists
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      // ✅ Navigate after login
      navigate("/dashboard");

    } catch (err) {
      console.error("LOGIN ERROR:", err);

      setError(
        err.response?.data?.message ||
        "Login failed. Please try again."
      );
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
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: bg }}>
      <motion.div style={{ width: 420, padding: 40, background: cardBg, borderRadius: 20 }}>
        
        <h2 style={{ textAlign: "center", color: textColor }}>Login</h2>

        {/* ✅ FORM FIXED */}
        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ ...inputStyle, marginTop: 10 }}
          />

          <button type="submit" disabled={loading} style={{ marginTop: 20 }}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && <p style={{ color: "red" }}>{error}</p>}

        </form>
      </motion.div>
    </div>
  );
};

export default Login;