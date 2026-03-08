-- DIAGNOSTIC FONDAMENTAL COMPLET - SYSTÈME PROFILS
-- Exécuter dans Supabase Dashboard → SQL Editor

-- 1. Test connexion Supabase
SELECT 
  'Test connexion Supabase' as test,
  NOW() as timestamp,
  version() as postgres_version;

-- 2. Vérifier si table profiles existe
SELECT 
  'Table profiles existence' as test,
  EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
  ) as table_exists;

-- 3. Structure complète de la table
SELECT 
  'Structure table profiles' as test,
  column_name,
  data_type,
  is_nullable,
  character_maximum_length,
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Statut RLS précis
SELECT 
  'RLS Status' as test,
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'profiles';

-- 5. Permissions sur la table
SELECT 
  'Permissions table profiles' as test,
  grantee,
  table_schema,
  table_name,
  privilege_type,
  is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'profiles'
ORDER BY grantee, privilege_type;

-- 6. Données actuelles dans profiles
SELECT 
  'Données profiles' as test,
  COUNT(*) as total_records,
  array_agg(email) as emails,
  MIN(created_at) as oldest_record,
  MAX(updated_at) as latest_record
FROM profiles;

-- 7. Test lecture directe (simule client)
SELECT 
  'Test lecture directe' as test,
  COUNT(*) as readable_records
FROM profiles;

-- 8. Politiques RLS si existantes
SELECT 
  'RLS Policies' as test,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles';
