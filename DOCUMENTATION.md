# Portfolio Pro - Documentation Essentielle

## 📋 Vue d'ensemble

Portfolio professionnel Next.js 16 avec Supabase, TypeScript strict et authentification 2FA sécurisée.

## 🚀 Démarrage Rapide

```bash
npm install --legacy-peer-deps
npm run dev
```

## 🏗️ Architecture

- **Framework**: Next.js 16.1.6 avec Turbopack
- **Langage**: TypeScript (mode strict)
- **Base de données**: Supabase PostgreSQL
- **Authentification**: Supabase Auth + 2FA TOTP
- **Styling**: TailwindCSS
- **Déploiement**: Vercel

## 📁 Structure Clé

```
src/
├── app/                # Pages Next.js 13+
├── components/         # Composants React
├── lib/               # Utilitaires (auth, logger, etc.)
├── hooks/             # Hooks personnalisés
├── types/             # Types TypeScript
└── middleware/        # Middleware Next.js
```

## 🔐 Sécurité

- **2FA TOTP**: Implémentation sécurisée avec otplib
- **Headers**: CSP, HSTS, XSS protection
- **Logging**: Logger structuré pour événements de sécurité
- **RLS**: Politiques Row Level Security Supabase

## 📊 Monitoring

- **Logger**: Système de logging structuré (`src/lib/logger.ts`)
- **Performance**: Web Vitals tracking
- **Analytics**: Vercel Analytics intégré

## 🛠️ Scripts Utiles

```bash
npm run dev          # Développement
npm run build        # Production
npm run quality      # Lint + Type-check + Tests
npm run cleanup      # Nettoyage cache
```

## 🧪 Tests

```bash
npm run test         # Tests Jest
npm run test:coverage # Couverture de code
```

## 📝 Notes de Maintenance

- **TypeScript strict** activé
- **Console.log** remplacé par logger structuré
- **2FA** sécurisé (plus de simulation)
- **Documentation** consolidée (fichier unique)

---

*Dernière mise à jour: 28/03/2026*
