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
    { name: 'Overview', path: '/student', icon: LayoutDashboard, color: '#6366f1' },
    { name: 'My Attendance', path: '/student/attendance', icon: Calendar, color: '#06b6d4' },
    { name: 'Submit Request', path: '/student/request', icon: MessageSquare, color: '#10b981' },
    { name: 'Change Password', path: '/student/change-password', icon: Shield, color: '#f59e0b' },
  ];

  const pageTitle = (() => {
    const seg = location.pathname.split('/').pop();
    if (!seg || seg === 'student') return 'Overview';
    return seg.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  })();

  const avatarLetter = user?.username?.charAt(0).toUpperCase() || 'S';

  return (
    <div className={`flex h-screen font-['Inter'] overflow-hidden transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* SIDEBAR */}
      <aside
        className={`relative flex flex-col transition-all duration-300 ease-in-out sidebar-glow flex-shrink-0
          ${collapsed ? 'w-[72px]' : 'w-64'}
          ${isDark ? 'bg-slate-950 border-r border-slate-800/50' : 'bg-indigo-950 border-r border-indigo-900'}`}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, #6366f1, #06b6d4, #10b981)' }} />

        {/* Logo */}
        <div className={`flex items-center px-4 py-5 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)' }}>
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-wide leading-tight">STUDENT</h1>
                <p className="text-[10px] text-indigo-400 leading-tight">PORTAL</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-indigo-400 hover:text-white hover:bg-indigo-900 transition-all"
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
                className={`sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden
                  ${collapsed ? 'justify-center' : ''}
                  ${isActive
                    ? 'bg-white/10 text-white shadow-md'
                    : 'text-indigo-300 hover:bg-white/5 hover:text-white'
                  }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full" style={{ background: item.color }} />
                )}
                <Icon
                  className="flex-shrink-0 transition-transform group-hover:scale-110"
                  style={{ color: isActive ? item.color : undefined, width: 18, height: 18 }}
                />
                {!collapsed && (
                  <span className="font-medium text-sm truncate">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User profile at bottom */}
        <div className="p-3 border-t border-indigo-900/50">
          <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-indigo-900/30 transition-all cursor-default ${collapsed ? 'justify-center' : ''}`}>
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm text-white"
                style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)' }}>
                {avatarLetter}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-indigo-950" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.username}</p>
                <p className="text-[10px] text-indigo-400 truncate">Student Account</p>
              </div>
            )}
          </div>
          <button
            onClick={logout}
            className={`mt-1.5 flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all w-full text-sm font-medium group ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            {!collapsed && 'Sign out'}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-hidden flex flex-col min-w-0">
        {/* Header */}
        <header className={`flex items-center justify-between px-8 py-4 border-b transition-colors flex-shrink-0
          ${isDark ? 'bg-slate-900/95 border-slate-800 backdrop-blur' : 'bg-white/95 border-slate-200 backdrop-blur shadow-sm'}`}>
          <div>
            <p className={`text-xs font-medium uppercase tracking-widest mb-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Student Portal
            </p>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {pageTitle}
            </h2>
          </div>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-all hover:scale-105 ${isDark ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
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
