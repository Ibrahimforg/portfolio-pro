-- Création de la table profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT,
  title TEXT,
  bio TEXT,
  profile_image_url TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création d'un index sur l'email pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Création d'un trigger pour mettre à jour le champ updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER IF NOT EXISTS update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insertion d'un profil par défaut si la table est vide
INSERT INTO profiles (full_name, title, bio, email)
SELECT 
  'Ibrahim FORGO',
  'Ingénieur Réseaux & Développeur',
  'Développeur Full-Stack passionné par les technologies modernes.',
  'ibrahimforgo59@gmail.com'
WHERE NOT EXISTS (SELECT 1 FROM profiles);

-- Création de la politique RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre toutes les opérations sur la table profiles
CREATE POLICY "Allow all operations on profiles" ON profiles
  FOR ALL USING (true) WITH CHECK (true);

-- Création du bucket pour les images de profil si nécessaire
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Politique pour permettre l'upload d'images de profil
CREATE POLICY "Allow image uploads" ON storage.objects
  FOR ALL WITH CHECK (bucket_id = 'profile-images');

-- Création de la table cv si elle n'existe pas
CREATE TABLE IF NOT EXISTS cv (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_url TEXT,
  file_name TEXT,
  file_size BIGINT,
  content_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger pour updated_at sur la table cv
CREATE TRIGGER IF NOT EXISTS update_cv_updated_at 
  BEFORE UPDATE ON cv 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Politique RLS pour la table cv
ALTER TABLE cv ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on cv" ON cv
  FOR ALL USING (true) WITH CHECK (true);

-- Création du bucket pour les fichiers CV
INSERT INTO storage.buckets (id, name, public)
VALUES ('cv-files', 'cv-files', true)
ON CONFLICT (id) DO NOTHING;

-- Politique pour permettre l'upload de fichiers CV
CREATE POLICY "Allow CV uploads" ON storage.objects
  FOR ALL WITH CHECK (bucket_id = 'cv-files');
