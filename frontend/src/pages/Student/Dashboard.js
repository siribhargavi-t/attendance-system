import React, { useState, useEffect, useCallback, useContext } from 'react';
import api from '../../api/axios';
import { Percent, CheckCircle, XCircle, RefreshCw, Award, AlertTriangle, TrendingUp } from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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

// Circular progress ring — now with glass panel behind it
const CircleProgress = ({ percentage, isDark }) => {
  const pct = Number(percentage) || 0;
  const isLow = pct < 75;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const color = isLow ? '#f87171' : pct >= 90 ? '#34d399' : '#818cf8';

  const countedPct = useCountUp(Math.round(pct));

  return (
    <div className="relative w-52 h-52 flex items-center justify-center">
      {/* Radial glow behind ring */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${color}25 0%, transparent 70%)`,
          filter: 'blur(20px)',
        }}
      />
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 160 160">
        {/* Background track */}
        <circle
          cx="80" cy="80" r={radius}
          fill="none"
          stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
          strokeWidth="12"
        />
        {/* Glow filter */}
        <defs>
          <filter id="ring-glow">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        {/* Progress arc */}
        <circle
          cx="80" cy="80" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          filter="url(#ring-glow)"
          style={{ transition: 'stroke-dashoffset 1.6s cubic-bezier(0.34,1.56,0.64,1)', opacity: 0.95 }}
        />
      </svg>
      {/* Center */}
      <div className="z-10 text-center">
        <span className="text-4xl font-black" style={{ color, letterSpacing: '-0.04em' }}>
          {countedPct}%
        </span>
        <p className={`text-xs font-semibold mt-0.5 ${isDark ? 'text-white/35' : 'text-slate-400'}`}>
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
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const fetchStats = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const response = await api.get('/student/dashboard');
      setStats(response.data.stats);
    } catch (err) {
      console.error('Error fetching student stats', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const totalDaysCount = useCountUp(stats.totalDays);
  const presentCount   = useCountUp(stats.present);
  const absentCount    = useCountUp(stats.absent);

  const isLow = Number(stats.percentage) < 75;
  const pct   = Number(stats.percentage);

  const statCards = [
    { title: 'Total Classes', value: totalDaysCount, icon: TrendingUp,  color: '#818cf8', bg: isDark ? 'rgba(129,140,248,0.12)' : 'rgba(99,102,241,0.10)',  label: 'Scheduled' },
    { title: 'Attended',      value: presentCount,   icon: CheckCircle, color: '#34d399', bg: isDark ? 'rgba(52,211,153,0.12)'  : 'rgba(16,185,129,0.10)',  label: 'Classes'   },
    { title: 'Missed',        value: absentCount,    icon: XCircle,     color: '#f87171', bg: isDark ? 'rgba(248,113,113,0.12)' : 'rgba(239,68,68,0.10)',   label: 'Classes'   },
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
          <h2 className={`text-2xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}
              style={{ letterSpacing: '-0.02em' }}>
            My Dashboard
          </h2>
          <p className={`text-sm ${isDark ? 'text-white/35' : 'text-slate-500'}`}>
            Your attendance overview at a glance
          </p>
        </div>
        <button
          onClick={() => fetchStats(true)}
          disabled={refreshing}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 disabled:opacity-50
            ${isDark
              ? 'liquid-glass text-indigo-300 hover:text-indigo-200'
              : 'liquid-glass-card-light text-indigo-600 border border-indigo-200 hover:text-indigo-700'}`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Low attendance warning — glass alert */}
      {isLow && (
        <div className="rounded-2xl p-4 animate-fade-in-up flex items-center gap-4 glass-alert-red">
          <div className="p-2.5 rounded-xl flex-shrink-0 glass-icon-bubble" style={{ background: 'rgba(248,113,113,0.15)' }}>
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-red-400">Low Attendance Warning</h4>
            <p className="text-xs mt-0.5 text-red-400/60">
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
              className={`group stat-card rounded-2xl p-5 transition-all duration-300 relative overflow-hidden
                ${isDark ? 'liquid-glass-card' : 'liquid-glass-card-light'}`}
            >
              {/* Color fog on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: `radial-gradient(140px circle at 30% 40%, ${card.color}14, transparent 80%)` }}
              />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="p-2.5 rounded-xl glass-icon-bubble transition-transform group-hover:scale-110"
                    style={{
                      background: card.bg,
                      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.20), 0 3px 10px ${card.color}25`,
                    }}
                  >
                    <Icon style={{ width: 18, height: 18, color: card.color }} />
                  </div>
                  <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-white/25' : 'text-slate-500'}`}>
                    {card.label}
                  </span>
                </div>
                <h3
                  className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}
                  style={{ letterSpacing: '-0.03em' }}
                >
                  {card.value}
                </h3>
                <p className={`text-sm mt-0.5 ${isDark ? 'text-white/30' : 'text-slate-500'}`}>{card.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Circular ring + Status breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
        {/* Ring card */}
        <div
          className={`rounded-2xl p-8 flex flex-col items-center relative overflow-hidden
            ${isDark ? 'liquid-glass-card' : 'liquid-glass-card-light'}`}
        >
          {/* Subtle accent blob in corner */}
          <div
            className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
            style={{
              background: `radial-gradient(circle at top right, ${pct < 75 ? '#f8717122' : pct >= 90 ? '#34d39922' : '#818cf822'} 0%, transparent 70%)`,
            }}
          />
          <h3 className={`text-xs font-bold uppercase tracking-[0.15em] mb-7 relative z-10 ${isDark ? 'text-white/30' : 'text-slate-500'}`}>
            Overall Attendance Score
          </h3>
          <CircleProgress percentage={stats.percentage} isDark={isDark} />
          <div className={`mt-6 text-center text-xs relative z-10 ${isDark ? 'text-white/25' : 'text-slate-400'}`}>
            <p>Based on all recorded classes</p>
          </div>
        </div>

        {/* Status breakdown */}
        <div
          className={`rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden
            ${isDark ? 'liquid-glass-card' : 'liquid-glass-card-light'}`}
        >
          <div
            className="absolute bottom-0 left-0 w-40 h-40 pointer-events-none"
            style={{
              background: `radial-gradient(circle at bottom left, ${isLow ? '#f8717118' : '#818cf818'} 0%, transparent 70%)`,
            }}
          />
          <h3 className={`text-xs font-bold uppercase tracking-[0.15em] mb-6 relative z-10 ${isDark ? 'text-white/30' : 'text-slate-500'}`}>
            Attendance Status
          </h3>

          <div className="flex-1 flex flex-col justify-center relative z-10">
            <div className="flex items-center gap-4 mb-7">
              <div
                className="p-3 rounded-2xl glass-icon-bubble"
                style={{
                  background: isLow ? 'rgba(248,113,113,0.15)' : pct >= 90 ? 'rgba(52,211,153,0.15)' : 'rgba(129,140,248,0.15)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)',
                }}
              >
                {isLow
                  ? <AlertTriangle className="w-8 h-8 text-red-400" />
                  : pct >= 90
                    ? <Award className="w-8 h-8 text-emerald-400" />
                    : <CheckCircle className="w-8 h-8 text-indigo-400" />
                }
              </div>
              <div>
                <h4 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {isLow ? 'Critical' : pct >= 90 ? 'Excellent' : 'Satisfactory'}
                </h4>
                <p className={`text-sm ${isDark ? 'text-white/30' : 'text-slate-500'}`}>
                  {isLow ? 'Needs immediate attention' : pct >= 90 ? 'Keep it up! Great work.' : 'Above minimum threshold'}
                </p>
              </div>
            </div>

            {/* Bars */}
            <div className="space-y-3.5">
              {[
                { label: 'Present', count: stats.present, total: stats.totalDays, color: '#34d399' },
                { label: 'Absent',  count: stats.absent,  total: stats.totalDays, color: '#f87171' },
              ].map(bar => (
                <div key={bar.label}>
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span className={isDark ? 'text-white/45' : 'text-slate-600'}>{bar.label}</span>
                    <span style={{ color: bar.color }} className="font-bold">{bar.count} / {bar.total}</span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: bar.total > 0 ? `${(bar.count / bar.total) * 100}%` : '0%',
                        background: `linear-gradient(90deg, ${bar.color}cc, ${bar.color})`,
                        boxShadow: `0 0 8px ${bar.color}55`,
                        transition: 'width 1.3s cubic-bezier(0.34,1.56,0.64,1)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Threshold pill */}
          <div
            className={`mt-6 p-3 rounded-xl flex items-center gap-2 text-xs relative z-10
              ${isDark ? 'bg-white/[0.04] border border-white/[0.06] text-white/30' : 'bg-slate-50/80 border border-slate-200/80 text-slate-500'}`}
          >
            <Percent className="w-3.5 h-3.5 flex-shrink-0" />
            Minimum required attendance is 75% per semester
          </div>
        </div>
      </div>

      {/* Attendance trend chart */}
      <div
        className={`rounded-2xl p-6 animate-fade-in-up relative overflow-hidden
          ${isDark ? 'liquid-glass-card' : 'liquid-glass-card-light'}`}
      >
        {/* Top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(129,140,248,0.5), transparent)' }}
        />
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div>
            <h3 className={`text-xs font-bold uppercase tracking-[0.15em] ${isDark ? 'text-white/30' : 'text-slate-500'}`}>
              Attendance History (Last 7 Days)
            </h3>
            <p className={`text-xs mt-1 ${isDark ? 'text-white/20' : 'text-slate-400'}`}>Daily percentage of present classes</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: '#818cf8', boxShadow: '0 0 6px rgba(129,140,248,0.6)' }} />
            <span className={`text-xs font-medium ${isDark ? 'text-white/35' : 'text-slate-500'}`}>Present %</span>
          </div>
        </div>

        <div className="h-64 w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.trend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPct" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#818cf8" stopOpacity={isDark ? 0.35 : 0.20}/>
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: isDark ? 'rgba(255,255,255,0.3)' : '#94a3b8', fontSize: 11 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: isDark ? 'rgba(255,255,255,0.3)' : '#94a3b8', fontSize: 11 }}
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
              />
              <Tooltip
                contentStyle={{
                  background: isDark ? 'rgba(10,10,25,0.90)' : 'rgba(255,255,255,0.90)',
                  backdropFilter: 'blur(16px)',
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                  borderRadius: '14px',
                  boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
                  color: isDark ? '#f8fafc' : '#1e293b',
                  fontSize: '12px',
                }}
                itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
              />
              <Area
                type="monotone"
                dataKey="percentage"
                stroke="#818cf8"
                strokeWidth={2.5}
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
