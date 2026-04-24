import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../../services/api";import "./Auth.css";

const ResetPassword = () => {
  const { token, role } = useParams();
  const navigate = useNavigate();

  const roleConfig = {
    admin: {
      title: "Admin Reset Password",
      color: "#4f46e5",
    },
    student: {
      title: "Student Reset Password",
      color: "#16a34a",
    },
    faculty: {
      title: "Faculty Reset Password",
      color: "#f59e0b",
    },
  };

  const current = roleConfig[role];

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!role || !current) {
    return <h2 style={{ textAlign: "center" }}>Invalid Role</h2>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      setMessage(res.data.message || "Password updated successfully");

      setTimeout(() => {
        navigate(`/login/${role}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        {/* 🔥 HEADER */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: "bold",
              color: current.color,
            }}
          >
            {current.title}
          </h1>

          <div style={{ marginTop: "10px" }}>
            <span
              style={{
                background: current.color,
                color: "#fff",
                padding: "5px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              {role.toUpperCase()}
            </span>

            <p
              style={{
                marginTop: "8px",
                fontSize: "13px",
                color: "#666",
              }}
            >
              Enter your new password
            </p>
          </div>
        </div>

        {/* 🔥 MESSAGES */}
        {error && <p className="auth-error">{error}</p>}
        {message && (
          <p style={{ color: "green", textAlign: "center" }}>{message}</p>
        )}

        {/* 🔥 FORM */}
        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label>New Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !!message}
            className="auth-button"
            style={{ background: current.color }}
          >
            {loading ? "Saving..." : "Save New Password"}
          </button>
        </form>

        {/* 🔥 BACK */}
        <div className="auth-link">
          <Link to={`/login/${role}`}>← Back to Login</Link>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;