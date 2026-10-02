import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';

export default function ThemeToggle({ variant = 'icon', className = '' }) {
  const { isDark, toggleTheme } = useTheme();

  const handleToggle = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    toggleTheme();
  };

  if (variant === 'pill') {
    return (
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.94 }}
        onClick={handleToggle}
        className={`theme-toggle-btn theme-toggle-pill d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill ${className}`}
        aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        type="button"
      >
        <span className="theme-toggle-icon-wrap">
          {isDark ? (
            <i className="bi bi-sun-fill text-warning fs-6"></i>
          ) : (
            <i className="bi bi-moon-stars-fill text-primary fs-6"></i>
          )}
        </span>
        <span className="theme-toggle-label fw-semibold small">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      </motion.button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleToggle}
        className={`theme-toggle-btn theme-toggle-compact btn btn-sm d-inline-flex align-items-center gap-1 border-0 p-1 text-light ${className}`}
        aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        type="button"
      >
        {isDark ? (
          <>
            <i className="bi bi-sun-fill text-warning"></i>
            <span className="small d-none d-sm-inline">Light</span>
          </>
        ) : (
          <>
            <i className="bi bi-moon-stars-fill text-warning"></i>
            <span className="small d-none d-sm-inline">Dark</span>
          </>
        )}
      </button>
    );
  }

  // Default 'icon' button variant
  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={handleToggle}
      className={`theme-toggle-btn theme-toggle-icon rounded-circle d-inline-flex align-items-center justify-content-center ${className}`}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      type="button"
      style={{
        width: '38px',
        height: '38px',
        border: '1px solid var(--border-subtle)',
        background: 'var(--canvas-subtle)',
        color: 'var(--text-main)',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
      }}
    >
      <motion.div
        key={isDark ? 'dark' : 'light'}
        initial={{ rotate: -90, scale: 0.7, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 90, scale: 0.7, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="d-flex align-items-center justify-content-center"
      >
        {isDark ? (
          <i className="bi bi-sun-fill text-warning fs-5"></i>
        ) : (
          <i className="bi bi-moon-stars-fill text-navy-800 fs-5"></i>
        )}
      </motion.div>
    </motion.button>
  );
}
