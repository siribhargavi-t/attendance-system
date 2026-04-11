import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import "./Auth.css";

const ForgotPassword = () => {
  const { role } = useParams();

  const roleConfig = {
    admin: {
      title: "Admin Password Reset",
      color: "#4f46e5",
    },
    student: {
      title: "Student Password Reset",
      color: "#16a34a",
    },
    faculty: {
      title: "Faculty Password Reset",
      color: "#f59e0b",
    },
  };

  const current = roleConfig[role];

  const [email, setEmail] = useState("");
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
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message || "Reset link sent to your email");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        {/* 🔥 Header */}
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
                letterSpacing: "1px",
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
              Enter your email to receive reset link
            </p>
          </div>
        </div>

        {/* 🔥 Messages */}
        {error && <p className="auth-error">{error}</p>}
        {message && (
          <p style={{ color: "green", textAlign: "center" }}>{message}</p>
        )}

        {/* 🔥 Form */}
        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-button"
            style={{
              background: current.color,
            }}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* 🔥 Back to Login */}
        <div className="auth-link">
          <Link to={`/login/${role}`}>← Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;