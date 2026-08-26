import { useTheme } from '../context/themeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label="Cambiar tema"
      className="theme-toggle-btn"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}