import React, { useState, useContext } from 'react';
import api from '../../api/axios';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden transition-all duration-500 ${isDark ? 'hero-gradient' : 'light-hero-gradient'}`}>
      {/* Grid background */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle, ${isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.06)'} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      {/* Orbs */}
      <div className="absolute top-1/3 -left-40 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />

      {/* Theme toggle */}
      <div className="absolute top-6 right-6 z-10">
        <button onClick={toggleTheme} className={`p-2.5 rounded-full transition-all hover:scale-110 backdrop-blur-md border ${isDark ? 'bg-slate-800/70 border-slate-700 text-yellow-400' : 'bg-white/70 border-white/50 text-slate-700'}`}>
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 animate-float shadow-2xl" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', animationDuration: '4s' }}>
        <Mail className="w-7 h-7 text-white" />
      </div>

      {/* Card */}
      <div className={`max-w-md w-full rounded-3xl overflow-hidden animate-fade-in-scale`}
        style={{
          background: isDark ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)',
          border: isDark ? '1px solid rgba(99,102,241,0.15)' : '1px solid rgba(255,255,255,0.6)',
          boxShadow: isDark ? '0 25px 80px rgba(0,0,0,0.5)' : '0 25px 80px rgba(99,102,241,0.1)',
        }}>
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)', backgroundSize: '200%', animation: 'borderFlow 3s linear infinite' }} />
        <div className="p-8">
          <h1 className={`text-2xl font-bold mb-1 text-center ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Forgot Password?
          </h1>
          <p className={`text-sm text-center mb-7 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Enter your email and we'll send you a reset link.
          </p>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl text-sm mb-5 animate-fade-in-up"
              style={{ background: isDark ? 'rgba(239,68,68,0.1)' : '#fee2e2', color: isDark ? '#fca5a5' : '#dc2626', border: `1px solid ${isDark ? 'rgba(239,68,68,0.25)' : 'rgba(252,165,165,0.6)'}` }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          {message && (
            <div className="flex items-center gap-2 p-3 rounded-xl text-sm mb-5 animate-fade-in-up"
              style={{ background: isDark ? 'rgba(16,185,129,0.1)' : '#d1fae5', color: isDark ? '#6ee7b7' : '#065f46', border: `1px solid ${isDark ? 'rgba(16,185,129,0.2)' : '#a7f3d0'}` }}>
              <CheckCircle className="w-4 h-4 flex-shrink-0" /> {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${focused ? 'text-indigo-500' : isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Enter your email"
                className={`w-full px-4 py-3.5 text-sm rounded-xl outline-none transition-all border
                  ${isDark ? 'bg-slate-800/80 text-white placeholder-slate-500 border-slate-700' : 'bg-slate-50 text-slate-800 placeholder-slate-400 border-slate-200'}
                  ${focused ? 'border-indigo-500 ring-1 ring-indigo-500/30 shadow-lg shadow-indigo-500/10' : ''}`}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-shine w-full py-3.5 text-sm font-bold text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
            >
              {isLoading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><Send className="w-4 h-4" /> Send Reset Link</>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:underline text-indigo-500 hover:text-indigo-400`}>
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
