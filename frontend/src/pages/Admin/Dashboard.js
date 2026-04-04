import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import api from '../../api/axios';
import { Users, CheckCircle, XCircle, TrendingUp, Activity, RefreshCw, ArrowRight, X, Clock, BookOpen, User, Calendar } from 'lucide-react';
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
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={points} opacity="0.7" />
    </svg>
  );
};

/* ─────────── Today's Attendance Modal ─────────── */
const AttendanceModal = ({ status, isDark, onClose }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

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

  const statusColor = status === 'present' ? '#10b981' : '#ef4444';
  const statusBg = status === 'present'
    ? isDark ? 'rgba(16,185,129,0.1)' : '#d1fae5'
    : isDark ? 'rgba(239,68,68,0.1)' : '#fee2e2';

  const formatTime = (ts) => {
    if (!ts) return '—';
    return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      {/* Modal panel */}
      <div
        className="w-full max-w-xl rounded-2xl overflow-hidden animate-fade-in-scale"
        style={{
          background: isDark ? '#0f172a' : '#fff',
          border: `1px solid ${isDark ? 'rgba(99,102,241,0.2)' : 'rgba(226,232,240,1)'}`,
          boxShadow: '0 25px 80px rgba(0,0,0,0.4)',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b flex-shrink-0"
          style={{ borderColor: isDark ? 'rgba(51,65,85,0.6)' : 'rgba(241,245,249,1)' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl" style={{ background: statusBg }}>
              {status === 'present'
                ? <CheckCircle style={{ width: 18, height: 18, color: statusColor }} />
                : <XCircle style={{ width: 18, height: 18, color: statusColor }} />
              }
            </div>
            <div>
              <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {status === 'present' ? 'Present Today' : 'Absent Today'}
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all hover:scale-105 ${isDark ? 'text-slate-500 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}
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
              <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                No {status} records found for today
              </p>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                Mark attendance on the Mark Attendance page.
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {/* Count pill */}
              <div className="flex items-center justify-between mb-3 px-1">
                <span className={`text-xs font-semibold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {records.length} record{records.length !== 1 ? 's' : ''} found
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg"
                  style={{ background: statusBg, color: statusColor }}>
                  {status.toUpperCase()}
                </span>
              </div>

              {records.map(rec => (
                <div
                  key={rec._id}
                  className="rounded-xl p-4 flex items-start gap-4 transition-all"
                  style={{
                    background: isDark ? 'rgba(30,41,59,0.6)' : 'rgba(248,250,252,1)',
                    border: `1px solid ${isDark ? 'rgba(51,65,85,0.5)' : 'rgba(226,232,240,1)'}`,
                  }}
                >
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${statusColor}, ${statusColor}99)` }}>
                    {rec.studentId?.name?.charAt(0) || '?'}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Student name + roll */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {rec.studentId?.name || 'Unknown'}
                      </span>
                      <span className={`text-xs font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {rec.studentId?.rollNumber}
                      </span>
                    </div>

                      {/* markedAt time + class interval */}
                      <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                        {rec.startTime && (
                          <div className="flex items-center gap-1.5">
                            <Clock className={`w-3 h-3 ${isDark ? 'text-indigo-400' : 'text-indigo-500'}`} />
                            <span className={`text-xs font-bold ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>
                              {rec.startTime} - {rec.endTime}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <Clock className={`w-3 h-3 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                          <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
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
        <div className="p-4 border-t flex-shrink-0"
          style={{ borderColor: isDark ? 'rgba(51,65,85,0.6)' : 'rgba(241,245,249,1)' }}>
          <Link
            to="/admin/mark-attendance"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-bold text-white rounded-xl btn-shine"
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
const StatCard = ({ title, value, icon: Icon, gradient, textColor, bgLight, sparkData, delay, quickLink, isDark, change, onClick }) => {
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

  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className="stat-card premium-card group animate-staggered"
      style={{
        animationDelay: `${delay}s`,
        background: isDark ? 'rgba(30,41,59,0.8)' : 'white',
        border: isDark ? '1px solid rgba(99,102,241,0.1)' : '1px solid rgba(226,232,240,1)',
        borderRadius: '20px',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {/* Spotlight glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${textColor}15, transparent 70%)` }}
      />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 rounded-xl" style={{ background: isDark ? `${bgLight}20` : bgLight }}>
            <Icon style={{ width: 22, height: 22, color: textColor }} />
          </div>
          <Sparkline data={sparkData} color={textColor} />
        </div>

        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {title}
          </p>
          <div className="flex items-end gap-3">
            <h3 className={`text-4xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`} style={{ letterSpacing: '-0.02em' }}>
              {count}
            </h3>
            {change !== undefined && (
              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-md mb-1 ${change >= 0 ? 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400' : 'text-red-500 bg-red-100 dark:bg-red-900/30 dark:text-red-400'}`}>
                {change >= 0 ? '+' : ''}{change}%
              </span>
            )}
          </div>
        </div>

        {/* Click hint on cards that open modal */}
        {onClick && (
          <p className={`mt-3 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0 flex items-center gap-1`}
            style={{ color: textColor }}>
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
  const [modal, setModal] = useState(null); // 'present' | 'absent' | null
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

  const attendanceRate = stats.totalStudents > 0
    ? Math.round((stats.totalPresentToday / stats.totalStudents) * 100)
    : 0;

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      textColor: '#6366f1',
      bgLight: '#eef2ff',
      sparkData: [8, 12, 9, 14, 11, 13, stats.totalStudents || 15],
      quickLink: '/admin/students',
      change: undefined,
    },
    {
      title: 'Present Today',
      value: stats.totalPresentToday,
      icon: CheckCircle,
      textColor: '#10b981',
      bgLight: '#d1fae5',
      sparkData: [5, 8, 6, 10, 7, 9, stats.totalPresentToday || 8],
      onClick: () => setModal('present'),
      change: undefined,
    },
    {
      title: 'Absent Today',
      value: stats.totalAbsentToday,
      icon: XCircle,
      textColor: '#ef4444',
      bgLight: '#fee2e2',
      sparkData: [3, 2, 4, 1, 3, 2, stats.totalAbsentToday || 2],
      onClick: () => setModal('absent'),
      change: undefined,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-44 rounded-2xl skeleton" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Modal */}
      {modal && (
        <AttendanceModal
          status={modal}
          isDark={isDark}
          onClose={() => setModal(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h2 className={`text-2xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Today's Overview
          </h2>
          <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => { setLoading(true); fetchStats(); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105
            ${isDark ? 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100'}`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Stat cards — click Present/Absent to open modal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-staggered">
        {statCards.map((card, i) => (
          <StatCard key={i} {...card} delay={i * 0.1} isDark={isDark} />
        ))}
      </div>

      {/* Hint text under present/absent cards */}
      <p className={`-mt-4 text-xs text-center ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>
        Click <strong>Present Today</strong> or <strong>Absent Today</strong> to view the student list
      </p>


      {/* Quick Actions */}
      <div className="animate-fade-in-up">
        <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Mark Today's Attendance", path: '/admin/mark-attendance', color: '#10b981', icon: CheckCircle, desc: 'Record class attendance' },
            { label: 'Add New Student', path: '/admin/students', color: '#6366f1', icon: Users, desc: 'Enroll a student' },
            { label: 'Review Requests', path: '/admin/requests', color: '#f59e0b', icon: TrendingUp, desc: 'Pending attendance changes' },
          ].map((action, i) => {
            const Icon = action.icon;
            return (
              <Link
                key={i}
                to={action.path}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group hover:scale-[1.02]
                  ${isDark ? 'bg-slate-800/60 border border-slate-700/50 hover:border-slate-600' : 'bg-white border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md'}`}
              >
                <div className="p-2.5 rounded-xl flex-shrink-0 transition-all group-hover:scale-110" style={{ background: `${action.color}18` }}>
                  <Icon style={{ width: 18, height: 18, color: action.color }} />
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-slate-700'}`}>{action.label}</p>
                  <p className={`text-xs truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{action.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" style={{ color: action.color }} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
