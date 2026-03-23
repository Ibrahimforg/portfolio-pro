'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'ocean-blue' | 'emerald-pro' | 'slate-minimal' | 'amber-focus' | 'purple-elite'
type ColorMode = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  colorMode: ColorMode
  setTheme: (theme: Theme) => void
  setColorMode: (mode: ColorMode) => void
  isDark: boolean
}

const themes = {
  'ocean-blue': {
    primary: '#3B82F6',
    primaryHover: '#2563EB',
    primaryLight: '#93C5FD',
  },
  'emerald-pro': {
    primary: '#10B981',
    primaryHover: '#059669',
    primaryLight: '#86EFAC',
  },
  'slate-minimal': {
    primary: '#64748B',
    primaryHover: '#475569',
    primaryLight: '#CBD5E1',
  },
  'amber-focus': {
    primary: '#F59E0B',
    primaryHover: '#D97706',
    primaryLight: '#FCD34D',
  },
  'purple-elite': {
    primary: '#8B5CF6',
    primaryHover: '#7C3AED',
    primaryLight: '#C4B5FD',
  },
}

const colorModes = {
  light: {
    background: '#FFFFFF',
    surface: '#F8FAFC',
    surfaceElevated: '#F1F5F9',
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    border: '#E2E8F0',
  },
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    surfaceElevated: '#334155',
    textPrimary: '#F8FAFC',
    textSecondary: '#CBD5E1',
    border: '#475569',
  },
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('ocean-blue')
  const [colorMode, setColorMode] = useState<ColorMode>('light') // Thème clair par défaut

  // Charger les préférences depuis localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const savedTheme = localStorage.getItem('portfolio-theme') as Theme
    const savedMode = localStorage.getItem('portfolio-color-mode') as ColorMode
    
    // Utiliser setTimeout pour éviter le setState synchrone
    setTimeout(() => {
      if (savedTheme && themes[savedTheme]) {
        setTheme(savedTheme)
      }
      if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
        setColorMode(savedMode)
      }
    }, 0)
  }, [])

  const [isDark, setIsDark] = useState(false)

  // Détection du mode système
  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const updateIsDark = () => {
      const newIsDark = colorMode === 'system' ? mediaQuery.matches : colorMode === 'dark'
      setIsDark(newIsDark)
    }

    updateIsDark()
    mediaQuery.addEventListener('change', updateIsDark)

    return () => mediaQuery.removeEventListener('change', updateIsDark)
  }, [colorMode, isDark]) // Retirer isDark des dépendances pour éviter la boucle

  // Mise à jour des couleurs
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const root = document.documentElement
    const colors = themes[theme]
    const modeColors = colorModes[isDark ? 'dark' : 'light']
    
    console.log('🎨 Application du thème:', { theme, colorMode, isDark })
    console.log('🎨 Couleurs:', { colors, modeColors })
    
    // Couleurs de thème
    root.style.setProperty('--primary', colors.primary)
    root.style.setProperty('--primary-hover', colors.primaryHover)
    root.style.setProperty('--primary-light', colors.primaryLight)
    
    // Couleurs de mode
    root.style.setProperty('--background', modeColors.background)
    root.style.setProperty('--surface', modeColors.surface)
    root.style.setProperty('--surface-elevated', modeColors.surfaceElevated)
    root.style.setProperty('--text-primary', modeColors.textPrimary)
    root.style.setProperty('--text-secondary', modeColors.textSecondary)
    root.style.setProperty('--border', modeColors.border)
    
    // Forcer l'application des classes sur le body
    root.classList.toggle('dark', isDark)
    root.classList.toggle('light', !isDark)
    
    console.log('🎨 Classes appliquées:', root.className)
    console.log('🎨 CSS Variables:', {
      '--primary': colors.primary,
      '--background': modeColors.background,
      '--surface': modeColors.surface,
      '--text-primary': modeColors.textPrimary
    })
    
    // Sauvegarde uniquement si la valeur a changé
    const currentTheme = localStorage.getItem('portfolio-theme')
    const currentMode = localStorage.getItem('portfolio-color-mode')
    
    if (currentTheme !== theme) {
      localStorage.setItem('portfolio-theme', theme)
    }
    if (currentMode !== colorMode) {
      localStorage.setItem('portfolio-color-mode', colorMode)
    }
  }, [theme, colorMode, isDark])

  const value: ThemeContextType = {
    theme,
    colorMode,
    setTheme,
    setColorMode,
    isDark,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
