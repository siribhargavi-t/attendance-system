import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import api from '../../api/axios';
import { Users, CheckCircle, XCircle, TrendingUp, RefreshCw, ArrowRight, X, AlertTriangle, Clock } from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { Link } from 'react-router-dom';

/* ─────────── Animated counter ─────────── */
const useCountUp = (target, duration = 1200) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
};

/* ─────────── Mini sparkline ─────────── */
const Sparkline = ({ data, color }) => {
  const max = Math.max(...data, 1);
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 60},${20 - (v / max) * 18}`).join(' ');
  return (
    <svg width="60" height="24" viewBox="0 0 60 24">
      <defs>
        <filter id={`glow-spark-${color.replace('#','')}`}>
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        opacity="0.85"
        filter={`url(#glow-spark-${color.replace('#','')})`}
      />
    </svg>
  );
};

/* ─────────── Low Attendance Panel ─────────── */
const LowAttendancePanel = ({ isDark }) => {
  const [data, setData] = useState([]);
  const [threshold, setThreshold] = useState(75);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    api.get('/admin/low-attendance')
      .then(res => { setData(res.data.data); setThreshold(res.data.threshold); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-24 rounded-2xl skeleton" />;
  if (data.length === 0) return null;

  return (
    <div className={`rounded-2xl overflow-hidden animate-fade-in-up glass-alert-red`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4"
      >
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-xl glass-icon-bubble"
            style={{ background: 'rgba(239,68,68,0.15)' }}
          >
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-red-400">
              {data.length} Student{data.length !== 1 ? 's' : ''} Below {threshold}% Attendance
            </p>
            <p className="text-xs text-red-500/60">Immediate attention required</p>
          </div>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-lg transition-all
          ${isDark ? 'bg-red-900/20 text-red-400 border border-red-800/30' : 'bg-red-100/80 text-red-600'}`}>
          {open ? 'Collapse' : 'Expand'}
        </span>
      </button>

      {open && (
        <div className={`border-t ${isDark ? 'border-red-900/20' : 'border-red-200/50'} overflow-x-auto`}>
          <table className="w-full">
            <thead>
              <tr className={`text-xs font-semibold uppercase tracking-wider
                ${isDark ? 'bg-red-950/20 text-red-500/60' : 'bg-red-50/60 text-red-400'}`}>
                {['Student', 'Roll No', 'Branch', 'Present', 'Absent', 'Percentage'].map(h => (
                  <th key={h} className="px-5 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: isDark ? 'rgba(127,29,29,0.15)' : 'rgba(254,202,202,0.4)' }}>
              {data.map(stu => (
                <tr key={stu._id} className="transition-colors hover:bg-red-500/[0.04]">
                  <td className={`px-5 py-3 text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{stu.name}</td>
                  <td className={`px-5 py-3 text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stu.rollNumber}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded font-semibold
                      ${isDark ? 'bg-white/[0.06] text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                      {stu.branch}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm font-bold text-emerald-400">{stu.present}</td>
                  <td className="px-5 py-3 text-sm font-bold text-red-400">{stu.absent}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 max-w-[80px] h-1.5 rounded-full overflow-hidden bg-red-500/15">
                        <div className="h-full rounded-full bg-red-500" style={{ width: `${stu.percentage}%` }} />
                      </div>
                      <span className="text-xs font-black text-red-400">{stu.percentage}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/* ─────────── Today's Attendance Modal ─────────── */
const AttendanceModal = ({ status, isDark, onClose }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchTodayRecords = async () => {
      try {
        const res = await api.get(`/admin/attendance?date=${todayStr}&status=${status}`);
        setRecords(res.data.data);
      } catch (err) {
        console.error('Error fetching today records', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTodayRecords();
  }, [status, todayStr]);

  const statusColor = status === 'present' ? '#34d399' : '#f87171';
  const statusBg    = status === 'present' ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)';

  const formatTime = (ts) => {
    if (!ts) return '—';
    return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-xl animate-fade-in-scale ${isDark ? 'liquid-glass-modal' : 'liquid-glass-modal-light'}`}
        style={{ maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-5 border-b flex-shrink-0"
          style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl glass-icon-bubble" style={{ background: statusBg }}>
              {status === 'present'
                ? <CheckCircle style={{ width: 18, height: 18, color: statusColor }} />
                : <XCircle    style={{ width: 18, height: 18, color: statusColor }} />
              }
            </div>
            <div>
              <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {status === 'present' ? 'Present Today' : 'Absent Today'}
              </h3>
              <p className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all hover:scale-105
              ${isDark ? 'text-white/40 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100/80'}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-16 rounded-xl skeleton" />)}
            </div>
          ) : records.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-4xl mb-3">{status === 'present' ? '📋' : '📭'}</div>
              <p className={`text-sm font-medium ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                No {status} records found for today
              </p>
              <p className={`text-xs mt-1 ${isDark ? 'text-white/25' : 'text-slate-400'}`}>
                Mark attendance on the Mark Attendance page.
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className={`text-xs font-semibold ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
                  {records.length} record{records.length !== 1 ? 's' : ''} found
                </span>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-lg"
                  style={{ background: statusBg, color: statusColor }}
                >
                  {status.toUpperCase()}
                </span>
              </div>

              {records.map(rec => (
                <div
                  key={rec._id}
                  className="rounded-xl p-4 flex items-start gap-4 transition-all"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                    border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.05)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0 glass-icon-bubble"
                    style={{ background: `linear-gradient(135deg, ${statusColor}cc, ${statusColor}77)` }}
                  >
                    {rec.studentId?.name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {rec.studentId?.name || 'Unknown'}
                      </span>
                      <span className={`text-xs font-mono ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
                        {rec.studentId?.rollNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                      {rec.startTime && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-indigo-400" />
                          <span className="text-xs font-bold text-indigo-300">
                            {rec.startTime} - {rec.endTime}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Clock className={`w-3 h-3 ${isDark ? 'text-white/20' : 'text-slate-300'}`} />
                        <span className={`text-xs ${isDark ? 'text-white/35' : 'text-slate-400'}`}>
                          Marked at {formatTime(rec.markedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="p-4 border-t flex-shrink-0"
          style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}
        >
          <Link
            to="/admin/mark-attendance"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-bold text-white rounded-xl btn-liquid btn-shine"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
          >
            Go to Mark Attendance <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

/* ─────────── Stat Card ─────────── */
const StatCard = ({ title, value, icon: Icon, textColor, bgColor, sparkData, delay, quickLink, isDark, onClick }) => {
  const count = useCountUp(value);
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    };
    card.addEventListener('mousemove', onMove);
    return () => card.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={onClick || undefined}
      className={`stat-card group animate-staggered relative
        ${isDark ? 'liquid-glass-card' : 'liquid-glass-card-light'}`}
      style={{
        animationDelay: `${delay}s`,
        padding: '24px',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {/* Mouse-follow spotlight */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-[20px]"
        style={{ background: `radial-gradient(260px circle at var(--mouse-x,50%) var(--mouse-y,50%), ${textColor}18, transparent 70%)` }}
      />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-5">
          {/* Glass icon bubble */}
          <div
            className="p-3 rounded-2xl glass-icon-bubble transition-transform group-hover:scale-110"
            style={{
              background: bgColor,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.20), 0 4px 16px ${textColor}30`,
            }}
          >
            <Icon style={{ width: 22, height: 22, color: textColor }} />
          </div>
          <Sparkline data={sparkData} color={textColor} />
        </div>

        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-white/35' : 'text-slate-500'}`}>
            {title}
          </p>
          <h3
            className={`text-4xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}
            style={{ letterSpacing: '-0.03em' }}
          >
            {count}
          </h3>
        </div>

        {onClick && (
          <p
            className="mt-4 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0 flex items-center gap-1"
            style={{ color: textColor }}
          >
            View list <ArrowRight className="w-3 h-3" />
          </p>
        )}
        {quickLink && !onClick && (
          <Link
            to={quickLink}
            className="mt-4 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0"
            style={{ color: textColor }}
          >
            View details <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  );
};

/* ─────────── Main Dashboard ─────────── */
const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalStudents: 0, totalPresentToday: 0, totalAbsentToday: 0 });
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data.stats);
    } catch (err) {
      console.error('Error fetching admin stats', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      textColor: '#818cf8',
      bgColor: isDark ? 'rgba(129,140,248,0.12)' : 'rgba(99,102,241,0.10)',
      sparkData: [8, 12, 9, 14, 11, 13, stats.totalStudents || 15],
      quickLink: '/admin/students',
    },
    {
      title: 'Present Today',
      value: stats.totalPresentToday,
      icon: CheckCircle,
      textColor: '#34d399',
      bgColor: isDark ? 'rgba(52,211,153,0.12)' : 'rgba(16,185,129,0.10)',
      sparkData: [5, 8, 6, 10, 7, 9, stats.totalPresentToday || 8],
      onClick: () => setModal('present'),
    },
    {
      title: 'Absent Today',
      value: stats.totalAbsentToday,
      icon: XCircle,
      textColor: '#f87171',
      bgColor: isDark ? 'rgba(248,113,113,0.12)' : 'rgba(239,68,68,0.10)',
      sparkData: [3, 2, 4, 1, 3, 2, stats.totalAbsentToday || 2],
      onClick: () => setModal('absent'),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-44 rounded-2xl skeleton" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Modal */}
      {modal && (
        <AttendanceModal status={modal} isDark={isDark} onClose={() => setModal(null)} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h2 className={`text-2xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}
              style={{ letterSpacing: '-0.02em' }}>
            Today's Overview
          </h2>
          <p className={`text-sm ${isDark ? 'text-white/35' : 'text-slate-500'}`}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => { setLoading(true); fetchStats(); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105
            ${isDark
              ? 'liquid-glass text-indigo-300 hover:text-indigo-200 border-indigo-500/20'
              : 'liquid-glass-card-light text-indigo-600 border border-indigo-200 hover:text-indigo-700'}`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-staggered">
        {statCards.map((card, i) => (
          <StatCard key={i} {...card} delay={i * 0.1} isDark={isDark} />
        ))}
      </div>

      {/* Hint text */}
      <p className={`-mt-4 text-xs text-center ${isDark ? 'text-white/20' : 'text-slate-400'}`}>
        Click <strong>Present Today</strong> or <strong>Absent Today</strong> to view the student list
      </p>

      {/* Quick Actions */}
      <div className="animate-fade-in-up">
        <h3 className={`text-xs font-bold uppercase tracking-[0.15em] mb-4 ${isDark ? 'text-white/30' : 'text-slate-500'}`}>
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Mark Today's Attendance", path: '/admin/mark-attendance', color: '#34d399', icon: CheckCircle, desc: 'Record class attendance' },
            { label: 'Add New Student',          path: '/admin/students',        color: '#818cf8', icon: Users,       desc: 'Enroll a student'     },
            { label: 'Review Requests',          path: '/admin/requests',        color: '#fbbf24', icon: TrendingUp,  desc: 'Pending attendance changes' },
          ].map((action, i) => {
            const Icon = action.icon;
            return (
              <Link
                key={i}
                to={action.path}
                className={`group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden
                  ${isDark ? 'liquid-glass-card' : 'liquid-glass-card-light'}`}
              >
                {/* Subtle color fog on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
                  style={{ background: `radial-gradient(120px circle at 30% 50%, ${action.color}14, transparent 80%)` }}
                />
                <div
                  className="p-2.5 rounded-xl flex-shrink-0 glass-icon-bubble transition-transform group-hover:scale-110"
                  style={{
                    background: `${action.color}18`,
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15), 0 3px 10px ${action.color}25`,
                  }}
                >
                  <Icon style={{ width: 18, height: 18, color: action.color }} />
                </div>
                <div className="min-w-0 relative z-10">
                  <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{action.label}</p>
                  <p className={`text-xs truncate ${isDark ? 'text-white/30' : 'text-slate-500'}`}>{action.desc}</p>
                </div>
                <ArrowRight
                  className="w-4 h-4 ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0.5 relative z-10"
                  style={{ color: action.color }}
                />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Low Attendance Panel */}
      <LowAttendancePanel isDark={isDark} />
    </div>
  );
};

export default AdminDashboard;
