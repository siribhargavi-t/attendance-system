import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full transition-colors flex items-center justify-center focus:outline-none ${
        theme === 'dark' ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-gray-100 text-slate-800 hover:bg-gray-200'
      } ${className}`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

export default ThemeToggle;
