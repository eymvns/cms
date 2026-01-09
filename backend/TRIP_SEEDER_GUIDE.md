# 🚗 Guide du Seeder de Trajets Amélioré

## 📋 Vue d'ensemble

Le seeder de trajets a été considérablement amélioré pour ajouter **90 trajets** avec des descriptions détaillées, des photos et des prix réalistes basés sur les distances réelles entre les villes marocaines.

## ✨ Améliorations apportées

### 1. **Trajets prédéfinis** (60 trajets)
- 20 trajets populaires prédéfinis avec descriptions détaillées
- Chaque trajet a 3 variations (dates et heures différentes)
- Prix réalistes basés sur les distances réelles
- Descriptions enrichies avec informations sur le trajet

### 2. **Trajets aléatoires** (30 trajets)
- Génération automatique de trajets entre différentes villes
- Descriptions variées et professionnelles
- Prix calculés de manière réaliste

### 3. **Images améliorées**
- 15 images différentes de véhicules
- Images haute qualité depuis Unsplash
- Rotation automatique des images

### 4. **Villes marocaines étendues**
- 24 villes au lieu de 18
- Inclut : Chefchaouen, Essaouira, Ouarzazate, Errachidia, Ifrane, Azrou, etc.

## 🚀 Utilisation

### Lancer le seeder

```bash
cd backend
node utils/tripSeeder.js
```

### Ce qui sera créé

- **90 trajets** au total
- **20 utilisateurs** (si aucun n'existe)
- Trajets répartis sur les **60 prochains jours**
- Prix entre **40 et 250 MAD**
- Places disponibles : **1 à 5 sièges**

## 📊 Trajets prédéfinis inclus

| Départ | Arrivée | Prix (MAD) | Description |
|--------|---------|------------|-------------|
| Casablanca | Rabat | 60 | Trajet direct sur autoroute A1 |
| Casablanca | Marrakech | 120 | Voyage confortable avec arrêt possible |
| Rabat | Fès | 100 | Route panoramique avec vue montagnes |
| Marrakech | Agadir | 90 | Route côtière avec vue océan |
| Tanger | Casablanca | 150 | Long trajet confortable |
| Fès | Marrakech | 130 | Traversée du Maroc via Atlas |
| Marrakech | Essaouira | 70 | Route côtière vers perle Atlantique |
| Tanger | Chefchaouen | 80 | Route montagne vers ville bleue |
| Marrakech | Ouarzazate | 100 | Porte du désert, paysages magnifiques |
| Et plus... | | | |

## 🎨 Caractéristiques des trajets

### Descriptions détaillées
Chaque trajet prédéfini inclut :
- Informations sur la route
- Points d'intérêt
- Type de véhicule
- Restrictions éventuelles
- Suggestions d'arrêts

### Véhicules variés
- Mercedes Classe C
- BMW Série 3
- Audi A4
- Peugeot 308/208
- Renault Clio/Megane
- Toyota Corolla
- Et plus...

### Prix réalistes
Les prix sont basés sur :
- Distance réelle entre villes
- Type de route (autoroute vs nationale)
- Popularité du trajet
- Variation de ±10 MAD pour chaque variation

## 📈 Statistiques affichées

Après le seeding, vous verrez :
- Nombre total de trajets créés
- Répartition par ville de départ
- Statistiques de prix (min, max, moyenne)

## 🔄 Réexécution

Pour réinitialiser et recréer les trajets :

```bash
node utils/tripSeeder.js
```

⚠️ **Note** : Cela supprimera tous les trajets existants avant de créer les nouveaux.

## 🎯 Prochaines étapes

1. Lancer le seeder : `node utils/tripSeeder.js`
2. Vérifier les trajets via l'API : `GET /api/trips`
3. Tester la recherche dans le frontend
4. Vérifier l'affichage des images et descriptions

## 📝 Notes techniques

- Base de données : MongoDB
- Collection : `trips`
- Modèle : `Trip` (voir `backend/models/Trip.js`)
- Route API : `/api/trips`

## 🐛 Dépannage

### Erreur de connexion MongoDB
Vérifiez que MongoDB est démarré :
```bash
mongod
```

Ou configurez `MONGO_URI` dans `.env` :
```
MONGO_URI=mongodb://localhost:27017/hotelreserve
```

### Pas d'utilisateurs
Le seeder créera automatiquement 20 utilisateurs si aucun n'existe.

### Trajets non affichés
Vérifiez que les trajets ont des `availableSeats > 0` (c'est automatique).

---

**🎉 Profitez de votre plateforme de covoiturage avec 90 trajets détaillés !**

