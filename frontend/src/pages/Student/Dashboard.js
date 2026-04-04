import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import api from '../../api/axios';
import { Percent, CheckCircle, XCircle, RefreshCw, Award, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Animated counter
const useCountUp = (target, duration = 1000) => {
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

// Circular progress ring
const CircleProgress = ({ percentage, isDark }) => {
  const pct = Number(percentage) || 0;
  const isLow = pct < 75;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const color = isLow ? '#ef4444' : pct >= 90 ? '#10b981' : '#6366f1';

  const countedPct = useCountUp(Math.round(pct));

  return (
    <div className="relative w-52 h-52 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 160 160">
        {/* Background track */}
        <circle
          cx="80" cy="80" r={radius}
          fill="none"
          stroke={isDark ? 'rgba(30,41,59,1)' : 'rgba(226,232,240,1)'}
          strokeWidth="14"
        />
        {/* Glow filter */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Progress arc */}
        <circle
          cx="80" cy="80" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          filter="url(#glow)"
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.34,1.56,0.64,1)', opacity: 0.9 }}
        />
      </svg>
      {/* Center content */}
      <div className="z-10 text-center">
        <span className="text-4xl font-black" style={{ color, letterSpacing: '-0.03em' }}>
          {countedPct}%
        </span>
        <p className={`text-xs font-semibold mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Attendance
        </p>
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  const [stats, setStats] = useState({ totalDays: 0, present: 0, absent: 0, percentage: 100 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const fetchStats = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const response = await api.get('/student/dashboard');
      setStats(response.data.stats);
      setMounted(true);
    } catch (err) {
      console.error('Error fetching student stats', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const totalDaysCount = useCountUp(stats.totalDays);
  const presentCount = useCountUp(stats.present);
  const absentCount = useCountUp(stats.absent);

  const isLow = Number(stats.percentage) < 75;
  const pct = Number(stats.percentage);

  const statCards = [
    { title: 'Total Classes', value: totalDaysCount, icon: TrendingUp, color: '#6366f1', bg: isDark ? 'rgba(99,102,241,0.1)' : '#eef2ff', label: 'Scheduled' },
    { title: 'Attended', value: presentCount, icon: CheckCircle, color: '#10b981', bg: isDark ? 'rgba(16,185,129,0.1)' : '#d1fae5', label: 'Classes' },
    { title: 'Missed', value: absentCount, icon: XCircle, color: '#ef4444', bg: isDark ? 'rgba(239,68,68,0.1)' : '#fee2e2', label: 'Classes' },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-32 rounded-2xl skeleton" />)}
        </div>
        <div className="h-80 rounded-2xl skeleton" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h2 className={`text-2xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            My Dashboard
          </h2>
          <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Your attendance overview at a glance
          </p>
        </div>
        <button
          onClick={() => fetchStats(true)}
          disabled={refreshing}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 disabled:opacity-50
            ${isDark ? 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100'}`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Low attendance warning */}
      {isLow && (
        <div className="rounded-2xl p-4 animate-fade-in-up flex items-center gap-4"
          style={{
            background: isDark ? 'rgba(239,68,68,0.1)' : '#fff1f2',
            border: `1px solid ${isDark ? 'rgba(239,68,68,0.25)' : 'rgba(254,202,202,1)'}`,
          }}>
          <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: isDark ? 'rgba(239,68,68,0.15)' : '#fee2e2' }}>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h4 className={`text-sm font-bold ${isDark ? 'text-red-400' : 'text-red-700'}`}>
              Low Attendance Warning
            </h4>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-red-500/70' : 'text-red-500'}`}>
              Your attendance ({stats.percentage}%) is below the 75% requirement. Submit a request if you have valid documentation.
            </p>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-staggered">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`stat-card rounded-2xl p-5 transition-all duration-300
                ${isDark ? 'bg-slate-800/70 border border-slate-700/50' : 'bg-white border border-slate-100 shadow-sm'}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl" style={{ background: card.bg }}>
                  <Icon style={{ width: 18, height: 18, color: card.color }} />
                </div>
                <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {card.label}
                </span>
              </div>
              <div>
                <h3 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`} style={{ letterSpacing: '-0.02em' }}>
                  {card.value}
                </h3>
                <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{card.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Circular Progress + Status card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
        {/* Ring */}
        <div className={`rounded-2xl p-8 flex flex-col items-center transition-all
          ${isDark ? 'bg-slate-800/70 border border-slate-700/50' : 'bg-white border border-slate-100 shadow-sm'}`}>
          <h3 className={`text-sm font-semibold uppercase tracking-wider mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Overall Attendance Score
          </h3>
          <CircleProgress percentage={stats.percentage} isDark={isDark} />
          <div className={`mt-6 text-center text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            <p>Based on all recorded classes</p>
          </div>
        </div>

        {/* Status breakdown */}
        <div className={`rounded-2xl p-8 flex flex-col justify-between transition-all
          ${isDark ? 'bg-slate-800/70 border border-slate-700/50' : 'bg-white border border-slate-100 shadow-sm'}`}>
          <h3 className={`text-sm font-semibold uppercase tracking-wider mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Attendance Status
          </h3>

          {/* Status indicator */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl" style={{ background: isLow ? '#fee2e2' : pct >= 90 ? '#d1fae5' : '#eef2ff' }}>
                {isLow ? (
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                ) : pct >= 90 ? (
                  <Award className="w-8 h-8 text-emerald-500" />
                ) : (
                  <CheckCircle className="w-8 h-8 text-indigo-500" />
                )}
              </div>
              <div>
                <h4 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {isLow ? 'Critical' : pct >= 90 ? 'Excellent' : 'Satisfactory'}
                </h4>
                <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {isLow ? 'Needs immediate attention' : pct >= 90 ? 'Keep it up! Great work.' : 'Above minimum threshold'}
                </p>
              </div>
            </div>

            {/* Bar breakdown */}
            <div className="space-y-3">
              {[ 
                { label: 'Present', count: stats.present, total: stats.totalDays, color: '#10b981' },
                { label: 'Absent', count: stats.absent, total: stats.totalDays, color: '#ef4444' },
              ].map(bar => (
                <div key={bar.label}>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{bar.label}</span>
                    <span style={{ color: bar.color }}>{bar.count} / {bar.total}</span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: bar.total > 0 ? `${(bar.count / bar.total) * 100}%` : '0%',
                        background: bar.color,
                        transition: 'width 1.2s cubic-bezier(0.34,1.56,0.64,1)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Threshold info */}
          <div className={`mt-6 p-3 rounded-xl flex items-center gap-2 text-xs ${isDark ? 'bg-slate-900/50 text-slate-500' : 'bg-slate-50 text-slate-400'}`}>
            <Percent className="w-3.5 h-3.5 flex-shrink-0" />
            Minimum required attendance is 75% per semester
          </div>
        </div>
      </div>

      {/* Graphical Trend Representation */}
      <div className={`rounded-2xl p-6 border animate-fade-in-up transition-all ${isDark ? 'bg-slate-800/70 border-slate-700/50' : 'bg-white border-slate-100 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-6">
              <div>
                  <h3 className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Attendance History (Last 7 Days)
                  </h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Daily percentage of present classes</p>
              </div>
              <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#6366f1' }} />
                      <span className="text-xs font-medium text-slate-500">Present %</span>
                  </div>
              </div>
          </div>
          
          <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.trend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                          <linearGradient id="colorPct" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
                        domain={[0, 100]}
                        ticks={[0, 25, 50, 75, 100]}
                      />
                      <Tooltip 
                        contentStyle={{ 
                            backgroundColor: isDark ? '#1e293b' : '#fff', 
                            borderColor: isDark ? '#334155' : '#e2e8f0',
                            borderRadius: '12px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            color: isDark ? '#f8fafc' : '#1e293b',
                            fontSize: '12px'
                        }} 
                        itemStyle={{ color: '#6366f1', fontWeight: 'bold' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="percentage" 
                        stroke="#6366f1" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorPct)" 
                        animationDuration={2000}
                      />
                  </AreaChart>
              </ResponsiveContainer>
          </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
