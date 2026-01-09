# 🗄️ Guide de Connexion à MongoDB Compass

## 📋 Vue d'ensemble

MongoDB Compass est un outil graphique pour visualiser et gérer vos bases de données MongoDB. Ce guide vous explique comment connecter votre application à MongoDB Compass.

## 🔧 Configuration

### Étape 1 : Créer le fichier .env

Créez un fichier `.env` dans le dossier `backend/` :

```bash
cd backend
copy .env.example .env
```

Ou créez-le manuellement avec ce contenu :

```env
MONGO_URI=mongodb://localhost:27017/hotelreserve
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=http://localhost:3000
```

### Étape 2 : Démarrer MongoDB

#### Option A : MongoDB Local (Recommandé pour développement)

1. **Installer MongoDB** (si pas déjà installé) :
   - Télécharger depuis : https://www.mongodb.com/try/download/community
   - Ou utiliser MongoDB via Docker

2. **Démarrer MongoDB** :
   ```bash
   # Windows (si installé comme service, il démarre automatiquement)
   # Sinon, dans un terminal :
   mongod
   
   # Ou avec Docker :
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

3. **Vérifier que MongoDB fonctionne** :
   ```bash
   mongosh
   # Ou
   mongo
   ```

#### Option B : MongoDB Atlas (Cloud)

1. Créer un compte sur https://www.mongodb.com/cloud/atlas
2. Créer un cluster gratuit
3. Obtenir la connection string
4. Mettre à jour `.env` :
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hotelreserve?retryWrites=true&w=majority
   ```

## 🔌 Connexion avec MongoDB Compass

### Étape 1 : Télécharger MongoDB Compass

Téléchargez depuis : https://www.mongodb.com/try/download/compass

### Étape 2 : Se connecter

#### Pour MongoDB Local :

1. Ouvrez MongoDB Compass
2. Dans le champ de connexion, entrez :
   ```
   mongodb://localhost:27017
   ```
3. Cliquez sur "Connect"

#### Pour MongoDB Atlas :

1. Ouvrez MongoDB Compass
2. Dans le champ de connexion, collez votre connection string :
   ```
   mongodb+srv://username:password@cluster.mongodb.net/hotelreserve?retryWrites=true&w=majority
   ```
3. Cliquez sur "Connect"

### Étape 3 : Naviguer vers votre base de données

Une fois connecté :
1. Vous verrez la liste des bases de données
2. Cliquez sur `hotelreserve` (ou le nom de votre base)
3. Vous verrez les collections :
   - `users`
   - `trips`
   - `bookings`
   - `payments`
   - `hotels`
   - etc.

## 📊 Visualiser vos données

### Collections disponibles :

- **users** : Utilisateurs de l'application
- **trips** : Trajets de covoiturage
- **bookings** : Réservations
- **payments** : Paiements (avec toutes les infos : date, prénom, etc.)
- **hotels** : Hôtels (si vous utilisez cette fonctionnalité)

### Exemple : Voir les paiements

1. Cliquez sur la collection `payments`
2. Vous verrez tous les paiements avec :
   - Informations du payeur (firstName, lastName, email, phone)
   - Méthode de paiement
   - Montant
   - Date de paiement (`paidAt`)
   - Statut
   - Détails de transaction

## 🔍 Formats de connexion

### 1. MongoDB Local (sans authentification)
```
mongodb://localhost:27017/hotelreserve
```

### 2. MongoDB Local (avec authentification)
```
mongodb://username:password@localhost:27017/hotelreserve?authSource=admin
```

### 3. MongoDB Atlas (Cloud)
```
mongodb+srv://username:password@cluster.mongodb.net/hotelreserve?retryWrites=true&w=majority
```

### 4. MongoDB avec options
```
mongodb://localhost:27017/hotelreserve?retryWrites=true&w=majority
```

## ✅ Vérifier la connexion

### Test 1 : Vérifier depuis le code

```bash
cd backend
node checkTrips.js
```

Vous devriez voir :
```
✅ Connected to MongoDB
📊 Database: hotelreserve
```

### Test 2 : Vérifier depuis MongoDB Compass

1. Connectez-vous avec Compass
2. Vérifiez que la base `hotelreserve` existe
3. Vérifiez que les collections contiennent des données

## 🐛 Dépannage

### Erreur : "Cannot connect to MongoDB"

**Solution 1** : Vérifier que MongoDB est démarré
```bash
# Windows
net start MongoDB

# Ou vérifier le processus
tasklist | findstr mongod
```

**Solution 2** : Vérifier le port
- MongoDB utilise le port 27017 par défaut
- Vérifiez qu'aucun autre service n'utilise ce port

**Solution 3** : Vérifier le fichier .env
- Assurez-vous que `MONGO_URI` est correct
- Pas d'espaces avant/après les valeurs

### Erreur : "Authentication failed"

**Solution** : Vérifiez vos identifiants dans la connection string
- Pour MongoDB local : créez un utilisateur ou désactivez l'authentification
- Pour Atlas : vérifiez username/password dans le dashboard

### Erreur : "Network timeout"

**Solution** : 
- Vérifiez votre connexion internet (pour Atlas)
- Vérifiez les règles de firewall
- Pour Atlas : ajoutez votre IP dans "Network Access"

## 📝 Exemple de fichier .env complet

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/hotelreserve

# Server
PORT=5000
NODE_ENV=development

# Security
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Frontend
CLIENT_URL=http://localhost:3000

# Stripe (optional)
STRIPE_SECRET_KEY=sk_test_your_key_here
```

## 🎯 Prochaines étapes

1. ✅ Créer le fichier `.env` dans `backend/`
2. ✅ Démarrer MongoDB
3. ✅ Se connecter avec MongoDB Compass
4. ✅ Vérifier que les données sont visibles
5. ✅ Tester l'application

## 💡 Astuces

- **Sauvegarder les connexions** : Dans Compass, vous pouvez sauvegarder vos connexions favorites
- **Filtres** : Utilisez les filtres dans Compass pour rechercher des données spécifiques
- **Export** : Vous pouvez exporter vos données depuis Compass en JSON ou CSV
- **Index** : Compass vous montre les index de vos collections

---

**🎉 Une fois connecté, vous pourrez voir toutes vos données de paiement, trajets, et utilisateurs dans MongoDB Compass !**

