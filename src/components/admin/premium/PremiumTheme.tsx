'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface ThemeContextType {
  theme: 'dark' | 'light' | 'auto'
  setTheme: (theme: 'dark' | 'light' | 'auto') => void
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    surfaceElevated: string
    text: {
      primary: string
      secondary: string
      muted: string
      inverse: string
    }
    border: string
    success: string
    warning: string
    error: string
    info: string
  }
}

const premiumColors = {
  dark: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#ec4899',
    background: '#0a0a0a',
    surface: '#1a1a1a',
    surfaceElevated: '#2a2a2a',
    text: {
      primary: '#ffffff',
      secondary: '#a1a1aa',
      muted: '#71717a',
      inverse: '#0a0a0a'
    },
    border: '#27272a',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },
  light: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#ec4899',
    background: '#ffffff',
    surface: '#f8fafc',
    surfaceElevated: '#ffffff',
    text: {
      primary: '#0a0a0a',
      secondary: '#52525b',
      muted: '#71717a',
      inverse: '#ffffff'
    },
    border: '#e5e7eb',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  }
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function usePremiumTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('usePremiumTheme must be used within PremiumThemeProvider')
  }
  return context
}

export function PremiumThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light' | 'auto'>('auto')
  const [systemTheme, setSystemTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }
    
    mediaQuery.addEventListener('change', handleChange)
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light')
    
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const currentTheme = theme === 'auto' ? systemTheme : theme
  const colors = premiumColors[currentTheme]

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--primary', colors.primary)
    root.style.setProperty('--secondary', colors.secondary)
    root.style.setProperty('--accent', colors.accent)
    root.style.setProperty('--background', colors.background)
    root.style.setProperty('--surface', colors.surface)
    root.style.setProperty('--surface-elevated', colors.surfaceElevated)
    root.style.setProperty('--text-primary', colors.text.primary)
    root.style.setProperty('--text-secondary', colors.text.secondary)
    root.style.setProperty('--text-muted', colors.text.muted)
    root.style.setProperty('--text-inverse', colors.text.inverse)
    root.style.setProperty('--border', colors.border)
    root.style.setProperty('--success', colors.success)
    root.style.setProperty('--warning', colors.warning)
    root.style.setProperty('--error', colors.error)
    root.style.setProperty('--info', colors.info)
    
    root.classList.toggle('dark', currentTheme === 'dark')
  }, [colors, currentTheme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  )
}
