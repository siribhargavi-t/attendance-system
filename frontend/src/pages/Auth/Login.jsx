import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import "./Auth.css";

const Login = () => {
  const { role } = useParams();
  const navigate = useNavigate();
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
console.log({ email, password });
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log({ email, password });

    try {
      const res = await axios.post("/api/auth/login", {
        email: formData.email,
        password: formData.password
      });
      // Store token and user in context and localStorage
      await login(email, password); // <-- FIXED

      // Redirect based on user role
      const userRole = res.data.user.role;
      if (userRole === "admin") navigate("/admin/dashboard");
      else if (userRole === "student") navigate("/student/dashboard");
      else if (userRole === "faculty") navigate("/faculty/dashboard");
      else navigate("/");
    } catch (err) {
      console.error("Login error:", err); // Add this line for debugging
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please check your credentials or try again later."
      );
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

        <div style={{ textAlign: "center", marginBottom: "25px" }}>
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
          <h1 style={{
            fontSize: "22px",
            fontWeight: "600",
            marginBottom: "5px"
          }}>
            {current.title}
          </h1>
          <p style={{
            fontSize: "13px",
            color: "#777",
            marginBottom: "10px"
          }}>
            Sign in to continue
          </p>
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
          <Link to={`/forgot-password/${role}`}>Forgot Password?</Link>
        </div>

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
