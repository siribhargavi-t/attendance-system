import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";

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
    const r = role.toLowerCase();

    if (email === "admin@gmail.com" && password === "1234" && r === "admin") {
      localStorage.setItem("role", "admin");
      navigate("/admin/dashboard");
      window.location.reload();
    } else if (email === "student@gmail.com" && password === "1234" && r === "student") {
      localStorage.setItem("role", "student");
      navigate("/student/dashboard");
      window.location.reload();
    } else if (email === "faculty@gmail.com" && password === "1234" && r === "faculty") {
      localStorage.setItem("role", "faculty");
      navigate("/faculty/dashboard");
      window.location.reload();
    } else {
      setError("Invalid email, password, or role. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="w-full max-w-md bg-white shadow-xl rounded-3xl p-8 space-y-6">

        <h1 className="text-3xl font-bold text-center text-blue-600">
          Attendance Login
        </h1>

        {/* Email */}
        <div className="relative">
          <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 text-lg" />
          <input
            type="email"
            placeholder="Email"
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="relative">
          <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 text-lg" />
          <input
            type="password"
            placeholder="Password"
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Forgot Password Link */}
        <div className="text-right">
          <button
            className="text-blue-600 hover:underline text-sm transition"
            type="button"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </button>
        </div>

        {/* Role */}
        <div className="flex gap-2">
          {ROLE_OPTIONS.map((r) => (
            <button
              key={r.key}
              onClick={() => setRole(r.key)}
              className={`flex-1 p-2 rounded-xl transition-transform duration-200 ${
                role === r.key
                  ? "bg-blue-600 text-white scale-105 shadow"
                  : "bg-gray-200 hover:scale-105"
              }`}
              type="button"
            >
              {r.emoji} {r.label}
            </button>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-3 rounded-xl hover:scale-105 transition-transform duration-200 focus:ring-2 focus:ring-blue-400"
        >
          Login
        </button>

        {/* Register Link */}
        <div className="text-center">
          <button
            className="text-blue-600 hover:underline text-sm transition"
            type="button"
            onClick={() => navigate("/register")}
          >
            Don't have an account? Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;