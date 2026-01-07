# 🌱 Seeder de Trajets

## Comment ajouter des trajets à la base de données

### Étape 1 : Lancer le seeder

```bash
cd backend
node utils/tripSeeder.js
```

### Étape 2 : Vérifier les résultats

Le seeder va :
- ✅ Créer 50 trajets aléatoires
- ✅ Créer des utilisateurs si nécessaire
- ✅ Générer des trajets entre différentes villes marocaines
- ✅ Ajouter des images aux trajets
- ✅ Afficher un résumé par ville

### Villes incluses

- Casablanca, Rabat, Marrakech, Fès
- Tanger, Agadir, Meknès, Oujda
- Et plus encore...

### Notes

- Les trajets sont générés pour les 60 prochains jours
- Les prix varient entre 50 et 250 MAD
- Chaque trajet a 2-5 places disponibles
- Les images sont générées automatiquement

