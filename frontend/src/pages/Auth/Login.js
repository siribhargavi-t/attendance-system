import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { LogIn, Eye, EyeOff, Sun, Moon, Wifi, WifiOff } from 'lucide-react';

const Login = () => {
  const [username, setUsername]         = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState('');
  const [isLoading, setIsLoading]       = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [serverStatus, setServerStatus] = useState('checking');
  const cardRef = useRef(null);
  const { login }              = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  // 3D card tilt effect
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2, cy = rect.height / 2;
      const rx = ((y - cy) / cy) * -4;
      const ry = ((x - cx) / cx) *  4;
      card.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(12px)`;
    };
    const onLeave = () => {
      card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    };
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    return () => { card.removeEventListener('mousemove', onMove); card.removeEventListener('mouseleave', onLeave); };
  }, []);

  // Server status check
  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: '__check__', password: '__check__' }),
        });
        setServerStatus(res.status < 500 ? 'online' : 'offline');
      } catch { setServerStatus('offline'); }
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
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden transition-all duration-500"
      style={{ background: isDark ? '#06060f' : '#f0f4ff' }}
    >
      {/* Animated ambient orbs */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 700, height: 700,
          top: '-200px', left: '-200px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.20) 0%, transparent 65%)',
          filter: 'blur(60px)',
          animation: 'orb-drift 22s ease-in-out infinite',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600, height: 600,
          bottom: '-150px', right: '-150px',
          background: isDark
            ? 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 65%)'
            : 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 65%)',
          filter: 'blur(60px)',
          animation: 'orb-drift 16s ease-in-out infinite reverse',
          animationDelay: '-8s',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 400, height: 400,
          top: '40%', left: '60%',
          background: isDark
            ? 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 65%)'
            : 'radial-gradient(circle, rgba(52,211,153,0.10) 0%, transparent 65%)',
          filter: 'blur(50px)',
          animation: 'orb-drift 28s ease-in-out infinite',
          animationDelay: '-14s',
        }}
      />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${isDark ? 'rgba(99,102,241,0.10)' : 'rgba(99,102,241,0.06)'} 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
        }}
      />

      {/* Top controls */}
      <div className="absolute top-5 right-5 flex items-center gap-2.5 z-20">
        {/* Server status pill */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold
            ${isDark ? 'liquid-glass' : 'liquid-glass-card-light'}
            ${serverStatus === 'online' ? 'text-emerald-400' : serverStatus === 'offline' ? 'text-red-400' : isDark ? 'text-white/40' : 'text-slate-400'}`}
        >
          {serverStatus === 'online'
            ? <Wifi className="w-3 h-3" />
            : <WifiOff className="w-3 h-3" />
          }
          {serverStatus === 'checking' ? 'Connecting...' : serverStatus === 'online' ? 'Server Online' : 'Server Offline'}
        </div>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2.5 rounded-xl transition-all hover:scale-110
            ${isDark ? 'liquid-glass text-yellow-300' : 'liquid-glass-card-light text-slate-600'}`}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Floating logo in standard flow */}
        <div className="relative mb-8 w-24 h-24 animate-float">
          <div className="relative w-full h-full">
            {/* Pulsing ring */}
            <div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: 'rgba(99,102,241,0.25)',
                animation: 'liquidPulse 2.5s ease-in-out infinite',
                borderRadius: '22px',
              }}
            />
            {/* Icon square */}
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center glass-icon-bubble relative z-10"
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.95), rgba(79,70,229,0.95), rgba(124,58,237,0.90))',
                boxShadow: '0 16px 48px rgba(99,102,241,0.40), inset 0 1px 0 rgba(255,255,255,0.20)',
              }}
            >
              <LogIn className="w-10 h-10 text-white transform -translate-x-1.5" />
            </div>
          </div>
        </div>

        {/* Glass card */}
        <div
          ref={cardRef}
          className={`w-full animate-fade-in-scale relative overflow-hidden z-10
            ${isDark ? 'liquid-glass-modal' : 'liquid-glass-modal-light'}`}
          style={{ transition: 'transform 0.15s ease', borderRadius: '28px' }}
        >
          {/* Rainbow top accent strip */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px] z-20"
            style={{
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #38bdf8, #34d399, #6366f1)',
              backgroundSize: '200% 100%',
              animation: 'gradientShift 4s linear infinite',
            }}
          />

          {/* Inner specular glow at top */}
          <div
            className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-10"
            style={{
              background: isDark
                ? 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)'
                : 'linear-gradient(180deg, rgba(255,255,255,0.50) 0%, transparent 100%)',
            }}
          />

          <div className="p-8 pt-10 relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className={`text-3xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}
                  style={{ letterSpacing: '-0.03em' }}>
                Welcome Back
              </h1>
              <p className={`text-sm ${isDark ? 'text-white/35' : 'text-slate-500'}`}>
                Sign in to your Attendance Portal
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 p-3.5 rounded-2xl text-sm text-center animate-fade-in-up glass-alert-red text-red-400">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 transition-colors
                  ${focusedField === 'username' ? 'text-indigo-500' : isDark ? 'text-white/40' : 'text-slate-600'}`}>
                  Username
                </label>
                <input
                  type="text"
                  required
                  className={`w-full px-4 py-3.5 text-sm rounded-2xl transition-all outline-none font-medium
                    ${isDark
                      ? 'glass-input text-white placeholder-white/20'
                      : 'glass-input-light text-slate-800 placeholder-slate-400'}`}
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your username"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className={`text-xs font-bold uppercase tracking-wider transition-colors
                    ${focusedField === 'password' ? 'text-indigo-500' : isDark ? 'text-white/40' : 'text-slate-600'}`}>
                    Password
                  </label>
                  <a
                    href="/forgot-password"
                    className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className={`w-full px-4 py-3.5 pr-12 text-sm rounded-2xl transition-all outline-none font-medium
                      ${isDark
                        ? 'glass-input text-white placeholder-white/20'
                        : 'glass-input-light text-slate-800 placeholder-slate-400'}`}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-xl transition-all hover:scale-110
                      ${isDark ? 'text-white/30 hover:text-white/70 hover:bg-white/08' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-liquid btn-shine w-full py-3.5 text-sm font-bold text-white rounded-2xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
              >
                {isLoading ? (
                  <>
                    <div className="flex gap-1">
                      {[0,1,2].map(i => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 bg-white/80 rounded-full"
                          style={{ animation: `pulse-glow 1.4s ease-in-out ${i * 0.15}s infinite` }}
                        />
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
            <div
              className={`mt-8 pt-5 border-t text-center text-xs ${isDark ? 'border-white/[0.06] text-white/20' : 'border-slate-200/80 text-slate-400'}`}
            >
              Attendance Management System · Secure Portal
            </div>
          </div>
        </div>

        {/* Bottom tag in standard flow */}
        <p className={`mt-6 text-xs text-center z-10 ${isDark ? 'text-white/15' : 'text-slate-400'}`}>
          Protected by AES-256 JWT Authentication
        </p>
      </div>
    </div>
  );
};

export default Login;
