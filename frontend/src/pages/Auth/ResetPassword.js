import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Key, Sun, Moon, CheckCircle, AlertCircle } from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      setMessage(res.data.message);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error resetting password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden transition-all duration-500 ${isDark ? 'dark-mesh-bg' : 'light-mesh-bg'}`}>
      {/* Grid dots */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle, ${isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.06)'} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      {/* Orb */}
      <div className="absolute top-1/3 -right-40 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />

      {/* Theme toggle */}
      <div className="absolute top-6 right-6 z-10">
        <button onClick={toggleTheme} className={`p-2.5 rounded-full transition-all hover:scale-110 backdrop-blur-md border ${isDark ? 'bg-slate-800/70 border-slate-700 text-yellow-400' : 'bg-white/70 border-white/50 text-slate-700'}`}>
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 animate-float text-white"
          style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', animationDuration: '4s' }}>
        <Key className="w-7 h-7" />
      </div>

      {/* Card */}
      <div className={`max-w-md w-full rounded-[28px] overflow-hidden animate-fade-in-scale ${isDark ? 'liquid-glass-card' : 'liquid-glass-card-light'}`}>
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)' }} />
        <div className="p-8">
          <h1 className={`text-2xl font-bold mb-1 text-center ${isDark ? 'text-white' : 'text-slate-800'}`}>Reset Password</h1>
          <p className={`text-sm text-center mb-7 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Create a new secure password for your account.</p>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl text-sm mb-5 animate-fade-in-up"
              style={{ background: isDark ? 'rgba(239,68,68,0.1)' : '#fee2e2', color: isDark ? '#fca5a5' : '#dc2626', border: `1px solid ${isDark ? 'rgba(239,68,68,0.25)' : 'rgba(252,165,165,0.6)'}` }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          {message && (
            <div className="flex items-center gap-2 p-3 rounded-xl text-sm mb-5 animate-fade-in-up"
              style={{ background: isDark ? 'rgba(16,185,129,0.1)' : '#d1fae5', color: isDark ? '#6ee7b7' : '#065f46', border: `1px solid ${isDark ? 'rgba(16,185,129,0.2)' : '#a7f3d0'}` }}>
              <CheckCircle className="w-4 h-4 flex-shrink-0" /> {message} Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>New Password</label>
              <input
                type="password"
                required
                minLength={6}
                className={`w-full px-4 py-3.5 text-sm rounded-xl outline-none transition-all ${isDark ? 'glass-input text-white' : 'glass-input-light text-slate-800'}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password (min. 6 chars)"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !!message}
              className="btn-shine w-full py-3.5 text-sm font-bold text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
            >
              {isLoading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : 'Save New Password'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:underline text-indigo-500 hover:text-indigo-400">
              ← Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
