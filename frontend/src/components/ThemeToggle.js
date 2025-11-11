import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button 
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <div className="theme-toggle-icon">
        {isDarkMode ? (
          // Sun icon for light mode
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="5" />
            <path d="m12 1v2" />
            <path d="m12 21v2" />
            <path d="m4.22 4.22l1.42 1.42" />
            <path d="m18.36 18.36l1.42 1.42" />
            <path d="m1 12h2" />
            <path d="m21 12h2" />
            <path d="m4.22 19.78l1.42-1.42" />
            <path d="m18.36 5.64l1.42-1.42" />
          </svg>
        ) : (
          // Moon icon for dark mode
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;