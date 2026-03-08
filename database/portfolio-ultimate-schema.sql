-- PORTFOLIO ULTIMATE SCHEMA - ARCHITECTURE FUTURE-PROOF
-- Système complet avec analytics, multimédia et toutes fonctionnalités professionnelles
-- Ordre d'exécution : 1. Nettoyage -> 2. Core -> 3. Analytics -> 4. Multimédia -> 5. Optimisations

-- ===================================================================
-- ÉTAPE 1: NETTOYAGE COMPLET ET SÉCURISÉ
-- ===================================================================

-- Suppression de toutes les tables existantes (fresh start)
DROP TABLE IF EXISTS contact_submissions CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS experiences CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS skill_categories CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS profile_images CASCADE;
DROP TABLE IF EXISTS cv_files CASCADE;

-- Nettoyage des tables analytics si existantes
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS analytics_sessions CASCADE;
DROP TABLE IF EXISTS analytics_page_performance CASCADE;
DROP TABLE IF EXISTS analytics_conversions CASCADE;
DROP TABLE IF EXISTS analytics_errors CASCADE;
DROP TABLE IF EXISTS analytics_custom_events CASCADE;
DROP TABLE IF EXISTS analytics_daily_stats CASCADE;

-- Nettoyage des vues et fonctions
DROP MATERIALIZED VIEW IF EXISTS analytics_daily_stats CASCADE;
DROP FUNCTION IF EXISTS refresh_daily_stats() CASCADE;
DROP FUNCTION IF EXISTS get_session_duration(UUID) CASCADE;
DROP FUNCTION IF EXISTS cleanup_old_analytics() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- ===================================================================
-- ÉTAPE 2: STRUCTURE CORE PORTFOLIO
-- ===================================================================

-- Table des catégories de projets
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  color VARCHAR(20),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des catégories de compétences
CREATE TABLE skill_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des projets (améliorée avec multimédia)
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  technologies TEXT[] DEFAULT '{}',
  context TEXT,
  constraints TEXT,
  architecture TEXT,
  implementation TEXT,
  results TEXT,
  featured_image TEXT,
  gallery TEXT[], -- URLs des images de galerie
  video_url TEXT, -- URL vidéo démonstrative
  demo_url TEXT,
  github_url TEXT,
  completion_date DATE NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des compétences (améliorée pour multimédia)
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category_id INTEGER REFERENCES skill_categories(id) ON DELETE SET NULL,
  level VARCHAR(20) CHECK (level IN ('Expert', 'Advanced', 'Intermediate')) NOT NULL,
  years_experience INTEGER,
  icon VARCHAR(100),
  description TEXT,
  skill_type VARCHAR(50) DEFAULT 'technical', -- technical, multimedia, soft
  multimedia_url TEXT, -- Pour démonstrations vidéo/son
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des expériences professionnelles
CREATE TABLE experiences (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  current BOOLEAN DEFAULT FALSE,
  description TEXT NOT NULL,
  accomplishments TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des services
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  icon VARCHAR(100),
  deliverables TEXT[] DEFAULT '{}',
  pricing JSONB, -- Flexibilité pour tarifs complexes
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des soumissions de contact
CREATE TABLE contact_submissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  budget VARCHAR(100),
  timeline VARCHAR(100),
  read BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'new', -- new, in_progress, completed, archived
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des profils (simplifiée et optimisée)
CREATE TABLE profiles (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  bio TEXT NOT NULL,
  profile_image_url TEXT,
  email TEXT,
  phone VARCHAR(50),
  location VARCHAR(255),
  website VARCHAR(255),
  linkedin VARCHAR(255),
  github VARCHAR(255),
  resume_url TEXT, -- Lien vers CV dans Supabase Storage
  social_links JSONB, -- Flexibilité pour réseaux sociaux
  available_for_hire BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================================
-- ÉTAPE 3: SYSTÈME ANALYTICS COMPLET
-- ===================================================================

-- Table principale des événements analytics
CREATE TABLE analytics_events (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  event_type VARCHAR(50) NOT NULL,
  event_category VARCHAR(50),
  event_action VARCHAR(100),
  event_label VARCHAR(255),
  event_value INTEGER,
  page_url TEXT,
  page_title VARCHAR(255),
  referrer_url TEXT,
  user_agent TEXT,
  ip_address INET,
  country_code CHAR(2),
  city VARCHAR(100),
  device_type VARCHAR(20),
  browser VARCHAR(50),
  os VARCHAR(50),
  screen_resolution VARCHAR(20),
  viewport_size VARCHAR(20),
  language VARCHAR(10),
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  utm_term VARCHAR(255),
  utm_content VARCHAR(255),
  custom_properties JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des sessions utilisateur
CREATE TABLE analytics_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  session_duration INTEGER,
  page_views INTEGER DEFAULT 0,
  unique_page_views INTEGER DEFAULT 0,
  bounce BOOLEAN DEFAULT TRUE,
  entry_page TEXT,
  exit_page TEXT,
  referrer_url TEXT,
  traffic_source VARCHAR(50),
  device_type VARCHAR(20),
  browser VARCHAR(50),
  os VARCHAR(50),
  country_code CHAR(2),
  city VARCHAR(100),
  converted BOOLEAN DEFAULT FALSE,
  conversion_value DECIMAL(10,2),
  custom_data JSONB
);

-- Table des performances pages
CREATE TABLE analytics_page_performance (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID REFERENCES analytics_sessions(id),
  page_url TEXT NOT NULL,
  page_title VARCHAR(255),
  load_time INTEGER,
  dom_content_loaded INTEGER,
  first_contentful_paint INTEGER,
  largest_contentful_paint INTEGER,
  first_input_delay INTEGER,
  cumulative_layout_shift DECIMAL(5,3),
  time_to_interactive INTEGER,
  page_size INTEGER,
  resource_count INTEGER,
  error_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des conversions et objectifs
CREATE TABLE analytics_conversions (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID REFERENCES analytics_sessions(id),
  user_id UUID REFERENCES auth.users(id),
  conversion_type VARCHAR(50) NOT NULL,
  conversion_value DECIMAL(10,2),
  conversion_currency CHAR(3) DEFAULT 'EUR',
  funnel_step INTEGER,
  goal_name VARCHAR(100),
  goal_description TEXT,
  attribution_model VARCHAR(20) DEFAULT 'last_click',
  attributed_touches JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des erreurs et exceptions
CREATE TABLE analytics_errors (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID REFERENCES analytics_sessions(id),
  error_type VARCHAR(50) NOT NULL,
  error_message TEXT,
  error_stack TEXT,
  error_url TEXT,
  error_line INTEGER,
  error_column INTEGER,
  user_agent TEXT,
  page_url TEXT,
  browser VARCHAR(50),
  os VARCHAR(50),
  error_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des événements personnalisés
CREATE TABLE analytics_custom_events (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID REFERENCES analytics_sessions(id),
  user_id UUID REFERENCES auth.users(id),
  event_name VARCHAR(100) NOT NULL,
  event_category VARCHAR(50),
  event_data JSONB,
  event_value DECIMAL(10,2),
  event_currency CHAR(3) DEFAULT 'EUR',
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================================
-- ÉTAPE 4: SYSTÈME MULTIMÉDIA PROFESSIONNEL
-- ===================================================================

-- Table multimédia centrale
CREATE TABLE multimedia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_type VARCHAR(50) NOT NULL, -- image, video, audio, document
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size BIGINT,
  duration INTEGER, -- Pour vidéos en secondes
  resolution VARCHAR(20), -- 1080p, 4K, etc.
  format VARCHAR(20), -- mp4, webm, jpg, png, etc.
  tags TEXT[],
  category VARCHAR(100),
  alt_text TEXT,
  metadata JSONB,
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT TRUE,
  project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,
  skill_id INTEGER REFERENCES skills(id) ON DELETE SET NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des galeries de projets (relation multiple)
CREATE TABLE project_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  multimedia_id UUID REFERENCES multimedia(id) ON DELETE CASCADE,
  caption TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================================
-- ÉTAPE 5: INDEX OPTIMISÉS
-- ===================================================================

-- Index pour les tables principales
CREATE INDEX idx_projects_category ON projects(category_id);
CREATE INDEX idx_projects_published ON projects(published);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_completion_date ON projects(completion_date DESC);
CREATE INDEX idx_skills_category ON skills(category_id);
CREATE INDEX idx_skills_type ON skills(skill_type);
CREATE INDEX idx_experiences_current ON experiences(current);
CREATE INDEX idx_experiences_dates ON experiences(start_date DESC, end_date DESC);
CREATE INDEX idx_services_order ON services(order_index);
CREATE INDEX idx_contact_status ON contact_submissions(status);
CREATE INDEX idx_contact_created ON contact_submissions(created_at DESC);

-- Index pour analytics
CREATE INDEX idx_events_session ON analytics_events(session_id);
CREATE INDEX idx_events_type ON analytics_events(event_type);
CREATE INDEX idx_events_date ON analytics_events(created_at);
CREATE INDEX idx_events_user ON analytics_events(user_id);
CREATE INDEX idx_sessions_user ON analytics_sessions(user_id);
CREATE INDEX idx_sessions_date ON analytics_sessions(session_start);
CREATE INDEX idx_sessions_duration ON analytics_sessions(session_duration);
CREATE INDEX idx_performance_page ON analytics_page_performance(page_url);
CREATE INDEX idx_performance_date ON analytics_page_performance(created_at);
CREATE INDEX idx_conversions_type ON analytics_conversions(conversion_type);
CREATE INDEX idx_conversions_date ON analytics_conversions(created_at);
CREATE INDEX idx_conversions_user ON analytics_conversions(user_id);
CREATE INDEX idx_errors_type ON analytics_errors(error_type);
CREATE INDEX idx_errors_date ON analytics_errors(created_at);
CREATE INDEX idx_custom_events_name ON analytics_custom_events(event_name);
CREATE INDEX idx_custom_events_date ON analytics_custom_events(created_at);

-- Index pour multimédia
CREATE INDEX idx_multimedia_type ON multimedia(file_type);
CREATE INDEX idx_multimedia_category ON multimedia(category);
CREATE INDEX idx_multimedia_published ON multimedia(published);
CREATE INDEX idx_multimedia_featured ON multimedia(featured);
CREATE INDEX idx_multimedia_project ON multimedia(project_id);
CREATE INDEX idx_multimedia_skill ON multimedia(skill_id);
CREATE INDEX idx_gallery_project ON project_gallery(project_id);
CREATE INDEX idx_gallery_multimedia ON project_gallery(multimedia_id);

-- Index GIN pour JSONB
CREATE INDEX idx_events_custom_properties ON analytics_events USING GIN (custom_properties);
CREATE INDEX idx_sessions_custom_data ON analytics_sessions USING GIN (custom_data);
CREATE INDEX idx_custom_events_data ON analytics_custom_events USING GIN (event_data);
CREATE INDEX idx_multimedia_metadata ON multimedia USING GIN (metadata);
CREATE INDEX idx_multimedia_tags ON multimedia USING GIN (tags);
CREATE INDEX idx_profiles_social_links ON profiles USING GIN (social_links);
CREATE INDEX idx_services_pricing ON services USING GIN (pricing);

-- ===================================================================
-- ÉTAPE 6: VUES MATÉRIALISÉES ET FONCTIONS
-- ===================================================================

-- Vue matérialisée pour les statistiques quotidiennes
CREATE MATERIALIZED VIEW analytics_daily_stats AS
SELECT 
  DATE(session_start) as date,
  COUNT(DISTINCT id) as sessions,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(*) as total_events,
  COUNT(DISTINCT entry_page) as unique_pages,
  AVG(session_duration) as avg_session_duration,
  SUM(CASE WHEN bounce = TRUE THEN 1 ELSE 0 END)::FLOAT / COUNT(*) as bounce_rate,
  SUM(CASE WHEN converted = TRUE THEN 1 ELSE 0 END) as conversions,
  COUNT(DISTINCT device_type) as unique_devices
FROM analytics_sessions
GROUP BY DATE(session_start);

-- Vue pour les projets multimédia
CREATE VIEW multimedia_projects AS
SELECT 
  p.*,
  array_agg(m.file_url) as multimedia_files,
  array_agg(m.file_type) as multimedia_types
FROM projects p
LEFT JOIN project_gallery pg ON p.id = pg.project_id
LEFT JOIN multimedia m ON pg.multimedia_id = m.id
WHERE p.published = true
GROUP BY p.id;

-- Fonction trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skill_categories_updated_at BEFORE UPDATE ON skill_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON experiences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON contact_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_multimedia_updated_at BEFORE UPDATE ON multimedia FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_gallery_updated_at BEFORE UPDATE ON project_gallery FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonctions utilitaires analytics
CREATE OR REPLACE FUNCTION refresh_daily_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY analytics_daily_stats;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_session_duration(session_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  duration INTEGER;
BEGIN
  SELECT EXTRACT(EPOCH FROM (COALESCE(session_end, NOW()) - session_start))::INTEGER
  INTO duration
  FROM analytics_sessions
  WHERE id = session_uuid;
  
  RETURN duration;
END;
$$ LANGUAGE plpgsql;

-- Fonctions utilitaires multimédia
CREATE OR REPLACE FUNCTION get_project_multimedia(project_id INTEGER)
RETURNS TABLE (
  file_url TEXT,
  file_type VARCHAR(50),
  thumbnail_url TEXT,
  order_index INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.file_url,
    m.file_type,
    m.thumbnail_url,
    pg.order_index
  FROM project_gallery pg
  JOIN multimedia m ON pg.multimedia_id = m.id
  WHERE pg.project_id = project_id
  ORDER BY pg.order_index;
END;
$$ LANGUAGE plpgsql;

-- ===================================================================
-- ÉTAPE 7: RLS (ROW LEVEL SECURITY)
-- ===================================================================

-- Activation RLS pour les tables principales
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE multimedia ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_gallery ENABLE ROW LEVEL SECURITY;

-- Activation RLS pour analytics
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_page_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_custom_events ENABLE ROW LEVEL SECURITY;

-- Politiques pour lecture publique (tables principales)
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Skill categories are viewable by everyone" ON skill_categories FOR SELECT USING (true);
CREATE POLICY "Published projects are viewable by everyone" ON projects FOR SELECT USING (published = true);
CREATE POLICY "Skills are viewable by everyone" ON skills FOR SELECT USING (true);
CREATE POLICY "Experiences are viewable by everyone" ON experiences FOR SELECT USING (true);
CREATE POLICY "Services are viewable by everyone" ON services FOR SELECT USING (true);
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Published multimedia are viewable by everyone" ON multimedia FOR SELECT USING (published = true);
CREATE POLICY "Project gallery are viewable by everyone" ON project_gallery FOR SELECT USING (true);

-- Politiques pour lecture (analytics)
-- Note: analytics_daily_stats est une vue matérialisée, pas une table
-- La politique sera appliquée via la table source analytics_sessions

-- Politiques pour écriture (tables principales)
CREATE POLICY "Categories are manageable by authenticated users" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Skill categories are manageable by authenticated users" ON skill_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Projects are manageable by authenticated users" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Skills are manageable by authenticated users" ON skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Experiences are manageable by authenticated users" ON experiences FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Services are manageable by authenticated users" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Contact submissions are insertable by everyone" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Contact submissions are manageable by authenticated users" ON contact_submissions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Profiles are manageable by authenticated users" ON profiles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Multimedia are manageable by authenticated users" ON multimedia FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Project gallery are manageable by authenticated users" ON project_gallery FOR ALL USING (auth.role() = 'authenticated');

-- Politiques pour écriture (analytics)
CREATE POLICY "Anyone can insert analytics events" ON analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert analytics sessions" ON analytics_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert performance data" ON analytics_page_performance FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert conversions" ON analytics_conversions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert errors" ON analytics_errors FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert custom events" ON analytics_custom_events FOR INSERT WITH CHECK (true);

-- ===================================================================
-- ÉTAPE 8: DONNÉES INITIALES OPTIMISÉES
-- ===================================================================

-- Données pour catégories de projets
INSERT INTO categories (name, slug, description, icon, color, order_index) VALUES
('Web', 'web', 'Projets de développement web applications', 'Globe', '#3B82F6', 1),
('Mobile', 'mobile', 'Applications mobiles iOS et Android', 'Smartphone', '#8B5CF6', 2),
('Réseaux', 'reseaux', 'Solutions réseau et infrastructure', 'Network', '#10B981', 3),
('Multimédia', 'multimedia', 'Projets multimédia et créatifs', 'Camera', '#FF6B6B', 4);

-- Données pour catégories de compétences
INSERT INTO skill_categories (name, slug, description, icon, order_index) VALUES
('Frontend', 'frontend', 'Technologies de développement frontend', 'Monitor', 1),
('Backend', 'backend', 'Technologies de développement backend', 'Server', 2),
('DevOps', 'devops', 'Outils et pratiques DevOps', 'Settings', 3),
('Multimédia', 'multimedia', 'Outils et logiciels multimédia', 'Camera', 4),
('Base de données', 'database', 'Systèmes de gestion de données', 'Database', 5);

-- Message de succès
SELECT 'Portfolio Ultimate Schema créé avec succès - Architecture future-proof prête !' as status;
