import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { LogIn, Eye, EyeOff, Sun, Moon, Wifi, WifiOff } from 'lucide-react';

// Floating particle background
const ParticleField = ({ isDark }) => {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 3,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 6 + 4,
    delay: Math.random() * 4,
    opacity: Math.random() * 0.4 + 0.1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: isDark
              ? `rgba(${[99,102,241,139,92,246,6,182,212][p.id % 3 * 3]},${[99,102,241,139,92,246,6,182,212][p.id % 3 * 3 + 1]},${[99,102,241,139,92,246,6,182,212][p.id % 3 * 3 + 2]},${p.opacity})`
              : `rgba(99,102,241,${p.opacity * 0.5})`,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            filter: 'blur(1px)',
          }}
        />
      ))}
      {/* Grid dots */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, ${isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)'} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [serverStatus, setServerStatus] = useState('checking');
  const cardRef = useRef(null);
  const { login } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  // Card tilt effect on mouse move
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Check server status
  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: '__check__', password: '__check__' }) });
        setServerStatus(res.status < 500 ? 'online' : 'offline');
      } catch {
        setServerStatus('offline');
      }
    };
    check();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-500 relative overflow-hidden ${isDark ? 'hero-gradient' : 'light-hero-gradient'}`}>
      <ParticleField isDark={isDark} />

      {/* Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />

      {/* Top bar */}
      <div className="absolute top-6 right-6 flex items-center gap-3 z-10">
        {/* Server status indicator */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md border transition-all
          ${serverStatus === 'online'
            ? isDark ? 'bg-green-900/40 border-green-700/40 text-green-400' : 'bg-green-50/80 border-green-200 text-green-700'
            : serverStatus === 'offline'
            ? isDark ? 'bg-red-900/40 border-red-700/40 text-red-400' : 'bg-red-50/80 border-red-200 text-red-700'
            : isDark ? 'bg-slate-800/60 border-slate-700 text-slate-400' : 'bg-white/60 border-gray-200 text-gray-500'
          }`}>
          {serverStatus === 'online' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
          {serverStatus === 'checking' ? 'Connecting...' : serverStatus === 'online' ? 'Server Online' : 'Server Offline'}
        </div>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2.5 rounded-full transition-all duration-300 backdrop-blur-md border hover:scale-110
            ${isDark ? 'bg-slate-800/70 border-slate-700 text-yellow-400 hover:bg-slate-700/70' : 'bg-white/70 border-white/50 text-slate-700 hover:bg-white/90'}
          `}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Logo mark floating above card */}
      <div className="relative mb-6 animate-float" style={{ animationDuration: '4s' }}>
        <div className="relative w-20 h-20">
          {/* Ping rings */}
          <div className="absolute inset-0 rounded-full bg-indigo-500 opacity-20 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5, #7c3aed)' }}>
            <LogIn className="w-9 h-9 text-white" />
          </div>
        </div>
      </div>

      {/* Card */}
      <div
        ref={cardRef}
        className={`max-w-md w-full rounded-3xl overflow-hidden transition-all duration-300 animate-fade-in-scale
          ${isDark ? 'glass-dark' : 'bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl'}`}
        style={{ boxShadow: isDark ? '0 25px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)' : '0 25px 80px rgba(99,102,241,0.12), 0 0 0 1px rgba(99,102,241,0.08)' }}
      >
        {/* Top gradient strip */}
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4, #6366f1)', backgroundSize: '200%', animation: 'borderFlow 3s linear infinite' }} />

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Welcome Back
            </h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Sign in to your Attendance Portal
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl border text-sm text-center animate-fade-in-up"
              style={{ background: isDark ? 'rgba(239,68,68,0.1)' : 'rgba(254,242,242,1)', borderColor: isDark ? 'rgba(239,68,68,0.3)' : 'rgba(252,165,165,0.5)', color: isDark ? '#fca5a5' : '#dc2626' }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className={`block text-sm font-semibold mb-2 transition-colors ${focusedField === 'username' ? 'text-indigo-500' : isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Username
              </label>
              <div className={`relative rounded-xl overflow-hidden transition-all duration-300 ${focusedField === 'username' ? 'ring-2 ring-indigo-500/50 shadow-lg shadow-indigo-500/10' : ''}`}>
                <input
                  type="text"
                  required
                  className={`w-full px-4 py-3.5 text-sm transition-all outline-none
                    ${isDark ? 'bg-slate-800/80 text-white placeholder-slate-500 border border-slate-700' : 'bg-slate-50 text-slate-800 placeholder-slate-400 border border-slate-200'}
                    ${focusedField === 'username' ? 'border-indigo-500/50' : ''}
                    rounded-xl`}
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className={`text-sm font-semibold transition-colors ${focusedField === 'password' ? 'text-indigo-500' : isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Password
                </label>
                <a href="/forgot-password" className="text-xs font-medium text-indigo-500 hover:text-indigo-400 transition-colors hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className={`relative rounded-xl overflow-hidden transition-all duration-300 ${focusedField === 'password' ? 'ring-2 ring-indigo-500/50 shadow-lg shadow-indigo-500/10' : ''}`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className={`w-full px-4 py-3.5 pr-12 text-sm transition-all outline-none
                    ${isDark ? 'bg-slate-800/80 text-white placeholder-slate-500 border border-slate-700' : 'bg-slate-50 text-slate-800 placeholder-slate-400 border border-slate-200'}
                    ${focusedField === 'password' ? 'border-indigo-500/50' : ''}
                    rounded-xl`}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-shine w-full py-3.5 text-sm font-bold text-white rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
            >
              {isLoading ? (
                <>
                  <div className="flex gap-1">
                    {[0,1,2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 bg-white/80 rounded-full loading-dot" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                  Authenticating...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className={`mt-8 pt-6 border-t text-center text-xs ${isDark ? 'border-slate-700/50 text-slate-500' : 'border-slate-100 text-slate-400'}`}>
            Attendance Management System · Secure Portal
          </div>
        </div>
      </div>

      {/* Bottom caption */}
      <p className={`mt-6 text-xs text-center ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
        Protected by JWT Authentication
      </p>
    </div>
  );
};

export default Login;
