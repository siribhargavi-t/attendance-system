import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "../../context/UserContext";
import MainLayout from "../../components/Layout/MainLayout";
import {
  FiUser, FiMail, FiEdit3, FiSave, FiX,
  FiBookOpen, FiHash, FiLayers, FiShield, FiCamera
} from "react-icons/fi";

const ROLE_CONFIG = {
  student: {
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    shadow: "rgba(79,172,254,0.35)",
    label: "Student",
    emoji: "🎓",
    banner: "linear-gradient(135deg, #4facfe, #a18cd1)",
  },
  faculty: {
    gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    shadow: "rgba(17,153,142,0.35)",
    label: "Faculty",
    emoji: "👨‍🏫",
    banner: "linear-gradient(135deg, #11998e, #4facfe)",
  },
  admin: {
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    shadow: "rgba(102,126,234,0.35)",
    label: "Administrator",
    emoji: "🛡️",
    banner: "linear-gradient(135deg, #667eea, #f093fb)",
  },
};

const ProfileField = ({ label, value, editing, icon, onChange, placeholder, type = "text", error, isDark, children }) => {
  const textColor = isDark ? "#f1f5f9" : "#1e293b";
  const mutedColor = isDark ? "#94a3b8" : "#64748b";
  const inputBg = isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.9)";
  const inputBorder = isDark ? "rgba(255,255,255,0.15)" : "rgba(102,126,234,0.3)";

  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{
        fontSize: 12, fontWeight: 600, color: mutedColor,
        textTransform: "uppercase", letterSpacing: "0.08em",
        display: "flex", alignItems: "center", gap: 5, marginBottom: 6,
      }}>
        {icon} {label}
      </label>
      {editing ? (
        children ? children : (
          <>
            <input
              type={type}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || label}
              style={{
                width: "100%", padding: "11px 14px", borderRadius: 12,
                border: `1px solid ${error ? "#f5576c" : inputBorder}`,
                background: inputBg, color: textColor, fontSize: 14, outline: "none",
                backdropFilter: "blur(12px)", boxSizing: "border-box", transition: "border-color 0.2s ease",
              }}
            />
            {error && <p style={{ color: "#f5576c", fontSize: 12, marginTop: 4 }}>⚠ {error}</p>}
          </>
        )
      ) : (
        <p style={{
          color: value ? textColor : mutedColor,
          fontSize: 15, fontWeight: value ? 500 : 400,
          padding: "8px 0", borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`,
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
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains("dark"));

  useEffect(() => {
    const observer = new MutationObserver(() => setIsDark(document.documentElement.classList.contains("dark")));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userData") || "{}");
    if (data && Object.keys(data).length > 0) {
      setUser(data);
      setName(data.name || "");
      setEmail(data.email || "");
      setPreview(data.image || "");
      setImage(data.image || "");
      setBanner(data.banner || "");
      setBannerPreview(data.banner || "");
      setStudentClass(data.class || "");
      setRollNo(data.rollNumber || data.rollNo || "");
      setDepartment(data.department || "");
      setAdminRole(data.adminRole || "");
    }
  }, [setUser]);

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => { setBannerPreview(reader.result); setBanner(reader.result); };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => { setPreview(reader.result); setImage(reader.result); };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Required";
    if (!email.trim()) errs.email = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const updated = {
        name,
        email,
        image,
        banner,
        class: studentClass,
        rollNo,
        department,
        adminRole
      };

      const res = await axios.put("/api/profile", updated, {
        headers: { Authorization: `Bearer ${userData.token}` }
      });

      if (res.data) {
        const newUserData = { ...userData, ...res.data };
        localStorage.setItem("userData", JSON.stringify(newUserData));
        setUser(newUserData);
        setEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch {
      alert("Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  const role = user?.role || "student";
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.student;
  const textColor = isDark ? "#f1f5f9" : "#1e293b";
  const mutedColor = isDark ? "#94a3b8" : "#64748b";
  const cardBg = isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.78)";
  const cardBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.7)";

  return (
    <MainLayout>
      <motion.div className="max-w-2xl mx-auto space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Banner Section */}
        <div className="rounded-3xl overflow-hidden relative shadow-2xl" style={{ border: `1px solid ${cardBorder}` }}>
          <div style={{ height: 160, background: bannerPreview ? `url(${bannerPreview}) center/cover` : cfg.banner }}>
             {editing && (
               <label className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-xl cursor-pointer text-white border border-white/30">
                 <FiCamera size={16}/> <input type="file" onChange={handleBannerChange} hidden />
               </label>
             )}
          </div>
          <div style={{ background: cardBg, padding: "0 28px 24px", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 20, marginTop: -40 }}>
              <div className="relative">
                <div style={{ width: 90, height: 90, borderRadius: "50%", background: cfg.gradient, border: "4px solid white", overflow: "hidden" }}>
                  {preview ? <img src={preview} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">{name[0]}</div>}
                </div>
                {editing && (
                  <label className="absolute bottom-0 right-0 bg-indigo-500 p-1.5 rounded-full text-white cursor-pointer border-2 border-white shadow-lg">
                    <FiCamera size={12}/> <input type="file" onChange={handleImageChange} hidden />
                  </label>
                )}
              </div>
              <div className="flex-1 flex justify-between items-center pb-2">
                <div>
                  <h2 className="text-2xl font-black" style={{ color: textColor }}>{name || "User Profile"}</h2>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: mutedColor }}>{cfg.label}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => editing ? handleSave() : setEditing(true)}
                    className="px-6 py-2 rounded-xl font-bold text-white shadow-lg transition-all"
                    style={{ background: cfg.gradient }}
                  >
                    {loading ? "..." : editing ? "Save" : "Edit"}
                  </button>
                  {editing && (
                    <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-xl border font-bold" style={{ color: textColor, borderColor: cardBorder }}>Cancel</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl border" style={{ background: cardBg, borderColor: cardBorder }}>
            <h3 className="flex items-center gap-2 font-bold mb-6" style={{ color: textColor }}><FiUser className="text-indigo-500"/> Personal</h3>
            <ProfileField label="Full Name" value={name} editing={editing} icon={<FiUser/>} onChange={setName} error={errors.name} isDark={isDark} />
            <ProfileField label="Email" value={email} editing={editing} icon={<FiMail/>} onChange={setEmail} error={errors.email} isDark={isDark} />
          </div>

          <div className="p-6 rounded-3xl border" style={{ background: cardBg, borderColor: cardBorder }}>
            <h3 className="flex items-center gap-2 font-bold mb-6" style={{ color: textColor }}><FiBookOpen className="text-indigo-500"/> Academic</h3>
            {role === "student" && (
              <>
                <ProfileField label="Class / Year" value={studentClass} editing={editing} icon={<FiBookOpen/>} isDark={isDark}>
                  <select 
                    value={studentClass} 
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white/5 border border-indigo-500/30 text-sm"
                    style={{ color: textColor }}
                  >
                    <option value="">Select Class</option>
                    {["1st Year - SEC A", "1st Year - SEC B", "2nd Year - CS", "2nd Year - IT", "3rd Year - CS", "4th Year - CS"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </ProfileField>
                <ProfileField label="Roll Number" value={rollNo} editing={editing} icon={<FiHash/>} onChange={setRollNo} isDark={isDark} />
              </>
            )}
            {role === "faculty" && <ProfileField label="Department" value={department} editing={editing} icon={<FiLayers/>} onChange={setDepartment} isDark={isDark} />}
            {role === "admin" && <ProfileField label="Role Title" value={adminRole} editing={editing} icon={<FiShield/>} onChange={setAdminRole} isDark={isDark} />}
          </div>
        </div>

        {saveSuccess && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center font-bold text-green-500">✓ Profile Updated!</motion.p>}
      </motion.div>
    </MainLayout>
  );
};

export default Profile;