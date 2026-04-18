import React, { useContext, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { LayoutDashboard, Calendar, MessageSquare, LogOut, Sun, Moon, ChevronLeft, ChevronRight, TrendingUp, Shield } from 'lucide-react';

const StudentLayout = () => {
  const { logout, user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const isDark = theme === 'dark';

  const navItems = [
    { name: 'Overview',         path: '/student',                 icon: LayoutDashboard, color: '#818cf8' },
    { name: 'My Attendance',    path: '/student/attendance',      icon: Calendar,        color: '#38bdf8' },
    { name: 'Submit Request',   path: '/student/request',         icon: MessageSquare,   color: '#34d399' },
    { name: 'Change Password',  path: '/student/change-password', icon: Shield,          color: '#fbbf24' },
  ];

  const pageTitle = (() => {
    const seg = location.pathname.split('/').pop();
    if (!seg || seg === 'student') return 'Overview';
    return seg.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  })();

  const avatarLetter = user?.username?.charAt(0).toUpperCase() || 'S';

  return (
    <div
      className="flex h-screen font-['Inter'] overflow-hidden transition-colors duration-500"
      style={{ background: isDark ? '#06060f' : '#f8fafc' }}
    >
      {/* Ambient orbs — dark mode only */}
      {isDark && (
        <>
          <div
            className="ambient-orb"
            style={{
              width: 500, height: 500,
              top: -80, left: -100,
              background: 'radial-gradient(circle, rgba(56,189,248,0.18) 0%, transparent 70%)',
              animationDelay: '-3s',
            }}
          />
          <div
            className="ambient-orb"
            style={{
              width: 450, height: 450,
              bottom: -80, right: 80,
              background: 'radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%)',
              animationDelay: '-9s',
            }}
          />
        </>
      )}

      {/* SIDEBAR */}
      <aside
        className={`relative flex flex-col transition-all duration-300 ease-in-out flex-shrink-0 z-20
          ${collapsed ? 'w-[72px]' : 'w-64'}
          ${isDark ? 'liquid-glass-sidebar' : 'liquid-glass-sidebar-light'}`}
      >
        {/* Top accent line — teal/indigo gradient for student */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] z-10"
          style={{ background: 'linear-gradient(90deg, #6366f1, #38bdf8, #34d399, #fbbf24)' }}
        />

        {/* Logo */}
        <div className={`flex items-center px-4 py-5 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-2xl flex items-center justify-center glass-icon-bubble"
                style={{ background: 'linear-gradient(135deg, rgba(56,189,248,0.9), rgba(99,102,241,0.9))' }}
              >
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xs font-black tracking-widest leading-tight text-white">
                  STUDENT
                </h1>
                <p className="text-[9px] tracking-[0.25em] leading-tight font-semibold text-cyan-400/70">
                  PORTAL
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-xl transition-all hover:scale-110 text-slate-500 hover:text-white hover:bg-white/10"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                title={collapsed ? item.name : undefined}
                className={`sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                  ${collapsed ? 'justify-center' : ''}
                  ${isActive
                    ? 'liquid-glass-nav-active text-white'
                    : 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
                  }`}
              >
                {isActive && (
                  <div
                    className="absolute inset-0 rounded-xl opacity-25 pointer-events-none"
                    style={{ background: item.color, filter: 'blur(16px)', transform: 'scale(0.7)' }}
                  />
                )}

                <div
                  className="flex-shrink-0 w-7 h-7 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                  style={{
                    background: isActive
                      ? `${item.color}22`
                      : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                    boxShadow: isActive ? `inset 0 1px 0 rgba(255,255,255,0.15)` : 'none',
                  }}
                >
                  <Icon
                    style={{ color: isActive ? item.color : undefined, width: 15, height: 15 }}
                  />
                </div>

                {!collapsed && (
                  <span className={`font-medium text-sm truncate flex-1 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  }`}>
                    {item.name}
                  </span>
                )}

                {isActive && !collapsed && (
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User profile at bottom */}
        <div className="p-3 border-t border-white/[0.06]">
          <div className={`flex items-center gap-3 p-2 rounded-xl transition-all cursor-default hover:bg-white/[0.05] ${collapsed ? 'justify-center' : ''}`}>
            <div className="relative flex-shrink-0">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm text-white glass-icon-bubble"
                style={{ background: 'linear-gradient(135deg, rgba(56,189,248,0.9), rgba(99,102,241,0.85))' }}
              >
                {avatarLetter}
              </div>
              <div
                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full"
                style={{
                  border: isDark ? '2px solid #06060f' : '2px solid #f0f4ff',
                  boxShadow: '0 0 6px rgba(52,211,153,0.6)',
                }}
              />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-white">{user?.username}</p>
                <p className="text-[10px] truncate font-medium text-cyan-400/70">Student Account</p>
              </div>
            )}
          </div>
          <button
            onClick={logout}
            className={`mt-1.5 flex items-center gap-2 px-3 py-2 rounded-xl transition-all w-full text-sm font-medium group text-red-400/80 hover:bg-red-500/10 hover:text-red-400 ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            {!collapsed && 'Sign out'}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-hidden flex flex-col min-w-0 relative z-10">
        {/* Floating glass header */}
        <header
          className={`flex items-center justify-between px-8 py-4 flex-shrink-0
            ${isDark ? 'liquid-glass-header' : 'liquid-glass-header-light'}`}
        >
          <div>
            <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] mb-0.5 ${isDark ? 'text-cyan-400/60' : 'text-cyan-600'}`}>
              Student Portal
            </p>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {pageTitle}
            </h2>
          </div>
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl transition-all hover:scale-105
              ${isDark ? 'liquid-glass text-yellow-300 hover:text-yellow-200' : 'liquid-glass-card-light text-slate-600 hover:text-slate-800'}`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-8 page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;
