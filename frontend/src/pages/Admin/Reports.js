import React, { useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import {
    Download, Filter, RefreshCw, FileText, BarChart2,
    CheckCircle2, XCircle, Search
} from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';

/* ─── CSV generator helper ───────────────────────────────────────────────── */
const generateCSV = (records) => {
    const headers = ['Date', 'Day', 'Student Name', 'Roll Number', 'Branch', 'Subject', 'Subject Code', 'Start Time', 'End Time', 'Status'];
    const rows = records.map(r => [
        new Date(r.date).toLocaleDateString('en-GB'),
        new Date(r.date).toLocaleDateString('en-US', { weekday: 'long' }),
        r.studentId?.name || 'N/A',
        r.studentId?.rollNumber || 'N/A',
        r.studentId?.branch || 'N/A',
        r.subjectId?.name || 'N/A',
        r.subjectId?.code || 'N/A',
        r.startTime || 'N/A',
        r.endTime || 'N/A',
        r.status?.toUpperCase() || 'N/A'
    ]);
    const csvContent = [headers, ...rows].map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    return csvContent;
};

const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/* ─── Summary Pill ───────────────────────────────────────────────────────── */
const SummaryPill = ({ label, value, color, bg, border }) => (
    <div className="flex flex-col items-center px-6 py-3 rounded-xl" style={{ background: bg, border: `1px solid ${border}` }}>
        <span className="text-2xl font-black" style={{ color }}>{value}</span>
        <span className="text-xs font-semibold mt-0.5" style={{ color }}>{label}</span>
    </div>
);

/* ─── Main Reports Page ──────────────────────────────────────────────────── */
const Reports = () => {
    const { theme } = useContext(ThemeContext);
    const isDark = theme === 'dark';

    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [records, setRecords] = useState([]);
    const [summary, setSummary] = useState({ total: 0, present: 0, absent: 0, percentage: 0 });
    const [loading, setLoading] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);

    const today = new Date().toISOString().split('T')[0];
    const [filters, setFilters] = useState({
        startDate: today,
        endDate: today,
        subjectId: '',
        branch: '',
        status: '',
        studentId: ''
    });

    const branches = Array.from(new Set(students.map(s => s.branch).filter(Boolean)));

    useEffect(() => {
        Promise.all([
            api.get('/admin/subjects'),
            api.get('/admin/students')
        ]).then(([subjRes, studRes]) => {
            setSubjects(subjRes.data.data || []);
            setStudents(studRes.data.data || []);
        }).catch(console.error);
    }, []);

    const handleFilter = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
            const res = await api.get(`/admin/report?${params.toString()}`);
            setRecords(res.data.data);
            setSummary(res.data.summary);
            setHasFetched(true);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (records.length === 0) return;
        const csvContent = generateCSV(records);
        const from = filters.startDate || 'all';
        const to = filters.endDate || 'all';
        downloadCSV(csvContent, `attendance_report_${from}_to_${to}.csv`);
    };

    const selectCls = `w-full px-3 py-2 text-sm rounded-xl border outline-none transition-all
        ${isDark ? 'bg-slate-900/80 text-white border-slate-700 focus:border-indigo-500' : 'bg-slate-50 text-slate-700 border-slate-200 focus:border-indigo-400'}`;

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Filter Card */}
            <div className={`rounded-2xl border p-6 transition-all ${isDark ? 'bg-slate-800/70 border-slate-700/50' : 'bg-white border-slate-100 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-5">
                    <Filter className="w-4 h-4 text-indigo-500" />
                    <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>Filter Attendance Records</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className={`text-xs font-semibold uppercase tracking-wider mb-1.5 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>From Date</label>
                        <input type="date" className={selectCls} value={filters.startDate}
                            onChange={e => setFilters(f => ({ ...f, startDate: e.target.value }))} />
                    </div>
                    <div>
                        <label className={`text-xs font-semibold uppercase tracking-wider mb-1.5 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>To Date</label>
                        <input type="date" className={selectCls} value={filters.endDate}
                            min={filters.startDate}
                            onChange={e => setFilters(f => ({ ...f, endDate: e.target.value }))} />
                    </div>
                    <div>
                        <label className={`text-xs font-semibold uppercase tracking-wider mb-1.5 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Subject</label>
                        <select className={selectCls} value={filters.subjectId} onChange={e => setFilters(f => ({ ...f, subjectId: e.target.value }))}>
                            <option value="">All Subjects</option>
                            {subjects.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={`text-xs font-semibold uppercase tracking-wider mb-1.5 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Branch</label>
                        <select className={selectCls} value={filters.branch} onChange={e => setFilters(f => ({ ...f, branch: e.target.value }))}>
                            <option value="">All Branches</option>
                            {branches.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={`text-xs font-semibold uppercase tracking-wider mb-1.5 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Status</label>
                        <select className={selectCls} value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
                            <option value="">All Statuses</option>
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                        </select>
                    </div>
                    <div>
                        <label className={`text-xs font-semibold uppercase tracking-wider mb-1.5 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Student</label>
                        <select className={selectCls} value={filters.studentId} onChange={e => setFilters(f => ({ ...f, studentId: e.target.value }))}>
                            <option value="">All Students</option>
                            {students.map(s => <option key={s._id} value={s._id}>{s.name} — {s.rollNumber}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex gap-3 mt-5">
                    <button onClick={handleFilter} disabled={loading}
                        className="btn-shine flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl disabled:opacity-60"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                        {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
                        {loading ? 'Loading...' : 'Apply Filters'}
                    </button>
                    <button onClick={() => setFilters({ startDate: today, endDate: today, subjectId: '', branch: '', status: '', studentId: '' })}
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all
                            ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                        <RefreshCw className="w-3.5 h-3.5" /> Reset
                    </button>
                    {records.length > 0 && (
                        <button onClick={handleDownload}
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl ml-auto transition-all hover:scale-105"
                            style={{ background: isDark ? 'rgba(16,185,129,0.15)' : '#d1fae5', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
                            <Download className="w-4 h-4" /> Download CSV
                        </button>
                    )}
                </div>
            </div>

            {/* Summary pills */}
            {hasFetched && (
                <div className="flex flex-wrap gap-3">
                    {[
                        { label: 'Total Records', value: summary.total, color: '#6366f1', bg: isDark ? 'rgba(99,102,241,0.1)' : '#eef2ff', border: 'rgba(99,102,241,0.2)' },
                        { label: 'Present', value: summary.present, color: '#10b981', bg: isDark ? 'rgba(16,185,129,0.1)' : '#d1fae5', border: 'rgba(16,185,129,0.2)' },
                        { label: 'Absent', value: summary.absent, color: '#ef4444', bg: isDark ? 'rgba(239,68,68,0.1)' : '#fee2e2', border: 'rgba(239,68,68,0.2)' },
                        { label: 'Attendance %', value: `${summary.percentage}%`, color: '#f59e0b', bg: isDark ? 'rgba(245,158,11,0.1)' : '#fffbeb', border: 'rgba(245,158,11,0.2)' },
                    ].map(s => <SummaryPill key={s.label} {...s} />)}
                </div>
            )}

            {/* Results Table */}
            {hasFetched && (
                <div className={`rounded-2xl border overflow-hidden transition-all ${isDark ? 'bg-slate-800/70 border-slate-700/50' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <div className={`px-6 py-4 flex items-center justify-between border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                        <div className="flex items-center gap-2">
                            <BarChart2 className="w-4 h-4 text-indigo-500" />
                            <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {records.length} record{records.length !== 1 ? 's' : ''} found
                            </span>
                        </div>
                        {records.length > 0 && (
                            <button onClick={handleDownload}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all hover:scale-105
                                    ${isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                                <Download className="w-3 h-3" /> Export CSV
                            </button>
                        )}
                    </div>

                    {records.length === 0 ? (
                        <div className="py-20 text-center">
                            <FileText className={`w-10 h-10 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                            <p className={`text-sm font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>No records match your filters</p>
                            <p className={`text-xs mt-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Try adjusting the date range or removing some filters</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className={`border-b text-xs font-semibold uppercase tracking-wider ${isDark ? 'border-slate-700 bg-slate-900/30 text-slate-500' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>
                                        {['Date', 'Student', 'Branch', 'Subject', 'Time Slot', 'Status'].map(h => (
                                            <th key={h} className="px-5 py-3.5 text-left">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y" style={{ borderColor: isDark ? 'rgba(51,65,85,0.4)' : 'rgba(241,245,249,1)' }}>
                                    {records.map(r => (
                                        <tr key={r._id} className="table-row-hover">
                                            <td className="px-5 py-3.5 whitespace-nowrap">
                                                <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                                    {new Date(r.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </div>
                                                <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                    {new Date(r.date).toLocaleDateString('en-US', { weekday: 'long' })}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 whitespace-nowrap">
                                                <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{r.studentId?.name || 'N/A'}</div>
                                                <div className={`text-xs font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{r.studentId?.rollNumber}</div>
                                            </td>
                                            <td className="px-5 py-3.5 whitespace-nowrap">
                                                <span className={`text-xs px-2 py-0.5 rounded font-semibold ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                                    {r.studentId?.branch || '—'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 whitespace-nowrap">
                                                <div className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{r.subjectId?.name || 'N/A'}</div>
                                                <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{r.subjectId?.code}</div>
                                            </td>
                                            <td className="px-5 py-3.5 whitespace-nowrap">
                                                <span className={`text-xs font-mono ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                                    {r.startTime || '—'} {r.endTime ? `→ ${r.endTime}` : ''}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 whitespace-nowrap">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold`}
                                                    style={{
                                                        color: r.status === 'present' ? '#10b981' : '#ef4444',
                                                        background: r.status === 'present' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                                        border: `1px solid ${r.status === 'present' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`
                                                    }}>
                                                    {r.status === 'present'
                                                        ? <CheckCircle2 style={{ width: 12, height: 12 }} />
                                                        : <XCircle style={{ width: 12, height: 12 }} />}
                                                    {r.status?.charAt(0).toUpperCase() + r.status?.slice(1)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {!hasFetched && (
                <div className={`rounded-2xl p-16 text-center border ${isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <BarChart2 className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-indigo-500/40' : 'text-indigo-300'}`} />
                    <p className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Set your filters and click "Apply Filters"</p>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Filter by date range, subject, branch, or student, then export to CSV.</p>
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {[['Date Range', '#6366f1'], ['Subject Filter', '#8b5cf6'], ['Branch Filter', '#06b6d4'], ['CSV Export', '#10b981']].map(([label, color]) => (
                            <span key={label} className="text-xs font-semibold px-3 py-1 rounded-full"
                                style={{ background: `${color}18`, color }}>{label}</span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;
