const mongoose = require('mongoose');
const Hotel = require('../models/Hotel');
require('dotenv').config();

// Helper function to generate unique Unsplash image URLs
const getImageUrl = (seed) => {
  const imageIds = [
    '1571003123894-1f0594d2b5d9', '1542314831-068cd1dbfeeb', '1580835845971-a393b73bf378',
    '1621293954908-056b532808c1', '1478131143081-80f7f84ca84d', '1445019980597-93fa8acb246c',
    '1534008753122-a83774618e05', '1566073771259-6a8506099945', '1605537964076-3cb0ea2e356d',
    '1596394516093-501ba68a0ba6', '1584132967334-10e028bd69f7', '1520250497591-112f2f40a3f4',
    '1551882547-ff40c63fe5fa', '1571896349842-33c89424de2d', '1548013146-72479768bada',
    '1564501049412-61c2a3083791', '1522771739844-6a9f6d5b527f', '1551882547-ff40c63fe5fa',
    '1566073771259-6a8506099945', '1571003123894-1f0594d2b5d9', '1580835845971-a393b73bf378',
    '1621293954908-056b532808c1', '1478131143081-80f7f84ca84d', '1445019980597-93fa8acb246c',
    '1534008753122-a83774618e05', '1566073771259-6a8506099945', '1605537964076-3cb0ea2e356d',
    '1596394516093-501ba68a0ba6', '1584132967334-10e028bd69f7', '1520250497591-112f2f40a3f4',
    '1564501049412-61c2a3083791', '1522771739844-6a9f6d5b527f', '1551882547-ff40c63fe5fa',
    '1571003123894-1f0594d2b5d9', '1542314831-068cd1dbfeeb', '1580835845971-a393b73bf378',
    '1621293954908-056b532808c1', '1478131143081-80f7f84ca84d', '1445019980597-93fa8acb246c',
    '1534008753122-a83774618e05', '1566073771259-6a8506099945', '1605537964076-3cb0ea2e356d',
    '1596394516093-501ba68a0ba6', '1584132967334-10e028bd69f7', '1520250497591-112f2f40a3f4',
    '1564501049412-61c2a3083791', '1522771739844-6a9f6d5b527f', '1551882547-ff40c63fe5fa',
    '1571003123894-1f0594d2b5d9', '1542314831-068cd1dbfeeb', '1580835845971-a393b73bf378',
    '1621293954908-056b532808c1', '1478131143081-80f7f84ca84d', '1445019980597-93fa8acb246c',
    '1534008753122-a83774618e05', '1566073771259-6a8506099945', '1605537964076-3cb0ea2e356d',
    '1596394516093-501ba68a0ba6', '1584132967334-10e028bd69f7', '1520250497591-112f2f40a3f4',
    '1564501049412-61c2a3083791', '1522771739844-6a9f6d5b527f', '1551882547-ff40c63fe5fa'
  ];
  const index = seed % imageIds.length;
  return `https://images.unsplash.com/photo-${imageIds[index]}?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80`;
};

const hotelsData = [
  // ========== MARRAKECH (10 hôtels) ==========
  {
    name: "Mamounia Palace",
    location: "Marrakech",
    category: "Marrakech",
    price: 3500,
    image: getImageUrl(1),
    desc: "L'adresse mythique de Marrakech depuis 1923. La Mamounia incarne le raffinement marocain avec ses 20 hectares de jardins séculaires, son service d'excellence et ses suites somptueuses. Découvrez le spa Dior, 4 restaurants gastronomiques et une piscine chauffée toute l'année. Une expérience de luxe ultime au cœur de la ville ocre.",
    features: ["Jardins Royaux 20ha", "Service Majordome 24/7", "4 Restaurants Gastronomiques", "Spa Dior", "Piscine Chauffée", "Golf 9 trous", "Salles de réception"]
  },
  {
    name: "Riad Dar Karma",
    location: "Marrakech",
    category: "Marrakech",
    price: 1200,
    image: getImageUrl(2),
    desc: "Riad authentique de 8 chambres au cœur de la médina, à 5 minutes à pied de la place Jemaa el-Fnaa. Patio traditionnel avec fontaine, terrasse panoramique sur les toits de Marrakech offrant une vue imprenable sur les montagnes de l'Atlas. Décoration soignée alliant tradition et modernité.",
    features: ["Médina - Centre historique", "Terrasse Panoramique", "Petit-déjeuner Marocain", "Wifi Haut Débit", "Climatisation", "Transfert Aéroport"]
  },
  {
    name: "Four Seasons Resort Marrakech",
    location: "Marrakech",
    category: "Luxe",
    price: 4500,
    image: getImageUrl(3),
    desc: "Resort 5 étoiles de 141 chambres et suites avec spa de renommée mondiale, golf privé 18 trous et villas avec piscine privée. Situé dans un parc de 16 hectares, à 10 minutes de la médina. Restaurants gastronomiques, piscines à débordement et service conciergerie exceptionnel.",
    features: ["Spa 5 étoiles 1500m²", "Golf 18 trous", "Villas Privées avec Piscine", "3 Restaurants", "Service Conciergerie", "Kids Club", "Piscines à débordement"]
  },
  {
    name: "Riad Yasmine",
    location: "Marrakech",
    category: "Marrakech",
    price: 950,
    image: getImageUrl(4),
    desc: "Riad boutique de charme avec 7 chambres, piscine intérieure chauffée, décoration moderne et accueil chaleureux. Situé dans la médina, à proximité des souks et des sites historiques. Terrasse avec vue sur la Koutoubia et service personnalisé.",
    features: ["Piscine Intérieure Chauffée", "Rooftop avec Vue", "Petit-déjeuner", "Wifi", "Transfert", "Guide Local"]
  },
  {
    name: "Amanjena Resort",
    location: "Marrakech",
    category: "Luxe",
    price: 5000,
    image: getImageUrl(5),
    desc: "Resort ultra-luxe avec 40 pavillons et maisons privés, spa Aman de 2000m² et service personnalisé exceptionnel. Golf privé, restaurants gastronomiques et piscines privées. Expérience exclusive dans un cadre d'exception à 15 minutes de la médina.",
    features: ["Pavillons Privés", "Spa Aman 2000m²", "Restaurant Gastronomique", "Piscines Privées", "Golf", "Service Majordome", "Hélicoptère"]
  },
  {
    name: "Riad Kniza",
    location: "Marrakech",
    category: "Marrakech",
    price: 1100,
    image: getImageUrl(6),
    desc: "Riad historique du 18ème siècle restauré avec élégance, situé dans la médina à 200m de la place Jemaa el-Fnaa. 11 suites spacieuses, restaurant traditionnel, hammam et terrasse avec vue panoramique. Collection d'antiquités et d'art marocain.",
    features: ["Médina - Historique", "Restaurant Traditionnel", "Hammam", "Terrasse", "Wifi", "Collection d'Art"]
  },
  {
    name: "La Sultana Marrakech",
    location: "Marrakech",
    category: "Marrakech",
    price: 2800,
    image: getImageUrl(7),
    desc: "Palace 5 étoiles avec 28 suites et chambres, spa de 1000m², piscine panoramique et suites avec vue sur les montagnes de l'Atlas. Situé près des tombeaux saadiens, avec 5 riads interconnectés et jardins luxuriants.",
    features: ["Spa 1000m²", "Piscine Panoramique", "Suites avec Vue Atlas", "Restaurant", "5 Riads", "Jardins"]
  },
  {
    name: "Riad El Fenn",
    location: "Marrakech",
    category: "Marrakech",
    price: 1500,
    image: getImageUrl(8),
    desc: "Riad design de 28 chambres avec piscine, restaurant gastronomique et galerie d'art contemporain. Situé dans la médina, à 2 minutes de la place Jemaa el-Fnaa. Décoration unique mêlant art moderne et tradition marocaine.",
    features: ["Design Contemporain", "Piscine", "Restaurant Gastronomique", "Galerie d'Art", "Rooftop", "Bar"]
  },
  {
    name: "Hôtel Les Jardins de la Koutoubia",
    location: "Marrakech",
    category: "Marrakech",
    price: 1800,
    image: getImageUrl(9),
    desc: "Hôtel 5 étoiles avec 231 chambres, vue directe sur la Koutoubia, spa de 800m² et piscine extérieure. Situé en face de la mosquée, avec 2 restaurants, bar lounge et accès direct à la médina.",
    features: ["Vue Koutoubia", "Spa 800m²", "Piscine Extérieure", "2 Restaurants", "Bar Lounge", "Centre-ville"]
  },
  {
    name: "Riad Dar Anika",
    location: "Marrakech",
    category: "Marrakech",
    price: 1300,
    image: getImageUrl(10),
    desc: "Riad de luxe avec 12 suites, piscine intérieure, restaurant sur le toit et spa. Situé dans la médina, avec terrasse panoramique offrant une vue à 360° sur Marrakech. Service personnalisé et décoration raffinée.",
    features: ["12 Suites", "Piscine Intérieure", "Restaurant Rooftop", "Spa", "Terrasse 360°", "Service Premium"]

  // ========== CASABLANCA (8 hôtels) ==========
  },
  {
    name: "Sofitel Casablanca Tour Blanche",
    location: "Casablanca",
    category: "Business",
    price: 1800,
    image: getImageUrl(11),
    desc: "Hôtel 5 étoiles de 180 chambres au cœur de la capitale économique, avec vue panoramique sur la ville et l'océan. Spa, fitness center, 2 restaurants et salles de conférence. Idéal pour les voyages d'affaires, à 10 minutes de l'aéroport.",
    features: ["Centre d'affaires", "Spa", "Salle de Fitness", "Restaurant Gastronomique", "Conciergerie", "Parking"]
  },
  {
    name: "Four Seasons Hotel Casablanca",
    location: "Casablanca",
    category: "Business",
    price: 2500,
    image: getImageUrl(12),
    desc: "Hôtel de luxe face à l'océan avec 186 chambres et suites, spa de 2000m², restaurants gastronomiques et salles de conférence de 1000m². Piscine extérieure, plage privée et service exceptionnel. Vue panoramique sur l'Atlantique.",
    features: ["Face Océan", "Spa 2000m²", "Restaurants Gastronomiques", "Salles Conférence", "Fitness", "Plage Privée"]
  },
  {
    name: "Hyatt Regency Casablanca",
    location: "Casablanca",
    category: "Business",
    price: 1600,
    image: getImageUrl(13),
    desc: "Hôtel moderne de 286 chambres au centre-ville avec vue panoramique, spa, restaurants internationaux et business center. Situé près de la corniche, avec piscine, fitness et accès facile aux quartiers d'affaires.",
    features: ["Centre-ville", "Spa", "Restaurants Internationaux", "Fitness", "Business Center", "Piscine"]
  },
  {
    name: "Le Lido Thalasso & Spa",
    location: "Casablanca",
    category: "Agadir",
    price: 1400,
    image: getImageUrl(14),
    desc: "Complexe thalasso face à la mer avec 120 chambres, centre de thalassothérapie, spa de 1500m², piscine et restaurant de fruits de mer. Soins marins, hammam et vue sur l'océan Atlantique.",
    features: ["Thalasso", "Spa 1500m²", "Face Mer", "Restaurant Fruits de Mer", "Piscine", "Hammam"]
  },
  {
    name: "Melliber Appart Hotel",
    location: "Casablanca",
    category: "Business",
    price: 800,
    image: getImageUrl(15),
    desc: "Appart-hôtel moderne de 120 appartements avec cuisine équipée, idéal pour séjours longue durée. Situé au centre-ville, avec fitness, laverie et service de ménage. Proche des quartiers d'affaires et commerces.",
    features: ["Appartements", "Cuisine Équipée", "Wifi", "Fitness", "Centre-ville", "Laverie"]
  },
  {
    name: "Kenzi Tower Hotel",
    location: "Casablanca",
    category: "Business",
    price: 1200,
    image: getImageUrl(16),
    desc: "Hôtel moderne de 200 chambres avec vue panoramique sur la ville depuis le 20ème étage, restaurant gastronomique et bar au dernier étage. Fitness center, spa et salles de réunion. Vue imprenable sur Casablanca.",
    features: ["Vue Panoramique", "Restaurant 20ème Étage", "Bar", "Fitness", "Business", "Spa"]
  },
  {
    name: "Ibis Casablanca City Center",
    location: "Casablanca",
    category: "Economique",
    price: 450,
    image: getImageUrl(17),
    desc: "Hôtel économique de 150 chambres bien situé au centre-ville, moderne et confortable pour les voyageurs d'affaires. Petit-déjeuner buffet, wifi gratuit et parking. Excellent rapport qualité-prix.",
    features: ["Économique", "Centre-ville", "Wifi Gratuit", "Petit-déjeuner Buffet", "Parking", "Réception 24h"]
  },
  {
    name: "Hotel & Spa Le Doge",
    location: "Casablanca",
    category: "Business",
    price: 1500,
    image: getImageUrl(18),
    desc: "Boutique hôtel Art Déco de 20 chambres avec spa, restaurant gastronomique et service personnalisé. Situé dans le quartier historique, avec décoration années 30 et charme authentique. Bar lounge et terrasse.",
    features: ["Art Déco", "Spa", "Restaurant Gastronomique", "Boutique", "Service Personnalisé", "Bar Lounge"]

  // ========== RABAT (6 hôtels) ==========
  },
  {
    name: "Ibis Rabat Centre",
    location: "Rabat",
    category: "Economique",
    price: 400,
    image: getImageUrl(19),
    desc: "Hôtel économique de 120 chambres efficace, propre et idéalement situé au centre de Rabat. Proche de la gare, des commerces et sites historiques. Le choix malin pour explorer la capitale sans se ruiner.",
    features: ["Wifi Gratuit", "Petit-déjeuner Buffet", "Réception 24h/24", "Proche Gare", "Bar", "Parking"]
  },
  {
    name: "Sofitel Rabat Jardin des Roses",
    location: "Rabat",
    category: "Business",
    price: 2000,
    image: getImageUrl(20),
    desc: "Palace 5 étoiles de 200 chambres avec jardins de 17 hectares, spa de 1500m² et restaurants gastronomiques au cœur de la capitale. Piscine extérieure, tennis et vue sur l'océan. Élégance française et service raffiné.",
    features: ["Palace", "Jardins 17ha", "Spa 1500m²", "Restaurants Gastronomiques", "Piscine", "Tennis"]
  },
  {
    name: "Riad Kalaa",
    location: "Rabat",
    category: "Villes Impériales",
    price: 900,
    image: getImageUrl(21),
    desc: "Riad authentique de 8 chambres dans la médina de Rabat, avec patio traditionnel et terrasse sur les remparts offrant une vue sur l'océan et l'embouchure du Bouregreg. Décoration traditionnelle et accueil chaleureux.",
    features: ["Médina", "Patio Traditionnel", "Terrasse Remparts", "Vue Océan", "Authentique", "Wifi"]
  },
  {
    name: "Hotel La Tour Hassan",
    location: "Rabat",
    category: "Business",
    price: 1500,
    image: getImageUrl(22),
    desc: "Hôtel 5 étoiles de 150 chambres face à la Tour Hassan, avec spa, restaurant avec vue panoramique et piscine. Situé au cœur de la capitale, avec accès aux sites historiques et quartiers gouvernementaux.",
    features: ["Vue Tour Hassan", "Spa", "Restaurant Panoramique", "Piscine", "Centre", "Fitness"]
  },
  {
    name: "Riad Dar El Kebira",
    location: "Rabat",
    category: "Villes Impériales",
    price: 750,
    image: getImageUrl(23),
    desc: "Riad de charme de 6 chambres dans la Kasbah des Oudayas, avec vue sur l'océan et l'embouchure du Bouregreg. Patio andalou, terrasse et décoration traditionnelle. Proche de la plage et des sites historiques.",
    features: ["Kasbah Oudayas", "Vue Océan", "Charme", "Petit-déjeuner", "Wifi", "Proche Plage"]
  },
  {
    name: "Golden Tulip Rabat",
    location: "Rabat",
    category: "Business",
    price: 1100,
    image: getImageUrl(24),
    desc: "Hôtel moderne de 180 chambres avec spa, fitness et restaurant international. Situé près de l'aéroport et des quartiers d'affaires, avec salles de conférence et service professionnel.",
    features: ["Moderne", "Spa", "Fitness", "Restaurant International", "Business", "Proche Aéroport"]

  // ========== FÈS (6 hôtels) ==========
  },
  {
    name: "Riad Fès Maya",
    location: "Fès",
    category: "Villes Impériales",
    price: 850,
    image: getImageUrl(25),
    desc: "Plongez dans l'histoire au cœur de la médina de Fès, classée UNESCO. Ce Riad restauré avec passion offre des zelliges authentiques, un patio andalou et une terrasse panoramique sur la vieille ville. 12 chambres, restaurant traditionnel et hammam. Une immersion culturelle garantie.",
    features: ["Médina UNESCO", "Petit-déjeuner Marocain", "Patio Andalou", "Terrasse Panoramique", "Climatisation", "Thé à volonté", "Hammam"]
  },
  {
    name: "Palais Faraj Suites & Spa",
    location: "Fès",
    category: "Villes Impériales",
    price: 2200,
    image: getImageUrl(26),
    desc: "Palace 5 étoiles de 50 suites avec vue exceptionnelle sur la médina de Fès, spa de 1000m² et suites luxueuses. Situé sur les hauteurs, avec piscine, restaurants gastronomiques et service majordome. Architecture hispano-mauresque.",
    features: ["Palace", "Vue Médina Exceptionnelle", "Spa 1000m²", "Suites Luxueuses", "Restaurant", "Piscine"]
  },
  {
    name: "Riad Laaroussa",
    location: "Fès",
    category: "Villes Impériales",
    price: 1100,
    image: getImageUrl(27),
    desc: "Riad de luxe de 10 chambres avec piscine intérieure, restaurant gastronomique et spa dans la médina. Patio avec fontaine, terrasse et décoration raffinée. Service personnalisé et accueil chaleureux.",
    features: ["Piscine Intérieure", "Restaurant Gastronomique", "Spa", "Médina", "Luxe", "Service Personnalisé"]
  },
  {
    name: "Dar Bensouda",
    location: "Fès",
    category: "Villes Impériales",
    price: 950,
    image: getImageUrl(28),
    desc: "Riad authentique restauré de 8 chambres, avec cours intérieure et chambres décorées à l'ancienne. Situé dans la médina, avec restaurant traditionnel et terrasse. Collection d'objets d'art et mobilier ancien.",
    features: ["Authentique", "Cours Intérieure", "Décor Traditionnel", "Wifi", "Petit-déjeuner", "Restaurant"]
  },
  {
    name: "Hotel Sahrai",
    location: "Fès",
    category: "Villes Impériales",
    price: 1800,
    image: getImageUrl(29),
    desc: "Hôtel design moderne de 50 chambres avec spa Givenchy de 2000m², piscine à débordement et vue sur la médina. Restaurants gastronomiques, bar rooftop et architecture contemporaine. Expérience unique.",
    features: ["Design Moderne", "Spa Givenchy 2000m²", "Piscine Débordement", "Vue Médina", "Restaurant", "Bar Rooftop"]
  },
  {
    name: "Riad Tizwa",
    location: "Fès",
    category: "Villes Impériales",
    price: 800,
    image: getImageUrl(30),
    desc: "Riad boutique de 7 chambres avec terrasse, restaurant et accueil chaleureux. Situé dans la médina, avec patio, décoration soignée et service attentionné. Idéal pour découvrir Fès authentique.",
    features: ["Boutique", "Terrasse", "Restaurant", "Chaleureux", "Wifi", "Médina"]

  // ========== TANGER (5 hôtels) ==========
  },
  {
    name: "Tanger Beach Hotel",
    location: "Tanger",
    category: "Nord",
    price: 900,
    image: getImageUrl(31),
    desc: "Hôtel moderne de 120 chambres face à la baie de Tanger, parfait pour explorer la ville blanche. Chambres spacieuses avec vue sur le détroit de Gibraltar, salle de sport, parking gratuit et bar lounge. Proche du centre historique.",
    features: ["Vue Détroit Gibraltar", "Salle de Sport", "Parking Gratuit", "Bar Lounge", "Proche Centre", "Face Baie"]
  },
  {
    name: "El Minzah Hotel",
    location: "Tanger",
    category: "Nord",
    price: 1500,
    image: getImageUrl(32),
    desc: "Hôtel historique 5 étoiles de 140 chambres depuis 1930, avec jardins de 2 hectares, piscine et vue sur le détroit. Restaurants gastronomiques, bar historique et charme d'époque. Situé dans la médina.",
    features: ["Historique 1930", "Jardins 2ha", "Piscine", "Vue Détroit", "Restaurant", "Bar Historique"]
  },
  {
    name: "Grand Hotel Villa de France",
    location: "Tanger",
    category: "Nord",
    price: 1200,
    image: getImageUrl(33),
    desc: "Villa historique avec 30 chambres, vue panoramique sur Tanger et le détroit, restaurant gastronomique et bar. Décoration d'époque, terrasse et charme authentique. Vue imprenable depuis les hauteurs.",
    features: ["Historique", "Vue Panoramique", "Restaurant", "Bar", "Charme", "Terrasse"]
  },
  {
    name: "Nord Pinus Tanger",
    location: "Tanger",
    category: "Nord",
    price: 1100,
    image: getImageUrl(34),
    desc: "Hôtel boutique de 20 chambres avec design contemporain, spa et restaurant. Situé dans la médina, avec terrasse et vue sur la baie. Décoration moderne et service personnalisé.",
    features: ["Boutique", "Design Contemporain", "Spa", "Restaurant", "Moderne", "Médina"]
  },
  {
    name: "Ibis Tanger City Center",
    location: "Tanger",
    category: "Economique",
    price: 450,
    image: getImageUrl(35),
    desc: "Hôtel économique moderne de 100 chambres au centre-ville, pratique et confortable. Proche du port, des commerces et sites touristiques. Wifi gratuit, petit-déjeuner et parking.",
    features: ["Économique", "Centre-ville", "Moderne", "Wifi Gratuit", "Parking", "Proche Port"]

  // ========== AGADIR (6 hôtels) ==========
  },
  {
    name: "Hôtel Royal Atlas Agadir",
    location: "Agadir",
    category: "Agadir",
    price: 1200,
    image: getImageUrl(36),
    desc: "Situé en front de mer, le Royal Atlas Agadir vous offre une expérience 5 étoiles inoubliable sur 8 hectares. Profitez de ses 3 piscines, de son spa luxueux de 1500m² et d'un accès direct à la plage privée de 300m. 400 chambres, 4 restaurants, club enfants et formule all-inclusive. Idéal pour les familles et les couples en quête de détente.",
    features: ["Wifi Haut Débit", "3 Piscines", "Spa & Hammam 1500m²", "Front de mer", "Plage Privée 300m", "Club Enfants", "All-inclusive", "4 Restaurants"]
  },
  {
    name: "Hyatt Place Agadir",
    location: "Agadir",
    category: "Agadir",
    price: 1400,
    image: getImageUrl(37),
    desc: "Hôtel moderne de 200 chambres face à la plage avec spa, piscine extérieure et restaurants. Situé sur la corniche, avec fitness center, business center et accès direct à la plage. Vue sur l'océan et service professionnel.",
    features: ["Face Plage", "Spa", "Piscine Extérieure", "Restaurants", "Fitness", "Business Center", "Corniche"]
  },
  {
    name: "Riad Villa Blanche",
    location: "Agadir",
    category: "Agadir",
    price: 850,
    image: getImageUrl(38),
    desc: "Villa de charme de 8 chambres avec piscine, jardin de 500m² et accès à la plage. Située à 5 minutes de la plage, avec terrasse, restaurant et service personnalisé. Ambiance décontractée et accueil chaleureux.",
    features: ["Villa", "Piscine", "Jardin 500m²", "Plage 5min", "Charme", "Restaurant"]
  },
  {
    name: "Ibis Agadir Centre",
    location: "Agadir",
    category: "Economique",
    price: 500,
    image: getImageUrl(39),
    desc: "Hôtel économique de 120 chambres au centre-ville, proche de la plage et des commerces. Moderne, propre et confortable. Wifi gratuit, petit-déjeuner et parking. Excellent rapport qualité-prix.",
    features: ["Économique", "Centre-ville", "Proche Plage", "Wifi Gratuit", "Parking", "Commerces"]
  },
  {
    name: "Tikida Beach Agadir",
    location: "Agadir",
    category: "Agadir",
    price: 1100,
    image: getImageUrl(40),
    desc: "Club de vacances all-inclusive de 300 chambres face à la plage avec animations et activités. 3 piscines, restaurants buffet, bars, discothèque et club enfants. Animations journée et soirée, sports nautiques.",
    features: ["All-inclusive", "Face Plage", "Animations", "3 Piscines", "Restaurants Buffet", "Club Enfants", "Sports Nautiques"]
  },
  {
    name: "Sofitel Agadir Thalassa Sea & Spa",
    location: "Agadir",
    category: "Agadir",
    price: 2000,
    image: getImageUrl(41),
    desc: "Resort 5 étoiles de 250 chambres avec centre thalasso de 2000m², spa et plage privée. Situé sur la corniche, avec 3 restaurants, piscines, fitness et service exceptionnel. Soins marins et bien-être.",
    features: ["Thalasso 2000m²", "Spa", "Plage Privée", "Resort", "3 Restaurants", "Piscines", "Fitness"]

  // ========== CHEFCHAOUEN (3 hôtels) ==========
  },
  {
    name: "Blue Pearl Riad",
    location: "Chefchaouen",
    category: "Nord",
    price: 550,
    image: getImageUrl(42),
    desc: "Un petit bijou caché dans les ruelles bleues de Chefchaouen. Riad de 6 chambres avec ambiance intimiste, décoration bohème et accueil chaleureux. Terrasse avec vue sur les montagnes du Rif. Pour un séjour photogénique et authentique dans la ville bleue.",
    features: ["Au cœur de la médina", "Rooftop", "Wifi", "Petit-déjeuner inclus", "Vue Montagnes", "Authentique"]
  },
  {
    name: "Casa Hassan",
    location: "Chefchaouen",
    category: "Nord",
    price: 650,
    image: getImageUrl(43),
    desc: "Riad de charme de 8 chambres dans la médina bleue, avec terrasse et vue sur les montagnes du Rif. Décoration traditionnelle, restaurant et accueil personnalisé. Proche de la place Outa el-Hammam.",
    features: ["Médina Bleue", "Terrasse", "Vue Montagnes Rif", "Charme", "Wifi", "Restaurant"]
  },
  {
    name: "Dar Echchaouen",
    location: "Chefchaouen",
    category: "Nord",
    price: 600,
    image: getImageUrl(44),
    desc: "Maison d'hôtes authentique de 7 chambres avec patio traditionnel et terrasse panoramique. Située dans la médina, avec décoration locale, restaurant et vue sur la ville bleue. Accueil chaleureux et service attentionné.",
    features: ["Authentique", "Patio", "Terrasse Panoramique", "Petit-déjeuner", "Wifi", "Vue Ville"]

  // ========== ESSAOUIRA (4 hôtels) ==========
  },
  {
    name: "Villa d'Essaouira",
    location: "Essaouira",
    category: "Agadir",
    price: 750,
    image: getImageUrl(45),
    desc: "Une maison d'hôtes de charme de 10 chambres protégée des vents alizés. Jardin de 800m², piscine et accès à la plage. Profitez de la douceur de vivre d'Essaouira, entre plage, surf et médina artistique. Cours de surf et activités nautiques.",
    features: ["Jardin 800m²", "Piscine", "Cours de Surf", "Proche Plage", "Ambiance Zen", "Activités Nautiques"]
  },
  {
    name: "Riad Watier",
    location: "Essaouira",
    category: "Agadir",
    price: 850,
    image: getImageUrl(46),
    desc: "Riad design de 8 chambres dans la médina, avec restaurant gastronomique et terrasse avec vue sur l'océan. Décoration moderne, spa et service personnalisé. Proche des remparts et de la plage.",
    features: ["Design", "Médina", "Restaurant Gastronomique", "Vue Océan", "Terrasse", "Spa"]
  },
  {
    name: "Atlas Essaouira & Spa",
    location: "Essaouira",
    category: "Agadir",
    price: 1200,
    image: getImageUrl(47),
    desc: "Hôtel 4 étoiles de 150 chambres avec spa de 1000m², piscine et accès direct à la plage. Situé sur la corniche, avec restaurants, fitness et activités nautiques. Vue sur l'océan et les îles.",
    features: ["Spa 1000m²", "Piscine", "Plage Directe", "Restaurant", "Fitness", "Activités Nautiques"]
  },
  {
    name: "Riad Lalla Mira",
    location: "Essaouira",
    category: "Agadir",
    price: 700,
    image: getImageUrl(48),
    desc: "Riad authentique de 6 chambres avec patio traditionnel, terrasse et accueil chaleureux. Situé dans la médina, avec restaurant, décoration soignée et vue sur les remparts. Ambiance décontractée.",
    features: ["Authentique", "Patio", "Terrasse", "Chaleureux", "Wifi", "Médina"]

  // ========== OUARZAZATE (3 hôtels) ==========
  },
  {
    name: "Berbère Palace",
    location: "Ouarzazate",
    category: "Désert",
    price: 1000,
    image: getImageUrl(49),
    desc: "Hôtel de charme de 120 chambres avec architecture berbère authentique, piscine et vue sur les montagnes de l'Atlas. Situé près des studios de cinéma, avec restaurant, spa et excursions dans le désert.",
    features: ["Architecture Berbère", "Piscine", "Vue Montagnes Atlas", "Restaurant", "Spa", "Excursions Désert"]
  },
  {
    name: "Le Temple des Arts",
    location: "Ouarzazate",
    category: "Désert",
    price: 850,
    image: getImageUrl(50),
    desc: "Hôtel design de 80 chambres inspiré du cinéma, avec piscine, restaurant et décoration cinématographique. Situé près des studios, avec musée du cinéma, bar et vue sur la kasbah de Taourirt.",
    features: ["Design Cinéma", "Piscine", "Restaurant", "Moderne", "Wifi", "Musée Cinéma"]
  },
  {
    name: "Kasbah Ait Benhaddou",
    location: "Ouarzazate",
    category: "Désert",
    price: 600,
    image: getImageUrl(51),
    desc: "Auberge traditionnelle de 20 chambres près de la kasbah classée UNESCO, avec vue sur les montagnes. Décoration berbère, restaurant traditionnel et excursions. Point de départ pour le désert.",
    features: ["Traditionnel", "Vue Kasbah UNESCO", "Montagnes", "Authentique", "Petit-déjeuner", "Excursions"]

  // ========== MEKNÈS (3 hôtels) ==========
  },
  {
    name: "Riad Yacout",
    location: "Meknès",
    category: "Villes Impériales",
    price: 750,
    image: getImageUrl(52),
    desc: "Riad authentique de 8 chambres dans la médina de Meknès, avec patio traditionnel et terrasse. Décoration soignée, restaurant et accueil chaleureux. Proche de la place El-Hedim et des sites historiques.",
    features: ["Médina", "Patio", "Terrasse", "Authentique", "Wifi", "Restaurant"]
  },
  {
    name: "Hotel Transatlantique",
    location: "Meknès",
    category: "Villes Impériales",
    price: 900,
    image: getImageUrl(53),
    desc: "Hôtel historique de 60 chambres avec jardin de 1 hectare, restaurant et vue sur la ville impériale. Décoration d'époque, bar et charme authentique. Situé près de la médina et des remparts.",
    features: ["Historique", "Jardin 1ha", "Restaurant", "Vue Ville", "Charme", "Bar"]
  },
  {
    name: "Riad Meknès",
    location: "Meknès",
    category: "Villes Impériales",
    price: 650,
    image: getImageUrl(54),
    desc: "Riad de charme de 6 chambres avec cours intérieure traditionnelle et accueil chaleureux. Situé dans la médina, avec restaurant, terrasse et décoration locale. Authenticité et simplicité.",
    features: ["Charme", "Cours Traditionnelle", "Traditionnel", "Petit-déjeuner", "Wifi", "Médina"]

  // ========== TÉTOUAN (2 hôtels) ==========
  },
  {
    name: "Hotel Marina Smir",
    location: "Tétouan",
    category: "Nord",
    price: 800,
    image: getImageUrl(55),
    desc: "Hôtel de 100 chambres face à la mer avec piscine, restaurant et accès à la plage. Situé à Marina Smir, avec vue sur la Méditerranée, fitness et activités nautiques. Proche de Tétouan et Chefchaouen.",
    features: ["Face Mer Méditerranée", "Piscine", "Restaurant", "Plage", "Moderne", "Activités Nautiques"]
  },
  {
    name: "Riad Blanco",
    location: "Tétouan",
    category: "Nord",
    price: 600,
    image: getImageUrl(56),
    desc: "Riad de 7 chambres dans la médina blanche, avec terrasse et vue sur la montagne. Décoration andalouse, restaurant et accueil personnalisé. Proche de la place Hassan II et des souks.",
    features: ["Médina Blanche", "Terrasse", "Vue Montagne", "Authentique", "Wifi", "Andalouse"]

  // ========== ASILAH (2 hôtels) ==========
  },
  {
    name: "Parador de Asilah",
    location: "Asilah",
    category: "Nord",
    price: 950,
    image: getImageUrl(57),
    desc: "Hôtel de 80 chambres face à l'océan avec piscine, restaurant gastronomique et vue panoramique. Situé sur les remparts, avec spa, terrasse et accès à la plage. Charme andalou et modernité.",
    features: ["Face Océan", "Piscine", "Restaurant Gastronomique", "Vue Panoramique", "Spa", "Remparts"]
  },
  {
    name: "Riad Asilah",
    location: "Asilah",
    category: "Nord",
    price: 700,
    image: getImageUrl(58),
    desc: "Riad de charme de 6 chambres dans la médina, avec terrasse et accès à la plage. Décoration soignée, restaurant et vue sur l'océan. Proche des remparts et de la place principale.",
    features: ["Médina", "Terrasse", "Plage", "Charme", "Wifi", "Vue Océan"]

  // ========== IFRANE (2 hôtels) ==========
  },
  {
    name: "Hotel Michlifen",
    location: "Ifrane",
    category: "Atlas Mountains",
    price: 1500,
    image: getImageUrl(59),
    desc: "Resort de montagne de 100 chambres avec spa de 1500m², piscine intérieure et activités de plein air. Situé dans la forêt de cèdres, avec restaurant, ski en hiver et randonnées. Vue exceptionnelle.",
    features: ["Montagne", "Spa 1500m²", "Piscine Intérieure", "Plein Air", "Restaurant", "Ski Hiver", "Forêt Cèdres"]
  },
  {
    name: "Hotel Chamonix",
    location: "Ifrane",
    category: "Atlas Mountains",
    price: 900,
    image: getImageUrl(60),
    desc: "Hôtel de montagne de 50 chambres avec vue sur les cèdres, restaurant et bar. Décoration alpine, cheminée et charme montagnard. Proche du parc national et des sentiers de randonnée.",
    features: ["Montagne", "Vue Cèdres", "Restaurant", "Bar", "Charme", "Randonnées"]

  // ========== AZROU (1 hôtel) ==========
  },
  {
    name: "Hotel Azrou",
    location: "Azrou",
    category: "Atlas Mountains",
    price: 650,
    image: getImageUrl(61),
    desc: "Hôtel de montagne de 40 chambres au cœur de la forêt de cèdres, avec restaurant et terrasse. Vue sur les montagnes, décoration simple et accueil chaleureux. Point de départ pour les randonnées.",
    features: ["Forêt Cèdres", "Montagne", "Restaurant", "Terrasse", "Nature", "Randonnées"]

  // ========== ERRACHIDIA (2 hôtels) ==========
  },
  {
    name: "Kasbah Hotel Xaluca",
    location: "Errachidia",
    category: "Désert",
    price: 800,
    image: getImageUrl(62),
    desc: "Kasbah traditionnelle de 80 chambres avec piscine, restaurant et vue sur le désert. Architecture berbère, spa et excursions dans les oasis. Point de départ pour Merzouga et les dunes.",
    features: ["Kasbah", "Piscine", "Désert", "Restaurant", "Traditionnel", "Excursions Oasis"]
  },
  {
    name: "Hotel Ziz",
    location: "Errachidia",
    category: "Désert",
    price: 600,
    image: getImageUrl(63),
    desc: "Hôtel simple et confortable de 50 chambres, point de départ idéal pour les excursions dans le désert. Restaurant, parking et service basique. Proche de la vallée du Ziz et des palmeraies.",
    features: ["Simple", "Confortable", "Excursions Désert", "Désert", "Wifi", "Vallée Ziz"]

  // ========== OUJDA (2 hôtels) ==========
  },
  {
    name: "Hotel Lalla Aicha",
    location: "Oujda",
    category: "Nord",
    price: 700,
    image: getImageUrl(64),
    desc: "Hôtel moderne de 100 chambres au centre-ville avec restaurant et salles de conférence. Proche de la gare et des commerces, avec fitness et service professionnel. Idéal pour les affaires.",
    features: ["Moderne", "Centre-ville", "Restaurant", "Conférence", "Wifi", "Proche Gare"]
  },
  {
    name: "Ibis Oujda",
    location: "Oujda",
    category: "Economique",
    price: 450,
    image: getImageUrl(65),
    desc: "Hôtel économique moderne de 80 chambres, pratique pour les voyageurs d'affaires. Proche de l'aéroport, avec wifi gratuit, petit-déjeuner et parking. Excellent rapport qualité-prix.",
    features: ["Économique", "Moderne", "Business", "Wifi Gratuit", "Parking", "Proche Aéroport"]

  // ========== NADOR (1 hôtel) ==========
  },
  {
    name: "Hotel Rif Nador",
    location: "Nador",
    category: "Nord",
    price: 650,
    image: getImageUrl(66),
    desc: "Hôtel de 80 chambres face à la lagune de Nador, avec restaurant et vue panoramique. Situé sur la corniche, avec piscine, bar et accès à la plage. Vue sur la lagune et les montagnes.",
    features: ["Face Lagune", "Restaurant", "Vue Panoramique", "Moderne", "Wifi", "Corniche"]

  // ========== LARACHE (1 hôtel) ==========
  },
  {
    name: "Hotel Larache",
    location: "Larache",
    category: "Nord",
    price: 600,
    image: getImageUrl(67),
    desc: "Hôtel de charme de 50 chambres face à l'océan, avec restaurant de fruits de mer et terrasse. Vue sur l'Atlantique, décoration simple et accueil chaleureux. Proche de Lixus et des plages.",
    features: ["Face Océan", "Charme", "Restaurant Fruits de Mer", "Terrasse", "Wifi", "Proche Lixus"]

  // ========== SAFI (1 hôtel) ==========
  },
  {
    name: "Hotel Safi",
    location: "Safi",
    category: "Agadir",
    price: 550,
    image: getImageUrl(68),
    desc: "Hôtel de 60 chambres face à la mer avec restaurant et accès à la plage. Vue sur l'océan, décoration simple et service basique. Proche du port et de la médina. Idéal pour un séjour économique.",
    features: ["Face Mer", "Restaurant", "Plage", "Simple", "Wifi", "Proche Port"]

  // ========== EL JADIDA (2 hôtels) ==========
  },
  {
    name: "Mazagan Beach & Golf Resort",
    location: "El Jadida",
    category: "Luxe",
    price: 2200,
    image: getImageUrl(69),
    desc: "Un resort grandiose de 500 chambres pour toute la famille sur 250 hectares. Casino, terrain de golf 18 trous signé Gary Player, immense plage privée de 7km et activités infinies. 12 restaurants, kids club géant, spa de 2000m² et marina. Expérience complète de détente et divertissement.",
    features: ["Golf 18 trous Gary Player", "Casino", "Plage Privée 7km", "12 Restaurants", "Kids Club Géant", "Spa 2000m²", "Marina"]
  },
  {
    name: "Hotel El Jadida",
    location: "El Jadida",
    category: "Agadir",
    price: 700,
    image: getImageUrl(70),
    desc: "Hôtel de 80 chambres face à la mer avec piscine et restaurant de fruits de mer. Vue sur l'océan, décoration moderne et service attentionné. Proche de la cité portugaise et de la plage.",
    features: ["Face Mer", "Piscine", "Restaurant Fruits de Mer", "Fruits de Mer", "Wifi", "Cité Portugaise"]

  // ========== DAKHLA (2 hôtels) ==========
  },
  {
    name: "Dakhla Kite Lodge",
    location: "Dakhla",
    category: "Désert",
    price: 1100,
    image: getImageUrl(71),
    desc: "Le paradis des sports de glisse. Bungalows écologiques de 20 unités face au lagon, école de kitesurf intégrée et cuisine saine à base de produits de la mer. Yoga quotidien, transfert aéroport et activités nautiques. Expérience unique dans un cadre préservé.",
    features: ["Spot de Kitesurf", "Bungalow Lagon", "Pension Complète", "Yoga", "Transfert Aéroport", "Écologique"]
  },
  {
    name: "Hotel Dakhla Attitude",
    location: "Dakhla",
    category: "Désert",
    price: 950,
    image: getImageUrl(72),
    desc: "Resort de 100 chambres face au lagon avec activités nautiques, restaurant gastronomique et spa. Piscine, bar et vue sur le lagon. Kitesurf, planche à voile et pêche. Cadre exceptionnel.",
    features: ["Face Lagon", "Activités Nautiques", "Restaurant", "Spa", "Moderne", "Kitesurf"]

  // ========== MERZOUGA (2 hôtels) ==========
  },
  {
    name: "Sahara Luxury Camp",
    location: "Merzouga",
    category: "Désert",
    price: 600,
    image: getImageUrl(73),
    desc: "Vivez la magie du désert sans sacrifier votre confort. Camp de 15 tentes de luxe avec vrais lits, salles de bains privées et électricité solaire. Dîner sous les étoiles, musique gnawa et excursion chameau au lever du soleil inclus. Expérience inoubliable dans les dunes de l'Erg Chebbi.",
    features: ["Tente de Luxe", "Dîner Étoiles", "Feu de Camp", "Douche Chaude", "Excursion Chameau", "Musique Gnawa", "Solaire"]
  },
  {
    name: "Kasbah Hotel Tombouctou",
    location: "Merzouga",
    category: "Désert",
    price: 750,
    image: getImageUrl(74),
    desc: "Kasbah de 40 chambres avec piscine, restaurant traditionnel et excursions dans les dunes. Vue sur l'Erg Chebbi, décoration berbère et accueil authentique. Point de départ pour les aventures désertiques.",
    features: ["Kasbah", "Piscine", "Restaurant", "Excursions", "Dunes Erg Chebbi", "Berbère"]

  // ========== LAÂYOUNE (1 hôtel) ==========
  },
  {
    name: "Hotel Laâyoune",
    location: "Laâyoune",
    category: "Désert",
    price: 700,
    image: getImageUrl(75),
    desc: "Hôtel moderne de 100 chambres au centre-ville avec restaurant et salles de conférence. Proche des commerces et administrations, avec fitness et service professionnel. Idéal pour les voyages d'affaires dans le Sahara.",
    features: ["Moderne", "Centre-ville", "Restaurant", "Conférence", "Wifi", "Fitness"]
  }
];

const seedHotels = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hotelreserve');
    
    console.log('✅ Connected to MongoDB');
    console.log('🗑️  Clearing existing hotels...');
    
    // Clear existing hotels
    await Hotel.deleteMany({});
    
    console.log('📝 Preparing hotel data...');
    
    // Prepare hotel data with availability
    const hotels = hotelsData.map((hotel) => ({
      name: hotel.name,
      location: hotel.location,
      category: hotel.category,
      price: hotel.price,
      description: hotel.desc,
      features: hotel.features,
      images: [hotel.image],
      availability: []
    }));
    
    console.log(`📦 Inserting ${hotels.length} hotels...`);
    await Hotel.insertMany(hotels);
    
    console.log(`\n✅ ${hotels.length} hotels seeded successfully!\n`);
    console.log('📊 Hotels by location:');
    const locationCount = {};
    hotels.forEach(h => {
      locationCount[h.location] = (locationCount[h.location] || 0) + 1;
    });
    Object.entries(locationCount).sort().forEach(([loc, count]) => {
      console.log(`   ${loc}: ${count} hôtel(s)`);
    });
    
    console.log('\n💰 Price range:');
    const prices = hotels.map(h => h.price).sort((a, b) => a - b);
    console.log(`   Min: ${prices[0]} MAD/nuit`);
    console.log(`   Max: ${prices[prices.length - 1]} MAD/nuit`);
    console.log(`   Average: ${Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)} MAD/nuit`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedHotels();
}

module.exports = seedHotels;
