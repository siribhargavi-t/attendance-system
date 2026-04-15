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
    const selectedRole = role.toLowerCase();

    let valid = false;
    let name = "";

    if (email === "admin@gmail.com" && password === "1234" && selectedRole === "admin") {
      valid = true;
      name = "Admin User";
    } 
    else if (email === "student@gmail.com" && password === "1234" && selectedRole === "student") {
      valid = true;
      name = "Student User";
    } 
    else if (email === "faculty@gmail.com" && password === "1234" && selectedRole === "faculty") {
      valid = true;
      name = "Faculty User";
    }

    if (valid) {
      // Store only userData (no other keys)
      localStorage.setItem(
        "userData",
        JSON.stringify({
          role: selectedRole,
          email: email,
          name: name,
        })
      );
      // Remove any conflicting keys
      localStorage.removeItem("role");

      // Navigate to correct dashboard
      navigate(`/${selectedRole}/dashboard`, { replace: true });
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
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
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
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <button
            className="text-blue-600 hover:underline text-sm"
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
              className={`flex-1 p-2 rounded-xl ${
                role === r.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {r.emoji} {r.label}
            </button>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-3 rounded-xl"
        >
          Login
        </button>

        {/* Register */}
        <div className="text-center">
          <button
            className="text-blue-600 hover:underline text-sm"
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