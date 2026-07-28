import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Check stored preference or default to system preference (or dark mode)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('usama_portfolio_theme');
    if (saved) return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  });

  const [autoSystem, setAutoSystem] = useState(() => {
    return localStorage.getItem('usama_portfolio_theme_auto') !== 'false';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light-mode');
      root.classList.remove('dark-mode');
    } else {
      root.classList.add('dark-mode');
      root.classList.remove('light-mode');
    }
    localStorage.setItem('usama_portfolio_theme', theme);
    localStorage.setItem('usama_portfolio_theme_auto', autoSystem);
  }, [theme, autoSystem]);

  // Listen to OS theme changes if autoSystem is enabled
  useEffect(() => {
    if (!autoSystem) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [autoSystem]);

  const toggleTheme = () => {
    setAutoSystem(false);
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setSystemTheme = () => {
    setAutoSystem(true);
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(isDark ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, autoSystem, setSystemTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
