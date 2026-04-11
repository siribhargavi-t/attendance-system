import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Auth.css";

const Login = () => {
  const { role } = useParams();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const roleConfig = {
    admin: {
      title: "Admin Login",
      color: "#4f46e5",
      icon: "🛠"
    },
    student: {
      title: "Student Login",
      color: "#16a34a",
      icon: "🎓"
    },
    faculty: {
      title: "Faculty Login",
      color: "#f59e0b",
      icon: "👨‍🏫"
    }
  };

  const current = roleConfig[role];

  if (!role || !current) {
    return <h2 style={{ textAlign: "center", marginTop: "100px" }}>Invalid Role</h2>;
  }

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err || "Login failed. Please check your credentials.");
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #e0e7ff, #f0fdf4)"
    }}>
      <div className="auth-card" style={{
        width: "350px",
        padding: "30px",
        borderRadius: "16px",
        background: "#fff",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
      }}>

        {/* TOP SECTION */}
        <div style={{ textAlign: "center", marginBottom: "25px" }}>

          {/* ICON */}
          <div style={{
            width: "60px",
            height: "60px",
            margin: "0 auto 10px",
            borderRadius: "50%",
            background: `${current.color}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "26px"
          }}>
            {current.icon}
          </div>

          {/* TITLE */}
          <h1 style={{
            fontSize: "22px",
            fontWeight: "600",
            marginBottom: "5px"
          }}>
            {current.title}
          </h1>

          {/* SUBTEXT */}
          <p style={{
            fontSize: "13px",
            color: "#777",
            marginBottom: "10px"
          }}>
            Sign in to continue
          </p>

          {/* ROLE BADGE */}
          <span style={{
            display: "inline-block",
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "11px",
            fontWeight: "600",
            background: current.color,
            color: "#fff"
          }}>
            {role.toUpperCase()}
          </span>

        </div>

        {error && <p className="auth-error">{error}</p>}

        {/* FORM */}
        <form onSubmit={onSubmit}>
          <div className="auth-form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
          </div>

          <div className="auth-form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-button"
            style={{
              background: current.color,
              border: "none"
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-link">
          <Link to={`/forgot-password/${role}`}>Forgot Password?</Link>        </div>

        <div className="auth-link">
          <p>
            Don't have an account? <Link to={`/register/${role}`}>Register</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;