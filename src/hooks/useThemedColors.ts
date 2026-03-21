import { useTheme } from '@/contexts/ThemeContext'

export function useThemedColors() {
  const { colorMode, isDark } = useTheme()
  
  // Définition des couleurs par défaut si non disponibles dans le thème
  const defaultColors = {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6'
  }
  
  return {
    // Couleurs de base
    background: isDark ? 'bg-gray-900' : 'bg-gray-50',
    surface: isDark ? 'bg-gray-800' : 'bg-white',
    text: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-300' : 'text-gray-600',
    
    // Couleurs de thème (avec fallbacks)
    primary: '#3B82F6', // Couleur primaire par défaut
    secondary: '#8B5CF6', // Couleur secondaire par défaut
    accent: '#8B5CF6', // Couleur d'accent par défaut
    
    // Couleurs sémantiques
    success: defaultColors.success,
    error: defaultColors.error,
    warning: defaultColors.warning,
    info: defaultColors.info,
    
    // Utilitaires
    border: isDark ? 'border-gray-700' : 'border-gray-200',
    shadow: isDark ? 'shadow-gray-900' : 'shadow-gray-100',
    
    // Classes CSS dynamiques
    primaryBg: `bg-[${defaultColors.info}]`, // Utilise info comme primary
    secondaryBg: `bg-[${'#8B5CF6'}]`,
    accentBg: `bg-[${'#8B5CF6'}]`,
    successBg: `bg-[${defaultColors.success}]`,
    errorBg: `bg-[${defaultColors.error}]`,
    infoBg: `bg-[${defaultColors.info}]`,
    
    primaryText: `text-[${defaultColors.info}]`,
    secondaryText: `text-[${'#8B5CF6'}]`,
    accentText: `text-[${'#8B5CF6'}]`,
    successText: `text-[${defaultColors.success}]`,
    errorText: `text-[${defaultColors.error}]`,
    infoText: `text-[${defaultColors.info}]`,
    
    // Bordures
    primaryBorder: `border-[${defaultColors.info}]`,
    secondaryBorder: `border-[${'#8B5CF6'}]`,
    accentBorder: `border-[${'#8B5CF6'}]`,
    successBorder: `border-[${defaultColors.success}]`,
    errorBorder: `border-[${defaultColors.error}]`,
    infoBorder: `border-[${defaultColors.info}]`,
  }
}
