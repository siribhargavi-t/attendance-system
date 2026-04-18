import React, { useContext, useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { LayoutDashboard, Users, CheckSquare, ClipboardList, Settings, LogOut, FileText, UserPlus, Sun, Moon, ChevronLeft, ChevronRight, Bell, BarChart2 } from 'lucide-react';

const AdminLayout = () => {
  const { logout, user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const isDark = theme === 'dark';

  // Live badge count for pending requests
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [leaveRes, attRes] = await Promise.all([
          import('../../api/axios').then(m => m.default.get('/leave/all?status=pending')),
          import('../../api/axios').then(m => m.default.get('/admin/attendance'))
        ]);
        const leavePending = leaveRes.data.leaves?.length || 0;
        const attPending = attRes.data.data?.filter(a => a.changeRequest && a.requestStatus === 'pending').length || 0;
        setPendingCount(leavePending + attPending);
      } catch (e) { /* silent if auth fails before login */ }
    };
    fetchCounts();
  }, [location.pathname]);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, color: '#6366f1' },
    { name: 'Students', path: '/admin/students', icon: Users, color: '#06b6d4' },
    { name: 'Subjects', path: '/admin/subjects', icon: FileText, color: '#8b5cf6' },
    { name: 'Mark Attendance', path: '/admin/mark-attendance', icon: CheckSquare, color: '#10b981' },
    { name: 'Review Requests', path: '/admin/requests', icon: ClipboardList, color: '#f59e0b', badge: pendingCount },
    { name: 'Reports', path: '/admin/reports', icon: BarChart2, color: '#06b6d4' },
    { name: 'Manage Admins', path: '/admin/manage-admins', icon: UserPlus, color: '#ec4899' },
    { name: 'Settings', path: '/admin/settings', icon: Settings, color: '#64748b' },
  ];

  const pageTitle = (() => {
    const seg = location.pathname.split('/').pop();
    if (!seg || seg === 'admin') return 'Dashboard';
    return seg.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  })();

  const avatarLetter = user?.username?.charAt(0).toUpperCase() || 'A';

  return (
    <div className={`flex h-screen font-['Inter'] overflow-hidden transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* SIDEBAR */}
      <aside
        className={`relative flex flex-col transition-all duration-300 ease-in-out sidebar-glow flex-shrink-0
          ${collapsed ? 'w-[72px]' : 'w-64'}
          ${isDark ? 'bg-slate-950 border-r border-slate-800/50' : 'bg-slate-900 border-r border-slate-800/80'}`}
      >
        {/* Sidebar top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)' }} />

        {/* Logo */}
        <div className={`flex items-center px-4 py-5 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                  <CheckSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-white tracking-wide leading-tight">ADMIN</h1>
                  <p className="text-[10px] text-indigo-400 leading-tight">PORTAL</p>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto py-2">
          {navItems.map((item) => {
            if (item.icon === UserPlus && user?.isSuperAdmin !== true && user?.isSuperAdmin !== 'true') return null;
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path === '/admin/manage-admins' && location.pathname === '/admin/add-admin');

            return (
              <Link
                key={item.name}
                to={item.path}
                title={collapsed ? item.name : undefined}
                className={`sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden
                  ${collapsed ? 'justify-center' : ''}
                  ${isActive
                    ? 'nav-link-active text-white'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                  }`}
              >
                {isActive && (
                  <div className="absolute inset-0 rounded-xl opacity-20" style={{ background: item.color, filter: 'blur(8px)' }} />
                )}
                <Icon
                  className="w-4.5 h-4.5 flex-shrink-0 transition-transform group-hover:scale-110"
                  style={{ color: isActive ? 'white' : item.color, width: 18, height: 18 }}
                />
                {!collapsed && (
                  <span className="font-medium text-sm truncate">{item.name}</span>
                )}
                {isActive && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80" />
                )}
                {!isActive && item.badge > 0 && !collapsed && (
                  <span className="ml-auto text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center text-white"
                    style={{ background: item.color }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User profile at bottom */}
        <div className={`p-3 border-t border-slate-800/50`}>
          <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/50 transition-all cursor-default ${collapsed ? 'justify-center' : ''}`}>
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm text-white"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                {avatarLetter}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-900" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.username}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.isSuperAdmin ? 'Super Admin' : 'Administrator'}</p>
              </div>
            )}
          </div>
          <button
            onClick={logout}
            className={`mt-1.5 flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all w-full text-sm font-medium group
              ${collapsed ? 'justify-center' : ''}`}
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
              Admin Portal
            </p>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {pageTitle}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <button className={`relative p-2 rounded-xl transition-all hover:scale-105 ${isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-700'}`}>
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            </button>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all hover:scale-105 ${isDark ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className={`flex-1 overflow-y-auto p-8 page-enter`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
