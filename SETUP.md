# Configuration de l'environnement Portfolio Pro

## Problème actuel
Les variables d'environnement Supabase ne sont pas configurées, ce qui empêche le chargement des données du portfolio.

## Étapes de configuration

### 1. Créer un compte Supabase
- Allez sur https://supabase.com
- Créez un compte gratuit
- Créez un nouveau projet

### 2. Obtenir les clés API
- Dans votre dashboard Supabase, allez dans **Settings > API**
- Copiez:
  - `Project URL` (ex: https://xyz.supabase.co)
  - `anon public` key

### 3. Configurer les variables d'environnement

#### Option A: Utiliser le template
```bash
# Copier le template
cp env.example.template .env.local

# Éditer le fichier avec vos valeurs
# Remplacez les placeholders par vos vraies valeurs Supabase
```

#### Option B: Créer manuellement
Créez un fichier `.env.local` à la racine du projet avec:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Redémarrer le serveur
```bash
# Arrêter le serveur actuel (Ctrl+C)
# Relancer
npm run dev
```

### 5. Vérifier la configuration
```bash
node check-env.js
```

## Configuration de la base de données

Après avoir configuré les variables d'environnement, vous devez créer les tables Supabase nécessaires:

### Tables requises:
- `profiles` - Informations du profil
- `projects` - Projets du portfolio
- `categories` - Catégories de projets
- `skills` - Compétences
- `skill_categories` - Catégories de compétences
- `experiences` - Expériences professionnelles
- `services` - Services proposés
- `contact_submissions` - Formulaires de contact
- `multimedia` - Fichiers multimédia

Vous pouvez utiliser le script SQL fourni dans `database/schema.sql` pour créer ces tables automatiquement.

## Dépannage

### Erreur: "Missing Supabase environment variables"
- Vérifiez que `.env.local` existe
- Vérifiez que les variables sont correctement nommées
- Redémarrez le serveur après modification

### Erreur: "Invalid API key"
- Vérifiez que vous avez copié la bonne clé (anon key, pas service role)
- Vérifiez que l'URL du projet est correcte

### Pages vides / données ne chargent pas
- Vérifiez la console du navigateur pour les erreurs
- Vérifiez que les tables Supabase existent
- Vérifiez que les tables contiennent des données

## Sécurité
- **NE JAMAIS** commit `.env.local` dans git
- **NE JAMAIS** partager vos clés Supabase
- Utilisez toujours des clés `anon` pour le frontend
- Les clés `service_role` ne doivent être utilisées que côté serveur
