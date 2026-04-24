import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../services/api";
import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "../../components/ThemeToggle";
import MainLayout from "../../components/Layout/MainLayout";
import { FiLock, FiCheckCircle, FiAlertCircle, FiChevronRight } from "react-icons/fi";

const Settings = () => {
  const { darkMode } = useTheme();
  
  const [preferences, setPreferences] = useState({
    emailNotifs: true,
    pushNotifs: true,
    weeklyReports: false,
    publicProfile: true,
    language: "English"
  });

  // Password Update State
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleToggle = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    // Validation
    if (!passwords.current || !passwords.new || !passwords.confirm) {
        setStatus({ type: "error", message: "Please fill all password fields" });
        return;
    }
    if (passwords.new !== passwords.confirm) {
        setStatus({ type: "error", message: "New passwords do not match" });
        return;
    }
    if (passwords.new.length < 6) {
        setStatus({ type: "error", message: "Password must be at least 6 characters" });
        return;
    }

    setLoading(true);
    try {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const token = userData.token;

        await API.put("/api/auth/update-password", {
            currentPassword: passwords.current,
            newPassword: passwords.new
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        setStatus({ type: "success", message: "Password updated successfully!" });
        setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
        setStatus({ 
            type: "error", 
            message: err.response?.data?.message || "Failed to update password" 
        });
    } finally {
        setLoading(false);
    }
  };

  const isDark = document.documentElement.classList.contains("dark");
  const textColor = isDark ? "#f1f5f9" : "#1e293b";
  const mutedColor = isDark ? "#94a3b8" : "#64748b";
  const cardBg = isDark ? "rgba(255,255,255,0.05)" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)";

  return (
    <MainLayout>
      <motion.div 
        className="max-w-4xl mx-auto px-4 py-10 space-y-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black gradient-text">System Settings</h1>
            <p style={{ color: mutedColor }} className="mt-1 font-medium">Manage your personal preferences and account security.</p>
          </div>
          <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border" style={{ borderColor: cardBorder }}>
            <span className="text-xs font-bold uppercase tracking-widest px-2" style={{ color: mutedColor }}>Theme</span>
            <ThemeToggle />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Account Security */}
          <div className="space-y-6">
            <div 
              className="p-8 rounded-3xl border transition-all duration-300"
              style={{ background: cardBg, borderColor: cardBorder, boxShadow: isDark ? "0 20px 50px rgba(0,0,0,0.3)" : "0 10px 30px rgba(0,0,0,0.04)" }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
                  <FiLock size={20} />
                </div>
                <h2 className="text-xl font-bold" style={{ color: textColor }}>Account Security</h2>
              </div>

              <form onSubmit={handlePasswordUpdate} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: mutedColor }}>Current Password</label>
                  <input 
                    type="password" 
                    value={passwords.current}
                    onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                    placeholder="••••••••" 
                    className="w-full px-5 py-3 rounded-2xl bg-black/5 dark:bg-white/5 outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-semibold"
                    style={{ color: textColor, border: `1px solid ${cardBorder}` }}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: mutedColor }}>New Password</label>
                  <input 
                    type="password" 
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    placeholder="••••••••" 
                    className="w-full px-5 py-3 rounded-2xl bg-black/5 dark:bg-white/5 outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-semibold"
                    style={{ color: textColor, border: `1px solid ${cardBorder}` }}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: mutedColor }}>Confirm New Password</label>
                  <input 
                    type="password" 
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    placeholder="••••••••" 
                    className="w-full px-5 py-3 rounded-2xl bg-black/5 dark:bg-white/5 outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-semibold"
                    style={{ color: textColor, border: `1px solid ${cardBorder}` }}
                  />
                </div>

                <AnimatePresence>
                  {status.message && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`flex items-center gap-2 p-4 rounded-2xl text-sm font-bold ${status.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}
                    >
                      {status.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
                      {status.message}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? "Updating..." : "Update Password"}
                  <FiChevronRight />
                </button>
              </form>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-6">
            <div 
              className="p-8 rounded-3xl border"
              style={{ background: cardBg, borderColor: cardBorder }}
            >
              <h2 className="text-xl font-bold mb-8" style={{ color: textColor }}>Notification Preferences</h2>
              <div className="space-y-6">
                {[
                  { id: 'emailNotifs', label: 'Email Notifications', desc: 'Receive alerts via email' },
                  { id: 'pushNotifs', label: 'Dashboard Alerts', desc: 'Real-time system notifications' },
                  { id: 'weeklyReports', label: 'Weekly Summary', desc: 'Recieve weekly attendance analysis' }
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm" style={{ color: textColor }}>{item.label}</p>
                      <p className="text-xs font-medium" style={{ color: mutedColor }}>{item.desc}</p>
                    </div>
                    <button 
                      onClick={() => handleToggle(item.id)}
                      className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${preferences[item.id] ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                    >
                      <motion.div 
                        layout
                        className="w-4 h-4 bg-white rounded-full shadow-sm"
                        animate={{ x: preferences[item.id] ? 24 : 0 }}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div 
              className="p-8 rounded-3xl border"
              style={{ background: cardBg, borderColor: cardBorder }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm" style={{ color: textColor }}>Public Profile</p>
                  <p className="text-xs font-medium" style={{ color: mutedColor }}>Allow others to see your information</p>
                </div>
                <button 
                  onClick={() => handleToggle('publicProfile')}
                  className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${preferences.publicProfile ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                >
                  <motion.div 
                    layout
                    className="w-4 h-4 bg-white rounded-full shadow-sm"
                    animate={{ x: preferences.publicProfile ? 24 : 0 }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Settings;
