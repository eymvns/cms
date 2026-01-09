# Guide de Test avec Postman pour l'API VOIMA

Ce guide explique comment tester l'API backend de la plateforme de covoiturage VOIMA à l'aide de Postman.

## Prérequis

1. **Démarrer le serveur backend** :
   - Assurez-vous que MongoDB est en cours d'exécution.
   - Naviguez vers le dossier `backend` et exécutez :
     ```bash
     npm install
     npm start
     ```
   - Le serveur sera disponible sur `http://localhost:5000`.

2. **Installer Postman** :
   - Téléchargez et installez Postman depuis [postman.com](https://www.postman.com/downloads/).

## Configuration de Postman

1. Créez une nouvelle collection appelée "VOIMA API".
2. Définissez la variable d'environnement :
   - Dans Postman, allez dans l'onglet "Environments" et créez un nouvel environnement.
   - Ajoutez une variable `baseURL` avec la valeur `http://localhost:5000`.
   - Ajoutez une variable `token` (laissée vide pour l'instant, elle sera remplie après l'authentification).

3. Pour les requêtes nécessitant une authentification :
   - Ajoutez un header `Authorization` avec la valeur `Bearer {{token}}`.

## Endpoints API

### 1. Authentification

#### Inscription (Register)
- **Méthode** : POST
- **URL** : `{{baseURL}}/api/auth/register`
- **Headers** :
  - Content-Type: application/json
- **Body** (raw JSON) :
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+212612345678",
    "password": "password123"
  }
  ```
- **Réponse attendue** : 201 Created avec userId.

#### Vérification OTP
- **Méthode** : POST
- **URL** : `{{baseURL}}/api/auth/verify-otp`
- **Headers** :
  - Content-Type: application/json
- **Body** :
  ```json
  {
    "email": "john@example.com",
    "otp": "123456"
  }
  ```
- **Note** : L'OTP est généré et affiché dans la console du serveur (simulation).

#### Connexion (Login)
- **Méthode** : POST
- **URL** : `{{baseURL}}/api/auth/login`
- **Headers** :
  - Content-Type: application/json
- **Body** :
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Réponse** : Copiez le token JWT et mettez-le dans la variable d'environnement `token`.

#### Profil utilisateur
- **Méthode** : GET
- **URL** : `{{baseURL}}/api/auth/profile`
- **Headers** :
  - Authorization: Bearer {{token}}

### 2. Trips (Trajets)

#### Lister les trips
- **Méthode** : GET
- **URL** : `{{baseURL}}/api/trips`
- **Query Parameters** (optionnels) :
  - departure: Ville de départ
  - arrival: Ville d'arrivée
  - date: Date (YYYY-MM-DD)
  - minPrice: Prix minimum
  - maxPrice: Prix maximum
  - page: Numéro de page
  - limit: Nombre d'éléments par page

#### Détails d'un trip
- **Méthode** : GET
- **URL** : `{{baseURL}}/api/trips/:id`
- **Remplacez** `:id` par l'ID du trip.

#### Créer un trip
- **Méthode** : POST
- **URL** : `{{baseURL}}/api/trips`
- **Headers** :
  - Authorization: Bearer {{token}}
  - Content-Type: application/json
- **Body** :
  ```json
  {
    "departure": "Casablanca",
    "arrival": "Rabat",
    "date": "2026-01-15T10:00:00Z",
    "price": 50,
    "availableSeats": 3,
    "description": "Trajet confortable"
  }
  ```

### 3. Réservations (Bookings)

#### Créer une réservation
- **Méthode** : POST
- **URL** : `{{baseURL}}/api/bookings`
- **Headers** :
  - Authorization: Bearer {{token}}
  - Content-Type: application/json
- **Body** :
  ```json
  {
    "tripId": "ID_DU_TRIP",
    "seats": 1
  }
  ```

#### Mes réservations
- **Méthode** : GET
- **URL** : `{{baseURL}}/api/bookings`
- **Headers** :
  - Authorization: Bearer {{token}}

### 4. Avis (Reviews)

#### Ajouter un avis
- **Méthode** : POST
- **URL** : `{{baseURL}}/api/reviews`
- **Headers** :
  - Authorization: Bearer {{token}}
  - Content-Type: application/json
- **Body** :
  ```json
  {
    "tripId": "ID_DU_TRIP",
    "rating": 5,
    "comment": "Excellent trajet !"
  }
  ```

### 5. Messages

#### Envoyer un message
- **Méthode** : POST
- **URL** : `{{baseURL}}/api/messages`
- **Headers** :
  - Authorization: Bearer {{token}}
  - Content-Type: application/json
- **Body** :
  ```json
  {
    "to": "ID_DESTINATAIRE",
    "content": "Bonjour, je suis intéressé par votre trajet."
  }
  ```

### 6. Paiements (Payments)

#### Créer un paiement Stripe
- **Méthode** : POST
- **URL** : `{{baseURL}}/api/payments/create-payment-intent`
- **Headers** :
  - Authorization: Bearer {{token}}
  - Content-Type: application/json
- **Body** :
  ```json
  {
    "amount": 5000,  // en centimes (50 MAD)
    "bookingId": "ID_DE_LA_RESERVATION"
  }
  ```

### 7. Administration (Admin)

#### Statistiques
- **Méthode** : GET
- **URL** : `{{baseURL}}/api/admin/stats`
- **Headers** :
  - Authorization: Bearer {{token}} (utilisateur admin requis)

## Tests Automatisés

Vous pouvez créer des tests dans Postman pour vérifier les réponses :
- Allez dans l'onglet "Tests" d'une requête.
- Exemple pour vérifier le statut :
  ```javascript
  pm.test("Status code is 200", function () {
      pm.response.to.have.status(200);
  });
  ```

## Collection Postman

Pour une collection complète, vous pouvez importer le fichier JSON suivant dans Postman (créez-le si nécessaire) ou créer manuellement les requêtes comme décrit ci-dessus.

## Dépannage

- **Erreur 401 Unauthorized** : Vérifiez que le token JWT est valide et inclus dans les headers.
- **Erreur 400 Bad Request** : Vérifiez le format des données envoyées.
- **Erreur 500 Internal Server Error** : Consultez les logs du serveur backend.

Pour plus d'informations, consultez la documentation complète de l'API ou contactez l'équipe de développement.</content>
<parameter name="filePath">c:\Users\adaym\Desktop\CMS\README_Postman.md