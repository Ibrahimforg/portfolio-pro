-- ANALYTICS & MONITORING AVANCÉ - NIVEAU PROFESSIONNEL
-- Tables pour tracking complet, analytics temps réel et monitoring avancé

-- 1. Table principale des événements analytics
CREATE TABLE analytics_events (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  event_type VARCHAR(50) NOT NULL, -- page_view, project_click, cv_download, contact_form, etc.
  event_category VARCHAR(50), -- content, user_interaction, conversion
  event_action VARCHAR(100), -- view, click, download, submit
  event_label VARCHAR(255), -- project_name, page_name, etc.
  event_value INTEGER, -- valeur numérique (duration, count, etc.)
  page_url TEXT,
  page_title VARCHAR(255),
  referrer_url TEXT,
  user_agent TEXT,
  ip_address INET,
  country_code CHAR(2),
  city VARCHAR(100),
  device_type VARCHAR(20), -- desktop, mobile, tablet
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
  custom_properties JSONB, -- propriétés personnalisées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table des sessions utilisateur
CREATE TABLE analytics_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  session_duration INTEGER, -- en secondes
  page_views INTEGER DEFAULT 0,
  unique_page_views INTEGER DEFAULT 0,
  bounce BOOLEAN DEFAULT TRUE, -- true si 1 page vue seulement
  entry_page TEXT,
  exit_page TEXT,
  referrer_url TEXT,
  traffic_source VARCHAR(50), -- direct, organic, social, referral, email, paid
  device_type VARCHAR(20),
  browser VARCHAR(50),
  os VARCHAR(50),
  country_code CHAR(2),
  city VARCHAR(100),
  converted BOOLEAN DEFAULT FALSE, -- a effectué une action de conversion
  conversion_value DECIMAL(10,2), -- valeur de conversion
  custom_data JSONB
);

-- 3. Table des performances pages
CREATE TABLE analytics_page_performance (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID REFERENCES analytics_sessions(id),
  page_url TEXT NOT NULL,
  page_title VARCHAR(255),
  load_time INTEGER, -- temps de chargement en ms
  dom_content_loaded INTEGER, -- DOMContentLoaded en ms
  first_contentful_paint INTEGER, -- FCP en ms
  largest_contentful_paint INTEGER, -- LCP en ms
  first_input_delay INTEGER, -- FID en ms
  cumulative_layout_shift DECIMAL(5,3), -- CLS
  time_to_interactive INTEGER, -- TTI en ms
  page_size INTEGER, -- taille en bytes
  resource_count INTEGER, -- nombre de ressources
  error_count INTEGER DEFAULT 0, -- erreurs JavaScript
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Table des conversions et objectifs
CREATE TABLE analytics_conversions (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID REFERENCES analytics_sessions(id),
  user_id UUID REFERENCES auth.users(id),
  conversion_type VARCHAR(50) NOT NULL, -- contact_form, cv_download, project_view, etc.
  conversion_value DECIMAL(10,2),
  conversion_currency CHAR(3) DEFAULT 'EUR',
  funnel_step INTEGER, -- étape dans le tunnel de conversion
  goal_name VARCHAR(100),
  goal_description TEXT,
  attribution_model VARCHAR(20) DEFAULT 'last_click', -- last_click, first_click, linear, time_decay
  attributed_touches JSONB, -- points d'attribution
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Table des erreurs et exceptions
CREATE TABLE analytics_errors (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID REFERENCES analytics_sessions(id),
  error_type VARCHAR(50) NOT NULL, -- javascript_error, network_error, console_error
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

-- 6. Table des événements personnalisés (business metrics)
CREATE TABLE analytics_custom_events (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID REFERENCES analytics_sessions(id),
  user_id UUID REFERENCES auth.users(id),
  event_name VARCHAR(100) NOT NULL,
  event_category VARCHAR(50),
  event_data JSONB,
  event_value DECIMAL(10,2),
  event_currency CHAR(3) DEFAULT 'EUR',
  tags TEXT[], -- tags pour catégorisation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CRÉER LES INDEX APRÈS LES TABLES
-- Index pour analytics_events
CREATE INDEX idx_events_session ON analytics_events(session_id);
CREATE INDEX idx_events_type ON analytics_events(event_type);
CREATE INDEX idx_events_date ON analytics_events(created_at);
CREATE INDEX idx_events_user ON analytics_events(user_id);

-- Index pour analytics_sessions
CREATE INDEX idx_sessions_user ON analytics_sessions(user_id);
CREATE INDEX idx_sessions_date ON analytics_sessions(session_start);
CREATE INDEX idx_sessions_duration ON analytics_sessions(session_duration);

-- Index pour analytics_page_performance
CREATE INDEX idx_performance_page ON analytics_page_performance(page_url);
CREATE INDEX idx_performance_date ON analytics_page_performance(created_at);

-- Index pour analytics_conversions
CREATE INDEX idx_conversions_type ON analytics_conversions(conversion_type);
CREATE INDEX idx_conversions_date ON analytics_conversions(created_at);
CREATE INDEX idx_conversions_user ON analytics_conversions(user_id);

-- Index pour analytics_errors
CREATE INDEX idx_errors_type ON analytics_errors(error_type);
CREATE INDEX idx_errors_date ON analytics_errors(created_at);

-- Index pour analytics_custom_events
CREATE INDEX idx_custom_events_name ON analytics_custom_events(event_name);
CREATE INDEX idx_custom_events_date ON analytics_custom_events(created_at);

-- Index GIN pour les colonnes JSONB
CREATE INDEX idx_events_custom_properties ON analytics_events USING GIN (custom_properties);
CREATE INDEX idx_sessions_custom_data ON analytics_sessions USING GIN (custom_data);
CREATE INDEX idx_custom_events_data ON analytics_custom_events USING GIN (event_data);

-- Vue matérialisée pour les statistiques quotidiennes
CREATE MATERIALIZED VIEW analytics_daily_stats AS
SELECT 
  DATE(created_at) as date,
  COUNT(DISTINCT session_id) as sessions,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(*) as total_events,
  COUNT(DISTINCT page_url) as unique_pages,
  AVG(session_duration) as avg_session_duration,
  SUM(CASE WHEN bounce = TRUE THEN 1 ELSE 0 END)::FLOAT / COUNT(*) as bounce_rate,
  SUM(CASE WHEN converted = TRUE THEN 1 ELSE 0 END) as conversions,
  COUNT(DISTINCT ip_address) as unique_visitors
FROM analytics_sessions
GROUP BY DATE(created_at);

-- Trigger pour mettre à jour la vue matérialisée
CREATE OR REPLACE FUNCTION refresh_daily_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY analytics_daily_stats;
END;
$$ LANGUAGE plpgsql;

-- Fonctions utilitaires
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

-- Nettoyage automatique des anciennes données
CREATE OR REPLACE FUNCTION cleanup_old_analytics()
RETURNS void AS $$
BEGIN
  -- Supprimer les événements de plus de 2 ans
  DELETE FROM analytics_events WHERE created_at < NOW() - INTERVAL '2 years';
  
  -- Supprimer les sessions de plus de 2 ans
  DELETE FROM analytics_sessions WHERE session_start < NOW() - INTERVAL '2 years';
  
  -- Supprimer les erreurs de plus de 6 mois
  DELETE FROM analytics_errors WHERE created_at < NOW() - INTERVAL '6 months';
  
  -- Supprimer les performances de plus de 1 an
  DELETE FROM analytics_page_performance WHERE created_at < NOW() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;
