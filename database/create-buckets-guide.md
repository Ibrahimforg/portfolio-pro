# Guide pour créer les buckets Supabase Storage

## Problème actuel
L'erreur "Bucket not found" signifie que les buckets Supabase Storage n'existent pas encore.

## Étapes pour créer les buckets

### 1. Aller dans Supabase Dashboard
1. Connectez-vous à votre projet Supabase
2. Allez dans la section "Storage"

### 2. Créer le bucket "profile-images"
1. Cliquez sur "New bucket"
2. Nom du bucket : `profile-images`
3. Public bucket : Oui (pour accès public aux images)
4. Créer le bucket

### 3. Créer le bucket "documents"
1. Cliquez sur "New bucket"  
2. Nom du bucket : `documents`
3. Public bucket : Non (accès authentifié seulement)
4. Créer le bucket

### 4. Configurer les politiques (optionnel)
Pour le bucket `documents`, vous pouvez configurer :
- Qui peut uploader (tout le monde ou authentifié)
- Qui peut télécharger (tout le monde ou authentifié)

## Après création des buckets
1. Exécutez le script SQL complet dans Supabase SQL Editor
2. Les erreurs "Bucket not found" disparaîtront
3. L'upload d'images et CV fonctionnera

## Vérification
- Les buckets apparaîtront dans la liste Storage
- Les URLs dans la base de données pointeront vers les bons buckets
