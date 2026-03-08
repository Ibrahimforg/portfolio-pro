'use client'

import { useState } from 'react'
import { Palette, Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

const themes = [
  { name: 'ocean-blue', label: 'Ocean Blue', color: 'bg-blue-500' },
  { name: 'emerald-pro', label: 'Emerald Pro', color: 'bg-emerald-500' },
  { name: 'slate-minimal', label: 'Slate Minimal', color: 'bg-slate-500' },
  { name: 'amber-focus', label: 'Amber Focus', color: 'bg-amber-500' },
  { name: 'purple-elite', label: 'Purple Elite', color: 'bg-purple-500' },
]

export function ThemeSwitcher() {
  const { theme, colorMode, setTheme, setColorMode, isDark } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-surface border border-gray-700 rounded-full p-3 hover:bg-surface-elevated transition-colors shadow-lg"
          aria-label="Changer le thème"
        >
          <Palette className="w-5 h-5 text-text-primary" />
        </button>
        
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 bg-surface border border-gray-700 rounded-lg shadow-xl p-4 min-w-[280px]">
            {/* Mode Clair/Sombre */}
            <div className="mb-4">
              <div className="text-xs text-text-secondary mb-2 px-2">Mode</div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setColorMode('light')}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-md transition-colors",
                    colorMode === 'light' 
                      ? "bg-surface-elevated text-text-primary" 
                      : "hover:bg-surface-elevated text-text-secondary"
                  )}
                >
                  <Sun className="w-4 h-4" />
                  <span className="text-xs">Clair</span>
                </button>
                <button
                  onClick={() => setColorMode('dark')}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-md transition-colors",
                    colorMode === 'dark' 
                      ? "bg-surface-elevated text-text-primary" 
                      : "hover:bg-surface-elevated text-text-secondary"
                  )}
                >
                  <Moon className="w-4 h-4" />
                  <span className="text-xs">Sombre</span>
                </button>
                <button
                  onClick={() => setColorMode('system')}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-md transition-colors",
                    colorMode === 'system' 
                      ? "bg-surface-elevated text-text-primary" 
                      : "hover:bg-surface-elevated text-text-secondary"
                  )}
                >
                  <Monitor className="w-4 h-4" />
                  <span className="text-xs">Auto</span>
                </button>
              </div>
            </div>

            {/* Palette de couleurs */}
            <div>
              <div className="text-xs text-text-secondary mb-2 px-2">Palette</div>
              <div className="space-y-1">
                {themes.map((themeOption) => (
                  <button
                    key={themeOption.name}
                    onClick={() => {
                      setTheme(themeOption.name as 'ocean-blue' | 'emerald-pro' | 'slate-minimal' | 'amber-focus' | 'purple-elite')
                      setIsOpen(false)
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                      theme === themeOption.name 
                        ? "bg-surface-elevated text-text-primary" 
                        : "hover:bg-surface-elevated text-text-secondary"
                    )}
                  >
                    <div className={cn("w-3 h-3 rounded-full", themeOption.color)} />
                    <span className="text-sm">{themeOption.label}</span>
                    {theme === themeOption.name && (
                      <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
