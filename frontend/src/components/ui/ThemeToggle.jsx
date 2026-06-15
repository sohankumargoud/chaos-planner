import React from 'react'
import { useTheme } from '../../contexts/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="material-symbols-outlined text-secondary hover:text-primary transition-colors p-2 hover:bg-surface-container-low rounded-full"
      title={`Current theme: ${theme}. Click to toggle.`}
    >
      {theme === 'dark' ? 'light_mode' : theme === 'light' ? 'dark_mode' : 'contrast'}
    </button>
  )
}
