// Hook de validation pour le profil avancé
// Système de validation robuste et extensible

import { useState, useCallback } from 'react'
import { ExtendedProfileData, ValidationSchema, ValidationRule } from '@/types/profile'

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

export const useProfileValidation = () => {
  const [errors, setErrors] = useState<ValidationError[]>([])

  // Schéma de validation complet
  const validationSchema: ValidationSchema = {
    // Interface visuelle
    display_name: [
      { required: true, custom: (value) => !value?.trim() ? 'Le nom d\'affichage est requis' : null },
      { minLength: 2, custom: (value) => value?.length < 2 ? 'Minimum 2 caractères' : null },
      { maxLength: 100, custom: (value) => value?.length > 100 ? 'Maximum 100 caractères' : null }
    ],
    hero_title: [
      { required: true, custom: (value) => !value?.trim() ? 'Le titre principal est requis' : null },
      { maxLength: 255, custom: (value) => value?.length > 255 ? 'Maximum 255 caractères' : null }
    ],
    hero_subtitle: [
      { required: true, custom: (value) => !value?.trim() ? 'Le sous-titre est requis' : null },
      { maxLength: 255, custom: (value) => value?.length > 255 ? 'Maximum 255 caractères' : null }
    ],

    // Informations personnelles
    full_name: [
      { required: true, custom: (value) => !value?.trim() ? 'Le nom complet est requis' : null },
      { minLength: 2, custom: (value) => value?.length < 2 ? 'Minimum 2 caractères' : null },
      { maxLength: 255, custom: (value) => value?.length > 255 ? 'Maximum 255 caractères' : null }
    ],
    title: [
      { required: true, custom: (value) => !value?.trim() ? 'Le titre est requis' : null },
      { maxLength: 255, custom: (value) => value?.length > 255 ? 'Maximum 255 caractères' : null }
    ],
    bio: [
      { required: true, custom: (value) => !value?.trim() ? 'La biographie est requise' : null },
      { minLength: 50, custom: (value) => value?.length < 50 ? 'Minimum 50 caractères' : null },
      { maxLength: 2000, custom: (value) => value?.length > 2000 ? 'Maximum 2000 caractères' : null }
    ],
    email: [
      { required: true, custom: (value) => !value?.trim() ? 'L\'email est requis' : null },
      { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, custom: (value) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Email invalide' : null }
    ],
    phone: [
      { pattern: /^[\+]?[0-9\s\-\(\)]+$/, custom: (value) => value && !/^[\+]?[0-9\s\-\(\)]+$/.test(value) ? 'Téléphone invalide' : null }
    ],
    website: [
      { pattern: /^https?:\/\/.+/, custom: (value) => value && !/^https?:\/\/.+/.test(value) ? 'URL doit commencer par http:// ou https://' : null }
    ],

    // SEO
    seo_title: [
      { required: true, custom: (value) => !value?.trim() ? 'Le titre SEO est requis' : null },
      { minLength: 30, custom: (value) => value?.length < 30 ? 'Minimum 30 caractères pour le SEO' : null },
      { maxLength: 60, custom: (value) => value?.length > 60 ? 'Maximum 60 caractères pour le SEO' : null }
    ],
    seo_description: [
      { required: true, custom: (value) => !value?.trim() ? 'La description SEO est requise' : null },
      { minLength: 120, custom: (value) => value?.length < 120 ? 'Minimum 120 caractères pour le SEO' : null },
      { maxLength: 160, custom: (value) => value?.length > 160 ? 'Maximum 160 caractères pour le SEO' : null }
    ],
    seo_keywords: [
      { required: true, custom: (value) => !value || value.length === 0 ? 'Au moins un mot-clé est requis' : null },
      { custom: (value) => value && value.length > 10 ? 'Maximum 10 mots-clés' : null }
    ],

    // Configuration contact
    auto_reply_message: [
      { maxLength: 500, custom: (value) => value?.length > 500 ? 'Maximum 500 caractères' : null }
    ]
  }

  // Valider un champ spécifique
  const validateField = useCallback((field: string, value: any): string | null => {
    const rules = validationSchema[field]
    if (!rules) return null

    for (const rule of rules) {
      if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
        return 'Ce champ est requis'
      }

      if (rule.minLength && value && value.length < rule.minLength) {
        return `Minimum ${rule.minLength} caractères`
      }

      if (rule.maxLength && value && value.length > rule.maxLength) {
        return `Maximum ${rule.maxLength} caractères`
      }

      if (rule.pattern && value && !rule.pattern.test(value)) {
        return 'Format invalide'
      }

      if (rule.custom) {
        const customError = rule.custom(value)
        if (customError) return customError
      }
    }

    return null
  }, [])

  // Valider tout le profil
  const validateProfile = useCallback((profile: Partial<ExtendedProfileData>): ValidationResult => {
    const newErrors: ValidationError[] = []

    Object.keys(validationSchema).forEach(field => {
      const error = validateField(field, profile[field as keyof ExtendedProfileData])
      if (error) {
        newErrors.push({ field, message: error })
      }
    })

    // Validation spéciale pour les couleurs
    if (profile.brand_colors) {
      const colorFields = ['primary', 'secondary', 'accent', 'background', 'surface', 'text', 'textSecondary']
      colorFields.forEach(colorField => {
        const color = (profile.brand_colors as any)[colorField]
        if (color && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
          newErrors.push({ 
            field: `brand_colors.${colorField}`, 
            message: 'Couleur invalide (format #RRGGBB requis)' 
          })
        }
      })
    }

    // Validation pour les compétences
    if (profile.skills_config) {
      Object.keys(profile.skills_config).forEach(category => {
        const categoryData = (profile.skills_config as any)[category]
        if (!categoryData.title || !categoryData.skills || !Array.isArray(categoryData.skills)) {
          newErrors.push({ 
            field: `skills_config.${category}`, 
            message: 'Configuration de compétence invalide' 
          })
        }
      })
    }

    setErrors(newErrors)
    return {
      isValid: newErrors.length === 0,
      errors: newErrors
    }
  }, [validateField])

  // Effacer les erreurs
  const clearErrors = useCallback(() => {
    setErrors([])
  }, [])

  // Effacer une erreur spécifique
  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => prev.filter(error => error.field !== field))
  }, [])

  return {
    errors,
    validateField,
    validateProfile,
    clearErrors,
    clearFieldError,
    hasErrors: errors.length > 0
  }
}
