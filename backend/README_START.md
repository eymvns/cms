# 🚀 Guide de Démarrage du Serveur Backend

## ⚠️ Problème : Port 5000 déjà utilisé

Si vous voyez l'erreur `EADDRINUSE: address already in use :::5000`, cela signifie qu'un autre processus utilise déjà le port 5000.

## ✅ Solutions

### Solution 1 : Utiliser le script batch (Recommandé)
```bash
cd backend
start-server.bat
```

### Solution 2 : Arrêter manuellement les processus Node.js
```powershell
# Arrêter tous les processus Node.js
taskkill /F /IM node.exe

# Attendre 2 secondes
timeout /t 2

# Démarrer le serveur
cd backend
npm start
```

### Solution 3 : Changer le port
Modifiez `backend/server.js` ligne 76 :
```javascript
const PORT = process.env.PORT || 5001; // Changez 5000 en 5001
```

Et dans `frontend/.env` :
```
REACT_APP_API_URL=http://localhost:5001/api
```

## 🔍 Vérifier que le serveur fonctionne

1. Ouvrez votre navigateur sur : `http://localhost:5000`
2. Vous devriez voir : `{"message":"VOIMA API - Plateforme de Covoiturage"}`

## 📊 Vérifier les trajets

1. Ouvrez : `http://localhost:5000/api/trips`
2. Vous devriez voir une liste de trajets JSON

## 🐛 Dépannage

### MongoDB n'est pas connecté
```bash
# Vérifier que MongoDB est démarré
mongod

# Ou utiliser MongoDB Atlas (cloud)
# Mettre l'URI dans backend/.env
```

### Le serveur ne démarre pas
1. Vérifiez que toutes les dépendances sont installées :
   ```bash
   cd backend
   npm install
   ```

2. Vérifiez les erreurs dans la console

3. Vérifiez que le port 5000 est libre :
   ```powershell
   netstat -ano | findstr :5000
   ```

## ✅ Une fois le serveur démarré

Vous devriez voir :
```
📡 Using MONGO_URI from environment
✅ MongoDB connected successfully
Server running on port 5000
```

Ensuite, démarrez le frontend dans un autre terminal :
```bash
cd frontend
npm start
```

