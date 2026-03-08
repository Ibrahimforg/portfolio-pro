-- SQL PERSONNALISÉ pour votre structure exacte de table profiles
-- Basé sur votre schema existant qui n'a PAS user_id et is_admin

-- ÉTAPE 1: Ajouter les colonnes manquantes
DO $$
BEGIN
    -- Ajouter la colonne user_id si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE profiles ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        RAISE NOTICE 'Colonne user_id ajoutée avec succès';
    END IF;

    -- Ajouter la colonne is_admin si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'is_admin'
    ) THEN
        ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Colonne is_admin ajoutée avec succès';
    END IF;
END $$;

-- ÉTAPE 2: Lier votre utilisateur auth.users à votre profil profiles existant
UPDATE profiles 
SET 
    user_id = (SELECT id FROM auth.users WHERE email = 'ibrahimforgo59@gmail.com'),
    is_admin = true
WHERE email = 'ibrahimforgo59@gmail.com';

-- ÉTAPE 3: Vérification et message
SELECT 
    'Structure profiles mise à jour avec succès !' as status,
    (SELECT user_id FROM profiles WHERE email = 'ibrahimforgo59@gmail.com') as user_id_added,
    (SELECT is_admin FROM profiles WHERE email = 'ibrahimforgo59@gmail.com') as is_admin_set;
