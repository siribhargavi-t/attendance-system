import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "../../context/UserContext";
import MainLayout from "../../components/Layout/MainLayout";
import {
  FiUser, FiMail, FiEdit3, FiSave, FiX,
  FiBookOpen, FiHash, FiLayers, FiShield, FiCamera
} from "react-icons/fi";

/** 
 * Role-based professional configuration 
 * Using high-contrast gradients and coordinated shadows
 */
const ROLE_CONFIG = {
  student: {
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    shadow: "rgba(79,172,254,0.35)",
    label: "Student",
    emoji: "🎓",
    banner: "linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #a18cd1 100%)",
  },
  faculty: {
    gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    shadow: "rgba(17,153,142,0.35)",
    label: "Faculty",
    emoji: "👨‍🏫",
    banner: "linear-gradient(135deg, #11998e 0%, #38ef7d 50%, #4facfe 100%)",
  },
  admin: {
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    shadow: "rgba(102,126,234,0.35)",
    label: "Administrator",
    emoji: "🛡️",
    banner: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
  },
};

/** 
 * Reusable professional field component 
 * Implements glassmorphic input styles and reactive dark mode text
 */
const ProfileField = ({ label, value, editing, icon, onChange, placeholder, type = "text", error, isDark }) => {
  const textColor = isDark ? "#f1f5f9" : "#1e293b";
  const mutedColor = isDark ? "#94a3b8" : "#64748b";
  const inputBg = isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.9)";
  const inputBorder = isDark ? "rgba(255,255,255,0.15)" : "rgba(102,126,234,0.3)";

  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{
        fontSize: 12,
        fontWeight: 600,
        color: mutedColor,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        display: "flex",
        alignItems: "center",
        gap: 5,
        marginBottom: 6,
      }}>
        {icon} {label}
      </label>
      {editing ? (
        <>
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || label}
            style={{
              width: "100%",
              padding: "11px 14px",
              borderRadius: 12,
              border: `1px solid ${error ? "#f5576c" : inputBorder}`,
              background: inputBg,
              color: textColor,
              fontSize: 14,
              outline: "none",
              backdropFilter: "blur(12px)",
              boxSizing: "border-box",
              transition: "border-color 0.2s ease",
            }}
          />
          {error && (
            <p style={{ color: "#f5576c", fontSize: 12, marginTop: 4 }}>⚠ {error}</p>
          )}
        </>
      ) : (
        <p style={{
          color: value ? textColor : mutedColor,
          fontSize: 15,
          fontWeight: value ? 500 : 400,
          padding: "8px 0",
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`,
        }}>
          {value || <span style={{ fontStyle: "italic", opacity: 0.6 }}>Not set</span>}
        </p>
      )}
    </div>
  );
};

const Profile = () => {
  const { user, setUser } = useContext(UserContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editing, setEditing] = useState(false);
  const [studentClass, setStudentClass] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [department, setDepartment] = useState("");
  const [adminRole, setAdminRole] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [banner, setBanner] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Reactive dark mode detection
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Sync data from context and storage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    if (userData && Object.keys(userData).length > 0) {
      setUser(userData);
      setName(userData.name || "");
      setEmail(userData.email || "");
      setImage(userData.image || "");
      setPreview(userData.image || "");
      setBanner(userData.banner || "");
      setBannerPreview(userData.banner || "");
      setStudentClass(userData.class || "");
      setRollNo(userData.rollNumber || userData.rollNo || "");
      setDepartment(userData.department || "");
      setAdminRole(userData.adminRole || "");
    }
  }, [setUser]);

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerPreview(reader.result);
      setBanner(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)) errs.email = "Invalid format";
    
    if (user?.role === "student") {
      if (!studentClass.trim()) errs.class = "Class is required";
      if (!rollNo.trim()) errs.rollNo = "Roll Number is required";
    }
    if (user?.role === "faculty" && !department.trim()) errs.department = "Department required";
    if (user?.role === "admin" && !adminRole.trim()) errs.adminRole = "Role title required";
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const updatedUser = {
        name,
        email,
        image,
        banner,
        ...(user?.role === "student"
          ? { class: studentClass, rollNo }
          : user?.role === "faculty"
            ? { department }
            : user?.role === "admin"
              ? { adminRole }
              : {}),
      };

      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const token = userData.token;

      const res = await axios.put("/api/profile", updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (res.data) {
        // Merge with existing token to prevent logout/auth errors
        const newUserData = { ...userData, ...res.data };
        localStorage.setItem("userData", JSON.stringify(newUserData));
        setUser(newUserData);
        setEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Save error:", err);
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    setName(userData.name || "");
    setEmail(userData.email || "");
    setImage(userData.image || "");
    setPreview(userData.image || "");
    setBanner(userData.banner || "");
    setBannerPreview(userData.banner || "");
    setStudentClass(userData.class || "");
    setRollNo(userData.rollNumber || userData.rollNo || "");
    setDepartment(userData.department || "");
    setAdminRole(userData.adminRole || "");
    setErrors({});
    setEditing(false);
  };

  const role = user?.role || "student";
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.student;
  const textColor = isDark ? "#f1f5f9" : "#1e293b";
  const mutedColor = isDark ? "#94a3b8" : "#64748b";
  const cardBg = isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.78)";
  const cardBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.7)";

  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : cfg.emoji;

  return (
    <MainLayout>
      <motion.div
        className="max-w-2xl mx-auto space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        {/* Banner & Avatar Section */}
        <div
          className="rounded-3xl overflow-hidden shimmer-border"
          style={{
            backdropFilter: "blur(20px)",
            border: `1px solid ${cardBorder}`,
            boxShadow: `0 20px 60px ${cfg.shadow}`,
          }}
        >
          <div
            style={{
              height: 180,
              background: bannerPreview ? `url(${bannerPreview}) center/cover no-repeat` : cfg.banner,
              position: "relative",
              transition: "all 0.4s ease",
            }}
          >
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
              zIndex: 1,
            }} />
            
            {editing && (
              <label 
                htmlFor="bannerUpload"
                style={{
                  position: "absolute",
                  top: 15, right: 15, zIndex: 10,
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 14px", borderRadius: 12,
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
                }}
              >
                <FiCamera size={14} /> Change Banner
                <input id="bannerUpload" type="file" accept="image/*" onChange={handleBannerChange} style={{ display: "none" }} />
              </label>
            )}

            <div style={{ position: "absolute", bottom: 20, left: 130, right: 20, zIndex: 5 }}>
              <motion.h2 
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                style={{ color: "#fff", fontWeight: 800, fontSize: 28, margin: 0, textShadow: "0 2px 10px rgba(0,0,0,0.4)" }}
              >
                {name || "User Profile"}
              </motion.h2>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "4px 14px", borderRadius: 999, background: cfg.gradient,
                  color: "#fff", fontSize: 12, fontWeight: 700, boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                }}>
                  {cfg.emoji} {cfg.label}
                </span>
                <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
                  {email}
                </span>
              </div>
            </div>
          </div>

          <div style={{ background: cardBg, padding: "0 32px 28px", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 20, marginTop: -50 }}>
              <div style={{ position: "relative", flexShrink: 0, zIndex: 10 }}>
                <div style={{
                  width: 100, height: 100, borderRadius: "50%",
                  background: cfg.gradient, boxShadow: `0 10px 30px ${cfg.shadow}`,
                  border: `4px solid ${isDark ? "#020617" : "#fff"}`,
                  overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 32, color: "#fff", fontWeight: 700,
                }}>
                  {preview ? <img src={preview} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span>{initials}</span>}
                </div>
                {editing && (
                  <label htmlFor="avatarUpload" style={{
                    position: "absolute", bottom: 0, right: 0, width: 32, height: 32, borderRadius: "50%",
                    background: cfg.gradient, border: `3px solid ${isDark ? "#020617" : "#fff"}`,
                    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.3)", zIndex: 11,
                  }}>
                    <FiCamera size={14} color="#fff" />
                    <input id="avatarUpload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                  </label>
                )}
              </div>

              <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", paddingBottom: 10, gap: 10 }}>
                {editing ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                      onClick={handleSave} disabled={loading}
                      style={{
                        padding: "10px 24px", borderRadius: 12, background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", 
                        color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer",
                        fontWeight: 700, fontSize: 14, boxShadow: "0 10px 20px rgba(16, 185, 129, 0.2)",
                        opacity: loading ? 0.7 : 1,
                      }}
                    >
                      <FiSave style={{ display: "inline", marginRight: 8 }} /> {loading ? "Saving..." : "Save Changes"}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={handleCancel}
                      style={{
                        padding: "10px 18px", borderRadius: 12, background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                        color: textColor, border: `1px solid ${cardBorder}`, cursor: "pointer", fontWeight: 600, fontSize: 14,
                      }}
                    >
                      <FiX style={{ display: "inline", marginRight: 8 }} /> Cancel
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setEditing(true)}
                    style={{
                      padding: "10px 24px", borderRadius: 12, background: cfg.gradient, color: "#fff",
                      border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14, boxShadow: `0 10px 30px ${cfg.shadow}`,
                    }}
                  >
                    <FiEdit3 style={{ display: "inline", marginRight: 8 }} /> Edit Profile
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Success Toast */}
        <AnimatePresence>
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              style={{
                background: "linear-gradient(135deg, #11998e, #38ef7d)", color: "#fff",
                borderRadius: 12, padding: "12px 20px", fontWeight: 600, textAlign: "center",
              }}
            >
              ✅ Profile updated successfully!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            style={{ background: cardBg, backdropFilter: "blur(20px)", border: `1px solid ${cardBorder}`, borderRadius: 24, padding: "28px", boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.25)" : "0 8px 32px rgba(0,0,0,0.08)" }}
          >
            <h3 style={{ color: textColor, fontWeight: 700, fontSize: 18, marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>👤</span> Profile Identity
            </h3>
            <ProfileField label="Full Name" value={name} editing={editing} icon={<FiUser />} onChange={setName} error={errors.name} isDark={isDark} />
            <ProfileField label="Email Address" value={email} editing={editing} icon={<FiMail />} onChange={setEmail} error={errors.email} isDark={isDark} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            style={{ background: cardBg, backdropFilter: "blur(20px)", border: `1px solid ${cardBorder}`, borderRadius: 24, padding: "28px", boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.25)" : "0 8px 32px rgba(0,0,0,0.08)" }}
          >
            <h3 style={{ color: textColor, fontWeight: 700, fontSize: 18, marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>{cfg.emoji}</span> Academic Info
            </h3>
            {role === "student" && (
              <>
                <ProfileField label="Class / Year" value={studentClass} editing={editing} icon={<FiBookOpen />} onChange={setStudentClass} placeholder="e.g. CSE-A 3rd Year" error={errors.class} isDark={isDark} />
                <ProfileField label="Roll Number" value={rollNo} editing={editing} icon={<FiHash />} onChange={setRollNo} placeholder="e.g. 21CS4001" error={errors.rollNo} isDark={isDark} />
              </>
            )}
            {role === "faculty" && (
                <ProfileField label="Department" value={department} editing={editing} icon={<FiLayers />} onChange={setDepartment} placeholder="e.g. Computer Science" error={errors.department} isDark={isDark} />
            )}
            {role === "admin" && (
                <ProfileField label="Role Title" value={adminRole} editing={editing} icon={<FiShield />} onChange={setAdminRole} placeholder="e.g. System Controller" error={errors.adminRole} isDark={isDark} />
            )}
          </motion.div>
        </div>

        {/* Quick Stats Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Account Status", value: "Verified", icon: "💎" },
            { label: "Activity Level", value: "High", icon: "🔥" },
            { label: "System Role", value: cfg.label, icon: "🛡️" },
            { label: "Connectivity", value: "Active", icon: "🌐" }
          ].map((stat, i) => (
            <div key={i} style={{
              background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 16, padding: "16px", textAlign: "center",
              boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.05)"
            }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{stat.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: textColor }}>{stat.value}</div>
              <div style={{ fontSize: 10, textTransform: "uppercase", color: mutedColor, letterSpacing: "0.05em", marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </MainLayout>
  );
};

export default Profile;