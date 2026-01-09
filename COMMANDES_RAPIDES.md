# ⚡ Commandes Rapides - Où Exécuter Quoi

## ❌ Erreur que vous voyez:
```
ENOENT: no such file or directory, open 'C:\Users\adaym\Desktop\CMS\package.json'
```

**Problème:** Vous êtes dans le mauvais dossier! Il n'y a pas de `package.json` à la racine.

---

## ✅ Solution: Aller dans le Bon Dossier

### Pour le Backend:

```powershell
# 1. Aller dans le dossier backend
cd backend

# 2. Vérifier que vous êtes au bon endroit (devrait afficher package.json)
dir package.json

# 3. Maintenant vous pouvez exécuter:
npm install    # Si pas encore fait
npm start      # Pour démarrer le serveur
npm run dev    # Pour le mode développement (avec auto-reload)
```

### Pour le Frontend:

```powershell
# 1. Aller dans le dossier frontend
cd frontend

# 2. Vérifier que vous êtes au bon endroit
dir package.json

# 3. Maintenant vous pouvez exécuter:
npm install    # Si pas encore fait
npm start      # Pour démarrer l'application React
```

---

## 🎯 Structure des Dossiers

```
CMS/                          ← Vous êtes ICI (pas de package.json ici)
├── backend/                  ← Aller ICI pour backend
│   ├── package.json         ← package.json est ICI
│   ├── server.js
│   └── ...
├── frontend/                 ← Aller ICI pour frontend
│   ├── package.json         ← package.json est ICI
│   └── ...
└── ...
```

---

## 📋 Commandes Complètes (Copier-Coller)

### Terminal 1 - Backend:
```powershell
cd C:\Users\adaym\Desktop\CMS\backend
npm install
node utils/seeder.js
npm start
```

### Terminal 2 - Frontend:
```powershell
cd C:\Users\adaym\Desktop\CMS\frontend
npm install
npm start
```

---

## 🔍 Vérification

### Vérifier que vous êtes dans le bon dossier:
```powershell
# Devrait afficher le chemin avec \backend ou \frontend
pwd

# Ou dans CMD:
cd
```

### Vérifier que package.json existe:
```powershell
# Devrait afficher package.json
dir package.json
```

---

## 💡 Astuce: Navigation Rapide

### Dans PowerShell:
```powershell
# Aller directement au backend
cd backend

# Revenir à la racine
cd ..

# Aller au frontend depuis la racine
cd frontend
```

### Dans CMD:
```cmd
cd backend
cd ..
cd frontend
```

---

## ✅ Checklist

- [ ] Être dans le dossier `backend` pour les commandes backend
- [ ] Être dans le dossier `frontend` pour les commandes frontend
- [ ] Vérifier avec `dir package.json` que le fichier existe
- [ ] Exécuter `npm install` avant `npm start`

---

## 🚀 Workflow Complet

### 1. Installation (une seule fois):
```powershell
# Backend
cd backend
npm install

# Frontend (nouveau terminal)
cd frontend
npm install
```

### 2. Démarrage quotidien:
```powershell
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

---

**💡 Rappel:** Toujours vérifier que vous êtes dans le bon dossier avec `dir package.json` avant d'exécuter les commandes npm!










