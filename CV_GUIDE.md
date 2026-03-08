# GUIDE GESTION DU CV

## 📄 OÙ PLACER VOTRE CV

### 🎯 EMPLACEMENT DU FICHIER
- **Dossier** : `public/cv.pdf`
- **Chemin complet** : `c:\Users\ibrah\OneDrive\Desktop\PORTFOLIO\portfolio-pro\public\cv.pdf`

### 📁 STRUCTURE DES DOSSIERS
```
portfolio-pro/
├── public/                    ← DOSSIER IMPORTANT
│   ├── cv.pdf                ← VOTRE CV ICI ✅
│   ├── manifest.json
│   ├── offline.html
│   └── sw.js
├── src/
├── i18n.json
└── package.json
```

## 🔄 COMMENT METTRE À JOUR VOTRE CV

### Étape 1 : Préparez votre nouveau CV
1. **Créez votre CV** au format PDF
2. **Nommez-le** exactement `cv.pdf` (important !)

### Étape 2 : Remplacez l'ancien fichier
1. **Allez dans** : `public/`
2. **Supprimez** l'ancien `cv.pdf` (s'il existe)
3. **Copiez** votre nouveau `cv.pdf` dans ce dossier

### Étape 3 : C'est tout ! 🎉
- **Aucun code à modifier**
- **Aucune configuration**
- **Le bouton fonctionnera** automatiquement

## 💡 POURQUOI C'EST SIMPLE ?

Le code pointe vers `/cv.pdf` qui signifie :
- **`/`** = Racine du dossier `public`
- **`cv.pdf`** = Nom du fichier

Donc `/cv.pdf` = `public/cv.pdf`

## 🚀 EXEMPLE CONCRET

**AVANT (pas de CV) :**
```
public/
├── manifest.json
├── offline.html
└── sw.js
```
Résultat : Bouton ne fait rien ❌

**APRÈS (avec CV) :**
```
public/
├── cv.pdf          ← VOTRE CV ✅
├── manifest.json
├── offline.html
└── sw.js
```
Résultat : Bouton télécharge le CV ✅

## 📱 TESTEZ LE RÉSULTAT

1. **Lancez le site** : `npm run dev`
2. **Allez sur** : http://localhost:3002
3. **Cliquez sur** "Télécharger CV"
4. **Vérifiez** que votre CV se télécharge

## 🔧 SI VOUS VOULEZ CHANGER LE NOM

Si vous préférez un autre nom (ex: `ibrahim-zerbo-cv.pdf`) :

1. **Renommez le fichier** dans `public/`
2. **Modifiez le code** dans :
   - `src/app/page.tsx` (ligne 225)
   - `src/components/HeroSection.tsx` (ligne 175)

Changez `href="/cv.pdf"` par `href="/nouveau-nom.pdf"`

## 🎯 CONSEIL DE PRO

**Gardez toujours le même nom** (`cv.pdf`) pour :
- ✅ Simplicité
- ✅ Pas de code à modifier
- ✅ Mise à jour en 30 secondes

---

**RÉSUMÉ** : Mettez votre `cv.pdf` dans le dossier `public` et c'est tout ! 📄✨
