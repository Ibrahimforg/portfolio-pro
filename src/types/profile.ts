// Types TypeScript pour le système de profil avancé
// Architecture modulaire et extensible

export interface BrandColors {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textSecondary: string
}

export interface LayoutPreferences {
  header_style: 'fixed' | 'static' | 'sticky'
  sidebar_position: 'left' | 'right' | 'none'
  content_width: 'max-w-4xl' | 'max-w-6xl' | 'max-w-7xl' | 'full'
  card_style: 'modern' | 'classic' | 'minimal'
  button_style: 'rounded' | 'square' | 'pill'
}

export interface SkillsConfig {
  [category: string]: {
    title: string
    skills: string[]
    icon: string
    level: 'expert' | 'advanced' | 'intermediate'
  }
}

export interface ContactPreferences {
  show_phone: boolean
  show_email: boolean
  show_location: boolean
  show_company: boolean
  show_budget: boolean
  show_timeline: boolean
  required_fields: string[]
}

export interface WorkingHours {
  days: {
    [day: string]: {
      open?: string
      close?: string
      available: boolean
    }
  }
  timezone?: string
}

export interface ExtendedProfileData {
  // Interface existante (compatibilité)
  full_name: string
  title: string
  bio: string
  profile_image_url: string | null
  email?: string
  phone?: string
  location?: string
  website?: string
  linkedin?: string
  github?: string
  resume_url?: string
  social_links?: Record<string, string>
  available_for_hire?: boolean
  user_id?: string
  is_admin?: boolean

  // Nouveaux champs interface visuelle
  display_name: string
  hero_title: string
  hero_subtitle: string

  // Personnalisation avancée
  brand_colors: BrandColors
  layout_preferences: LayoutPreferences
  animations_enabled: boolean

  // SEO & Marketing
  seo_title: string
  seo_description: string
  seo_keywords: string[]

  // Compétences dynamiques
  skills_config: SkillsConfig
  skills_display_mode: 'grid' | 'list' | 'cards'

  // Configuration contact
  contact_preferences: ContactPreferences
  auto_reply_message: string

  // Affichage avancé
  featured_projects: number[]
  testimonials_enabled: boolean
  blog_enabled: boolean
  newsletter_enabled: boolean

  // Internationalisation
  language: string
  timezone: string
  currency: string
  working_hours: WorkingHours

  // Métadonnées
  created_at?: string
  updated_at?: string
}

// Valeurs par défaut pour l'initialisation
export const DEFAULT_PROFILE_DATA: Partial<ExtendedProfileData> = {
  display_name: 'Ibrahim FORGO',
  hero_title: 'Ingénieur Réseau & Système',
  hero_subtitle: 'Conception, Automatisation, Infrastructure',
  
  brand_colors: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#10B981',
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F1F5F9',
    textSecondary: '#94A3B8'
  },
  
  layout_preferences: {
    header_style: 'fixed',
    sidebar_position: 'left',
    content_width: 'max-w-7xl',
    card_style: 'modern',
    button_style: 'rounded'
  },
  
  animations_enabled: true,
  
  seo_title: 'Ibrahim FORGO - Ingénieur Réseaux & Systèmes | Expert Cloud & Cybersécurité',
  seo_description: 'Ingénieur spécialisé en réseaux, télécommunications, cloud et cybersécurité. Solutions innovantes pour entreprises modernes.',
  seo_keywords: ['ingénieur réseaux', 'cybersécurité', 'cloud aws azure', 'télécommunications', 'infrastructure it'],
  
  skills_config: {
    réseau: {
      title: 'Réseau & Infrastructure',
      skills: ['Cisco', 'Firewall', 'VPN', 'Switching', 'Routing'],
      icon: 'network',
      level: 'expert'
    },
    télécom: {
      title: 'Télécommunications',
      skills: ['Fibre Optique', '5G', 'VoIP', 'MPLS', 'SD-WAN'],
      icon: 'radio',
      level: 'advanced'
    },
    cloud: {
      title: 'Cloud & Virtualisation',
      skills: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'VMware'],
      icon: 'cloud',
      level: 'advanced'
    },
    sécurité: {
      title: 'Cybersécurité',
      skills: ['CyberSécurité', 'Audit', 'SIEM', 'Pentest', 'ISO 27001'],
      icon: 'shield',
      level: 'intermediate'
    }
  },
  
  skills_display_mode: 'grid',
  
  contact_preferences: {
    show_phone: true,
    show_email: true,
    show_location: true,
    show_company: false,
    show_budget: false,
    show_timeline: false,
    required_fields: ['name', 'email', 'message']
  },
  
  auto_reply_message: 'Merci pour votre message ! Je vous répondrai dans les plus brefs délais. Pour toute urgence, n\'hésitez pas à me contacter directement par téléphone.',
  
  featured_projects: [1, 2, 3],
  testimonials_enabled: true,
  blog_enabled: false,
  newsletter_enabled: false,
  
  language: 'fr',
  timezone: 'UTC',
  currency: 'EUR',
  
  working_hours: {
    days: {
      monday: { open: '09:00', close: '18:00', available: true },
      tuesday: { open: '09:00', close: '18:00', available: true },
      wednesday: { open: '09:00', close: '18:00', available: true },
      thursday: { open: '09:00', close: '18:00', available: true },
      friday: { open: '09:00', close: '18:00', available: true },
      saturday: { available: false },
      sunday: { available: false }
    },
    timezone: 'UTC'
  }
}

// Types pour les composants de formulaire
export interface FormFieldProps {
  label: string
  value: any
  onChange: (value: any) => void
  placeholder?: string
  type?: 'text' | 'email' | 'tel' | 'url' | 'textarea'
  required?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  helper?: string
  error?: string
}

export interface SectionProps {
  title: string
  description?: string
  icon?: React.ReactNode
  children: React.ReactNode
  defaultExpanded?: boolean
}

// Types pour la validation
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
}

export interface ValidationSchema {
  [field: string]: ValidationRule[]
}
