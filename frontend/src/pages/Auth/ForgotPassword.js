import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail } from "react-icons/fi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSent(true);
      setLoading(false);
    }, 900);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8 flex items-center justify-center gap-2">
          <FiMail /> Forgot Password
        </h2>
        {sent ? (
          <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg text-center mb-6">
            Reset link sent to your email (dummy)
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
            <div>
              <label className="block text-gray-600 mb-1 font-medium">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-blue-400" />
                <input
                  type="email"
                  name="email"
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition text-lg"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <button
            className="text-blue-600 hover:underline"
            onClick={() => navigate("/login")}
            type="button"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;