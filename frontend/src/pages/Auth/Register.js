import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { UserPlus } from 'lucide-react';

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
    <div className="max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-8 transition-colors">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-indigo-200 dark:shadow-none">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Create New Admin/Faculty</h2>
        <p className="text-gray-500 dark:text-slate-400 mt-2 text-center text-sm">Register a new administrator or restricted faculty member.</p>
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Username</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. adoe123"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@school.edu"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Password</label>
          <input
            type="password"
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
          />
        </div>

        <div className="pt-4 border-t dark:border-slate-700">
          <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-2">Faculty Restrictions (Optional)</h3>
          <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">Assigning subjects or branches will restrict this admin to only manage those subsets. Leave blank to create a Super Admin.</p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Assigned Branches (comma separated)</label>
            <input
              type="text"
              className="w-full px-4 py-2 text-sm rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              value={assignedBranches}
              onChange={(e) => setAssignedBranches(e.target.value)}
              placeholder="e.g. CSE, ECE, General"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Assigned Subjects</label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700">
              {allSubjects.map(sub => (
                <label key={sub._id} className="flex items-center space-x-2 text-sm text-gray-800 dark:text-slate-200 cursor-pointer">
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
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-70 flex justify-center items-center mt-6"
        >
          {isLoading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            'Create Account'
          )}
        </button>
      </form>
    </div>
  );
};

export default Register;
