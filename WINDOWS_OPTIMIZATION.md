# Guide d'Optimisation Windows pour le Développement

## 🚀 SOLUTIONS IMPLEMENTÉES

### Scripts de Nettoyage Automatique
- **cleanup.ps1** : Script PowerShell pour nettoyer les processus
- **cleanup.bat** : Script batch Windows alternatif
- **Scripts npm** : `npm run cleanup`, `npm run dev:clean`

### Commandes Rapides
```bash
# Nettoyer et lancer proprement
npm run dev:clean

# Nettoyer uniquement
npm run cleanup

# Tuer tous les processus Node
npm run kill
```

## 🔧 UTILISATION RECOMMANDÉE

### Avant chaque lancement
1. **Nettoyer** : `npm run cleanup`
2. **Lancer** : `npm run dev`
3. **En cas de blocage** : `npm run dev:clean`

### Si ça bloque encore
1. **Ctrl+C** pour arrêter la commande
2. **Nettoyer** : `npm run kill`
3. **Relancer** : `npm run dev:clean`

## ⚡ OPTIMISATIONS WINDOWS

### Variables d'environnement
- NODE_ENV=development
- NODE_OPTIONS=--max-old-space-size=4096

### PowerShell Execution Policy
- Scripts signés avec `-ExecutionPolicy Bypass`
- Sécurité maintenue

## 🎯 RÉSULTATS ATTENDUS

- ✅ Plus de processus zombies
- ✅ Port 3000 toujours libre
- ✅ Lancement rapide (< 30 secondes)
- ✅ Pas de blocages infinis

## 📞 EN CAS DE PROBLÈME

1. Utiliser `cleanup.bat` si PowerShell bloque
2. Vérifier les processus avec `tasklist | findstr node`
3. Redémarrer le terminal si nécessaire
