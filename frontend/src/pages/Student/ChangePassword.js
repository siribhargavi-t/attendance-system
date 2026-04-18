import React, { useState, useContext } from 'react';
import api from '../../api/axios';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';

const ChangePassword = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);

    if (form.newPassword !== form.confirmPassword) {
      setResult({ type: 'error', message: 'New passwords do not match.' });
      return;
    }
    if (form.newPassword.length < 6) {
      setResult({ type: 'error', message: 'New password must be at least 6 characters.' });
      return;
    }
    if (form.newPassword === form.currentPassword) {
      setResult({ type: 'error', message: 'New password must be different from current password.' });
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setResult({ type: 'success', message: res.data.message });
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setResult({ type: 'error', message: err.response?.data?.message || 'Failed to change password.' });
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (key) => `w-full px-4 py-3 pr-11 text-sm rounded-xl outline-none transition-all border-none ${isDark ? 'glass-input text-white' : 'glass-input-light text-slate-800'}
    ${focused === key ? 'ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-500/10' : ''}`;

  const strengthScore = () => {
    const p = form.newPassword;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strength = strengthScore();
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['', '#ef4444', '#f59e0b', '#6366f1', '#10b981'];

  const fields = [
    { key: 'currentPassword', label: 'Current Password', showKey: 'current', placeholder: 'Enter your current password' },
    { key: 'newPassword', label: 'New Password', showKey: 'new', placeholder: 'At least 6 characters' },
    { key: 'confirmPassword', label: 'Confirm New Password', showKey: 'confirm', placeholder: 'Re-enter new password' },
  ];

  return (
    <div className="max-w-lg space-y-6 animate-fade-in-up">
      {/* Info card */}
      <div className={`rounded-2xl p-5 flex items-center gap-4 transition-all ${isDark ? 'liquid-glass-card border border-indigo-500/10' : 'liquid-glass-card-light border border-indigo-100'}`}>
        <div className="p-3 rounded-xl flex-shrink-0" style={{ background: isDark ? 'rgba(99,102,241,0.15)' : '#e0e7ff' }}>
          <Shield className="w-5 h-5 text-indigo-500" />
        </div>
        <div>
          <h3 className={`font-bold text-sm ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>Change Password</h3>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-indigo-400/70' : 'text-indigo-500'}`}>
            Keep your account secure with a strong, unique password
          </p>
        </div>
      </div>

      {/* Result banner */}
      {result && (
        <div className={`rounded-xl p-4 flex items-start gap-3 animate-fade-in-up border text-sm font-medium
          ${result.type === 'success'
            ? isDark ? 'bg-green-900/20 border-green-700/30 text-green-400' : 'bg-green-50 border-green-200 text-green-700'
            : isDark ? 'bg-red-900/20 border-red-700/30 text-red-400' : 'bg-red-50 border-red-200 text-red-700'
          }`}>
          {result.type === 'success'
            ? <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            : <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          }
          {result.message}
        </div>
      )}

      {/* Form card */}
      <div className={`rounded-[24px] p-6 transition-all ${isDark ? 'liquid-glass-card' : 'liquid-glass-card-light'}`}>
        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map(field => (
            <div key={field.key}>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 transition-colors
                ${focused === field.key ? 'text-indigo-500' : isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Lock className="w-3 h-3 inline mr-1.5" />
                {field.label}
              </label>
              <div className="relative">
                <input
                  type={show[field.showKey] ? 'text' : 'password'}
                  required
                  value={form[field.key]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  onFocus={() => setFocused(field.key)}
                  onBlur={() => setFocused(null)}
                  placeholder={field.placeholder}
                  className={inputCls(field.key)}
                />
                <button
                  type="button"
                  onClick={() => setShow(s => ({ ...s, [field.showKey]: !s[field.showKey] }))}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {show[field.showKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength bar — only on new password field */}
              {field.key === 'newPassword' && form.newPassword && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className="h-1.5 flex-1 rounded-full transition-all duration-300"
                        style={{ background: i <= strength ? strengthColor[strength] : isDark ? '#334155' : '#e2e8f0' }}
                      />
                    ))}
                  </div>
                  <p className="text-xs mt-1 font-medium" style={{ color: strengthColor[strength] }}>
                    {strengthLabel[strength]}
                  </p>
                </div>
              )}

              {/* Match indicator on confirm field */}
              {field.key === 'confirmPassword' && form.confirmPassword && (
                <p className={`text-xs mt-1.5 font-medium flex items-center gap-1
                  ${form.newPassword === form.confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
                  {form.newPassword === form.confirmPassword
                    ? <><CheckCircle className="w-3 h-3" /> Passwords match</>
                    : <><AlertCircle className="w-3 h-3" /> Passwords don't match</>
                  }
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="btn-shine w-full py-3 text-sm font-bold text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
          >
            {loading
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Changing...</>
              : <><Shield className="w-4 h-4" /> Update Password</>
            }
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
