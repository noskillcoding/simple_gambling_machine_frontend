// src/components/ThemeSwitcher.js
"use client";

import React from 'react';
import { useTheme } from '../contexts/ThemeContext'; // Using relative path

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Basic button styling, can be improved later with Tailwind classes
  // For now, focus on functionality.
  // Adding some basic Tailwind classes for better initial appearance.
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        // Using a simple text representation for now. SVG icons would be better.
        // Sun icon for when in dark mode (to switch to light)
        <span role="img" aria-label="Sun icon">☀️ Light Mode</span>
      ) : (
        // Moon icon for when in light mode (to switch to dark)
        <span role="img" aria-label="Moon icon">🌙 Dark Mode</span>
      )}
    </button>
  );
}
