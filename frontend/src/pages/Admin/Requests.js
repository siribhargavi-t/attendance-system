import React, { useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import { Check, X, User, BookOpen, Calendar, ExternalLink, RefreshCw, Inbox, CalendarDays, MessageCircle, ShieldCheck, ShieldX, Shield } from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';

const REASON_LABELS = {
    'hackathon':        { label: 'Hackathon',              emoji: '💻' },
    'nptel-exam':       { label: 'NPTEL / Online Exam',    emoji: '📝' },
    'internship':       { label: 'Internship',             emoji: '🏢' },
    'medical':          { label: 'Medical',                emoji: '🏥' },
    'family-emergency': { label: 'Family Emergency',       emoji: '🏠' },
    'sports-event':     { label: 'Sports / Cultural Event',emoji: '🏆' },
    'other':            { label: 'Other',                  emoji: '📋' },
};

/* ─── Attendance Correction Requests ─────────────────────────────────────── */
const AttendanceCorrectionPanel = ({ isDark }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/attendance');
            setRequests(res.data.data.filter(att => att.changeRequest === true && att.requestStatus === 'pending'));
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchRequests(); }, []);

    const handleReview = async (id, action) => {
        setProcessing(id + action);
        try {
            await api.post('/attendance/review-request', { id, action });
            setRequests(prev => prev.filter(r => r._id !== id));
        } catch (err) { console.error(err); }
        finally { setProcessing(null); }
    };

    if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-36 rounded-2xl skeleton" />)}</div>;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                {requests.length > 0 && (
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                        {requests.length} request{requests.length !== 1 ? 's' : ''} pending
                    </span>
                )}
                <button onClick={fetchRequests}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105 ml-auto
                        ${isDark ? 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700' : 'bg-white text-slate-500 hover:text-slate-700 border border-slate-200 shadow-sm'}`}>
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
            </div>

            {requests.length === 0 ? (
                <div className={`rounded-[24px] p-16 text-center transition-all ${isDark ? 'liquid-glass-card' : 'liquid-glass-card-light'}`}>
                    <Inbox className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-200'}`} />
                    <p className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>All caught up!</p>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>No pending attendance corrections.</p>
                </div>
            ) : (
                <div className={`rounded-[24px] transition-all overflow-hidden ${isDark ? 'liquid-glass-card' : 'liquid-glass-card-light'}`}>
                    <div className="divide-y" style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                    {requests.map(req => (
                        <div key={req._id} className="p-6 table-row-hover transition-all animate-fade-in-up">
                            <div className="flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
                                <div className="flex-1 min-w-0 space-y-3">
                                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg" style={{ background: isDark ? 'rgba(99,102,241,0.1)' : '#eef2ff' }}>
                                                <User className="w-3.5 h-3.5 text-indigo-500" />
                                            </div>
                                            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{req.studentId?.name}</span>
                                            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>· {req.studentId?.rollNumber}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg" style={{ background: isDark ? 'rgba(6,182,212,0.1)' : '#e0f9ff' }}>
                                                <BookOpen className="w-3.5 h-3.5 text-cyan-500" />
                                            </div>
                                            <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{req.subjectId?.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg" style={{ background: isDark ? 'rgba(245,158,11,0.1)' : '#fffbeb' }}>
                                                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                                            </div>
                                            <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                                {new Date(req.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`p-3 rounded-xl text-sm ${isDark ? 'bg-slate-900/50 text-slate-300 border border-slate-700/30' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}>
                                        <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Reason</p>
                                        {req.changeReason}
                                    </div>
                                    {req.documentUrl && (
                                        <a href={req.documentUrl} target="_blank" rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-500 hover:text-indigo-400 transition-colors">
                                            <ExternalLink className="w-3.5 h-3.5" /> View Document
                                        </a>
                                    )}
                                </div>
                                <div className="flex gap-2.5 flex-shrink-0">
                                    <button onClick={() => handleReview(req._id, 'approved')} disabled={!!processing}
                                        className="btn-shine flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white rounded-xl disabled:opacity-60"
                                        style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                                        {processing === req._id + 'approved'
                                            ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            : <Check className="w-3.5 h-3.5" />}
                                        Approve
                                    </button>
                                    <button onClick={() => handleReview(req._id, 'rejected')} disabled={!!processing}
                                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-xl disabled:opacity-60 hover:scale-105 transition-all"
                                        style={{ background: isDark ? 'rgba(239,68,68,0.1)' : '#fee2e2', color: '#ef4444', border: `1px solid ${isDark ? 'rgba(239,68,68,0.25)' : 'rgba(254,202,202,1)'}` }}>
                                        {processing === req._id + 'rejected'
                                            ? <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                                            : <X className="w-3.5 h-3.5" />}
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            )}
        </div>
    );
};

/* ─── Leave Requests Panel ────────────────────────────────────────────────── */
const LeaveRequestsPanel = ({ isDark }) => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);
    const [commentModal, setCommentModal] = useState(null); // { id, action }
    const [adminComment, setAdminComment] = useState('');
    const [filterStatus, setFilterStatus] = useState('pending');
    const [verifyingDoc, setVerifyingDoc] = useState(null); // leave id being verified

    const handleVerifyDoc = async (id, verified) => {
        setVerifyingDoc(id);
        try {
            await api.put(`/leave/${id}/verify-document`, { verified });
            setLeaves(prev => prev.map(l => l._id === id ? { ...l, documentVerified: verified, documentVerifiedAt: new Date() } : l));
        } catch (err) { console.error(err); }
        finally { setVerifyingDoc(null); }
    };

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/leave/all?status=${filterStatus}`);
            setLeaves(res.data.leaves);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchLeaves(); }, [filterStatus]);

    const openReview = (id, action) => {
        setAdminComment('');
        setCommentModal({ id, action });
    };

    const confirmReview = async () => {
        if (!commentModal) return;
        setProcessing(commentModal.id + commentModal.action);
        try {
            await api.put(`/leave/${commentModal.id}/review`, { action: commentModal.action, adminComment });
            setLeaves(prev => prev.filter(l => l._id !== commentModal.id));
            setCommentModal(null);
        } catch (err) { console.error(err); }
        finally { setProcessing(null); }
    };



    return (
        <div className="space-y-4">
            {/* Filter + refresh row */}
            <div className="flex items-center justify-between gap-3">
                <div className={`flex items-center gap-1 p-1.5 rounded-2xl ${isDark ? 'liquid-glass-card' : 'liquid-glass-card-light'}`}>
                    {['pending', 'approved', 'rejected'].map(s => {
                        return (
                            <button key={s} onClick={() => setFilterStatus(s)}
                                className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize transition-all
                                    ${filterStatus === s
                                        ? isDark ? 'bg-slate-700 text-white shadow' : 'bg-white text-slate-800 shadow'
                                        : isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}>
                                {s}
                            </button>
                        );
                    })}
                </div>
                <button onClick={fetchLeaves}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105
                        ${isDark ? 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700' : 'bg-white text-slate-500 hover:text-slate-700 border border-slate-200 shadow-sm'}`}>
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
            </div>

            {loading ? (
                <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-32 rounded-2xl skeleton" />)}</div>
            ) : leaves.length === 0 ? (
                <div className={`rounded-[24px] p-16 text-center transition-all ${isDark ? 'liquid-glass-card' : 'liquid-glass-card-light'}`}>
                    <CalendarDays className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-200'}`} />
                    <p className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No {filterStatus} leave requests</p>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>All {filterStatus} requests will appear here.</p>
                </div>
            ) : (
                <div className={`rounded-[24px] transition-all overflow-hidden ${isDark ? 'liquid-glass-card' : 'liquid-glass-card-light'}`}>
                    <div className="divide-y" style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                    {leaves.map(leave => {
                        const r = REASON_LABELS[leave.reason] || { label: leave.reason, emoji: '📋' };
                        const duration = Math.max(1, Math.round((new Date(leave.toDate) - new Date(leave.fromDate)) / (1000 * 60 * 60 * 24)) + 1);
                        return (
                            <div key={leave._id} className="p-6 table-row-hover transition-all animate-fade-in-up">
                                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                                    <div className="flex-1 min-w-0 space-y-2">
                                        {/* Student + reason row */}
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white flex-shrink-0"
                                                style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                                                {leave.studentId?.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{leave.studentId?.name}</span>
                                                    <span className={`text-xs font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{leave.studentId?.rollNumber}</span>
                                                    <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{leave.studentId?.branch}</span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-sm">{r.emoji}</span>
                                                    <span className={`text-xs font-semibold ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>{r.label}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Date range */}
                                        <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                            <CalendarDays className="w-3.5 h-3.5" />
                                            <span className="font-semibold">
                                                {new Date(leave.fromDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })} → {new Date(leave.toDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                            <span className={`px-1.5 py-0.5 rounded font-bold ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{duration} day{duration !== 1 ? 's' : ''}</span>
                                        </div>

                                        {/* Description */}
                                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{leave.description}</p>

                                        {/* Document */}
                                        {/* Document + Verification */}
                                        {leave.documentUrl && (
                                            <div className="flex flex-wrap items-center gap-3">
                                                <a href={leave.documentUrl} target="_blank" rel="noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-500 hover:text-indigo-400">
                                                    <ExternalLink className="w-3.5 h-3.5" /> View Supporting Document
                                                </a>
                                                {/* Verification badge / buttons */}
                                                {leave.documentVerified === true ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                                                        style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
                                                        <ShieldCheck className="w-3 h-3" /> Verified
                                                    </span>
                                                ) : leave.documentVerified === false ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                                                        style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                                                        <ShieldX className="w-3 h-3" /> Not Legitimate
                                                    </span>
                                                ) : (
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                                                            <Shield className="w-3 h-3" /> Unreviewed
                                                        </span>
                                                        <button onClick={() => handleVerifyDoc(leave._id, true)}
                                                            disabled={!!verifyingDoc}
                                                            className="text-[10px] font-bold px-2 py-0.5 rounded-full transition-all hover:scale-105"
                                                            style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
                                                            ✓ Verify
                                                        </button>
                                                        <button onClick={() => handleVerifyDoc(leave._id, false)}
                                                            disabled={!!verifyingDoc}
                                                            className="text-[10px] font-bold px-2 py-0.5 rounded-full transition-all hover:scale-105"
                                                            style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' }}>
                                                            ✗ Reject Doc
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Admin comment if already reviewed */}
                                        {leave.adminComment && (
                                            <p className={`text-xs italic px-2 py-1.5 rounded-lg ${isDark ? 'bg-slate-900/50 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                                                💬 "{leave.adminComment}"
                                            </p>
                                        )}
                                    </div>

                                    {/* Actions (only for pending) */}
                                    {filterStatus === 'pending' && (
                                        <div className="flex gap-2.5 flex-shrink-0">
                                            <button onClick={() => openReview(leave._id, 'approved')}
                                                disabled={!!processing}
                                                className="btn-shine flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white rounded-xl disabled:opacity-60"
                                                style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                                                <Check className="w-3.5 h-3.5" /> Approve
                                            </button>
                                            <button onClick={() => openReview(leave._id, 'rejected')}
                                                disabled={!!processing}
                                                className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-xl disabled:opacity-60 hover:scale-105 transition-all"
                                                style={{ background: isDark ? 'rgba(239,68,68,0.1)' : '#fee2e2', color: '#ef4444', border: `1px solid ${isDark ? 'rgba(239,68,68,0.25)' : 'rgba(254,202,202,1)'}` }}>
                                                <X className="w-3.5 h-3.5" /> Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    </div>
                </div>
            )}

            {/* Review Comment Modal */}
            {commentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
                    onClick={() => setCommentModal(null)}>
                    <div className={`w-full max-w-md rounded-[28px] overflow-hidden shadow-2xl ${isDark ? 'liquid-glass-modal' : 'liquid-glass-modal-light'}`}
                        onClick={e => e.stopPropagation()}>
                        <div className={`px-6 py-4 border-b ${isDark ? 'border-white/10' : 'border-slate-200/50'} flex items-center gap-3`}>
                            <div className="p-2 rounded-xl" style={{ background: commentModal.action === 'approved' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' }}>
                                {commentModal.action === 'approved'
                                    ? <Check className="w-5 h-5 text-emerald-500" />
                                    : <X className="w-5 h-5 text-red-500" />}
                            </div>
                            <div>
                                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    {commentModal.action === 'approved' ? 'Approve Leave Request' : 'Reject Leave Request'}
                                </h3>
                                <p className={`text-xs font-semibold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Add a comment for the student (optional)</p>
                            </div>
                            <button onClick={() => setCommentModal(null)} className={`ml-auto p-2 rounded-xl transition-all hover:scale-110 ${isDark ? 'text-white hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'}`}><X className="w-4 h-4" /></button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="flex items-center gap-2">
                                <MessageCircle className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                                <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Admin Comment (Optional)</span>
                            </div>
                            <textarea rows={3} value={adminComment} onChange={e => setAdminComment(e.target.value)}
                                placeholder={commentModal.action === 'approved'
                                    ? 'E.g. Great initiative! Approved. Please attend make-up sessions if any.'
                                    : 'E.g. Insufficient documentation provided. Please resubmit with a proper letter.'}
                                className={`w-full px-4 py-3 text-sm rounded-xl outline-none transition-all
                                    ${isDark
                                        ? 'glass-input text-white'
                                        : 'glass-input-light text-slate-800'}`} />
                            <div className="flex gap-3">
                                <button onClick={() => setCommentModal(null)}
                                    className={`flex-1 py-2.5 text-sm font-semibold rounded-xl ${isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                    Cancel
                                </button>
                                <button onClick={confirmReview} disabled={!!processing}
                                    className="flex-1 py-2.5 text-sm font-bold text-white rounded-xl disabled:opacity-60 btn-shine"
                                    style={{ background: commentModal.action === 'approved' ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#ef4444,#dc2626)' }}>
                                    {processing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : `Confirm ${commentModal.action === 'approved' ? 'Approval' : 'Rejection'}`}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ─── Main Requests Page with Tabs ───────────────────────────────────────── */
const Requests = () => {
    const [activeTab, setActiveTab] = useState('leaves');
    const { theme } = useContext(ThemeContext);
    const isDark = theme === 'dark';

    const [leavePendingCount, setLeavePendingCount] = useState(0);
    const [correctionPendingCount, setCorrectionPendingCount] = useState(0);

    // Fetch pending counts for badge
    useEffect(() => {
        api.get('/leave/all?status=pending').then(r => setLeavePendingCount(r.data.leaves.length)).catch(() => {});
        api.get('/admin/attendance').then(r => {
            const pending = r.data.data.filter(a => a.changeRequest && a.requestStatus === 'pending').length;
            setCorrectionPendingCount(pending);
        }).catch(() => {});
    }, []);

    const tabs = [
        { id: 'leaves',      label: 'Leave Requests',        count: leavePendingCount,      color: '#10b981' },
        { id: 'corrections', label: 'Attendance Corrections', count: correctionPendingCount, color: '#f59e0b' },
    ];

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Tab bar */}
            <div className={`flex gap-1.5 p-1.5 rounded-2xl ${isDark ? 'liquid-glass-card' : 'liquid-glass-card-light'}`}>
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-bold transition-all duration-200
                            ${activeTab === tab.id
                                ? isDark ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-800 shadow-md'
                                : isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}>
                        {tab.label}
                        {tab.count > 0 && (
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center text-white"
                                style={{ background: activeTab === tab.id ? 'rgba(255,255,255,0.25)' : tab.color }}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Panels with slide transitions */}
            <div className="relative">
                {activeTab === 'leaves' ? (
                    <div key="leaves" className="animate-slide-in-right">
                        <LeaveRequestsPanel isDark={isDark} />
                    </div>
                ) : (
                    <div key="corrections" className="animate-slide-in-left">
                        <AttendanceCorrectionPanel isDark={isDark} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Requests;
