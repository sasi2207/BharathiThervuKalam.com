import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    // 1. Check local storage
    const savedTheme = localStorage.getItem('bharathi_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    // 2. Check system preference
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const isDark = theme === 'dark';

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const rootDiv = document.getElementById('root');

    root.setAttribute('data-theme', theme);
    body.setAttribute('data-theme', theme);
    if (rootDiv) {
      rootDiv.setAttribute('data-theme', theme);
    }

    if (isDark) {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
      if (rootDiv) {
        rootDiv.classList.add('dark-theme');
        rootDiv.classList.remove('light-theme');
      }
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
      if (rootDiv) {
        rootDiv.classList.add('light-theme');
        rootDiv.classList.remove('dark-theme');
      }
    }

    try {
      localStorage.setItem('bharathi_theme', theme);
    } catch (e) {
      // Ignore local storage error in private mode
    }
  }, [theme, isDark]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') {
      setThemeState(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
