import React, { useState, useEffect } from "react";
import MainLayout from "../../components/Layout/MainLayout";
import { FiSearch, FiCheckCircle, FiXCircle, FiSave, FiClock, FiBook, FiUsers, FiFilter } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "English", "Computer Science", "Engineering Graphics"];
const CLASSES = ["1st Year - SEC A", "1st Year - SEC B", "2nd Year - CS", "2nd Year - IT", "3rd Year - CS", "4th Year - CS"];
const TIME_SLOTS = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
  "01:00 PM - 02:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
];
const ROWS_PER_PAGE = 8;

const FacultyAttendance = () => {
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [className, setClassName] = useState(CLASSES[0]);
  const [time, setTime] = useState(TIME_SLOTS[0]);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  
  const [attendance, setAttendance] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains("dark"));

  // Detect dark mode
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Fetch students
  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/admin/students")
      .then((res) => {
        const studentData = (res.data || []).map((s) => ({
          id: s._id,
          name: s.name || "Unknown",
          email: s.email || "",
          roll: s.rollNumber || "N/A",
          className: s.class || "" // Capture class from backend
        }));
        setStudents(studentData);
        // Initialize attendance state
        const initial = {};
        studentData.forEach(s => initial[s.id] = "Present");
        setAttendance(initial);
      })
      .catch((err) => console.error("Error fetching students", err))

      .finally(() => setLoading(false));
  }, []);

  const filteredData = students.filter((student) => {
    const search = searchTerm.toLowerCase();
    // Filter by class AND Search term
    const matchesClass = student.className === className;
    const matchesSearch = student.name.toLowerCase().includes(search) || student.roll.toLowerCase().includes(search);
    return matchesClass && matchesSearch;
  });

  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);
  const paginatedData = filteredData.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

  const handleMarkAll = (status) => {
    const newAtt = { ...attendance };
    filteredData.forEach(s => newAtt[s.id] = status);
    setAttendance(newAtt);
  };

  const toggleAttendance = (id) => {
    setAttendance(prev => ({
      ...prev,
      [id]: prev[id] === "Present" ? "Absent" : "Present"
    }));
  };

  const handleSave = async () => {
    if (!subject || !className || !time || !date) {
      return alert("Please fill in all session details");
    }
    setSaving(true);
    try {
      const records = students.map((s) => ({
        studentName: s.name,
        studentEmail: s.email,
        rollNumber: s.roll,
        className,
        time,
        subject,
        date,
        status: attendance[s.id] || "Absent",
      }));

      // In a real app, we'd have a bulk endpoint
      await Promise.all(records.map(r => axios.post("/api/attendance", r)));
      alert("Attendance records saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  // UI Tokens - Refined for professional look
  const cardBg = isDark 
    ? "rgba(15, 23, 42, 0.82)" // Deep slate-indigo
    : "rgba(255, 255, 255, 0.9)";
  const cardBorder = isDark 
    ? "rgba(102, 126, 234, 0.15)" // Subtle indigo glow
    : "rgba(0, 0, 0, 0.08)";
  const textColor = isDark ? "#f8fafc" : "#0f172a"; // Crisp light / True dark
  const mutedText = isDark ? "#94a3b8" : "#64748b";

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                Mark Attendance
              </h1>
              <p style={{ color: mutedText, fontWeight: 500 }} className="mt-1">
                Establish and record session details with precision.
              </p>
            </div>
            <div className="flex gap-3">
              <motion.button 
                whileHover={{ scale: 1.02, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={saving || loading}
                className="flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-white shadow-2xl transition-all active:scale-95 disabled:opacity-50"
                style={{ 
                  background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                  boxShadow: "0 10px 40px rgba(99, 102, 241, 0.3)"
                }}
              >
                {saving ? "Saving..." : <><FiSave /> Publish Session</>}
              </motion.button>
            </div>
          </div>

          {/* Session Configuration Card */}
          <div 
            className="p-8 rounded-3xl border"
            style={{ 
              background: cardBg, 
              borderColor: cardBorder,
              backdropFilter: "blur(24px)",
              boxShadow: isDark 
                ? "0 20px 50px rgba(0,0,0,0.3)" 
                : "0 20px 50px rgba(0,0,0,0.04)"
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest flex items-center gap-2" style={{ color: mutedText }}>
                  <FiBook size={14} className="text-indigo-500" /> Subject
                </label>
                <div className="relative">
                  <select 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border bg-black/5 dark:bg-white/5 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all appearance-none cursor-pointer"
                    style={{ color: textColor, borderColor: cardBorder }}
                  >
                    {SUBJECTS.map(s => <option key={s} value={s} className="dark:bg-slate-900 bg-white">{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest flex items-center gap-2" style={{ color: mutedText }}>
                  <FiUsers size={14} className="text-indigo-500" /> Class Unit
                </label>
                <div className="relative">
                  <select 
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border bg-black/5 dark:bg-white/5 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all appearance-none cursor-pointer"
                    style={{ color: textColor, borderColor: cardBorder }}
                  >
                    {CLASSES.map(c => <option key={c} value={c} className="dark:bg-slate-900 bg-white">{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest flex items-center gap-2" style={{ color: mutedText }}>
                  <FiClock size={14} className="text-indigo-500" /> Schedule
                </label>
                <div className="relative">
                  <select 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border bg-black/5 dark:bg-white/5 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all appearance-none cursor-pointer"
                    style={{ color: textColor, borderColor: cardBorder }}
                  >
                    {TIME_SLOTS.map(t => <option key={t} value={t} className="dark:bg-slate-900 bg-white">{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest flex items-center gap-2" style={{ color: mutedText }}>
                   Calendar Date
                </label>
                <input 
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border bg-black/5 dark:bg-white/5 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all"
                  style={{ color: textColor, borderColor: cardBorder }}
                />
              </div>
            </div>
          </div>

          {/* Student List Section */}
          <div 
            className="overflow-hidden rounded-2xl border"
            style={{ 
              background: cardBg, 
              borderColor: cardBorder,
              backdropFilter: "blur(12px)"
            }}
          >
            {/* Table Header / Toolbar */}
            <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4" style={{ borderColor: cardBorder }}>
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search student by name or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 outline-none focus:ring-1 focus:ring-indigo-500"
                  style={{ color: textColor }}
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleMarkAll("Present")}
                  className="px-4 py-2 rounded-lg bg-green-500/10 text-green-500 text-sm font-bold hover:bg-green-500 hover:text-white transition-colors"
                >
                  Mark All Present
                </button>
                <button 
                  onClick={() => handleMarkAll("Absent")}
                  className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 text-sm font-bold hover:bg-red-500 hover:text-white transition-colors"
                >
                  Mark All Absent
                </button>
              </div>
            </div>

            {/* Table Body */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-20 text-center space-y-4">
                  <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p style={{ color: mutedText }}>Loading student data...</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr style={{ background: isDark ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.02)" }}>
                      <th className="px-6 py-4 font-bold text-xs uppercase" style={{ color: mutedText }}>Roll Number</th>
                      <th className="px-6 py-4 font-bold text-xs uppercase" style={{ color: mutedText }}>Full Name</th>
                      <th className="px-6 py-4 font-bold text-xs uppercase" style={{ color: mutedText }}>Email Address</th>
                      <th className="px-6 py-4 font-bold text-xs uppercase text-center" style={{ color: mutedText }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence mode="popLayout">
                      {paginatedData.map((student) => (
                        <motion.tr 
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          key={student.id} 
                          className="hover:bg-indigo-500/5 transition-colors border-b"
                          style={{ borderColor: cardBorder }}
                        >
                          <td className="px-6 py-4 font-mono font-bold" style={{ color: textColor }}>{student.roll}</td>
                          <td className="px-6 py-4 font-medium" style={{ color: textColor }}>{student.name}</td>
                          <td className="px-6 py-4 text-sm" style={{ color: mutedText }}>{student.email}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-4">
                              <span 
                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                  attendance[student.id] === "Present" 
                                    ? "bg-green-500 text-white" 
                                    : "bg-red-500 text-white"
                                }`}
                              >
                                {attendance[student.id]}
                              </span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="sr-only peer" 
                                  checked={attendance[student.id] === "Present"}
                                  onChange={() => toggleAttendance(student.id)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                              </label>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer / Pagination */}
            {!loading && (
              <div className="p-4 flex items-center justify-between border-t" style={{ borderColor: cardBorder }}>
                <p className="text-sm" style={{ color: mutedText }}>
                  Showing {paginatedData.length} of {filteredData.length} students
                </p>
                <div className="flex items-center gap-1">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="p-2 rounded hover:bg-black/5 disabled:opacity-30"
                  >
                    Previous
                  </button>
                  <span className="px-4 text-sm font-bold">{currentPage} / {totalPages || 1}</span>
                  <button 
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="p-2 rounded hover:bg-black/5 disabled:opacity-30"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default FacultyAttendance;