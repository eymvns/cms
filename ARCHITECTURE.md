# Architecture VOIMA - Plateforme de Covoiturage Type BlaBlaCar

## 📐 Architecture Globale

```
VOIMA/
├── backend/                 # API Node.js/Express
│   ├── config/             # Configuration
│   ├── controllers/        # Logique métier
│   ├── middleware/         # Auth, validation, etc.
│   ├── models/             # Modèles MongoDB
│   ├── routes/             # Routes API
│   ├── utils/              # Utilitaires (OTP, etc.)
│   ├── uploads/            # Fichiers uploadés (CIN)
│   └── server.js           # Point d'entrée
│
├── frontend/               # Application React
│   ├── public/            # Assets statiques
│   └── src/
│       ├── components/    # Composants réutilisables
│       ├── pages/         # Pages principales
│       ├── context/       # Context API (Auth)
│       ├── hooks/         # Custom hooks
│       ├── utils/         # Utilitaires (API, etc.)
│       └── App.js         # Point d'entrée React
│
└── docker/                # Configuration Docker
```

## 🗄️ Modèles MongoDB

### User
```javascript
{
  name, email, phone (+212), password (hashed),
  verified, otp, otpExpires,
  cin (file path), identityVerified,
  role: 'user' | 'admin',
  avatar, rating (moyenne), createdAt,
  tripsDriven: [Trip], tripsTaken: [Booking]
}
```

### Trip
```javascript
{
  driver: User,
  departure, arrival, date, time,
  price, seats, availableSeats,
  restrictions, description, vehicle,
  bookings: [Booking], createdAt
}
```

### Booking
```javascript
{
  user, trip,
  seats, totalPrice,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed',
  paymentId, createdAt
}
```

### Review
```javascript
{
  from: User, to: User, trip: Trip,
  rating (1-5), comment, createdAt
}
```

### Message
```javascript
{
  from, to, trip, content,
  timestamp, read, readAt
}
```

## 🔌 Routes API Express

### Auth (`/api/auth`)
- `POST /register` - Inscription
- `POST /verify-otp` - Vérification OTP
- `POST /login` - Connexion
- `GET /profile` - Profil utilisateur
- `PUT /profile` - Mettre à jour profil
- `POST /upload-cin` - Upload CIN
- `PUT /verify-identity/:userId` - Admin: vérifier identité

### Trips (`/api/trips`)
- `GET /` - Liste avec filtres (departure, arrival, date)
- `GET /:id` - Détails trajet
- `POST /` - Publier trajet
- `PUT /:id` - Modifier trajet (driver only)
- `DELETE /:id` - Supprimer trajet
- `GET /:id/bookings` - Réservations trajet

### Bookings (`/api/bookings`)
- `GET /` - Mes réservations
- `POST /` - Réserver places
- `GET /:id` - Détails réservation
- `PUT /:id/cancel` - Annuler
- `PUT /:id/status` - Admin: changer statut
- `GET /admin/all` - Admin: toutes réservations

### Reviews (`/api/reviews`)
- `GET /user/:userId` - Avis utilisateur
- `POST /` - Ajouter avis
- `GET /trip/:tripId` - Avis trajet

### Payments (`/api/payments`)
- `POST /create-session` - Créer session Stripe
- `POST /confirm-payment` - Confirmer paiement
- `GET /session/:sessionId` - Statut paiement

### Messages (`/api/messages`)
- `GET /` - Conversations
- `GET /:userId` - Messages avec utilisateur
- `POST /` - Envoyer message
- `PUT /:userId/read` - Marquer comme lu
- Socket.io pour temps réel

### Admin (`/api/admin`)
- `GET /stats` - Statistiques
- `GET /users` - Liste utilisateurs
- `PUT /users/:id` - Modifier utilisateur
- `DELETE /users/:id` - Supprimer utilisateur
- `GET /trips` - Liste trajets
- `GET /bookings` - Liste réservations

## 🎨 Pages React Principales

### Home (`/`)
- Hero avec recherche (départ, arrivée, date)
- Filtres avancés
- Liste trajets avec cartes modernes
- Pagination

### TripDetail (`/trip/:id`)
- Détails trajet (conducteur, véhicule, restrictions)
- Formulaire réservation
- Avis conducteur
- Chat avec conducteur

### PostTrip (`/post-trip`)
- Formulaire publication trajet
- Sélection départ/arrivée
- Date, heure, prix, places

### Auth (`/auth`)
- Login / Register / OTP
- Validation numéro Maroc (+212)
- Design Airbnb-like

### Profile (`/profile`)
- Infos personnelles, avatar
- Mes trajets publiés
- Mes réservations
- Upload CIN
- Avis reçus

### Search (`/search`)
- Résultats recherche trajets
- Filtres sidebar

### Messages (`/messages`)
- Liste conversations
- Chat temps réel

### Admin (`/admin`)
- Dashboard stats (users, trips, bookings)
- Gestion utilisateurs, trajets, réservations
- Validation identités

## 🔒 Sécurité

- JWT avec expiration
- Bcrypt pour mots de passe
- Helmet pour headers sécurisés
- Rate limiting
- Validation avec Joi
- CORS configuré
- Upload sécurisé (CIN)

## 🚀 Déploiement

### Docker
- `Dockerfile` backend
- `Dockerfile` frontend
- `docker-compose.yml`

### CI/CD
- GitHub Actions
- Tests automatiques
- Déploiement automatique

### Production
- Nginx reverse proxy
- SSL avec Let's Encrypt
- MongoDB Atlas
- VPS (DigitalOcean, AWS, etc.)

