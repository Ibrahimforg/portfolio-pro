/**
 * INTERFACES CENTRALISÉES - Élimine les duplications
 * Basé sur le schéma Supabase portfolio-ultimate-schema.sql
 */

// Types définis manuellement car absents du Database type
export interface Project {
  id: number
  title: string
  slug: string
  short_description: string
  full_description: string
  category_id: number
  technologies: string[]
  context: string | null
  constraints: string | null
  architecture: string | null
  implementation: string | null
  results: string | null
  featured_image: string | null
  gallery: string[] | null
  demo_url: string | null
  github_url: string | null
  completion_date: string
  featured: boolean
  order: number
  published: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  order: number
  created_at: string
  updated_at: string
}

export interface Skill {
  id: number
  name: string
  category_id: number
  level: 'Expert' | 'Advanced' | 'Intermediate'
  years_experience: number | null
  icon: string | null
  description: string | null
  order: number
  created_at: string
  updated_at: string
}

export interface SkillCategory {
  id: number
  name: string
  slug: string
  description: string | null
  icon: string | null
  order: number
  created_at: string
  updated_at: string
}

export interface Experience {
  id: number
  title: string
  company: string
  location: string
  start_date: string
  end_date: string | null
  current: boolean
  description: string
  accomplishments: string[]
  technologies: string[]
  order: number
  created_at: string
  updated_at: string
}

export interface Service {
  id: number
  title: string
  slug: string
  short_description: string
  full_description: string
  icon: string | null
  deliverables: string[]
  pricing: PricingInfo | null
  order: number
  created_at: string
  updated_at: string
}

export interface ContactSubmission {
  id: number
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  created_at: string
}

export interface Multimedia {
  id: string  // UUID
  title: string
  description: string | null
  file_type: string  // image, video, audio, document
  file_url: string
  thumbnail_url: string | null
  file_size: number  // BIGINT
  duration: number | null  // Pour vidéos en secondes
  resolution: string | null  // 1080p, 4K, etc.
  format: string | null  // mp4, webm, jpg, png, etc.
  tags: string[]
  category: string | null
  alt_text: string | null
  metadata: Record<string, any>  // JSONB
  featured: boolean
  published: boolean
  project_id: number | null
  skill_id: number | null
  order_index: number
  created_at: string
  updated_at: string
}

export interface Profile {
  id: number
  full_name: string
  title: string
  bio: string
  profile_image_url: string | null
  cv_file_url: string | null
  email: string | null
  phone: string | null
  location: string | null
  website: string | null
  linkedin: string | null
  github: string | null
  created_at: string
  updated_at: string
}

// Types spécifiques pour remplacer les any

// Types avec relations
export interface ProjectWithCategory extends Project {
  categories: {
    name: string
    color: string | null
    icon: string | null
  }
}

export interface SkillWithCategory extends Skill {
  skill_categories: {
    name: string
    icon: string | null
  }
}

export interface ExperienceWithTechnologies extends Experience {
  technologies: string[]
  accomplishments: string[]
}

// Types pour les formulaires (Insert) - Interfaces simples
export interface ProjectInsert {
  title: string
  slug: string
  short_description: string
  full_description: string
  category_id?: number
  technologies?: string[]
  published?: boolean
}

export interface CategoryInsert {
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  order_index?: number
}

export interface SkillInsert {
  name: string
  category_id?: number
  level: 'Expert' | 'Advanced' | 'Intermediate'
  years_experience?: number
  icon?: string
  description?: string
  order_index?: number
}

export interface ExperienceInsert {
  title: string
  company: string
  location: string
  start_date: string
  end_date?: string
  current?: boolean
  description: string
  order_index?: number
}

export interface ServiceInsert {
  title: string
  slug: string
  short_description: string
  full_description: string
  icon?: string
  order_index?: number
}

export interface ContactSubmissionInsert {
  name: string
  email: string
  subject: string
  message: string
  phone?: string
  company?: string
}

export interface ProfileInsert {
  full_name: string
  title: string
  bio: string
  profile_image_url?: string
  email?: string
  phone?: string
  location?: string
  website?: string
  linkedin?: string
  github?: string
}

export interface PricingInfo {
  type: 'fixed' | 'hourly' | 'project'
  amount: number
  currency: string
  description?: string
}

export interface IconComponent {
  [key: string]: React.ComponentType<any>
}

export interface AnalyticsPerformance {
  score: number
  lcp: number
  fid: number
  cls: number
  ttfb: number
}

export interface SupabaseFilterOptions {
  select?: string
  filter?: Record<string, unknown>
  order?: { column: string; ascending?: boolean }
  limit?: number
  single?: boolean
}

// Types pour les mises à jour (Update)
export interface ProjectUpdate {
  title?: string
  slug?: string
  short_description?: string
  full_description?: string
  category_id?: number
  technologies?: string[]
  context?: string | null
  constraints?: string | null
  architecture?: string | null
  implementation?: string | null
  results?: string | null
  featured_image?: string | null
  gallery?: string[] | null
  demo_url?: string | null
  github_url?: string | null
  completion_date?: string
  featured?: boolean
  order?: number
  published?: boolean
}

export interface CategoryUpdate {
  name?: string
  slug?: string
  description?: string | null
  icon?: string | null
  color?: string | null
  order?: number
}

export interface SkillUpdate {
  name?: string
  category_id?: number
  level?: 'Expert' | 'Advanced' | 'Intermediate'
  years_experience?: number | null
  icon?: string | null
  description?: string | null
  order?: number
}

export interface ExperienceUpdate {
  title?: string
  company?: string
  location?: string
  start_date?: string
  end_date?: string | null
  current?: boolean
  description?: string
  accomplishments?: string[]
  technologies?: string[]
  order?: number
}

export interface ServiceUpdate {
  title?: string
  slug?: string
  short_description?: string
  full_description?: string
  icon?: string | null
  deliverables?: string[]
  order?: number
}

export interface ContactSubmissionUpdate {
  name?: string
  email?: string
  subject?: string
  message?: string
  read?: boolean
}

// Types utilitaires
export interface ProjectCardProps {
  project: ProjectWithCategory
  loading?: boolean
}

export interface SkillGroup {
  category: string
  items: string[]
}

export interface Education {
  degree: string
  school: string
  period: string
  description: string
}

export interface AdminStats {
  projects: number
  categories: number
  skills: number
  contacts: number
}

// Types pour les filtres et recherche
export interface ProjectFilters {
  category?: string
  featured?: boolean
  search?: string
  technologies?: string[]
}

export interface SkillFilters {
  category?: string
  level?: string
  search?: string
}

export interface ContactFilters {
  read?: boolean
  search?: string
  dateRange?: {
    start: string
    end: string
  }
}

// Types pour les états des formulaires
export interface FormState<T> {
  data: T
  loading: boolean
  error: string | null
  success: boolean
}

// Types pour la pagination
export interface PaginationInfo {
  page: number
  limit: number
  total: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: PaginationInfo
}

export interface SkillWithCategory extends Skill {
  skill_categories: {
    name: string
    icon: string | null
  }
}

export interface ExperienceWithTechnologies extends Experience {
  technologies: string[]
  accomplishments: string[]
}

// Types Supabase - Utilisés pour les opérations CRUD
// Note: Ces types sont générés automatiquement par Supabase CLI

// Types utilitaires
export interface ProjectCardProps {
  project: ProjectWithCategory
  loading?: boolean
}

export interface SkillGroup {
  category: string
  items: string[]
}

export interface Education {
  degree: string
  school: string
  period: string
  description: string
}

export interface AdminStats {
  projects: number
  categories: number
  skills: number
  contacts: number
}

// Types pour les filtres et recherche
export interface ProjectFilters {
  category?: string
  featured?: boolean
  search?: string
  technologies?: string[]
}

export interface SkillFilters {
  category?: string
  level?: string
  search?: string
}

export interface ContactFilters {
  read?: boolean
  search?: string
  dateRange?: {
    start: string
    end: string
  }
}

// Types pour les états des formulaires
export interface FormState<T> {
  data: T
  loading: boolean
  error: string | null
  success: boolean
}

// Types pour la pagination
export interface PaginationInfo {
  page: number
  limit: number
  total: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: PaginationInfo
}
