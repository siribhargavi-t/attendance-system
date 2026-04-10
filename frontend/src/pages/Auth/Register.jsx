import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../../api/axios";
import "./Auth.css";

const Register = () => {
  const { role } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const roleConfig = {
    admin: {
      title: "Admin Registration",
      color: "#4f46e5",
      icon: "🛠"
    },
    student: {
      title: "Student Registration",
      color: "#16a34a",
      icon: "🎓"
    },
    faculty: {
      title: "Faculty Registration",
      color: "#f59e0b",
      icon: "👨‍🏫"
    }
  };

  const current = roleConfig[role];

  if (!role || !current) {
    return <h2 style={{ textAlign: "center", marginTop: "100px" }}>Invalid Access</h2>;
  }

  const { email, password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      return setError("Please enter a valid email.");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    setLoading(true);
    try {
      await axios.post("/auth/register", {
        email,
        password,
        role
      });

      navigate(`/login/${role}`);
    } catch (err) {
      console.log(err.response?.data);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
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
            Create your account
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

          <div className="auth-form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
            style={{
              background: current.color,
              border: "none"
            }}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="auth-link">
          <p>
            Already have an account?{" "}
            <Link to={`/login/${role}`}>Login</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;