// Validation complète avec Zod
import { z } from 'zod'

// Configuration de sécurité
export const SECURITY_CONFIG = {
  MIN_PASSWORD_LENGTH: 12,
  REQUIRE_SPECIAL_CHARS: true,
  PASSWORD_HISTORY: 5,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000
}

// Schémas de validation Zod
export const loginSchema = z.object({
  email: z.string()
    .email('Email invalide')
    .min(5, 'Email requis')
    .max(100, 'Email trop long'),
  password: z.string()
    .min(SECURITY_CONFIG.MIN_PASSWORD_LENGTH, `Le mot de passe doit contenir au moins ${SECURITY_CONFIG.MIN_PASSWORD_LENGTH} caractères`)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]/, 
      'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial'),
  remember: z.boolean().optional().default(false)
})

export const registerSchema = z.object({
  email: z.string()
    .email('Email invalide')
    .min(5, 'Email requis')
    .max(100, 'Email trop long'),
  password: z.string()
    .min(SECURITY_CONFIG.MIN_PASSWORD_LENGTH, `Le mot de passe doit contenir au moins ${SECURITY_CONFIG.MIN_PASSWORD_LENGTH} caractères`)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]/, 
      'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial'),
  confirmPassword: z.string(),
  fullName: z.string()
    .min(2, 'Nom complet requis')
    .max(100, 'Nom trop long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Nom contient des caractères invalides'),
  acceptTerms: z.boolean().refine((val) => val === true, 'Vous devez accepter les conditions d\'utilisation')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword']
})

export const projectSchema = z.object({
  title: z.string()
    .min(3, 'Titre requis')
    .max(100, 'Titre trop long')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Titre contient des caractères invalides'),
  description: z.string()
    .min(10, 'Description requise')
    .max(1000, 'Description trop longue'),
  status: z.enum(['draft', 'published', 'archived']),
  category_id: z.number()
    .positive('ID de catégorie requis')
    .int('ID de catégorie doit être un entier'),
  featured: z.boolean().default(false),
  tags: z.array(z.string().min(1).max(50)).optional().default([]),
  images: z.array(z.object({
    url: z.string().url('URL d\'image invalide'),
    alt_text: z.string().min(1, 'Texte alternatif requis').max(200),
    is_primary: z.boolean().default(false)
  })).optional().default([])
})

export const profileSchema = z.object({
  full_name: z.string()
    .min(2, 'Nom complet requis')
    .max(100, 'Nom trop long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Nom contient des caractères invalides'),
  title: z.string()
    .min(2, 'Titre requis')
    .max(100, 'Titre trop long'),
  bio: z.string()
    .max(1000, 'Bio trop longue')
    .optional(),
  email: z.string()
    .email('Email invalide')
    .optional(),
  phone: z.string()
    .regex(/^[+]?[\d\s\-\(\)]+$/, 'Numéro de téléphone invalide')
    .optional(),
  location: z.string()
    .max(100, 'Localisation trop longue')
    .optional(),
  website: z.union([z.string().url('URL du site web invalide'), z.literal('')]).optional(),
  is_admin: z.boolean().default(false)
})

export const skillSchema = z.object({
  name: z.string()
    .min(1, 'Nom de compétence requis')
    .max(50, 'Nom trop long'),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  category_id: z.number()
    .positive('ID de catégorie requis')
    .int('ID de catégorie doit être un entier'),
  years_experience: z.number()
    .min(0, 'Années d\'expérience invalides')
    .max(50, 'Années d\'expérience invalides')
    .int('Années d\'expérience doit être un entier')
    .optional(),
  visible: z.boolean().default(true),
  order: z.number()
    .int('Ordre doit être un entier')
    .min(0, 'Ordre invalide')
    .default(0)
})

export const contactSchema = z.object({
  name: z.string()
    .min(2, 'Nom requis')
    .max(100, 'Nom trop long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Nom contient des caractères invalides'),
  email: z.string()
    .email('Email invalide'),
  subject: z.string()
    .min(5, 'Sujet requis')
    .max(200, 'Sujet trop long'),
  message: z.string()
    .min(20, 'Message requis')
    .max(2000, 'Message trop long'),
  phone: z.string()
    .regex(/^[+]?[\d\s\-\(\)]+$/, 'Numéro de téléphone invalide')
    .optional(),
  company: z.string()
    .max(100, 'Nom d\'entreprise trop long')
    .optional(),
  project_type: z.enum(['web', 'mobile', 'desktop', 'consulting', 'other']),
  budget: z.enum(['<5k', '5k-10k', '10k-25k', '25k-50k', '>50k']).optional(),
  timeline: z.enum(['asap', '1-3months', '3-6months', '6months+']).optional(),
  consent: z.boolean().refine((val) => val === true, 'Consentement requis pour le traitement des données')
})

export const categorySchema = z.object({
  name: z.string()
    .min(1, 'Nom de catégorie requis')
    .max(50, 'Nom trop long'),
  slug: z.string()
    .min(1, 'Slug requis')
    .max(50, 'Slug trop long')
    .regex(/^[a-z0-9-]+$/, 'Slug ne peut contenir que des lettres minuscules, chiffres et tirets'),
  description: z.string()
    .max(200, 'Description trop longue')
    .optional(),
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur invalide (format hexadécimal requis)'),
  icon: z.string()
    .max(50, 'Nom d\'icône trop long')
    .optional(),
  order: z.number()
    .int('Ordre doit être un entier')
    .min(0, 'Ordre invalide')
    .default(0)
})

// Validation middleware
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.issues.map(err => err.message).join(', ')
      return { success: false, error: errorMessage }
    }
    return { success: false, error: 'Erreur de validation inconnue' }
  }
}

// Validation de sécurité pour les entrées utilisateur
export class SecurityValidator {
  static sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Supprimer les balises HTML
      .replace(/javascript:/gi, '') // Supprimer les scripts JS
      .replace(/on\w+=/gi, '') // Supprimer les event handlers
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email)
  }

  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    
    if (password.length < SECURITY_CONFIG.MIN_PASSWORD_LENGTH) {
      errors.push(`Le mot de passe doit contenir au moins ${SECURITY_CONFIG.MIN_PASSWORD_LENGTH} caractères`)
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une minuscule')
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une majuscule')
    }
    
    if (!/\d/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre')
    }
    
    if (!/[@$!%*?&.]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un caractère spécial')
    }
    
    // Vérifier les mots de passe courants
    const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein']
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Le mot de passe est trop courant')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }

  static validateFileUpload(file: File): { valid: boolean; error?: string } {
    // Types de fichiers autorisés
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
    const maxSize = 5 * 1024 * 1024 // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Type de fichier non autorisé' }
    }
    
    if (file.size > maxSize) {
      return { valid: false, error: 'Fichier trop volumineux (max 5MB)' }
    }
    
    return { valid: true }
  }

  static validateURL(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  static sanitizeHTML(html: string): string {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/javascript:/gi, '')
  }
}
