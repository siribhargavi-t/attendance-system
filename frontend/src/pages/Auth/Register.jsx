import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock } from "react-icons/fi";

const ROLES = [
  { label: "Admin", emoji: "🛡️" },
  { label: "Student", emoji: "🎓" },
  { label: "Faculty", emoji: "👨‍🏫" },
];

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
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

  // Role select handler
  const handleRole = (role) => {
    setForm((prev) => ({ ...prev, role }));
    setError("");
    setSuccess("");
  };

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!form.name || !form.email || !form.password || !form.confirm) {
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
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8 flex items-center justify-center gap-2">
          <FiUser /> Create Account
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label className="block text-gray-600 mb-1 font-medium">Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 text-lg" />
              <input
                type="text"
                name="name"
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition"
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
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 text-lg" />
              <input
                type="email"
                name="email"
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition"
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
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 text-lg" />
              <input
                type="password"
                name="password"
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-600 mb-1 font-medium">Confirm Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 text-lg" />
              <input
                type="password"
                name="confirm"
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition"
                placeholder="Re-enter your password"
                value={form.confirm}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-600 mb-1 font-medium">Role</label>
            <div className="flex gap-3">
              {ROLES.map((role) => (
                <button
                  type="button"
                  key={role.label}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition font-semibold hover:scale-105 transition-transform duration-200
                    ${
                      form.role === role.label
                        ? "bg-blue-600 text-white shadow"
                        : "bg-white text-blue-700 border-gray-300 hover:bg-blue-50"
                    }`}
                  onClick={() => handleRole(role.label)}
                >
                  <span>{role.emoji}</span>
                  {role.label}
                </button>
              ))}
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
            className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 hover:scale-105 transition-transform duration-200 focus:ring-2 focus:ring-blue-400 text-lg"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        <div className="mt-6 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <button
            className="text-blue-600 hover:underline transition text-sm"
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