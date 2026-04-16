import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = ({ className = "" }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const isDark = darkMode;

  return (
    <div 
      className={`theme-toggle-wrapper ${isDark ? 'dark' : ''} ${className}`} 
      onClick={toggleDarkMode}
      title="Toggle Theme"
    >
      <div className="day-scenery">
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>
      </div>
      <div className="night-scenery">
        <div className="star star-1"></div>
        <div className="star star-2"></div>
        <div className="star star-3"></div>
        <div className="star star-4"></div>
      </div>
      <div className="theme-toggle-thumb"></div>
    </div>
  );
};

export default ThemeToggle;
