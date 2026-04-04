import React, { useContext } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import ThemeToggle from '../ThemeToggle';
import { LayoutDashboard, Calendar, MessageSquare, LogOut } from 'lucide-react';

const StudentLayout = () => {
  const { logout, user } = useContext(AuthContext);
  const location = useLocation();

  const navItems = [
    { name: 'Overview', path: '/student', icon: LayoutDashboard },
    { name: 'My Attendance', path: '/student/attendance', icon: Calendar },
    { name: 'Submit Request', path: '/student/request', icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900 font-sans transition-colors">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 dark:bg-slate-950 text-white shadow-xl flex flex-col border-r dark:border-slate-800">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-wider text-indigo-300">STUDENT</h1>
          <p className="text-sm text-indigo-400 mt-1">Attendance Portal</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (location.pathname === '/student' && item.path === '/student');
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-white text-indigo-900 dark:bg-indigo-600 dark:text-white shadow-md' 
                    : 'text-indigo-200 hover:bg-indigo-800 dark:hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-indigo-800 dark:border-slate-800">
          <div className="flex items-center space-x-3 p-3">
             <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold opacity-80 uppercase">
                {user?.username?.charAt(0) || 'S'}
             </div>
             <div className="flex-1 truncate">
               <p className="text-sm font-medium text-white truncate">{user?.username}</p>
               <p className="text-xs text-indigo-300">Student Account</p>
             </div>
          </div>
          <button 
            onClick={logout}
            className="mt-2 flex w-full items-center space-x-2 px-4 py-2 text-red-300 hover:bg-indigo-800 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium text-sm">Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 flex flex-col transition-colors">
        <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 py-4 px-8 flex justify-between items-center transition-colors">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white capitalize">
                {location.pathname.split('/').pop().replace('-', ' ') || 'Overview'}
            </h2>
            <ThemeToggle />
        </header>
        <div className="p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;
