-- VÉRIFICATION COMPLÈTE DU PROFIL
-- Exécuter dans Supabase Dashboard → SQL Editor

-- 1. Vérifier si la table profiles existe et sa structure
SELECT 
  'Table profiles' as table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Vérifier tous les enregistrements dans profiles
SELECT 
  'Tous les profils' as info,
  id,
  user_id,
  full_name,
  title,
  email,
  display_name,
  hero_title,
  hero_subtitle,
  created_at,
  updated_at
FROM profiles;

-- 3. Vérifier spécifiquement le profil avec l'email attendu
SELECT 
  'Profil ibrahimforgo59@gmail.com' as info,
  id,
  user_id,
  full_name,
  title,
  email,
  display_name,
  hero_title,
  hero_subtitle,
  created_at,
  updated_at
FROM profiles 
WHERE email = 'ibrahimforgo59@gmail.com';

-- 4. Vérifier le statut RLS
SELECT 
  'RLS Status' as info,
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'profiles';

-- 5. Compter les enregistrements
SELECT 
  'Count profiles' as info,
  COUNT(*) as total_records
FROM profiles;

-- 6. Vérifier les colonnes étendues
SELECT 
  'Extended columns check' as info,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND table_schema = 'public'
  AND column_name IN ('display_name', 'hero_title', 'hero_subtitle', 'seo_title', 'seo_description', 'seo_keywords');
