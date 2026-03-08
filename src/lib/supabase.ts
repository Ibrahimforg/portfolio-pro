import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
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
        Insert: {
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          color?: string | null
          order?: number
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          order?: number
        }
      }
      projects: {
        Row: {
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
        Insert: {
          title: string
          slug: string
          short_description: string
          full_description: string
          category_id: number
          technologies: string[]
          context?: string | null
          constraints?: string | null
          architecture?: string | null
          implementation?: string | null
          results?: string | null
          featured_image?: string | null
          gallery?: string[] | null
          demo_url?: string | null
          github_url?: string | null
          completion_date: string
          featured?: boolean
          order?: number
          published?: boolean
        }
        Update: {
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
      }
      skill_categories: {
        Row: {
          id: number
          name: string
          slug: string
          description: string | null
          icon: string | null
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          order?: number
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          order?: number
        }
      }
      skills: {
        Row: {
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
        Insert: {
          name: string
          category_id: number
          level: 'Expert' | 'Advanced' | 'Intermediate'
          years_experience?: number | null
          icon?: string | null
          description?: string | null
          order?: number
        }
        Update: {
          name?: string
          category_id?: number
          level?: 'Expert' | 'Advanced' | 'Intermediate'
          years_experience?: number | null
          icon?: string | null
          description?: string | null
          order?: number
        }
      }
      experiences: {
        Row: {
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
        Insert: {
          title: string
          company: string
          location: string
          start_date: string
          end_date?: string | null
          current?: boolean
          description: string
          accomplishments?: string[]
          technologies?: string[]
          order?: number
        }
        Update: {
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
      }
      services: {
        Row: {
          id: number
          title: string
          slug: string
          short_description: string
          full_description: string
          icon: string | null
          deliverables: string[]
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          title: string
          slug: string
          short_description: string
          full_description: string
          icon?: string | null
          deliverables?: string[]
          order?: number
        }
        Update: {
          title?: string
          slug?: string
          short_description?: string
          full_description?: string
          icon?: string | null
          deliverables?: string[]
          order?: number
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string
          title: string | null
          bio: string | null
          profile_image_url: string | null
          email: string | null
          phone: string | null
          location: string | null
          website: string | null
          github: string | null
          linkedin: string | null
          created_at: string
          updated_at: string
          // Champs étendus du profil
          display_name: string | null
          hero_title: string | null
          hero_subtitle: string | null
          seo_title: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          brand_colors: {
            primary: string | null
            secondary: string | null
            accent: string | null
          } | null
          layout_preferences: {
            hero_style: string | null
            card_layout: string | null
            animation_level: string | null
          } | null
          skills_config: {
            categories: Array<{
              id: string
              title: string
              display_mode: string
              max_skills: number
              show_levels: boolean
            }> | null
            global_display_mode: string | null
            show_levels: boolean
          } | null
          contact_preferences: {
            email_visible: boolean
            phone_visible: boolean
            location_visible: boolean
            social_links: {
              github: boolean
              linkedin: boolean
              twitter: boolean
            }
          } | null
          working_hours: {
            monday: { open: string; close: string; available: boolean } | null
            tuesday: { open: string; close: string; available: boolean } | null
            wednesday: { open: string; close: string; available: boolean } | null
            thursday: { open: string; close: string; available: boolean } | null
            friday: { open: string; close: string; available: boolean } | null
            saturday: { available: boolean } | null
            sunday: { available: boolean } | null
            timezone: string | null
          } | null
          auto_reply_message: string | null
          featured_projects: number[] | null
        }
        Insert: {
          user_id: string
          full_name: string
          title?: string | null
          bio?: string | null
          profile_image_url?: string | null
          email?: string | null
          phone?: string | null
          location?: string | null
          website?: string | null
          github?: string | null
          linkedin?: string | null
        }
        Update: {
          full_name?: string
          title?: string | null
          bio?: string | null
          profile_image_url?: string | null
          email?: string | null
          phone?: string | null
          location?: string | null
          website?: string | null
          github?: string | null
          linkedin?: string | null
        }
      }
      multimedia: {
        Row: {
          id: string
          title: string
          description: string | null
          file_url: string
          file_type: string
          file_size: number
          thumbnail_url: string | null
          alt_text: string | null
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          title: string
          description?: string | null
          file_url: string
          file_type: string
          file_size: number
          thumbnail_url?: string | null
          alt_text?: string | null
          published?: boolean
        }
        Update: {
          title?: string
          description?: string | null
          file_url?: string
          file_type?: string
          file_size?: number
          thumbnail_url?: string | null
          alt_text?: string | null
          published?: boolean
        }
      }
      contact_submissions: {
        Row: {
          id: number
          name: string
          email: string
          subject: string
          message: string
          read: boolean
          created_at: string
        }
        Insert: {
          name: string
          email: string
          subject: string
          message: string
        }
        Update: {
          name?: string
          email?: string
          subject?: string
          message?: string
          read?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
