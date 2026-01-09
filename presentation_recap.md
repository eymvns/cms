# Recapitulatif du Projet EYM pour Presentation PowerPoint

## Slide 1: Titre de la Presentation
**EYM - Excellence Your Morocco**  
Plateforme de Covoiturage Moderne pour Voyager au Maroc  
- Presente par [Votre Nom]  
- Date: [Date Actuelle]  

## Slide 2: Apercu du Projet
- Application web de covoiturage pour voyager au Maroc de maniere economique et conviviale  
- Inspirée de BlaBlaCar, adaptée au contexte marocain  
- Design moderne avec couleurs marocaines (terracotta #E44D2E, camel #C19A6B)  
- Typographie: Urbanist (titres) + Lato (corps)  
- Framework CSS: Tailwind CSS v4 avec shadcn/ui et Framer Motion  
- Architecture full-stack: Frontend React, Backend Node.js/Express  

## Slide 3: Probleme Resolu
- Difficulte a trouver des trajets abordables au Maroc  
- Manque de confiance entre passagers et conducteurs  
- Besoin d'une plateforme securisee, moderne et facile d'utilisation  
- Solution: Plateforme centralisee avec verification d'identite, paiements securises et systeme de notation  

## Slide 4: Fonctionnalites Principales
- **Authentification complete**: Inscription avec verification OTP, connexion securisee (JWT)  
- **Recherche de trajets**: Filtres par depart, arrivee, date; vue liste des resultats  
- **Reservation**: Selection du nombre de places, calcul du prix total, confirmation  
- **Profil utilisateur**: Voir mes reservations, gerer mon compte, historique des trajets  
- **Messagerie temps reel**: Communication entre conducteurs et passagers via Socket.io  
- **Dashboard Admin**: Gestion des trajets, utilisateurs et statistiques  

## Slide 5: Architecture Technique
- **Backend (Node.js/Express)**:  
  - API RESTful avec routes pour auth, trips, bookings, messages, etc.  
  - Modeles MongoDB: User, Trip, Booking, Review, Message  
  - Middleware: Authentification JWT, validation Joi, rate limiting, Helmet  
- **Frontend (React)**:  
  - Composants reutilisables (Header, Footer, Cards)  
  - Pages principales: Home, Search, Auth, Profile, Admin  
  - Context API pour gestion d'etat auth  
- **Temps reel**: Socket.io pour messagerie instantanee  
- **Securite**: Hashage bcrypt, validation d'entrees, protection CORS  

## Slide 6: Technologies Utilisees
- **Frontend**:  
  - React 18 avec React Router v6  
  - Tailwind CSS v4, shadcn/ui, Framer Motion  
  - Lucide Icons, Axios pour API calls  
  - React Hook Form + Zod pour validation  
- **Backend**:  
  - Node.js + Express  
  - MongoDB + Mongoose  
  - JWT pour authentification  
  - Socket.io pour temps reel  
  - Stripe pour paiements securises  
  - Multer pour uploads (CIN)  
- **Autres**: Docker, docker-compose, Nginx, PostCSS  

## Slide 7: Installation et Demonstration
- **Prerequis**: Node.js v20+, MongoDB  
- **Installation**:  
  - Backend: cd backend && npm install  
  - Frontend: cd frontend && npm install (avec Tailwind, shadcn, etc.)  
- **Demarrage**: npm run dev (backend), npm start (frontend)  
- **Demonstration**:  
  - Creation de compte avec OTP  
  - Publication et recherche de trajet  
  - Reservation avec paiement Stripe  
  - Messagerie et profil utilisateur  

## Slide 8: Securite et Deploiement
- **Securite**:  
  - Authentification JWT avec expiration  
  - Hashage des mots de passe (bcrypt)  
  - Validation des entrees (Joi + Zod)  
  - Protection CORS, rate limiting, Helmet.js  
  - Verification d'identite avec upload CIN  
- **Deploiement**:  
  - Docker pour containerisation  
  - docker-compose pour orchestration  
  - Nginx comme reverse proxy  
  - CI/CD avec GitHub Actions  
  - Production: VPS (DigitalOcean/AWS) avec SSL Let's Encrypt  

## Slide 9: Conclusion
- **Realisations**: Application complete et fonctionnelle avec toutes les fonctionnalites clees  
- **Qualites**: Technologies modernes, design responsive, securite renforcee  
- **Perspectives**:  
  - Ajout de fonctionnalites (notifications push, geolocalisation)  
  - Scalabilite et optimisation performance  
  - Expansion a d'autres pays d'Afrique du Nord  

## Slide 10: Questions
- Avez-vous des questions?  
- Merci pour votre attention!