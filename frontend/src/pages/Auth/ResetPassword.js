import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Key } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 flex flex-col items-center justify-center p-4 transition-colors">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden p-8 transition-colors">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-indigo-200 dark:shadow-none">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Reset Password</h2>
          <p className="text-gray-500 dark:text-slate-400 mt-2 text-center text-sm">Create a new secure password for your account.</p>
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">New Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !!message}
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-70 flex justify-center items-center"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              'Save New Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
