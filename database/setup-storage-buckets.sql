-- CONFIGURATION DES BUCKETS SUPABASE STORAGE
-- Exécuter dans Supabase Dashboard → SQL Editor

-- 1. Création des buckets pour le multimédia
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
('multimedia', 'multimedia', true, 52428800, ARRAY[
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
  'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo',
  'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3',
  'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]),
('profiles', 'profiles', true, 10485760, ARRAY[
  'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'
]),
('documents', 'documents', true, 52428800, ARRAY[
  'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain', 'text/csv'
])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Politiques RLS pour les buckets
-- Politiques pour le bucket multimedia
CREATE POLICY "Anyone can view multimedia files" ON storage.objects FOR SELECT USING (
  bucket_id = 'multimedia' AND auth.role() IS NOT NULL
);

CREATE POLICY "Anyone can upload multimedia files" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'multimedia' AND auth.role() IS NOT NULL
);

CREATE POLICY "Users can update own multimedia files" ON storage.objects FOR UPDATE USING (
  bucket_id = 'multimedia' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own multimedia files" ON storage.objects FOR DELETE USING (
  bucket_id = 'multimedia' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Politiques pour le bucket profiles
CREATE POLICY "Anyone can view profile files" ON storage.objects FOR SELECT USING (
  bucket_id = 'profiles' AND auth.role() IS NOT NULL
);

CREATE POLICY "Users can upload profile files" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'profiles' AND auth.role() IS NOT NULL
);

CREATE POLICY "Users can update own profile files" ON storage.objects FOR UPDATE USING (
  bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own profile files" ON storage.objects FOR DELETE USING (
  bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Politiques pour le bucket documents
CREATE POLICY "Anyone can view document files" ON storage.objects FOR SELECT USING (
  bucket_id = 'documents' AND auth.role() IS NOT NULL
);

CREATE POLICY "Users can upload document files" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'documents' AND auth.role() IS NOT NULL
);

CREATE POLICY "Users can update own document files" ON storage.objects FOR UPDATE USING (
  bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own document files" ON storage.objects FOR DELETE USING (
  bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Message de succès
SELECT 'Buckets Supabase Storage configurés avec succès !' as status;
