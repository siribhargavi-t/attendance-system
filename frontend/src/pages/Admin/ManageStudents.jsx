import React, { useState, useEffect } from 'react';
import API from "../../services/api";   // adjust path
import { motion } from "framer-motion";
import { UserPlus, Trash2, AlertTriangle } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';

const ManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [newStudent, setNewStudent] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const isDark = document.documentElement.classList.contains("dark");
    const textColor = isDark ? "#f1f5f9" : "#1e293b";
    const mutedColor = isDark ? "#94a3b8" : "#64748b";
    const cardBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.78)";
    const inputBg = isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.9)";
    const inputBorder = isDark ? "rgba(255,255,255,0.18)" : "rgba(102,126,234,0.3)";

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await API.get('/api/admin/students', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(res.data);
        } catch (err) {
            setError('Failed to fetch students.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStudents(); }, []);

    const handleInputChange = (e) => {
        setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        setError('');
        if (!newStudent.name || !newStudent.email || !newStudent.password) {
            setError('Please fill all fields.');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await API.post('/api/admin/students', newStudent, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewStudent({ name: '', email: '', password: '' });
            fetchStudents();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add student.');
        }
    };

    const handleDeleteStudent = async (studentId) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                const token = localStorage.getItem('token');
                await API.delete(`/api/admin/students/${studentId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchStudents();
            } catch (err) {
                setError('Failed to delete student.');
            }
        }
    };

    const inputStyle = {
        background: inputBg,
        border: `1px solid ${inputBorder}`,
        borderRadius: "10px",
        padding: "10px 14px",
        color: textColor,
        outline: "none",
        fontSize: "14px",
        width: "100%",
    };

    return (
        <MainLayout>
            <motion.div
                className="max-w-5xl mx-auto space-y-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="shimmer-border rounded-2xl"
                    style={{
                        background: "linear-gradient(135deg, rgba(102,126,234,0.15), rgba(118,75,162,0.12))",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        padding: "24px 28px",
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div className="text-4xl">🎓</div>
                        <div>
                            <h1 className="text-2xl font-bold gradient-text">Manage Students</h1>
                            <p style={{ color: mutedColor, fontSize: 14 }}>Add, view, and manage student accounts</p>
                        </div>
                    </div>
                </motion.div>

                {/* Add Student Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6"
                    style={{ background: cardBg }}
                >
                    <h2
                        className="text-lg font-bold mb-5 flex items-center gap-2"
                        style={{ color: textColor }}
                    >
                        <UserPlus size={20} style={{ color: "#667eea" }} />
                        Add New Student
                    </h2>
                    <form onSubmit={handleAddStudent}>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <input
                                type="text"
                                name="name"
                                value={newStudent.name}
                                onChange={handleInputChange}
                                placeholder="Full Name"
                                style={inputStyle}
                            />
                            <input
                                type="email"
                                name="email"
                                value={newStudent.email}
                                onChange={handleInputChange}
                                placeholder="Email Address"
                                style={inputStyle}
                            />
                            <input
                                type="password"
                                name="password"
                                value={newStudent.password}
                                onChange={handleInputChange}
                                placeholder="Password"
                                style={inputStyle}
                            />
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                className="btn-glow-blue flex items-center justify-center gap-2"
                                style={{ padding: "10px 16px" }}
                            >
                                <UserPlus size={16} /> Add Student
                            </motion.button>
                        </div>
                        {error && (
                            <p className="text-red-400 mt-3 flex items-center gap-1 text-sm">
                                <AlertTriangle size={15} /> {error}
                            </p>
                        )}
                    </form>
                </motion.div>

                {/* Student List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="glass-card overflow-hidden"
                    style={{ background: cardBg }}
                >
                    <div className="p-5 border-b" style={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)" }}>
                        <h2 className="font-bold text-lg" style={{ color: textColor }}>
                            All Students ({students.length})
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm colorful-table">
                            <thead>
                                <tr>
                                    <th className="py-3 px-4 text-left">#</th>
                                    <th className="py-3 px-4 text-left">Name</th>
                                    <th className="py-3 px-4 text-left">Email</th>
                                    <th className="py-3 px-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="text-center p-6" style={{ color: mutedColor }}>
                                            Loading students...
                                        </td>
                                    </tr>
                                ) : students.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center p-6" style={{ color: mutedColor }}>
                                            No students found.
                                        </td>
                                    </tr>
                                ) : (
                                    students.map((student, idx) => (
                                        <tr
                                            key={student._id}
                                            className="border-b transition"
                                            style={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)" }}
                                        >
                                            <td className="py-3 px-4 font-medium" style={{ color: mutedColor }}>{idx + 1}</td>
                                            <td className="py-3 px-4 font-semibold" style={{ color: textColor }}>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                                                        style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
                                                    >
                                                        {student.name?.[0]?.toUpperCase() || "?"}
                                                    </div>
                                                    {student.name}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4" style={{ color: mutedColor }}>{student.email}</td>
                                            <td className="py-3 px-4 text-center">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleDeleteStudent(student._id)}
                                                    className="p-2 rounded-lg text-white"
                                                    style={{ background: "linear-gradient(135deg, #f093fb, #f5576c)" }}
                                                >
                                                    <Trash2 size={16} />
                                                </motion.button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </motion.div>
        </MainLayout>
    );
};

export default ManageStudents;