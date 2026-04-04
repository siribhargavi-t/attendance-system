import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { LogIn } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 flex flex-col items-center justify-center p-4 transition-colors">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden p-8 transition-colors">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-indigo-200 dark:shadow-none">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome Back</h2>
          <p className="text-gray-500 dark:text-slate-400 mt-2 text-center">Attendance Management System</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Username</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Password</label>
                <a href="/forgot-password" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">Forgot password?</a>
            </div>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-70 flex justify-center items-center"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700 flex justify-center text-sm">
          <span className="text-gray-600 dark:text-slate-400">
             Welcome to Attendance Management System
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
