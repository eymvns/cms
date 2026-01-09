# 🗄️ Configuration MongoDB pour Compass

## 📝 Créer le fichier .env

Créez un fichier `.env` dans le dossier `backend/` avec ce contenu :

```env
MONGO_URI=mongodb://localhost:27017/hotelreserve
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this
CLIENT_URL=http://localhost:3000
```

## 🔌 Connexion MongoDB Compass

### Pour MongoDB Local :

1. **Démarrer MongoDB** :
   ```bash
   # Si MongoDB est installé comme service Windows, il démarre automatiquement
   # Sinon :
   mongod
   ```

2. **Dans MongoDB Compass** :
   - Ouvrez MongoDB Compass
   - Connection string : `mongodb://localhost:27017`
   - Cliquez sur "Connect"

3. **Sélectionner la base** :
   - Cliquez sur `hotelreserve`
   - Vous verrez toutes vos collections !

### Pour MongoDB Atlas (Cloud) :

1. **Obtenir la connection string** :
   - Allez sur https://www.mongodb.com/cloud/atlas
   - Créez un cluster gratuit
   - Cliquez sur "Connect" → "Connect your application"
   - Copiez la connection string

2. **Mettre à jour .env** :
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hotelreserve?retryWrites=true&w=majority
   ```

3. **Dans MongoDB Compass** :
   - Collez la même connection string
   - Cliquez sur "Connect"

## ✅ Vérifier la connexion

```bash
cd backend
node checkTrips.js
```

Vous devriez voir vos données !

