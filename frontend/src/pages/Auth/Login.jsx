import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff, FiBookOpen } from "react-icons/fi";
import * as THREE from "three";
import CLOUDS from "vanta/dist/vanta.clouds.min";
import axios from "axios";

const ROLE_OPTIONS = [
  { key: "admin", label: "Admin", emoji: "🧑‍💼" },
  { key: "student", label: "Student", emoji: "🎓" },
  { key: "faculty", label: "Faculty", emoji: "👨‍🏫" },
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const vantaRef = useRef(null);

  useEffect(() => {
    const vantaEffect = CLOUDS({
      el: vantaRef.current,
      THREE: THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      skyColor: 0x68b8d7,
      cloudColor: 0xadc1de,
      cloudShadowColor: 0x183550,
      sunColor: 0xff9919,
      sunGlareColor: 0xff6633,
      sunlightColor: 0xff9933,
      speed: 1.0
    });
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  const handleLogin = async () => {
    try {
      setError("");

      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
        role, // ✅ send role
      });

      localStorage.setItem("userData", JSON.stringify(res.data));

      if (res.data.role === "admin") {
        navigate("/admin/dashboard");
      } else if (res.data.role === "student") {
        navigate("/student/dashboard");
      } else {
        navigate("/faculty/dashboard");
      }
    } catch (err) {
      console.error(err.response?.data || err.message); // ✅ debug
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div ref={vantaRef} className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl p-8 space-y-6 z-10 border border-white/20">

        <h1 className="text-3xl font-bold flex items-center justify-center gap-2 text-blue-700">
          <FiBookOpen /> AttendPro
        </h1>
        <p className="text-center text-gray-500 font-medium">Please login to your account</p>

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
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
          </button>
        </div>

        {/* Role */}
        <div className="flex gap-2">
          {ROLE_OPTIONS.map((r) => (
            <button
              key={r.key}
              onClick={() => setRole(r.key)}
              className={`flex-1 p-2 rounded-xl ${role === r.key ? "bg-blue-600 text-white" : "bg-gray-200"
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