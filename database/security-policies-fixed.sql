-- 🚨 CORRECTION SÉCURITÉ CRITIQUE - POLITIQUES RLS SÉCURISÉES
-- 
-- PROBLÈME : Les politiques actuelles autorisent N'IMPORTE QUELQUOI authentifié
-- SOLUTION : Restreindre l'accès admin aux administrateurs uniquement

-- ===================================================================
-- POLITIQUES DE LECTURE (PUBLIC)
-- ===================================================================

-- Tout le monde peut lire les données publiques
CREATE POLICY "Enable read access for all users" ON categories FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON skill_categories FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON projects FOR SELECT USING (published = true);
CREATE POLICY "Enable read access for all users" ON skills FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON experiences FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON services FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON contact_submissions FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON profiles FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON multimedia FOR SELECT USING (published = true);
CREATE POLICY "Enable read access for all users" ON project_gallery FOR SELECT USING (true);

-- ===================================================================
-- POLITIQUES D'ÉCRITURE (ADMIN SEULEMENT)
-- ===================================================================

-- Seuls les administrateurs peuvent modifier les données principales
CREATE POLICY "Only admins can manage categories" ON categories FOR ALL USING (
  auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Only admins can manage skill categories" ON skill_categories FOR ALL USING (
  auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Only admins can manage projects" ON projects FOR ALL USING (
  auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Only admins can manage skills" ON skills FOR ALL USING (
  auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Only admins can manage experiences" ON experiences FOR ALL USING (
  auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Only admins can manage services" ON services FOR ALL USING (
  auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Only admins can manage contact submissions" ON contact_submissions FOR ALL USING (
  auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Only admins can manage profiles" ON profiles FOR ALL USING (
  auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Only admins can manage multimedia" ON multimedia FOR ALL USING (
  auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE raw_user_meta_data->>'is_admin' = 'true'
  )
);

CREATE POLICY "Only admins can manage project gallery" ON project_gallery FOR ALL USING (
  auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE raw_user_meta_data->>'is_admin' = 'true'
  )
);

-- ===================================================================
-- POLITIQUES PUBLIQUES (FORMULAIRES)
-- ===================================================================

-- Tout le monde peut soumettre des contacts
CREATE POLICY "Anyone can submit contact forms" ON contact_submissions FOR INSERT WITH CHECK (true);

-- ===================================================================
-- POLITIQUES ANALYTICS (PUBLIC)
-- ===================================================================

-- Tout le monde peut insérer des données analytics (tracking)
CREATE POLICY "Anyone can insert analytics events" ON analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert analytics sessions" ON analytics_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert performance data" ON analytics_page_performance FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert conversions" ON analytics_conversions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert errors" ON analytics_errors FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert custom events" ON analytics_custom_events FOR INSERT WITH CHECK (true);

-- ===================================================================
-- TABLE UTILISATEURS ADMIN (pour la gestion des rôles)
-- ===================================================================

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Politique pour la table admin_users
CREATE POLICY "Admin users can manage admin users" ON admin_users FOR ALL USING (
  auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE raw_user_meta_data->>'is_admin' = 'true'
  )
);

-- ===================================================================
-- INSTRUCTIONS DE DÉPLOIEMENT
-- ===================================================================

/*
1. Exécuter ce script SQL dans Supabase SQL Editor
2. Mettre à jour les métadonnées utilisateur :
   UPDATE auth.users 
   SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": "true"}'
   WHERE email = 'votre-email@exemple.com';

3. Pour ajouter un nouvel admin :
   INSERT INTO admin_users (id, email, is_admin)
   SELECT id, email, true
   FROM auth.users
   WHERE email = 'nouvel-admin@exemple.com';

4. Vérifier les politiques :
   SELECT * FROM pg_policies 
   WHERE tablename IN ('categories', 'projects', 'skills', 'experiences', 'services');
*/
