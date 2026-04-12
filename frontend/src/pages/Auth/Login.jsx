import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // Dummy credentials
    const creds = {
      admin: { email: "admin@gmail.com", password: "1234" },
      student: { email: "student@gmail.com", password: "1234" },
      faculty: { email: "faculty@gmail.com", password: "1234" },
    };
    if (
      email === creds[role].email &&
      password === creds[role].password
    ) {
      // Optionally store user in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({ email, role })
      );
      setError("");
      navigate("/dashboard");
    } else {
      setError("Invalid email, password, or role. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 space-y-6 border border-gray-200">
        {/* 🔥 TITLE */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-blue-600 flex items-center justify-center gap-2">
            👤 Login
          </h1>
          <p className="text-sm text-gray-500">
            Welcome back! Please login to continue
          </p>
        </div>

        {/* 🔥 EMAIL */}
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
            />
          </div>
        </div>

        {/* 🔥 PASSWORD */}
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
            />
          </div>
        </div>

        {/* 🔥 ROLE */}
        <div className="space-y-2">
          <label className="text-sm text-gray-600">Role</label>
          <div className="flex gap-2">
            {["admin", "student", "faculty"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition ${
                  role === r
                    ? "bg-blue-600 text-white shadow"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* 🔥 ERROR MESSAGE */}
        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        {/* 🔥 LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-md"
        >
          Login
        </button>

        {/* 🔥 DEMO */}
        <div className="text-xs text-gray-500 text-center space-y-1">
          <p className="font-semibold text-gray-600">Demo credentials:</p>
          <p>Admin: admin@gmail.com / 1234</p>
          <p>Student: student@gmail.com / 1234</p>
          <p>Faculty: faculty@gmail.com / 1234</p>
        </div>
      </div>
    </div>
  );
};

export default Login;