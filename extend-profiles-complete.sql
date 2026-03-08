-- EXTENSION COMPLÈTE TABLE PROFILES - SYSTÈME HAUT DE GAMME ÉVOLUTIF
-- Exécuter dans Supabase Dashboard → SQL Editor

-- ===================================================================
-- ÉTAPE 1: EXTENSION PERSONNALISATION VISUELLE
-- ===================================================================

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS display_name VARCHAR(255),          -- "Ibrahim FORGO" (header)
ADD COLUMN IF NOT EXISTS hero_title VARCHAR(255),              -- "Ingénieur Réseau & Système" (titre principal)
ADD COLUMN IF NOT EXISTS hero_subtitle VARCHAR(255),           -- "Conception, Automatisation, Infrastructure" (sous-titre)
ADD COLUMN IF NOT EXISTS brand_colors JSONB,                    -- Couleurs personnalisées
ADD COLUMN IF NOT EXISTS layout_preferences JSONB,             -- Mise en page préférences
ADD COLUMN IF NOT EXISTS animations_enabled BOOLEAN DEFAULT TRUE;

-- ===================================================================
-- ÉTAPE 2: EXTENSION MÉTADONNÉES SEO
-- ===================================================================

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS seo_keywords TEXT[];

-- ===================================================================
-- ÉTAPE 3: EXTENSION CONFIGURATION COMPÉTENCES
-- ===================================================================

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS skills_config JSONB,                 -- Configuration compétences affichées
ADD COLUMN IF NOT EXISTS skills_display_mode VARCHAR(20) DEFAULT 'grid'; -- grid/list/cards

-- ===================================================================
-- ÉTAPE 4: EXTENSION CONFIGURATION CONTACT
-- ===================================================================

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS contact_preferences JSONB,            -- Champs contact visibles
ADD COLUMN IF NOT EXISTS auto_reply_message TEXT;               -- Message auto-réponse

-- ===================================================================
-- ÉTAPE 5: EXTENSION PRÉFÉRENCES AFFICHAGE
-- ===================================================================

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS featured_projects INTEGER[],            -- Projets en vedette
ADD COLUMN IF NOT EXISTS testimonials_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS blog_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS newsletter_enabled BOOLEAN DEFAULT FALSE;

-- ===================================================================
-- ÉTAPE 6: EXTENSION PRÉFÉRENCES AVANCÉES
-- ===================================================================

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'fr',     -- Langue par défaut
ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'UTC',    -- Fuseau horaire
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'EUR',       -- Devise pour tarifs
ADD COLUMN IF NOT EXISTS working_hours JSONB;                    -- Horaires disponibilité

-- ===================================================================
-- ÉTAPE 7: MIGRATION DONNÉES EXISTANTES
-- ===================================================================

UPDATE profiles SET 
  -- Données principales interface
  display_name = COALESCE(full_name, 'Ibrahim FORGO'),
  hero_title = COALESCE(title, 'Ingénieur Réseau & Système'),
  hero_subtitle = 'Conception, Automatisation, Infrastructure',
  
  -- Configuration compétences par défaut
  skills_config = '{
    "réseau": {
      "title": "Réseau & Infrastructure",
      "skills": ["Cisco", "Firewall", "VPN", "Switching", "Routing"],
      "icon": "network",
      "level": "expert"
    },
    "télécom": {
      "title": "Télécommunications",
      "skills": ["Fibre Optique", "5G", "VoIP", "MPLS", "SD-WAN"],
      "icon": "radio",
      "level": "advanced"
    },
    "cloud": {
      "title": "Cloud & Virtualisation",
      "skills": ["AWS", "Azure", "Docker", "Kubernetes", "VMware"],
      "icon": "cloud",
      "level": "advanced"
    },
    "sécurité": {
      "title": "Cybersécurité",
      "skills": ["CyberSécurité", "Audit", "SIEM", "Pentest", "ISO 27001"],
      "icon": "shield",
      "level": "intermediate"
    }
  }'::jsonb,
  
  -- Couleurs marque par défaut (thème actuel)
  brand_colors = '{
    "primary": "#3B82F6",
    "secondary": "#8B5CF6", 
    "accent": "#10B981",
    "background": "#0F172A",
    "surface": "#1E293B",
    "text": "#F1F5F9",
    "textSecondary": "#94A3B8"
  }'::jsonb,
  
  -- Préférences layout par défaut
  layout_preferences = '{
    "header_style": "fixed",
    "sidebar_position": "left",
    "content_width": "max-w-7xl",
    "card_style": "modern",
    "button_style": "rounded"
  }'::jsonb,
  
  -- Préférences contact par défaut
  contact_preferences = '{
    "show_phone": true,
    "show_email": true,
    "show_location": true,
    "show_company": false,
    "show_budget": false,
    "show_timeline": false,
    "required_fields": ["name", "email", "message"]
  }'::jsonb,
  
  -- SEO par défaut
  seo_title = 'Ibrahim FORGO - Ingénieur Réseaux & Systèmes | Expert Cloud & Cybersécurité',
  seo_description = 'Ingénieur spécialisé en réseaux, télécommunications, cloud et cybersécurité. Solutions innovantes pour entreprises modernes.',
  seo_keywords = ARRAY['ingénieur réseaux', 'cybersécurité', 'cloud aws azure', 'télécommunications', 'infrastructure it'],
  
  -- Horaires disponibilité
  working_hours = '{
    "monday": {"open": "09:00", "close": "18:00", "available": true},
    "tuesday": {"open": "09:00", "close": "18:00", "available": true},
    "wednesday": {"open": "09:00", "close": "18:00", "available": true},
    "thursday": {"open": "09:00", "close": "18:00", "available": true},
    "friday": {"open": "09:00", "close": "18:00", "available": true},
    "saturday": {"available": false},
    "sunday": {"available": false},
    "timezone": "UTC"
  }'::jsonb,
  
  -- Message auto-réponse par défaut
  auto_reply_message = 'Merci pour votre message ! Je vous répondrai dans les plus brefs délais. Pour toute urgence, n''hésitez pas à me contacter directement par téléphone.',
  
  -- Projets en vedette (sera mis à jour manuellement)
  featured_projects = ARRAY[1, 2, 3]
  
WHERE email = 'ibrahimforgo59@gmail.com';

-- ===================================================================
-- ÉTAPE 8: VÉRIFICATION STRUCTURE
-- ===================================================================

SELECT 
  'Profiles table étendue avec succès !' as status,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- ===================================================================
-- ÉTAPE 9: VÉRIFICATION DONNÉES MIGRÉES
-- ===================================================================

SELECT 
  'Données profil migrées avec succès !' as status,
  display_name,
  hero_title,
  hero_subtitle,
  seo_title,
  language,
  timezone,
  currency,
  animations_enabled,
  testimonials_enabled
FROM profiles 
WHERE email = 'ibrahimforgo59@gmail.com';
