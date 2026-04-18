import React, { useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import { UserPlus, Search, X, ChevronDown, Trash2, Eye, BookOpen } from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [form, setForm] = useState({ email: '', password: '', name: '', rollNumber: '', parentEmail: '', branch: '' });
    const [profileModal, setProfileModal] = useState(null); // { student, data }
    const [loadingProfile, setLoadingProfile] = useState(false);
    const { theme } = useContext(ThemeContext);
    const isDark = theme === 'dark';

    const openProfile = async (student) => {
        setLoadingProfile(true);
        setProfileModal({ student, data: null });
        try {
            const res = await api.get(`/admin/students/${student._id}/attendance`);
            setProfileModal({ student, data: res.data });
        } catch (err) {
            console.error(err);
            setProfileModal(null);
        } finally {
            setLoadingProfile(false);
        }
    };

    useEffect(() => { fetchStudents(); }, []);

    const fetchStudents = async () => {
        try {
            const res = await api.get('/admin/students');
            setStudents(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            await api.post('/admin/students', form);
            setForm({ email: '', password: '', name: '', rollNumber: '', parentEmail: '', branch: '' });
            setSuccess('Student added successfully!');
            setShowForm(false);
            fetchStudents();
            setTimeout(() => setSuccess(''), 4000);
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding student');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (studentId, studentName) => {
        if (!window.confirm(`Are you sure you want to permanently delete ${studentName}? This cannot be undone.`)) return;
        try {
            await api.delete(`/admin/students/${studentId}`);
            setSuccess(`${studentName} deleted successfully.`);
            setTimeout(() => setSuccess(''), 4000);
            fetchStudents();
        } catch (err) {
            setError(err.response?.data?.message || 'Error deleting student');
        }
    };

    const filtered = students.filter(s =>
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.rollNumber?.toLowerCase().includes(search.toLowerCase()) ||
        s.branch?.toLowerCase().includes(search.toLowerCase())
    );

    const inputCls = `w-full px-4 py-2.5 text-sm rounded-xl outline-none transition-all border
        ${isDark
            ? 'bg-slate-900/80 text-white placeholder-slate-500 border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30'
            : 'bg-slate-50 text-slate-800 placeholder-slate-400 border-slate-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20'}`;

    if (loading) return (
        <div className="space-y-6">
            <div className="h-14 rounded-2xl skeleton" />
            <div className="h-80 rounded-2xl skeleton" />
        </div>
    );

    const branchColors = {
        'CSE': '#6366f1', 'ECE': '#06b6d4', 'ME': '#f59e0b',
        'CE': '#10b981', 'IT': '#8b5cf6', 'General': '#64748b'
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Success / Error toasts */}
            {success && (
                <div className="rounded-xl p-3.5 text-sm font-medium flex items-center gap-2 animate-fade-in-up"
                    style={{ background: isDark ? 'rgba(16,185,129,0.1)' : '#d1fae5', color: isDark ? '#6ee7b7' : '#065f46', border: `1px solid ${isDark ? 'rgba(16,185,129,0.2)' : 'rgba(167,243,208,1)'}` }}>
                    ✓ {success}
                </div>
            )}
            {error && (
                <div className="rounded-xl p-3.5 text-sm font-medium flex items-center justify-between animate-fade-in-up"
                    style={{ background: isDark ? 'rgba(239,68,68,0.1)' : '#fee2e2', color: isDark ? '#fca5a5' : '#dc2626', border: `1px solid ${isDark ? 'rgba(239,68,68,0.2)' : 'rgba(252,165,165,1)'}` }}>
                    {error}
                    <button onClick={() => setError('')}><X className="w-4 h-4" /></button>
                </div>
            )}

            {/* Top bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1 relative max-w-sm">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className={`pl-9 pr-4 py-2.5 text-sm rounded-xl outline-none w-full border transition-all
                            ${isDark
                                ? 'bg-slate-800 text-white placeholder-slate-500 border-slate-700 focus:border-indigo-500'
                                : 'bg-white text-slate-800 placeholder-slate-400 border-slate-200 focus:border-indigo-400 shadow-sm'}`}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {filtered.length} student{filtered.length !== 1 ? 's' : ''}
                    </span>
                    <button
                        onClick={() => setShowForm(v => !v)}
                        className="btn-shine flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
                    >
                        <UserPlus className="w-4 h-4" />
                        Add Student
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showForm ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Add Student Form (collapsible) */}
            {showForm && (
                <div className={`rounded-2xl p-6 animate-fade-in-scale border transition-all
                    ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <h3 className={`text-base font-bold mb-5 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        New Student Registration
                    </h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { key: 'name', placeholder: 'Full Name', required: true, type: 'text' },
                            { key: 'rollNumber', placeholder: 'Roll Number (used as Username)', required: true, type: 'text' },
                            { key: 'branch', placeholder: 'Branch (e.g. CSE, ECE)', required: true, type: 'text' },
                            { key: 'email', placeholder: 'Student Email', required: true, type: 'email' },
                            { key: 'password', placeholder: 'Password', required: true, type: 'password' },
                            { key: 'parentEmail', placeholder: 'Parent Email (Optional)', required: false, type: 'email' },
                        ].map(field => (
                            <div key={field.key} className={field.key === 'parentEmail' ? 'sm:col-span-2' : ''}>
                                <input
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    value={form[field.key]}
                                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                                    className={inputCls}
                                />
                            </div>
                        ))}
                        <div className="sm:col-span-2 flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="btn-shine flex-1 py-2.5 text-sm font-bold text-white rounded-xl disabled:opacity-60 transition-all"
                                style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
                            >
                                {submitting ? 'Adding...' : 'Add Student'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className={`px-6 py-2.5 text-sm font-semibold rounded-xl transition-all ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Students table */}
            <div className={`rounded-2xl overflow-hidden border transition-all
                ${isDark ? 'bg-slate-800/70 border-slate-700/50' : 'bg-white border-slate-100 shadow-sm'}`}>
                {filtered.length === 0 ? (
                    <div className="py-20 text-center">
                        <div className={`text-4xl mb-3`}>🎓</div>
                        <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            {search ? 'No students match your search.' : 'No students added yet. Click "Add Student" to get started.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={isDark ? 'border-b border-slate-700' : 'border-b border-slate-100'}>
                                    {['Student', 'Roll No', 'Branch', 'Account', ''].map(h => (
                                        <th key={h} className={`px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500 bg-slate-900/40' : 'text-slate-400 bg-slate-50'}`}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y" style={{ borderColor: isDark ? 'rgba(51,65,85,0.5)' : 'rgba(241,245,249,1)' }}>
                                {filtered.map(student => {
                                    const branchColor = branchColors[student.branch] || '#64748b';
                                    return (
                                        <tr key={student._id} className="table-row-hover group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                                        style={{ background: `linear-gradient(135deg, ${branchColor}, ${branchColor}aa)` }}>
                                                        {student.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                                        {student.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-sm font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    {student.rollNumber}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-1 text-xs font-bold rounded-lg"
                                                    style={{
                                                        background: `${branchColor}18`,
                                                        color: branchColor,
                                                        border: `1px solid ${branchColor}30`
                                                    }}>
                                                    {student.branch || 'General'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                                        {student.user?.username}
                                                    </p>
                                                    <p className={`text-xs ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                                                        {student.user?.email}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <button
                                                        onClick={() => openProfile(student)}
                                                        className={`p-2 rounded-lg transition-all hover:scale-110 ${
                                                            isDark ? 'text-indigo-400 hover:bg-indigo-500/10' : 'text-indigo-400 hover:bg-indigo-50 hover:text-indigo-600'
                                                        }`}
                                                        title="View attendance profile"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(student._id, student.name)}
                                                        className={`p-2 rounded-lg transition-all hover:scale-110 group ${
                                                            isDark ? 'text-red-500 hover:bg-red-500/10' : 'text-red-400 hover:bg-red-50 hover:text-red-600'
                                                        }`}
                                                        title="Delete student"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Student Profile Modal */}
            {profileModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
                    onClick={() => setProfileModal(null)}>
                    <div className={`w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl`}
                        style={{ background: isDark ? '#0f172a' : '#fff', border: `1px solid ${isDark ? 'rgba(99,102,241,0.2)' : '#e2e8f0'}` }}
                        onClick={e => e.stopPropagation()}>
                        {/* Modal header */}
                        <div className={`px-6 py-5 border-b flex items-center gap-4 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-lg text-white flex-shrink-0"
                                style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                                {profileModal.student?.name?.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{profileModal.student?.name}</h3>
                                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                    {profileModal.student?.rollNumber} · {profileModal.student?.branch}
                                </p>
                            </div>
                            <button onClick={() => setProfileModal(null)} className={`p-2 rounded-lg ${isDark ? 'text-slate-600 hover:text-slate-300 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}>
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                            {loadingProfile || !profileModal.data ? (
                                <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 rounded-xl skeleton" />)}</div>
                            ) : (
                                <>
                                    {/* Overall stats */}
                                    <div className="grid grid-cols-4 gap-3">
                                        {[
                                            { label: 'Total', value: profileModal.data.overall.total, color: '#6366f1', bg: isDark ? 'rgba(99,102,241,0.1)' : '#eef2ff' },
                                            { label: 'Present', value: profileModal.data.overall.present, color: '#10b981', bg: isDark ? 'rgba(16,185,129,0.1)' : '#d1fae5' },
                                            { label: 'Absent', value: profileModal.data.overall.absent, color: '#ef4444', bg: isDark ? 'rgba(239,68,68,0.1)' : '#fee2e2' },
                                            { label: 'Overall %', value: `${profileModal.data.overall.percentage}%`, color: '#f59e0b', bg: isDark ? 'rgba(245,158,11,0.1)' : '#fffbeb' },
                                        ].map(s => (
                                            <div key={s.label} className="text-center p-3 rounded-xl" style={{ background: s.bg }}>
                                                <p className="text-lg font-black" style={{ color: s.color }}>{s.value}</p>
                                                <p className="text-xs font-semibold mt-0.5" style={{ color: s.color }}>{s.label}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Subject breakdown */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <BookOpen className={`w-3.5 h-3.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                                            <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Subject-wise Breakdown</span>
                                        </div>
                                        {profileModal.data.subjects.length === 0 ? (
                                            <p className={`text-sm text-center py-6 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>No attendance records found</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {profileModal.data.subjects.map(sub => {
                                                    const pct = parseFloat(sub.percentage);
                                                    const color = pct < 75 ? '#ef4444' : pct >= 90 ? '#10b981' : '#6366f1';
                                                    return (
                                                        <div key={sub.subjectId} className={`p-4 rounded-xl ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                                                            <div className="flex items-center justify-between mb-2">
                                                                <div>
                                                                    <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{sub.subjectName}</p>
                                                                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{sub.subjectCode} · {sub.present}/{sub.total} classes</p>
                                                                </div>
                                                                <span className="text-sm font-black" style={{ color }}>{sub.percentage}%</span>
                                                            </div>
                                                            <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                                                                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${sub.percentage}%`, background: color }} />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Students;
