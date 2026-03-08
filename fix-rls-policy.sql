-- ===================================================================
-- CORRECTION RLS POUR TABLE PROFILES
-- ===================================================================

-- Option 1: Désactiver RLS complètement (pour portfolio public)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Option 2: Activer RLS avec policy publique (alternative)
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- 
-- -- Policy pour lecture publique
-- CREATE POLICY "Enable read access for all users" ON profiles
--   FOR SELECT USING (true);
-- 
-- -- Policy pour insertion (admin seulement)
-- CREATE POLICY "Enable insert for admin" ON profiles
--   FOR INSERT WITH CHECK (email = 'ibrahimforgo59@gmail.com');
-- 
-- -- Policy pour mise à jour (admin seulement)
-- CREATE POLICY "Enable update for admin" ON profiles
--   FOR UPDATE USING (email = 'ibrahimforgo59@gmail.com');

-- ===================================================================
-- VÉRIFICATION
-- ===================================================================

-- Vérifier que la table est accessible
SELECT count(*) FROM profiles;

-- Vérifier les données existantes
SELECT * FROM profiles LIMIT 5;

-- ===================================================================
-- INSTRUCTIONS
-- ===================================================================

-- 1. Exécuter ce script dans Supabase SQL Editor
-- 2. Rafraîchir l'application
-- 3. Tester l'admin panel: http://localhost:3001/admin/profile
-- 4. Tester la page principale: http://localhost:3001
