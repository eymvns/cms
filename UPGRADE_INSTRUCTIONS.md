# 🚀 HotelReserve V3 - Upgrade Instructions

## ✅ Étapes Complétées

1. ✅ Création de la palette de couleurs inspirée du Maroc
2. ✅ Sélection de la typographie moderne (Urbanist + Lato)
3. ✅ Configuration PostCSS pour Tailwind v4
4. ✅ Configuration jsconfig.json pour les alias @/
5. ✅ Création du fichier CSS principal avec design tokens

## 🔧 Étapes Requises (À faire manuellement)

### 1. Installation des Dépendances

Ouvrez un terminal PowerShell ou CMD dans le dossier `frontend` et exécutez:

```powershell
# Installez les dépendances Tailwind v4 et PostCSS
npm install tailwindcss@4 @tailwindcss/postcss postcss postcss-import postcss-preset-env

# Installez @types/node
npm install -D @types/node

# Installez les nouvelles dépendances pour le projet moderne
npm install framer-motion lucide-react @tanstack/react-query react-hook-form zod @hookform/resolvers sonner date-fns

# Initialisez shadcn/ui avec les defaults
npx -y shadcn@latest init -y -d

# Installez les composants shadcn nécessaires
npx -y shadcn@latest add button card input label select dialog sheet tabs accordion badge avatar calendar dropdown-menu checkbox switch slider toast skeleton table separator scroll-area
```

### 2. Après l'installation

Une fois les commandes ci-dessus exécutées avec succès, **répondez "Done"** dans le chat et je continuerai avec:

- ✨ Création des composants React modernes
- 📱 Pages principales (Home, Search, Hotel Details, Profile, Admin)
- 🎨 Design system complet
- 🚀 Fonctionnalités avancées

## 📋 Palette de Couleurs Finale

- **Primary**: #E44D2E (Fiery Terracotta)
- **Secondary**: #C19A6B (Camel Gold)
- **Accent**: #A45A52 (Terracotta Clay)
- **Dark**: #79443B (Clay Soil)
- **Light**: #EDC9AF (Desert Sand)

## ✍️ Typographie

- **Headers**: Urbanist (moderne, géométrique)
- **Body**: Lato (friendly, professionnel)

## 🎯 Prochaines Étapes

1. Installation des packages (voir ci-dessus)
2. Création de la structure de dossiers React
3. Composants UI réutilisables
4. Pages principales
5. Dashboard Admin
6. Nouvelles fonctionnalités (carte, dark mode, etc.)

---

**Note**: Si vous rencontrez des erreurs lors de l'installation, partagez-les dans le chat pour que je puisse vous aider à les résoudre.