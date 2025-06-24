import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    // Apply theme to document
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Apply CSS variables based on theme
    const root = document.documentElement;
    if (theme === 'dark') {
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#e2e2e2');
      root.style.setProperty('--background', '#121212');
      root.style.setProperty('--card-bg', '#1e1e1e');
      root.style.setProperty('--icon-bg', '#2d2d2d');
      root.style.setProperty('--button-text', '#ffffff'); // White text for dark mode
      root.style.setProperty('--button-hover', 'rgba(255, 255, 255, 0.1)');
    } else {
      root.style.setProperty('--text-primary', '#1a1a1a');
      root.style.setProperty('--text-secondary', '#4a4a4a');
      root.style.setProperty('--background', '#f8f8f8');
      root.style.setProperty('--card-bg', '#ffffff');
      root.style.setProperty('--icon-bg', '#f0f0f0');
      root.style.setProperty('--button-text', '#000000'); // Black text for light mode
      root.style.setProperty('--button-hover', 'rgba(0, 0, 0, 0.1)');
    }
  }, [theme]);

  // Add system theme change listener
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};