import React, { useState, useEffect, useContext, useCallback } from 'react';
import api from '../../api/axios';
import { CheckCircle2, Circle, History, ClipboardList, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';

/* ─── Correct Attendance Tab ─────────────────────────────────────────────── */
const CorrectAttendanceTab = ({ subjects, isDark, cardCls, inputCls, labelCls }) => {
    const today = new Date().toISOString().split('T')[0];
    const [date, setDate]             = useState(today);
    const [subjectId, setSubjectId]   = useState('');
    const [startTime, setStartTime]   = useState('');
    const [endTime, setEndTime]       = useState('');
    const [records, setRecords]       = useState([]);
    const [fetching, setFetching]     = useState(false);
    const [correcting, setCorrecting] = useState(null); // id being saved
    const [toast, setToast]           = useState('');
    const [hasFetched, setHasFetched] = useState(false);

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

    const fetchSession = async () => {
        if (!subjectId) { showToast('Please select a subject first.'); return; }
        setFetching(true);
        setHasFetched(false);
        try {
            const params = new URLSearchParams({ date, subjectId });
            if (startTime) params.set('startTime', startTime);
            if (endTime)   params.set('endTime',   endTime);
            const res = await api.get(`/admin/attendance/session?${params}`);
            setRecords(res.data.data);
            setHasFetched(true);
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to load session records.');
        } finally {
            setFetching(false);
        }
    };

    const correct = async (record, newStatus) => {
        setCorrecting(record._id);
        try {
            await api.patch(`/admin/attendance/${record._id}/correct`, { status: newStatus });
            setRecords(prev => prev.map(r => r._id === record._id ? { ...r, status: newStatus } : r));
            showToast(`✓ ${record.studentId?.name}'s attendance corrected to ${newStatus.toUpperCase()}`);
        } catch (err) {
            showToast(err.response?.data?.message || 'Correction failed.');
        } finally {
            setCorrecting(null);
        }
    };

    const presentCount = records.filter(r => r.status === 'present').length;
    const absentCount  = records.filter(r => r.status === 'absent').length;

    return (
        <div className="space-y-5">
            {/* Toast */}
            {toast && (
                <div className="flex items-center gap-2 p-3.5 rounded-xl text-sm font-medium animate-fade-in-up"
                    style={{ background: isDark ? 'rgba(99,102,241,0.12)' : '#eef2ff', color: isDark ? '#a5b4fc' : '#4338ca', border: `1px solid ${isDark ? 'rgba(99,102,241,0.25)' : 'rgba(165,180,252,0.5)'}` }}>
                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {toast}
                </div>
            )}

            {/* Session Picker */}
            <div className={`p-6 rounded-2xl transition-all ${cardCls}`}>
                <h3 className={`text-base font-bold mb-5 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <History className="w-4 h-4 text-indigo-500" />
                    Look Up Past Session
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                    <div>
                        <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Date</label>
                        <input type="date" max={today} value={date}
                            onChange={e => setDate(e.target.value)}
                            className={`w-full px-4 py-2.5 rounded-xl outline-none transition-all ${inputCls}`} />
                    </div>
                    <div>
                        <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Subject</label>
                        <select value={subjectId} onChange={e => setSubjectId(e.target.value)}
                            className={`w-full px-4 py-2.5 rounded-xl outline-none transition-all ${inputCls}`}>
                            <option value="">Select Subject</option>
                            {subjects.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Start Time (optional)</label>
                        <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)}
                            className={`w-full px-4 py-2.5 rounded-xl outline-none transition-all ${inputCls}`} />
                    </div>
                    <div>
                        <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>End Time (optional)</label>
                        <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)}
                            className={`w-full px-4 py-2.5 rounded-xl outline-none transition-all ${inputCls}`} />
                    </div>
                </div>
                <button onClick={fetchSession} disabled={fetching}
                    className="btn-shine flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                    {fetching
                        ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : <Search className="w-4 h-4" />}
                    {fetching ? 'Loading...' : 'Load Session'}
                </button>
            </div>

            {/* Records Table */}
            {hasFetched && (
                <div className={`rounded-2xl overflow-hidden transition-all ${cardCls}`}>
                    <div className={`px-6 py-4 border-b flex items-center justify-between ${isDark ? 'border-white/10' : 'border-slate-200/50'}`}>
                        <div>
                            <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {records.length === 0 ? 'No records found for this session' : `${records.length} student${records.length !== 1 ? 's' : ''} in this session`}
                            </h3>
                            {records.length > 0 && (
                                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                    <span className="text-emerald-500 font-bold">{presentCount} present</span>
                                    {' · '}
                                    <span className="text-red-500 font-bold">{absentCount} absent</span>
                                </p>
                            )}
                        </div>
                        {records.length > 0 && (
                            <span className={`text-xs px-3 py-1 rounded-lg font-semibold ${isDark ? 'bg-amber-900/20 text-amber-400 border border-amber-800/30' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
                                Click a row to correct it
                            </span>
                        )}
                    </div>

                    {records.length === 0 ? (
                        <div className="py-16 text-center">
                            <ClipboardList className={`w-10 h-10 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                            <p className={`text-sm font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                No attendance was recorded for this session.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'bg-white/5 backdrop-blur-md text-slate-400 border-b border-white/10' : 'bg-slate-50/50 backdrop-blur-md text-slate-500 border-b border-slate-200/50'}`}>
                                        <th className="px-6 py-3.5 text-left">Student</th>
                                        <th className="px-6 py-3.5 text-left">Roll No</th>
                                        <th className="px-6 py-3.5 text-left">Branch</th>
                                        <th className="px-6 py-3.5 text-left">Current Status</th>
                                        <th className="px-6 py-3.5 text-left">Correct To</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y" style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                                    {records.map(record => {
                                        const isPresent   = record.status === 'present';
                                        const isSaving    = correcting === record._id;
                                        const newStatus   = isPresent ? 'absent' : 'present';
                                        return (
                                            <tr key={record._id} className={`transition-all group ${isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-slate-50/60'}`}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                                            style={{ background: isPresent ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                                                            {record.studentId?.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                                            {record.studentId?.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-sm font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                        {record.studentId?.rollNumber}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-xs px-2.5 py-1 rounded-lg font-bold ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                                        {record.studentId?.branch || '—'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold`}
                                                        style={{
                                                            background: isPresent ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                                                            color: isPresent ? '#10b981' : '#ef4444',
                                                            border: `1px solid ${isPresent ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                                                        }}>
                                                        {isPresent ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                                                        {isPresent ? 'Present' : 'Absent'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        disabled={isSaving}
                                                        onClick={() => correct(record, newStatus)}
                                                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
                                                        style={{
                                                            background: newStatus === 'absent' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                                                            color: newStatus === 'absent' ? '#ef4444' : '#10b981',
                                                            border: `1px solid ${newStatus === 'absent' ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
                                                        }}>
                                                        {isSaving
                                                            ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                            : newStatus === 'absent' ? <Circle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                                        Mark {newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

/* ─── Main MarkAttendance Page ───────────────────────────────────────────── */
const MarkAttendance = () => {
    const { theme } = useContext(ThemeContext);
    const isDark = theme === 'dark';
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);

    // Active tab: 'mark' | 'correct'
    const [activeTab, setActiveTab] = useState('mark');

    // Mark Attendance filters
    const [selectedDate, setSelectedDate]       = useState(new Date().toISOString().split('T')[0]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedBranch, setSelectedBranch]   = useState('');
    const [startTime, setStartTime]             = useState('09:00');
    const [endTime, setEndTime]                 = useState('10:00');

    const [attendanceMap, setAttendanceMap] = useState({});
    const [loading, setLoading]     = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [markToast, setMarkToast]   = useState('');

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [studRes, subRes] = await Promise.all([
                    api.get('/admin/students'),
                    api.get('/admin/subjects')
                ]);
                setStudents(studRes.data.data);
                setSubjects(subRes.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    const uniqueBranches = Array.from(new Set(students.map(s => s.branch || 'General')));

    const filteredStudents = students.filter(s => {
        if (selectedBranch && selectedBranch !== 'All') return (s.branch || 'General') === selectedBranch;
        return true;
    });

    useEffect(() => {
        const initialMap = {};
        filteredStudents.forEach(s => { initialMap[s._id] = 'present'; });
        setAttendanceMap(initialMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBranch, students.length]);

    const toggleAttendance = (studentId) => {
        setAttendanceMap(prev => ({
            ...prev,
            [studentId]: prev[studentId] === 'present' ? 'absent' : 'present'
        }));
    };

    const markAllAs = (status) => {
        const newMap = {};
        filteredStudents.forEach(s => { newMap[s._id] = status; });
        setAttendanceMap(newMap);
    };

    const handleSubmit = async () => {
        if (!selectedSubject) { setMarkToast('Please select a subject first.'); setTimeout(() => setMarkToast(''), 3000); return; }
        const records = filteredStudents.map(s => ({ studentId: s._id, status: attendanceMap[s._id] || 'present' }));
        if (records.length === 0) { setMarkToast('No students in the list.'); setTimeout(() => setMarkToast(''), 3000); return; }
        setSubmitting(true);
        try {
            await api.post('/attendance/mark-bulk', { subjectId: selectedSubject, date: selectedDate, startTime, endTime, records });
            setMarkToast('✓ Bulk attendance marked successfully!');
            setTimeout(() => setMarkToast(''), 4000);
        } catch (err) {
            setMarkToast(err.response?.data?.message || 'Error marking bulk attendance');
            setTimeout(() => setMarkToast(''), 4000);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="space-y-6">
            <div className="h-14 rounded-2xl skeleton" />
            <div className="h-64 rounded-2xl skeleton" />
        </div>
    );

    const presentCount = Object.values(attendanceMap).filter(v => v === 'present').length;
    const absentCount  = Object.values(attendanceMap).filter(v => v === 'absent').length;

    const cardCls  = isDark ? 'liquid-glass-card' : 'liquid-glass-card-light';
    const inputCls = isDark ? 'glass-input text-white' : 'glass-input-light text-slate-800';
    const labelCls = isDark ? 'text-slate-400' : 'text-slate-500';

    return (
        <div className="space-y-6 transition-all animate-fade-in-up">
            {/* Tab Switcher */}
            <div className={`p-1.5 rounded-2xl flex gap-1.5 w-fit ${isDark ? 'bg-slate-900/60 border border-white/10' : 'bg-slate-100/80 border border-slate-200/50'}`}>
                {[
                    { id: 'mark',    label: 'Mark Attendance',   icon: ClipboardList },
                    { id: 'correct', label: 'Correct Attendance', icon: History },
                ].map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                isActive
                                    ? 'text-white shadow-lg'
                                    : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
                            }`}
                            style={isActive ? { background: 'linear-gradient(135deg, #6366f1, #4f46e5)' } : {}}>
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* ── MARK TAB ────────────────────────────────────────────── */}
            {activeTab === 'mark' && (
                <div className="space-y-6 animate-slide-in-right">
                    {markToast && (
                        <div className="flex items-center gap-2 p-3.5 rounded-xl text-sm font-medium animate-fade-in-up"
                            style={{ background: isDark ? 'rgba(99,102,241,0.12)' : '#eef2ff', color: isDark ? '#a5b4fc' : '#4338ca', border: `1px solid ${isDark ? 'rgba(99,102,241,0.25)' : 'rgba(165,180,252,0.5)'}` }}>
                            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {markToast}
                        </div>
                    )}

                    {/* Control Panel */}
                    <div className={`p-6 rounded-2xl transition-all ${cardCls}`}>
                        <h3 className={`text-base font-bold mb-5 ${isDark ? 'text-white' : 'text-slate-800'}`}>Class Attendance Roster</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                                <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Subject</label>
                                <select className={`w-full px-4 py-2.5 rounded-xl outline-none transition-all ${inputCls}`} value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
                                    <option value="">Select Subject</option>
                                    {subjects.map(s => <option key={s._id} value={s._id} className="bg-slate-800">{s.name} ({s.code})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Date</label>
                                <input type="date" className={`w-full px-4 py-2.5 rounded-xl outline-none transition-all ${inputCls}`} value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                            </div>
                            <div>
                                <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Filter by Branch</label>
                                <select className={`w-full px-4 py-2.5 rounded-xl outline-none transition-all ${inputCls}`} value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)}>
                                    <option value="All" className="bg-slate-800">All Branches</option>
                                    {uniqueBranches.map(b => <option key={b} value={b} className="bg-slate-800">{b}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Start Time</label>
                                <input type="time" className={`w-full px-4 py-2.5 rounded-xl outline-none transition-all ${inputCls}`} value={startTime} onChange={e => setStartTime(e.target.value)} />
                            </div>
                            <div>
                                <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>End Time</label>
                                <input type="time" className={`w-full px-4 py-2.5 rounded-xl outline-none transition-all ${inputCls}`} value={endTime} onChange={e => setEndTime(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Student Grid */}
                    <div className={`p-6 rounded-2xl transition-all ${cardCls}`}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                Students ({filteredStudents.length})
                            </h3>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-emerald-500 font-bold">{presentCount} Present</span>
                                <span className="text-sm text-red-500 font-bold">{absentCount} Absent</span>
                                <div className={`hidden sm:flex border-l h-6 mx-2 ${isDark ? 'border-white/10' : 'border-slate-200'}`} />
                                <button onClick={() => markAllAs('present')} className={`text-sm font-bold transition-all hover:scale-105 ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}>Mark All Present</button>
                                <button onClick={() => markAllAs('absent')} className={`text-sm font-bold transition-all hover:scale-105 ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-600'}`}>Mark All Absent</button>
                            </div>
                        </div>

                        {filteredStudents.length === 0 ? (
                            <div className={`py-12 text-center font-semibold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>No students found.</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredStudents.map(student => {
                                    const isPresent = attendanceMap[student._id] === 'present';
                                    return (
                                        <div key={student._id} onClick={() => toggleAttendance(student._id)}
                                            className={`relative p-4 rounded-[20px] border cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 select-none flex items-center justify-between
                                                ${isPresent
                                                    ? isDark ? 'border-emerald-500/50 bg-emerald-500/10 shadow-[0_4px_20px_rgba(16,185,129,0.15)]' : 'border-emerald-200 bg-emerald-50 shadow-sm'
                                                    : isDark ? 'border-red-500/40 bg-red-500/10 shadow-[0_4px_20px_rgba(239,68,68,0.15)]' : 'border-red-200 bg-red-50 shadow-sm'
                                                }`}>
                                            <div>
                                                <p className={`font-bold text-sm ${isPresent ? isDark ? 'text-emerald-400' : 'text-emerald-700' : isDark ? 'text-red-400' : 'text-red-700'}`}>
                                                    {student.name}
                                                </p>
                                                <p className={`text-xs font-semibold ${isPresent ? isDark ? 'text-emerald-500/80' : 'text-emerald-600' : isDark ? 'text-red-500/80' : 'text-red-600'}`}>
                                                    {student.rollNumber} &bull; {student.branch || 'General'}
                                                </p>
                                            </div>
                                            <div className="flex-shrink-0 ml-4">
                                                {isPresent
                                                    ? <CheckCircle2 className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`} />
                                                    : <Circle className={`w-6 h-6 ${isDark ? 'text-red-400' : 'text-red-500'}`} />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className={`mt-8 pt-6 border-t ${isDark ? 'border-white/10' : 'border-slate-200/80'}`}>
                            <button onClick={handleSubmit} disabled={submitting || filteredStudents.length === 0}
                                className="btn-liquid btn-shine w-full sm:w-auto px-8 py-3.5 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex justify-center items-center shadow-lg hover:shadow-indigo-500/30"
                                style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                                {submitting ? 'Saving Records...' : 'Submit Attendance For Entire Class'}
                            </button>
                            <p className={`text-xs mt-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                This action will override any existing attendance records for the selected date and subject combination.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ── CORRECT TAB ─────────────────────────────────────────── */}
            {activeTab === 'correct' && (
                <div className="animate-slide-in-right">
                    <CorrectAttendanceTab
                        subjects={subjects}
                        isDark={isDark}
                        cardCls={cardCls}
                        inputCls={inputCls}
                        labelCls={labelCls}
                    />
                </div>
            )}
        </div>
    );
};

export default MarkAttendance;
