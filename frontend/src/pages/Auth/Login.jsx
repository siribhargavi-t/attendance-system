import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ROLE_OPTIONS = [
  { key: "admin", label: "Admin", emoji: "🧑‍💼" },
  { key: "student", label: "Student", emoji: "🎓" },
  { key: "faculty", label: "Faculty", emoji: "👨‍🏫" },
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // Normalize role to lowercase for comparison
    const normalizedRole = role.toLowerCase();
    if (
      email === "admin@gmail.com" &&
      password === "1234" &&
      normalizedRole === "admin"
    ) {
      navigate("/admin/dashboard");
    } else if (
      email === "student@gmail.com" &&
      password === "1234" &&
      normalizedRole === "student"
    ) {
      navigate("/student/dashboard");
    } else if (
      email === "faculty@gmail.com" &&
      password === "1234" &&
      normalizedRole === "faculty"
    ) {
      navigate("/faculty/dashboard");
    } else {
      setError("Invalid email, password, or role. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 space-y-8 border border-gray-200">
        {/* Header */}
        <div className="flex flex-col items-center space-y-3">
          <span className="text-5xl mb-1">📊</span>
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight text-center">
            Login
          </h1>
          <h2 className="text-lg font-semibold text-gray-700 text-center">
            Attendance Management System
          </h2>
          <p className="text-sm text-gray-500 text-center max-w-xs">
            Track, manage, and analyze attendance efficiently
          </p>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-sm text-gray-600">Email</label>
          <div className="flex items-center bg-gray-100 px-3 py-2 rounded-xl focus-within:ring-2 focus-within:ring-blue-400">
            <span className="text-gray-500">📧</span>
            <input
              type="email"
              className="bg-transparent outline-none px-2 w-full"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-sm text-gray-600">Password</label>
          <div className="flex items-center bg-gray-100 px-3 py-2 rounded-xl focus-within:ring-2 focus-within:ring-blue-400">
            <span className="text-gray-500">🔒</span>
            <input
              type="password"
              className="bg-transparent outline-none px-2 w-full"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
        </div>

        {/* Role Selection */}
        <div className="space-y-2">
          <label className="text-sm text-gray-600">Role</label>
          <div className="flex gap-2">
            {ROLE_OPTIONS.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRole(r.key)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
                  ${
                    role === r.key
                      ? "bg-blue-600 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                  }`}
                style={{ minWidth: 0 }}
              >
                <span className="text-lg">{r.emoji}</span>
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-md text-lg"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;