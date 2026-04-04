import React, { useState } from 'react';
import api from '../../api/axios';
import { Mail } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 flex flex-col items-center justify-center p-4 transition-colors">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden p-8 transition-colors">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-indigo-200 dark:shadow-none">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Forgot Password</h2>
          <p className="text-gray-500 dark:text-slate-400 mt-2 text-center text-sm">Enter your email and we'll send you a link to reset your password.</p>
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
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-70 flex justify-center items-center"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>
        <div className="mt-6 text-center">
             <a href="/" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
