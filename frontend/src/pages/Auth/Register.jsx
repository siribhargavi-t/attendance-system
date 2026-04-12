import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiChevronDown } from "react-icons/fi";

const ROLES = ["Admin", "Student", "Faculty"];

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Input change handler
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
    setSuccess("");
  };

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    // Simulate registration (frontend only)
    setTimeout(() => {
      setLoading(false);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    }, 900);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-green-100">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6 flex items-center justify-center gap-2">
          <FiUser /> Register
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label className="block text-gray-600 mb-1 font-medium">Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-blue-400" />
              <input
                type="text"
                name="name"
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 outline-none transition"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-600 mb-1 font-medium">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-blue-400" />
              <input
                type="email"
                name="email"
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 outline-none transition"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-600 mb-1 font-medium">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-blue-400" />
              <input
                type="password"
                name="password"
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 outline-none transition"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-600 mb-1 font-medium">Role</label>
            <div className="relative">
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 outline-none transition appearance-none"
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute left-3 top-3 text-blue-400 pointer-events-none" />
            </div>
          </div>
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-center text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-center text-sm">
              {success}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition text-lg"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <div className="mt-6 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => navigate("/login")}
            type="button"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;