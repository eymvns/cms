# 🚗 EYM - Excellence Your Morocco

Application de covoiturage moderne pour voyager au Maroc de manière économique et conviviale.

## 🎨 Design Moderne

- **Nom**: EYM (Excellence Your Morocco)
- **Palette**: Couleurs marocaines (terracotta #E44D2E, camel #C19A6B)
- **Typographie**: Urbanist (headers) + Lato (body)
- **Framework CSS**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Custom Components
- **Animations**: Framer Motion

## 📦 Installation

### Prérequis
- Node.js v20+
- MongoDB
- npm ou yarn

### 1. Installation Backend

```bash
cd backend
npm install
```

Créez un fichier `.env` dans le dossier `backend`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/eym
JWT_SECRET=votre_secret_jwt_super_securise
CLIENT_URL=http://localhost:3000
STRIPE_SECRET_KEY=votre_cle_stripe
```

Démarrez le backend:
```bash
npm run dev
```

### 2. Installation Frontend

```bash
cd frontend

# Installez les dépendances de base
npm install

# Installez Tailwind CSS v4 et PostCSS
npm install tailwindcss@4 @tailwindcss/postcss postcss postcss-import postcss-preset-env

# Installez shadcn/ui
npx -y shadcn@latest init -y -d

# Installez les composants shadcn nécessaires
npx -y shadcn@latest add button card input label select dialog sheet tabs accordion badge avatar calendar dropdown-menu checkbox switch slider toast skeleton table separator scroll-area

# Installez les bibliothèques supplémentaires
npm install framer-motion lucide-react @tanstack/react-query react-hook-form zod @hookform/resolvers date-fns
```

Démarrez le frontend:
```bash
npm start
```

## 🚀 Fonctionnalités

### ✅ Fonctionnalités Implémentées

- **Authentification complète**
  - Inscription avec OTP
  - Connexion sécurisée (JWT)
  - Protection des routes
  - Gestion des sessions

- **Recherche de trajets**
  - Filtres par départ, arrivée, date
  - Vue liste des résultats
  - Détails complets du trajet

- **Réservation**
  - Sélection du nombre de places
  - Calcul du prix total
  - Confirmation de réservation

- **Profil utilisateur**
  - Voir mes réservations
  - Gérer mon compte
  - Historique des trajets

- **Dashboard Admin**
  - Gestion des trajets
  - Gestion des utilisateurs
  - Statistiques

### 🔧 Configuration requise pour fonctionner

#### Backend (déjà configuré)
- ✅ Modèles MongoDB (User, Trip, Booking, Message)
- ✅ Routes API (auth, trips, bookings, messages)
- ✅ Middleware d'authentification
- ✅ Socket.io pour la messagerie temps réel

#### Frontend
Les fichiers suivants ont été créés/mis à jour:

1. **Configuration**:
   - ✅ `postcss.config.js` - Configuration PostCSS
   - ✅ `jsconfig.json` - Alias pour imports
   - ✅ `src/index.css` - Design tokens et thème

2. **Contextes**:
   - ✅ `src/contexts/AuthContext.js` - Gestion auth

3. **Utilitaires**:
   - ✅ `src/utils/api.js` - Client API avec intercepteurs

4. **Composants**:
   - ✅ `src/components/Header.js` - Navigation moderne
   - ✅ `src/components/Footer.js` - Pied de page EYM
   - ✅ `src/components/ProtectedRoute.js` - Protection routes
   - 🆕 `src/components/HotelCard.js` - Card de trajet (à utiliser)

5. **Pages**:
   - ✅ `src/pages/Home.js` - Page d'accueil
   - ✅ `src/pages/Search.js` - Recherche de trajets
   - ✅ `src/pages/Auth.js` - Connexion/Inscription
   - 🆕 `src/pages/TripDetails.js` - Détails du trajet
   - ✅ `src/pages/Profile.js` - Profil utilisateur
   - ✅ `src/pages/Admin.js` - Dashboard admin

## 🐛 Résolution des Problèmes

### Les boutons ne fonctionnent pas?

1. **Vérifiez que le backend tourne** sur `http://localhost:5000`
2. **Vérifiez que MongoDB est démarré**
3. **Vérifiez la console du navigateur** pour les erreurs
4. **Vérifiez que les imports utilisent** `../contexts/AuthContext` et non `../context/AuthContext`

### Les styles ne s'appliquent pas?

1. **Vérifiez que Tailwind CSS v4 est installé**:
```bash
npm list tailwindcss
```

2. **Vérifiez que le fichier `postcss.config.js` existe** et contient:
```js
module.exports = {
  plugins: {
    'postcss-import': {},
    '@tailwindcss/postcss': {},
    'postcss-preset-env': {
      stage: 3,
      features: {
        'nesting-rules': true
      }
    }
  }
}
```

3. **Vérifiez que `src/index.css` commence par**:
```css
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700;800;900&family=Lato:wght@300;400;700;900&display=swap');
@import "tailwindcss";
```

### Erreur "Cannot find module '../context/AuthContext'"

Mettez à jour tous les imports pour utiliser:
```js
import { useAuth } from '../contexts/AuthContext'; // avec 's'
```

## 🎯 Prochaines Étapes

Pour finaliser l'application:

1. **Testez l'authentification**:
   - Créez un compte
   - Vérifiez le code OTP (dans les logs backend)
   - Connectez-vous

2. **Testez la recherche**:
   - Recherchez des trajets
   - Filtrez par critères
   - Cliquez sur un trajet

3. **Testez la réservation**:
   - Sélectionnez un trajet
   - Choisissez le nombre de places
   - Confirmez la réservation

4. **Créez des données de test**:
```bash
cd backend
node utils/seeder.js
```

## 📱 Technologies Utilisées

### Frontend
- React 18
- React Router v6
- Tailwind CSS v4
- shadcn/ui
- Framer Motion
- Lucide Icons
- Axios
- React Hook Form + Zod

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Socket.io
- Stripe (paiements)
- Multer (uploads)

## 🔐 Sécurité

- ✅ Authentification JWT
- ✅ Validation des entrées (Joi + Zod)
- ✅ Protection CORS
- ✅ Rate limiting
- ✅ Helmet.js
- ✅ Hashage des mots de passe (bcrypt)

## 📞 Support

Pour toute question ou problème:
- Email: contact@eym.ma
- Tel: +212 6 00 00 00 00

## 📄 Licence

© 2026 EYM - Excellence Your Morocco. Tous droits réservés.