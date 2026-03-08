# NETTOYAGE DONNÉES STATIQUES - PLAN D'ACTION

## 🎯 OBJECTIF
Remplacer toutes les données statiques par l'admin panel pour contrôle total

## 📋 ÉLÉMENTS À NETTOYER

### 1. CONFIGURATION SITE (`config/site.ts`)
**AVANT :**
```typescript
name: "Ibrahim FORGO"
title: "Ibrahim FORGO - Ingénieur Réseaux & Développeur Junior"
```

**ACTION :**
- Garder `name` pour le site
- Supprimer `title` statique (viendra de l'admin)

### 2. TYPES PAR DÉFAUT (`types/profile.ts`)
**AVANT :**
```typescript
display_name: 'Ibrahim FORGO'
hero_title: 'Ingénieur Réseau & Système'
hero_subtitle: 'Conception, Automatisation, Infrastructure'
```

**ACTION :**
- Garder comme valeurs par défaut
- Les valeurs réelles viendront de la base de données

### 3. SECTIONS HERO
**AVANT :**
- `PremiumHeroSection.tsx` : Données codées en dur
- `HeroSection.tsx` : Ancien titre "Développeur Full Stack"

**ACTIONS :**
- Connecter à la base de données via admin panel
- Supprimer les titres codés en dur
- Utiliser les données de `profiles` table

### 4. TESTS OBSOLÈTES
**AVANT :**
- `useProfile.test.ts` : Tests "Développeur Full Stack Senior"

**ACTIONS :**
- Mettre à jour les tests avec nouvelles données
- Tester les nouvelles fonctionnalités admin

## 🚀 PLAN D'IMPLÉMENTATION

### ÉTAPE 1 : CONNECTER FRONTEND À LA BASE
1. Créer hook `useProfileData` pour récupérer les données
2. Modifier `PremiumHeroSection` pour utiliser les données dynamiques
3. Modifier `Header` pour utiliser `display_name`

### ÉTAPE 2 : NETTOYER CONFIGURATION
1. Simplifier `site.ts` pour ne garder que l'essentiel
2. Mettre à jour les types par défaut si nécessaire

### ÉTAPE 3 : VALIDATION
1. Tester que l'admin panel contrôle bien l'interface
2. Vérifier que les changements sont répercutés
3. Confirmer qu'il n'y a plus de données statiques

## ✅ RÉSULTAT ATTENDU
- Contrôle total via admin panel
- Interface dynamique et cohérente
- Plus de duplication de données
- Système professionnel unifié
