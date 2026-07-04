import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff, FiBookOpen, FiArrowRight } from "react-icons/fi";
import API from "../../services/api";
import { useTheme } from "../../context/ThemeContext";
import { UserContext } from "../../context/UserContext";

const ROLES = [
  { label: "Admin", emoji: "🛡️" },
  { label: "Student", emoji: "🎓" },
  { label: "Faculty", emoji: "👨‍🏫" },
];

const Login = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { setUser } = useContext(UserContext);

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
      const res = await API.post("/api/auth/login", {
        email,
        password,
        role: role.toLowerCase(),
      });

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
      setUser(res.data);

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
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto 16px",
              boxShadow: "0 8px 20px rgba(102,126,234,0.3)",
            }}
          >
            <FiBookOpen size={28} color="#fff" />
          </div>

          <h1 style={{
            fontSize: 28,
            fontWeight: 800,
            margin: 0,
            color: textColor,
            letterSpacing: "-0.02em"
          }}>
            AttendPro
          </h1>

          <p style={{ color: mutedColor, marginTop: 8, fontSize: 15 }}>
            Sign in to your account
          </p>

          {/* ✅ FIXED POSITION */}
          <p style={{ color: mutedColor, marginTop: 6, fontSize: 14 }}>
            Don’t have an account?{" "}
            <Link to="/register" style={{ color: "#667eea", fontWeight: 600 }}>
              Register
            </Link>
          </p>
        </div>

        {/* FORM (UNCHANGED) */}

        <form onSubmit={handleLogin}>
          {/* ROLE */}
          <div style={{ marginBottom: 20 }}>
            <label style={{
              fontSize: 12,
              fontWeight: 700,
              color: mutedColor,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              display: "block",
              marginBottom: 8
            }}>
              Role
            </label>

            <div style={{ display: "flex", gap: 10 }}>
              {ROLES.map((r) => (
                <button
                  key={r.label}
                  type="button"   // ✅ FIXED
                  onClick={() => setRole(r.label.toLowerCase())}
                  style={{
                    flex: 1,
                    padding: "10px 4px",
                    borderRadius: 12,
                    border: "none",
                    background: role === r.label.toLowerCase()
                      ? "linear-gradient(135deg, #667eea, #764ba2)"
                      : (isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9"),
                    color: role === r.label.toLowerCase() ? "white" : textColor,
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: role === r.label.toLowerCase()
                      ? "0 4px 12px rgba(102,126,234,0.3)"
                      : "none",
                  }}
                >
                  {r.emoji} {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* EMAIL */}
          <div style={{ marginBottom: 20, position: "relative" }}>
            <FiMail style={{ position: "absolute", left: 16, top: 16, color: "#667eea" }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}
              placeholder="Email address"
              style={inputStyle}
            />
          </div>

          {/* PASSWORD */}
          <div style={{ marginBottom: 12, position: "relative" }}>
            <FiLock style={{ position: "absolute", left: 16, top: 16, color: "#667eea" }} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
              placeholder="Password"
              style={{ ...inputStyle, paddingRight: 48 }}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 14,
                top: 16,
                border: "none",
                background: "none",
                color: mutedColor,
                cursor: "pointer",
              }}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div style={{
              color: "#f87171",
              marginBottom: 16,
              fontSize: 13
            }}>
              {error}
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 16,
              borderRadius: 14,
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* DEMO CREDENTIALS QUICK-FILL */}
          <div style={{
            marginTop: 24,
            paddingTop: 20,
            borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
            textAlign: "center"
          }}>
            <p style={{
              fontSize: 11,
              fontWeight: 700,
              color: mutedColor,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 12
            }}>
              Quick Demo Login
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              {[
                { label: "Admin", email: "admin@example.com", role: "admin" },
                { label: "Faculty", email: "faculty@example.com", role: "faculty" },
                { label: "Student", email: "student@example.com", role: "student" }
              ].map(demo => (
                <button
                  key={demo.label}
                  type="button"
                  onClick={() => {
                    setEmail(demo.email);
                    setPassword("password");
                    setRole(demo.role);
                  }}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 10,
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(102,126,234,0.15)"}`,
                    background: isDark ? "rgba(255,255,255,0.03)" : "rgba(102,126,234,0.05)",
                    color: textColor,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.08)" : "rgba(102,126,234,0.1)";
                    e.currentTarget.style.borderColor = "#667eea";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "rgba(102,126,234,0.05)";
                    e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(102,126,234,0.15)";
                  }}
                >
                  {demo.label}
                </button>
              ))}
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;