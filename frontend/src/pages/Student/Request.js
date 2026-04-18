import React, { useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import { Send, FileText, MessageSquare, Link as LinkIcon, CheckCircle, AlertCircle, CalendarDays, Briefcase, X, ShieldCheck, ShieldX, Shield } from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';

/* ─────── Reason label map ─────── */
const REASON_LABELS = {
    'hackathon':       { label: 'Hackathon',         emoji: '💻' },
    'nptel-exam':      { label: 'NPTEL / Online Exam', emoji: '📝' },
    'internship':      { label: 'Internship',         emoji: '🏢' },
    'medical':         { label: 'Medical',            emoji: '🏥' },
    'family-emergency':{ label: 'Family Emergency',  emoji: '🏠' },
    'sports-event':    { label: 'Sports / Cultural Event', emoji: '🏆' },
    'other':           { label: 'Other',              emoji: '📋' },
};

const statusConfig = {
    pending:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)',  label: 'Pending' },
    approved: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', label: 'Approved' },
    rejected: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.25)',  label: 'Rejected' },
};

/* ─── Attendance Correction Tab (unchanged from before) ─── */
const AttendanceCorrectionTab = ({ isDark }) => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [form, setForm] = useState({ attendanceId: '', changeReason: '', documentUrl: '' });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const res = await api.get('/student/attendance');
                const absences = res.data.attendance.filter(r => r.status === 'absent' && !r.changeRequest);
                setAttendanceRecords(absences);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchAttendance();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setResult(null);
        try {
            await api.post('/student/request', form);
            setResult({ type: 'success', message: 'Correction request submitted! Admin will review it shortly.' });
            setForm({ attendanceId: '', changeReason: '', documentUrl: '' });
            setAttendanceRecords(prev => prev.filter(r => r._id !== form.attendanceId));
        } catch (err) {
            setResult({ type: 'error', message: err.response?.data?.message || 'Failed to submit request.' });
        } finally { setSubmitting(false); }
    };

    const inputCls = `w-full px-4 py-3 text-sm rounded-xl outline-none transition-all
        ${isDark
            ? 'glass-input text-white'
            : 'glass-input-light text-slate-800'}`;

    if (loading) return <div className="h-64 rounded-2xl skeleton" />;

    return (
        <div className="space-y-5">
            {result && (
                <div className={`rounded-xl p-4 flex items-start gap-3 animate-fade-in-up border
                    ${result.type === 'success'
                        ? isDark ? 'bg-green-900/20 border-green-700/30 text-green-400' : 'bg-green-50 border-green-200 text-green-700'
                        : isDark ? 'bg-red-900/20 border-red-700/30 text-red-400' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {result.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                    <p className="text-sm font-medium">{result.message}</p>
                </div>
            )}
            <div className={`rounded-[24px] p-6 transition-all ${isDark ? 'liquid-glass-card' : 'liquid-glass-card-light'}`}>
                {attendanceRecords.length === 0 ? (
                    <div className="py-12 text-center">
                        <CheckCircle className={`w-10 h-10 mx-auto mb-3 ${isDark ? 'text-green-500/50' : 'text-green-300'}`} />
                        <p className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No eligible absences</p>
                        <p className={`text-xs mt-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>You have no absences to dispute.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                <FileText className="w-3.5 h-3.5" /> Select Absence Record
                            </label>
                            <select required value={form.attendanceId} onChange={e => setForm({ ...form, attendanceId: e.target.value })} className={inputCls}>
                                <option value="">— Choose an absence date —</option>
                                {attendanceRecords.map(record => (
                                    <option key={record._id} value={record._id}>
                                        {new Date(record.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })} · {record.subjectId?.name || 'Unknown Subject'}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                <MessageSquare className="w-3.5 h-3.5" /> Reason
                            </label>
                            <textarea required rows={3} value={form.changeReason} onChange={e => setForm({ ...form, changeReason: e.target.value })}
                                placeholder="Describe the reason for your absence..." className={`${inputCls} resize-none`} />
                        </div>
                        <div>
                            <label className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                <LinkIcon className="w-3.5 h-3.5" /> Document URL <span className={isDark ? 'text-slate-600' : 'text-slate-300'}>· Optional</span>
                            </label>
                            <input type="url" value={form.documentUrl} onChange={e => setForm({ ...form, documentUrl: e.target.value })}
                                placeholder="https://drive.google.com/..." className={inputCls} />
                        </div>
                        <button type="submit" disabled={submitting}
                            className="btn-shine w-full py-3 text-sm font-bold text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                            {submitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</> : <><Send className="w-4 h-4" /> Submit Correction Request</>}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

/* ─── Leave Request Tab ─── */
const LeaveRequestTab = ({ isDark }) => {
    const [myLeaves, setMyLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [cancelling, setCancelling] = useState(null);
    const [result, setResult] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const today = new Date().toISOString().split('T')[0];

    const [form, setForm] = useState({
        reason: '',
        description: '',
        fromDate: today,
        toDate: today,
        documentUrl: ''
    });

    const fetchLeaves = async () => {
        try {
            const res = await api.get('/leave/my');
            setMyLeaves(res.data.leaves);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchLeaves(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setResult(null);
        try {
            await api.post('/leave', form);
            setResult({ type: 'success', message: 'Leave request submitted! Admin will review it.' });
            setForm({ reason: '', description: '', fromDate: today, toDate: today, documentUrl: '' });
            setShowForm(false);
            fetchLeaves();
        } catch (err) {
            setResult({ type: 'error', message: err.response?.data?.message || 'Failed to submit leave.' });
        } finally { setSubmitting(false); }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Cancel this leave request?')) return;
        setCancelling(id);
        try {
            await api.delete(`/leave/${id}`);
            setMyLeaves(prev => prev.filter(l => l._id !== id));
        } catch (err) {
            setResult({ type: 'error', message: err.response?.data?.message || 'Error cancelling leave.' });
        } finally { setCancelling(null); }
    };

    const inputCls = `w-full px-4 py-3 text-sm rounded-xl outline-none transition-all
        ${isDark
            ? 'glass-input text-white'
            : 'glass-input-light text-slate-800'}`;

    return (
        <div className="space-y-5">
            {result && (
                <div className={`rounded-xl p-4 flex items-start gap-3 animate-fade-in-up border
                    ${result.type === 'success'
                        ? isDark ? 'bg-green-900/20 border-green-700/30 text-green-400' : 'bg-green-50 border-green-200 text-green-700'
                        : isDark ? 'bg-red-900/20 border-red-700/30 text-red-400' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {result.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                    <p className="text-sm font-medium">{result.message}</p>
                    <button onClick={() => setResult(null)} className="ml-auto flex-shrink-0"><X className="w-3.5 h-3.5" /></button>
                </div>
            )}

            {/* New Leave Form */}
            <div className={`rounded-[24px] transition-all overflow-hidden ${isDark ? 'liquid-glass-card' : 'liquid-glass-card-light'}`}>
                <button
                    onClick={() => setShowForm(v => !v)}
                    className="w-full flex items-center justify-between px-6 py-4 text-sm font-bold transition-all"
                    style={{ color: '#6366f1' }}
                >
                    <span className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4" />
                        Apply for Leave
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-lg transition-all ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-50'}`}>
                        {showForm ? 'Close' : 'New Request'}
                    </span>
                </button>

                {showForm && (
                    <form onSubmit={handleSubmit} className={`px-6 pb-6 space-y-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className={`text-xs font-semibold uppercase tracking-wider mb-2 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Reason for Leave</label>
                                <select required value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} className={inputCls}>
                                    <option value="">— Select reason —</option>
                                    {Object.entries(REASON_LABELS).map(([val, { label, emoji }]) => (
                                        <option key={val} value={val}>{emoji} {label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={`text-xs font-semibold uppercase tracking-wider mb-2 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>From Date</label>
                                <input type="date" required min={today} value={form.fromDate}
                                    onChange={e => setForm({ ...form, fromDate: e.target.value })} className={inputCls} />
                            </div>
                            <div>
                                <label className={`text-xs font-semibold uppercase tracking-wider mb-2 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>To Date</label>
                                <input type="date" required min={form.fromDate} value={form.toDate}
                                    onChange={e => setForm({ ...form, toDate: e.target.value })} className={inputCls} />
                            </div>
                            <div className="sm:col-span-2">
                                <label className={`text-xs font-semibold uppercase tracking-wider mb-2 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Description</label>
                                <textarea required rows={3} value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    placeholder="E.g. Participating in Smart India Hackathon 2025 at VIT Chennai..."
                                    className={`${inputCls} resize-none`} />
                            </div>
                            <div className="sm:col-span-2">
                                <label className={`text-xs font-semibold uppercase tracking-wider mb-2 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Supporting Document URL <span className={isDark ? 'text-slate-600' : 'text-slate-300'}>· Optional</span>
                                </label>
                                <input type="url" value={form.documentUrl}
                                    onChange={e => setForm({ ...form, documentUrl: e.target.value })}
                                    placeholder="https://drive.google.com/... (permission letter, hall ticket, etc.)"
                                    className={inputCls} />
                            </div>
                        </div>
                        <button type="submit" disabled={submitting}
                            className="btn-shine w-full py-3 text-sm font-bold text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
                            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                            {submitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</> : <><Send className="w-4 h-4" /> Submit Leave Request</>}
                        </button>
                    </form>
                )}
            </div>

            {/* My Leave History */}
            <div className={`rounded-[24px] transition-all ${isDark ? 'liquid-glass-card' : 'liquid-glass-card-light'}`}>
                <div className={`px-6 py-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                    <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>My Leave Requests</h3>
                </div>
                {loading ? (
                    <div className="p-6 space-y-3">{[1,2].map(i => <div key={i} className="h-20 rounded-xl skeleton" />)}</div>
                ) : myLeaves.length === 0 ? (
                    <div className="py-12 text-center">
                        <Briefcase className={`w-10 h-10 mx-auto mb-3 ${isDark ? 'text-slate-700' : 'text-slate-200'}`} />
                        <p className={`text-sm font-semibold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>No leave requests yet</p>
                        <p className={`text-xs mt-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Click "Apply for Leave" above to get started.</p>
                    </div>
                ) : (
                    <div className="divide-y" style={{ borderColor: isDark ? 'rgba(51,65,85,0.4)' : 'rgba(241,245,249,1)' }}>
                        {myLeaves.map(leave => {
                            const st = statusConfig[leave.status];
                            const r = REASON_LABELS[leave.reason] || { label: leave.reason, emoji: '📋' };
                            return (
                                <div key={leave._id} className="px-6 py-4 flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <span className="text-base">{r.emoji}</span>
                                            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{r.label}</span>
                                            <span className="text-xs px-2 py-0.5 rounded-lg font-bold"
                                                style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                                                {st.label}
                                            </span>
                                        </div>
                                        <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                            {new Date(leave.fromDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })} →{' '}
                                            {new Date(leave.toDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </p>
                                        <p className={`text-xs truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{leave.description}</p>
                                        {leave.adminComment && (
                                            <p className={`text-xs mt-1.5 italic px-2 py-1 rounded-lg ${isDark ? 'bg-slate-900/50 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                                                💬 "{leave.adminComment}"
                                            </p>
                                        )}
                                        {/* Document verification badge */}
                                        {leave.documentUrl && (
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Document:</span>
                                                {leave.documentVerified === true ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                                                        style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
                                                        <ShieldCheck className="w-3 h-3" /> Verified by Admin
                                                    </span>
                                                ) : leave.documentVerified === false ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                                                        style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                                                        <ShieldX className="w-3 h-3" /> Not Accepted
                                                    </span>
                                                ) : (
                                                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                                                        <Shield className="w-3 h-3" /> Pending Verification
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {leave.status === 'pending' && (
                                        <button
                                            onClick={() => handleCancel(leave._id)}
                                            disabled={cancelling === leave._id}
                                            className={`flex-shrink-0 p-2 rounded-xl text-xs font-semibold transition-all ${isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'}`}
                                            title="Cancel request"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

/* ─── Main Request Page with Tabs ────────────────────────────────────────── */
const Request = () => {
    const [activeTab, setActiveTab] = useState('leave');
    const { theme } = useContext(ThemeContext);
    const isDark = theme === 'dark';

    const tabs = [
        { id: 'leave',       label: '🗓️ Leave Request',         desc: 'Inform admin about planned absences' },
        { id: 'correction',  label: '✏️ Attendance Correction',  desc: 'Dispute a recorded absence' },
    ];

    return (
        <div className="max-w-2xl space-y-6 animate-fade-in-up">
            {/* Tab switcher */}
            <div className={`rounded-[20px] p-1.5 flex gap-1.5 transition-all ${isDark ? 'liquid-glass-card' : 'liquid-glass-card-light'}`}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 text-left
                            ${activeTab === tab.id
                                ? isDark ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-800 shadow-md'
                                : isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <div>{tab.label}</div>
                        <div className={`text-[10px] font-normal mt-0.5 ${activeTab === tab.id ? 'opacity-70' : 'opacity-50'}`}>{tab.desc}</div>
                    </button>
                ))}
            </div>

            {/* Tab content */}
            {activeTab === 'leave'
                ? <LeaveRequestTab isDark={isDark} />
                : <AttendanceCorrectionTab isDark={isDark} />
            }
        </div>
    );
};

export default Request;
