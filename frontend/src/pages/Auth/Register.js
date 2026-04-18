import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { UserPlus } from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [assignedBranches, setAssignedBranches] = useState('');
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const inputCls = `w-full px-4 py-3 rounded-xl outline-none transition-all
    ${isDark ? 'glass-input text-white' : 'glass-input-light text-slate-800'}`;

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const res = await api.get('/admin/subjects');
        setAllSubjects(res.data.data);
      } catch (err) {
        console.error("Failed to load subjects:", err);
      }
    };
    loadSubjects();
  }, []);

  const handleSubjectToggle = (subjectId) => {
    setAssignedSubjects(prev =>
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const payload = {
        username,
        email,
        password,
        assignedBranches: assignedBranches.split(',').map(b => b.trim()).filter(b => b),
        assignedSubjects
      };
      const res = await api.post('/auth/register-admin', payload);
      setMessage(res.data.message);
      // Wait a moment then go back to admin dashboard
      setTimeout(() => navigate('/admin'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-full max-w-2xl rounded-[28px] shadow-2xl p-8 transition-all animate-fade-in-up ${isDark ? 'liquid-glass-card' : 'liquid-glass-card-light'}`}>
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-white font-black flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
          <UserPlus className="w-8 h-8" />
        </div>
        <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Create New Admin/Faculty</h2>
        <p className={`mt-2 text-center text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Register a new administrator or restricted faculty member.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center border border-red-200">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-6 text-sm text-center border border-green-200">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ml-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Username</label>
            <input
              type="text"
              required
              className={inputCls}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. adoe123"
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1.5 ml-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Email Address</label>
            <input
              type="email"
              required
              className={inputCls}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@school.edu"
            />
          </div>
        </div>

        <div>
          <label className={`block text-xs font-semibold mb-1.5 ml-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Password</label>
          <input
            type="password"
            required
            className={inputCls}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
          />
        </div>

        <div className="pt-5 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
          <h3 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>Faculty Restrictions (Optional)</h3>
          <p className={`text-xs mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Assigning subjects or branches will restrict this admin to only manage those subsets. Leave blank to create a Super Admin.</p>

          <div className="mb-4">
            <label className={`block text-xs font-semibold mb-1.5 ml-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Assigned Branches (comma separated)</label>
            <input
              type="text"
              className={inputCls}
              value={assignedBranches}
              onChange={(e) => setAssignedBranches(e.target.value)}
              placeholder="e.g. CSE, ECE, General"
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1.5 ml-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Assigned Subjects</label>
            <div className={`grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-3 rounded-xl ${isDark ? 'bg-slate-900/30' : 'bg-slate-50/50 border border-slate-200/50'}`}>
              {allSubjects.map(sub => (
                <label key={sub._id} className={`flex items-center space-x-2 text-sm cursor-pointer ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <input
                    type="checkbox"
                    checked={assignedSubjects.includes(sub._id)}
                    onChange={() => handleSubjectToggle(sub._id)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="truncate">{sub.name} ({sub.code})</span>
                </label>
              ))}
              {allSubjects.length === 0 && <span className="text-xs text-gray-500 italic">No subjects available</span>}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !!message}
          className="w-full btn-shine flex justify-center items-center py-3.5 mt-6 rounded-xl text-white font-bold transition-all disabled:opacity-70 text-sm"
          style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
        >
          {isLoading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            'Create Account'
          )}
        </button>
      </form>
    </div>
  );
};

export default Register;
