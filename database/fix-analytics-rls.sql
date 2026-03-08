-- CORRECTION POLITIQUES RLS ANALYTICS
-- Permet l'insertion automatique des events analytics

-- Suppression des anciennes politiques restrictives
DROP POLICY IF EXISTS "Anyone can insert analytics events" ON analytics_events;
DROP POLICY IF EXISTS "Anyone can insert analytics sessions" ON analytics_sessions;
DROP POLICY IF EXISTS "Anyone can insert performance data" ON analytics_page_performance;
DROP POLICY IF EXISTS "Anyone can insert conversions" ON analytics_conversions;
DROP POLICY IF EXISTS "Anyone can insert errors" ON analytics_errors;
DROP POLICY IF EXISTS "Anyone can insert custom events" ON analytics_custom_events;

-- Nouvelles politiques permissives pour insertion automatique
CREATE POLICY "Anyone can insert analytics events" ON analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert analytics sessions" ON analytics_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert performance data" ON analytics_page_performance FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert conversions" ON analytics_conversions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert errors" ON analytics_errors FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert custom events" ON analytics_custom_events FOR INSERT WITH CHECK (true);

-- Politiques de lecture pour utilisateurs authentifiés
CREATE POLICY "Authenticated users can view analytics events" ON analytics_events FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view analytics sessions" ON analytics_sessions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view performance data" ON analytics_page_performance FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view conversions" ON analytics_conversions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view errors" ON analytics_errors FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view custom events" ON analytics_custom_events FOR SELECT USING (auth.role() = 'authenticated');

-- Message de succès
SELECT 'Politiques RLS analytics corrigées avec succès !' as status;
