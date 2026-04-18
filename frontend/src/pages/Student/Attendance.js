import React, { useState, useEffect, useCallback, useContext } from 'react';
import api from '../../api/axios';
import { RefreshCw, Calendar, BookOpen, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';

const statusConfig = {
  present: { label: 'Present', color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', icon: CheckCircle2 },
  absent: { label: 'Absent', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)', icon: XCircle },
};

const requestStatusConfig = {
  none: { label: '—', color: '#64748b' },
  pending: { label: 'Pending', color: '#f59e0b' },
  approved: { label: 'Approved', color: '#10b981' },
  rejected: { label: 'Rejected', color: '#ef4444' },
};

const AttendanceView = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const fetchAttendance = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await api.get('/student/attendance');
      setAttendance(res.data.attendance);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchAttendance(); }, [fetchAttendance]);

  const filtered = filterStatus === 'all' ? attendance : attendance.filter(r => r.status === filterStatus);
  const presentCount = attendance.filter(r => r.status === 'present').length;
  const absentCount = attendance.filter(r => r.status === 'absent').length;

  const formatTime = (ts) => {
    if (!ts) return null;
    return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  if (loading) return (
    <div className="space-y-4">
      <div className="h-24 rounded-2xl skeleton" />
      <div className="h-80 rounded-2xl skeleton" />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Summary pills */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'Total Records', value: attendance.length, color: '#6366f1', border: isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)' },
          { label: 'Present', value: presentCount, color: '#10b981', border: isDark ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.15)' },
          { label: 'Absent', value: absentCount, color: '#ef4444', border: isDark ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.15)' },
        ].map(s => (
          <div key={s.label} className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl transition-all ${isDark ? 'liquid-glass-card' : 'liquid-glass-card-light'}`}
            style={{ border: `1px solid ${s.border}` }}>
            <span className="text-xl font-black" style={{ color: s.color }}>{s.value}</span>
            <span className="text-xs font-semibold" style={{ color: s.color }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className={`rounded-[24px] overflow-hidden transition-all
        ${isDark ? 'liquid-glass-card' : 'liquid-glass-card-light'}`}>
        {/* Header */}
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border-b
          ${isDark ? 'border-white/10' : 'border-slate-200/50'}`}>
          <div>
            <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Attendance History</h3>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Detailed log of all recorded classes</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Filter */}
            <div className={`flex items-center gap-1 p-1 rounded-xl ${isDark ? 'bg-slate-900/60' : 'bg-slate-100'}`}>
              {['all', 'present', 'absent'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilterStatus(f)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all
                    ${filterStatus === f
                      ? isDark ? 'bg-slate-700 text-white shadow' : 'bg-white text-slate-800 shadow'
                      : isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <button
              onClick={() => fetchAttendance(true)}
              disabled={refreshing}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all hover:scale-105 disabled:opacity-50
                ${isDark ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}
            >
              <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Calendar className={`w-10 h-10 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
            <p className={`text-sm font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              No {filterStatus !== 'all' ? filterStatus : ''} records found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDark ? 'border-white/10 bg-white/5 backdrop-blur-md' : 'border-slate-200/50 bg-slate-50/50 backdrop-blur-md'}`}>
                  {['Date', 'Subject', 'Class Time', 'Status', 'Request'].map(h => (
                    <th key={h} className={`px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                {filtered.map(record => {
                  const st = statusConfig[record.status] || statusConfig.absent;
                  const StatIcon = st.icon;
                  const req = requestStatusConfig[record.requestStatus] || requestStatusConfig.none;

                  return (
                    <tr key={record._id} className="table-row-hover">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className={`w-3.5 h-3.5 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                          <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            {new Date(record.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <BookOpen className={`w-3.5 h-3.5 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                          <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            {record.subjectId?.name || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                                <Clock className={`w-3.5 h-3.5 ${isDark ? 'text-indigo-400' : 'text-indigo-500'}`} />
                                <span className={`text-sm font-bold ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>
                                    {record.startTime || '??'} - {record.endTime || '??'}
                                </span>
                            </div>
                            <span className={`text-[10px] ml-5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                                Recorded at {formatTime(record.markedAt) || 'N/A'}
                            </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg w-fit"
                          style={{ background: st.bg, border: `1px solid ${st.border}` }}>
                          <StatIcon style={{ width: 13, height: 13, color: st.color }} />
                          <span className="text-xs font-bold capitalize" style={{ color: st.color }}>{st.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.changeRequest ? (
                          <div className="flex items-center gap-1 text-xs font-medium text-amber-500">
                            <Clock className="w-3 h-3" />
                            Under Review
                          </div>
                        ) : (
                          <span className="text-xs font-semibold" style={{ color: req.color }}>{req.label}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceView;
