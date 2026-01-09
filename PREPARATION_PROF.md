# 📋 Préparation pour le Professeur : Endpoints, GitHub & Postman

## 1️⃣ ENDPOINTS DE L'API

### 🔐 AUTHENTIFICATION (`/api/auth`)

| Méthode | Endpoint | Description | Auth | Body |
|---------|----------|-------------|------|------|
| POST | `/api/auth/register` | Inscription utilisateur | ❌ | name, email, phone, password |
| POST | `/api/auth/verify-otp` | Vérification OTP | ❌ | email, otp |
| POST | `/api/auth/login` | Connexion | ❌ | email, password |
| GET | `/api/auth/profile` | Profil utilisateur | ✅ JWT | - |
| POST | `/api/auth/logout` | Déconnexion | ✅ JWT | - |
| POST | `/api/auth/upload-cin` | Upload CIN | ✅ JWT | file (image) |

### 🚗 TRAJETS (`/api/trips`)

| Méthode | Endpoint | Description | Auth | Paramètres |
|---------|----------|-------------|------|-----------|
| GET | `/api/trips` | Lister les trajets | ❌ | departure, arrival, date, minPrice, maxPrice, page, limit |
| POST | `/api/trips` | Créer un trajet | ✅ JWT | title, description, departure, arrival, date, price, seats |
| GET | `/api/trips/:id` | Détails d'un trajet | ❌ | - |
| PUT | `/api/trips/:id` | Modifier un trajet | ✅ JWT | (champs à modifier) |
| DELETE | `/api/trips/:id` | Supprimer un trajet | ✅ JWT | - |

### 🏨 HÔTELS (`/api/hotels`)

| Méthode | Endpoint | Description | Auth | Paramètres |
|---------|----------|-------------|------|-----------|
| GET | `/api/hotels` | Lister les hôtels | ❌ | city, minPrice, maxPrice, page, limit |
| POST | `/api/hotels` | Créer un hôtel | ✅ JWT | name, city, price, description, amenities, images |
| GET | `/api/hotels/:id` | Détails d'un hôtel | ❌ | - |
| PUT | `/api/hotels/:id` | Modifier un hôtel | ✅ JWT | (champs à modifier) |
| DELETE | `/api/hotels/:id` | Supprimer un hôtel | ✅ JWT | - |

### 📅 RÉSERVATIONS (`/api/reservations`)

| Méthode | Endpoint | Description | Auth | Body |
|---------|----------|-------------|------|------|
| GET | `/api/reservations` | Mes réservations | ✅ JWT | - |
| POST | `/api/reservations` | Créer une réservation | ✅ JWT | tripId, seats |
| GET | `/api/reservations/:id` | Détails réservation | ✅ JWT | - |
| PUT | `/api/reservations/:id` | Modifier réservation | ✅ JWT | status |
| DELETE | `/api/reservations/:id` | Annuler réservation | ✅ JWT | - |

### 💳 PAIEMENTS (`/api/payments`)

| Méthode | Endpoint | Description | Auth | Body |
|---------|----------|-------------|------|------|
| POST | `/api/payments/create-intent` | Créer intent Stripe | ✅ JWT | amount, reservationId |
| POST | `/api/payments/webhook` | Webhook Stripe | ❌ | event data |
| GET | `/api/payments/:id` | Historique paiement | ✅ JWT | - |

### 💬 MESSAGES (`/api/messages`)

| Méthode | Endpoint | Description | Auth | Body |
|---------|----------|-------------|------|------|
| GET | `/api/messages/:conversationId` | Charger messages | ✅ JWT | - |
| POST | `/api/messages` | Envoyer message | ✅ JWT | conversationId, text |

### ⭐ AVIS (`/api/reviews`)

| Méthode | Endpoint | Description | Auth | Body |
|---------|----------|-------------|------|------|
| GET | `/api/reviews/trip/:tripId` | Avis d'un trajet | ❌ | - |
| POST | `/api/reviews` | Laisser un avis | ✅ JWT | tripId, rating, comment |

### 👨‍💼 ADMIN (`/api/admin`)

| Méthode | Endpoint | Description | Auth | Rôle |
|---------|----------|-------------|------|------|
| GET | `/api/admin/stats` | Statistiques | ✅ JWT | Admin |
| GET | `/api/admin/users` | Lister utilisateurs | ✅ JWT | Admin |
| GET | `/api/admin/bookings` | Lister réservations | ✅ JWT | Admin |
| DELETE | `/api/admin/users/:id` | Supprimer utilisateur | ✅ JWT | Admin |

---

## 2️⃣ ARCHITECTURE API

### Structure Backend
```
backend/
├── routes/           # Définit les endpoints
│   ├── auth.js      # Authentification
│   ├── trips.js     # Trajets
│   ├── hotels.js    # Hôtels
│   ├── reservations.js
│   ├── payments.js
│   ├── messages.js
│   ├── reviews.js
│   └── admin.js
├── models/          # Schémas MongoDB
├── controllers/     # Logique métier
├── middleware/      # auth.js (JWT validation)
├── utils/          # Fonctions utilitaires
└── server.js       # Point d'entrée
```

### Port d'écoute
- **Backend**: `http://localhost:5000`
- **Frontend**: `http://localhost:3000`
- **MongoDB**: `mongodb://localhost:27017/eym`

### Authentification
- **Type**: JWT (JSON Web Tokens)
- **Headers**: `Authorization: Bearer {token}`
- **Stockage**: Token retourné lors du login

---

## 3️⃣ CONFIGURATION POSTMAN

### Étape 1️⃣ : Créer l'environnement
```
Nom: EYM Dev
Variables:
  - baseURL: http://localhost:5000
  - token: (vide, à remplir après login)
```

### Étape 2️⃣ : Tests de base

#### 1. Inscription
```
POST {{baseURL}}/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "+212612345678",
  "password": "password123"
}
```

#### 2. Vérification OTP
```
POST {{baseURL}}/api/auth/verify-otp
Content-Type: application/json

{
  "email": "test@example.com",
  "otp": "123456"
}
```

#### 3. Connexion (LOGIN)
```
POST {{baseURL}}/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}

Réponse: Copier le token dans la variable "token"
```

#### 4. Profil utilisateur (nécessite token)
```
GET {{baseURL}}/api/auth/profile
Authorization: Bearer {{token}}
```

#### 5. Lister les trajets
```
GET {{baseURL}}/api/trips?departure=Casablanca&arrival=Marrakech
```

#### 6. Créer une réservation
```
POST {{baseURL}}/api/reservations
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "tripId": "ID_DU_TRAJET",
  "seats": 2
}
```

---

## 4️⃣ GITHUB

### Informations Repository
- **Nom du projet**: CMS / EYM (Excellence Your Morocco)
- **Type**: Application full-stack (MERN)
- **Stack**: 
  - **Frontend**: React.js + Tailwind CSS
  - **Backend**: Node.js/Express + MongoDB
  - **Auth**: JWT
  - **Payment**: Stripe
  - **Docker**: Docker Compose

### Structure Git
```
.
├── backend/          # API Node.js/Express
├── frontend/         # React.js
├── nginx/           # Configuration Nginx
├── docker-compose.yml
└── Documentation
```

### Fonctionnalités principales
✅ Authentification avec OTP  
✅ Recherche et filtrage de trajets  
✅ Réservations de trajets  
✅ Paiements Stripe  
✅ Dashboard Admin  
✅ Avis et évaluations  
✅ Messagerie entre utilisateurs  

---

## 5️⃣ POINTS CLÉS À RETENIR

### Pour les Endpoints
1. **Auth obligatoire**: Endpoints `/profile`, `/logout`, `POST/PUT/DELETE` nécessitent JWT
2. **Base URL**: `http://localhost:5000`
3. **Content-Type**: `application/json` pour tout
4. **Token**: Format `Bearer {jwt_token}` dans les headers

### Pour Postman
1. Définir la variable `baseURL`
2. Après login, copier le token dans la variable `token`
3. Utiliser `{{baseURL}}` et `{{token}}` dans les requêtes
4. Tester dans cet ordre: Register → Verify OTP → Login → API calls

### Pour GitHub
1. Le projet est full-stack (Frontend + Backend)
2. Architecture modulaire avec séparation des responsabilités
3. Utilise les meilleures pratiques (JWT, validation, etc.)

---

## ✨ RÉPONSES RAPIDES

**Q: C'est quoi un endpoint?**  
R: C'est une URL spécifique de l'API qui fait une action précise. Ex: `POST /api/auth/login` pour se connecter.

**Q: Pourquoi JWT?**  
R: Pour sécuriser les requêtes protégées. Le token prouve que l'utilisateur est authentifié.

**Q: Combien d'endpoints?**  
R: ~30+ endpoints répartis sur 7 modules (auth, trips, hotels, reservations, payments, messages, reviews, admin).

**Q: Comment tester?**  
R: Postman! C'est l'outil standard pour tester les APIs REST.
