-- MIGRATION ANALYTICS - RÉPARATION CONFLITS
-- Script pour migrer vers le nouveau schéma analytics sans conflits

-- 1. D'ABORD VERIFIER L'ÉTAT ACTUEL
-- Tables existantes à vérifier dans Supabase:
-- - analytics_events (ancienne version ?)
-- - analytics_sessions (ancienne version ?)
-- - analytics_page_performance
-- - analytics_conversions
-- - analytics_errors
-- - analytics_custom_events

-- 2. STRATÉGIE DE MIGRATION SÉCURISÉE

-- ÉTAPE 1: Sauvegarder les données existantes (si précieuses)
CREATE TABLE IF NOT EXISTS analytics_events_backup AS
SELECT * FROM analytics_events;

CREATE TABLE IF NOT EXISTS analytics_sessions_backup AS
SELECT * FROM analytics_sessions;

-- ÉTAPE 2: Supprimer les anciennes tables en conflit
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS analytics_sessions CASCADE;
DROP TABLE IF EXISTS analytics_page_performance CASCADE;
DROP TABLE IF EXISTS analytics_conversions CASCADE;
DROP TABLE IF EXISTS analytics_errors CASCADE;
DROP TABLE IF EXISTS analytics_custom_events CASCADE;

-- ÉTAPE 3: Supprimer les anciennes vues et fonctions
DROP MATERIALIZED VIEW IF EXISTS analytics_daily_stats CASCADE;
DROP FUNCTION IF EXISTS refresh_daily_stats() CASCADE;
DROP FUNCTION IF EXISTS get_session_duration(UUID) CASCADE;
DROP FUNCTION IF EXISTS cleanup_old_analytics() CASCADE;

-- ÉTAPE 4: Nettoyer les anciennes politiques RLS
DROP POLICY IF EXISTS "Anyone can insert analytics events" ON analytics_events;
DROP POLICY IF EXISTS "Anyone can insert analytics sessions" ON analytics_sessions;
DROP POLICY IF EXISTS "Anyone can insert performance data" ON analytics_page_performance;
DROP POLICY IF EXISTS "Anyone can insert conversions" ON analytics_conversions;
DROP POLICY IF EXISTS "Anyone can insert errors" ON analytics_errors;
DROP POLICY IF EXISTS "Anyone can insert custom events" ON analytics_custom_events;
DROP POLICY IF EXISTS "Daily stats are viewable by authenticated users" ON analytics_daily_stats;
DROP POLICY IF EXISTS "Admins can view all analytics events" ON analytics_events;

-- ÉTAPE 5: Créer le nouveau schéma propre
-- (Le contenu de analytics-schema.sql sera exécuté après)

-- NOTE IMPORTANTE:
-- 1. Exécuter d'abord CE script de migration
-- 2. Ensuite exécuter analytics-schema.sql 
-- 3. Vérifier que tout fonctionne dans /admin/analytics

-- Message de succès
SELECT 'Migration préparée - Prêt à exécuter le nouveau schéma analytics' as status;
