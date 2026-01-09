const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const User = require('../models/User');
require('dotenv').config();

// Helper function to generate random date in the future
const getRandomDate = (daysFromNow = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow + Math.floor(Math.random() * 30));
  return date;
};

// Helper function to generate random time
const getRandomTime = () => {
  const hours = Math.floor(Math.random() * 12) + 6; // Between 6 AM and 6 PM
  const minutes = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Helper function to generate car images (more variety)
const getCarImage = (index) => {
  const carImages = [
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1494976688153-0e8a5c8c5c5c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1553440569-bcc63803d83d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
  ];
  return carImages[index % carImages.length];
};

// Moroccan cities with more options
const cities = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 
  'Meknès', 'Oujda', 'Kenitra', 'Tétouan', 'Safi', 'Mohammedia',
  'El Jadida', 'Nador', 'Beni Mellal', 'Taza', 'Khouribga', 'Settat',
  'Chefchaouen', 'Essaouira', 'Ouarzazate', 'Errachidia', 'Ifrane', 'Azrou'
];

const vehicles = [
  'Mercedes Classe C', 'BMW Série 3', 'Audi A4', 'Peugeot 308', 
  'Renault Clio', 'Volkswagen Golf', 'Toyota Corolla', 'Hyundai i20',
  'Dacia Sandero', 'Ford Focus', 'Opel Corsa', 'Citroën C3',
  'Peugeot 208', 'Renault Megane', 'Hyundai Tucson', 'Kia Sportage'
];

const names = [
  'Ahmed', 'Fatima', 'Mohammed', 'Aicha', 'Hassan', 'Sanae', 
  'Youssef', 'Khadija', 'Omar', 'Laila', 'Ali', 'Nadia',
  'Mehdi', 'Souad', 'Karim', 'Salma', 'Amine', 'Imane',
  'Rachid', 'Zineb', 'Bilal', 'Sara', 'Anas', 'Yasmine'
];

// Predefined trips with detailed descriptions and realistic prices
const predefinedTrips = [
  {
    departure: 'Casablanca',
    arrival: 'Rabat',
    price: 60,
    description: 'Trajet direct Casablanca-Rabat sur l\'autoroute A1. Véhicule confortable avec climatisation. Départ depuis le centre-ville, arrivée près de la gare. Idéal pour les déplacements professionnels ou touristiques.',
    vehicle: 'Mercedes Classe C',
    restrictions: 'Non-fumeur uniquement'
  },
  {
    departure: 'Casablanca',
    arrival: 'Marrakech',
    price: 120,
    description: 'Voyage confortable vers Marrakech. Passage par Settat avec possibilité d\'arrêt. Véhicule spacieux avec sièges confortables. Parfait pour découvrir la ville ocre !',
    vehicle: 'BMW Série 3',
    restrictions: ''
  },
  {
    departure: 'Rabat',
    arrival: 'Fès',
    price: 100,
    description: 'Trajet vers Fès, la capitale culturelle. Route panoramique avec vue sur les montagnes. Arrêt possible à Meknès. Conduite souple et sécurisée.',
    vehicle: 'Audi A4',
    restrictions: ''
  },
  {
    departure: 'Marrakech',
    arrival: 'Agadir',
    price: 90,
    description: 'Route côtière vers Agadir avec vue sur l\'océan Atlantique. Passage par Essaouira possible. Véhicule moderne et bien entretenu. Parfait pour les vacances !',
    vehicle: 'Peugeot 308',
    restrictions: ''
  },
  {
    departure: 'Tanger',
    arrival: 'Casablanca',
    price: 150,
    description: 'Long trajet confortable Tanger-Casablanca. Autoroute moderne avec arrêts possibles. Idéal pour rejoindre la capitale économique. Conduite expérimentée.',
    vehicle: 'Mercedes Classe C',
    restrictions: 'Non-fumeur uniquement'
  },
  {
    departure: 'Casablanca',
    arrival: 'Tanger',
    price: 150,
    description: 'Trajet vers le nord du Maroc. Passage par Rabat et Kénitra. Vue sur le détroit de Gibraltar. Voyage agréable et sécurisé.',
    vehicle: 'BMW Série 3',
    restrictions: ''
  },
  {
    departure: 'Fès',
    arrival: 'Marrakech',
    price: 130,
    description: 'Traversée du Maroc de Fès à Marrakech. Passage par les montagnes de l\'Atlas. Paysages magnifiques garantis. Arrêt déjeuner possible.',
    vehicle: 'Toyota Corolla',
    restrictions: ''
  },
  {
    departure: 'Agadir',
    arrival: 'Marrakech',
    price: 90,
    description: 'Retour vers Marrakech depuis la côte. Route bien entretenue avec vue sur les montagnes. Confort et sécurité assurés.',
    vehicle: 'Renault Clio',
    restrictions: ''
  },
  {
    departure: 'Rabat',
    arrival: 'Casablanca',
    price: 60,
    description: 'Trajet court et fréquent Rabat-Casablanca. Idéal pour les déplacements quotidiens. Départ flexible selon vos besoins.',
    vehicle: 'Peugeot 208',
    restrictions: ''
  },
  {
    departure: 'Marrakech',
    arrival: 'Essaouira',
    price: 70,
    description: 'Petit trajet vers Essaouira, la perle de l\'Atlantique. Route côtière avec vue sur l\'océan. Parfait pour un week-end détente.',
    vehicle: 'Citroën C3',
    restrictions: ''
  },
  {
    departure: 'Casablanca',
    arrival: 'El Jadida',
    price: 50,
    description: 'Trajet court vers El Jadida. Route directe et rapide. Idéal pour une escapade à la plage ou visiter la cité portugaise.',
    vehicle: 'Dacia Sandero',
    restrictions: ''
  },
  {
    departure: 'Fès',
    arrival: 'Tanger',
    price: 140,
    description: 'Voyage vers le nord depuis Fès. Passage par Tétouan possible. Route panoramique avec vue sur la Méditerranée.',
    vehicle: 'Hyundai Tucson',
    restrictions: 'Non-fumeur uniquement'
  },
  {
    departure: 'Tanger',
    arrival: 'Chefchaouen',
    price: 80,
    description: 'Trajet vers la ville bleue de Chefchaouen. Route de montagne avec paysages époustouflants. Parfait pour les amateurs de photos !',
    vehicle: 'Renault Megane',
    restrictions: ''
  },
  {
    departure: 'Marrakech',
    arrival: 'Ouarzazate',
    price: 100,
    description: 'Route vers Ouarzazate, la porte du désert. Passage par le col de Tizi n\'Tichka. Paysages désertiques magnifiques. Arrêt photos possible.',
    vehicle: 'Toyota Corolla',
    restrictions: ''
  },
  {
    departure: 'Casablanca',
    arrival: 'Safi',
    price: 70,
    description: 'Trajet vers Safi, ville côtière authentique. Route directe avec vue sur l\'océan. Idéal pour découvrir cette ville historique.',
    vehicle: 'Peugeot 308',
    restrictions: ''
  },
  {
    departure: 'Rabat',
    arrival: 'Meknès',
    price: 80,
    description: 'Voyage vers Meknès, l\'une des villes impériales. Route agréable avec vue sur la campagne. Arrivée au centre-ville.',
    vehicle: 'Volkswagen Golf',
    restrictions: ''
  },
  {
    departure: 'Agadir',
    arrival: 'Essaouira',
    price: 60,
    description: 'Trajet côtier Agadir-Essaouira. Route panoramique avec vue sur l\'océan. Parfait pour découvrir deux villes côtières.',
    vehicle: 'Renault Clio',
    restrictions: ''
  },
  {
    departure: 'Fès',
    arrival: 'Ifrane',
    price: 50,
    description: 'Petit trajet vers Ifrane, la petite Suisse du Maroc. Route de montagne avec vue sur les forêts de cèdres. Idéal pour une escapade nature.',
    vehicle: 'Hyundai i20',
    restrictions: ''
  },
  {
    departure: 'Marrakech',
    arrival: 'Ouarzazate',
    price: 100,
    description: 'Route vers Ouarzazate et ses studios de cinéma. Passage par les kasbahs. Paysages de carte postale garantis.',
    vehicle: 'BMW Série 3',
    restrictions: ''
  },
  {
    departure: 'Casablanca',
    arrival: 'Mohammedia',
    price: 40,
    description: 'Très court trajet vers Mohammedia. Idéal pour une journée à la plage ou visiter cette ville côtière charmante.',
    vehicle: 'Dacia Sandero',
    restrictions: ''
  },
  {
    departure: 'Tanger',
    arrival: 'Tétouan',
    price: 50,
    description: 'Trajet vers Tétouan, la ville blanche. Route côtière avec vue sur la Méditerranée. Arrivée au cœur de la médina.',
    vehicle: 'Citroën C3',
    restrictions: ''
  }
];

const tripSeeder = async () => {
  try {
    // Connect to MongoDB - Use same logic as server
    let mongoUri;
    
    if (process.env.MONGO_URI) {
      // Use provided MongoDB URI
      mongoUri = process.env.MONGO_URI;
      console.log('📡 Using MONGO_URI from environment');
    } else {
      // Use local MongoDB
      mongoUri = 'mongodb://localhost:27017/hotelreserve';
      console.log('📡 Using local MongoDB');
    }
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected for trip seeding');

    // Clear existing trips
    await Trip.deleteMany({});
    console.log('🗑️  Cleared existing trips');

    // Get or create users
    let users = await User.find().limit(20);
    
    if (users.length === 0) {
      // Create sample users if none exist
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('password123', 12);
      
      for (let i = 0; i < 20; i++) {
        const user = new User({
          name: names[i % names.length] + ' ' + (i + 1),
          email: `user${i + 1}@example.com`,
          phone: `+2126${String(i).padStart(8, '0')}`,
          password: hashedPassword,
          verified: true
        });
        await user.save();
        users.push(user);
      }
      console.log('👥 Created sample users');
    } else {
      console.log(`👥 Using ${users.length} existing users`);
    }

    // Generate trips
    const trips = [];
    const today = new Date();

    // First, add all predefined trips with variations
    predefinedTrips.forEach((predefinedTrip, index) => {
      // Create multiple variations of each predefined trip
      for (let variation = 0; variation < 3; variation++) {
        const daysFromNow = Math.floor(Math.random() * 60) + variation * 7; // Spread over 60 days
        const date = getRandomDate(daysFromNow);
        const time = getRandomTime();
        
        const seats = 3 + Math.floor(Math.random() * 3); // 3-5 seats
        const availableSeats = Math.floor(Math.random() * (seats - 1)) + 1; // At least 1 seat available
        
        const driver = users[Math.floor(Math.random() * users.length)];
        const tripIndex = trips.length;

        const trip = new Trip({
          driver: driver._id,
          departure: predefinedTrip.departure,
          arrival: predefinedTrip.arrival,
          date,
          time,
          price: predefinedTrip.price + Math.floor(Math.random() * 20) - 10, // ±10 MAD variation
          seats,
          availableSeats,
          vehicle: predefinedTrip.vehicle || vehicles[Math.floor(Math.random() * vehicles.length)],
          description: predefinedTrip.description,
          restrictions: predefinedTrip.restrictions || (Math.random() > 0.7 ? 'Non-fumeur uniquement' : ''),
          image: getCarImage(tripIndex) || getCarImage(0) // Toujours avoir une image
        });

        trips.push(trip);
      }
    });

    // Then generate additional random trips
    const additionalTrips = 30;
    for (let i = 0; i < additionalTrips; i++) {
      const departure = cities[Math.floor(Math.random() * cities.length)];
      let arrival = cities[Math.floor(Math.random() * cities.length)];
      // Ensure departure and arrival are different
      while (arrival === departure) {
        arrival = cities[Math.floor(Math.random() * cities.length)];
      }

      const daysFromNow = Math.floor(Math.random() * 60);
      const date = getRandomDate(daysFromNow);
      const time = getRandomTime();
      
      // Price based on distance (simulated)
      const basePrice = 50 + Math.floor(Math.random() * 200);
      const seats = 2 + Math.floor(Math.random() * 4); // 2-5 seats
      const availableSeats = Math.floor(Math.random() * seats) + 1;

      const driver = users[Math.floor(Math.random() * users.length)];
      const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];

      // Generate descriptive text
      const descriptions = [
        `Trajet confortable de ${departure} à ${arrival}. Véhicule ${vehicle} bien entretenu avec climatisation. Conduite souple et sécurisée.`,
        `Voyage agréable vers ${arrival} depuis ${departure}. Véhicule moderne et spacieux. Arrêts possibles selon vos besoins.`,
        `Trajet direct ${departure}-${arrival}. Véhicule ${vehicle} récent avec tous les équipements. Parfait pour un voyage confortable.`,
        `Route panoramique vers ${arrival}. Départ depuis ${departure} avec vue sur les paysages marocains. Voyage agréable garanti.`,
        `Trajet économique et confortable de ${departure} à ${arrival}. Véhicule ${vehicle} fiable. Idéal pour les déplacements réguliers.`
      ];

      const trip = new Trip({
        driver: driver._id,
        departure,
        arrival,
        date,
        time,
        price: basePrice,
        seats,
        availableSeats,
        vehicle,
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        restrictions: Math.random() > 0.7 ? 'Non-fumeur uniquement' : '',
        image: getCarImage(trips.length) || getCarImage(0) // Toujours avoir une image
      });

      trips.push(trip);
    }

    // Save all trips
    await Trip.insertMany(trips);
    console.log(`\n✅ Successfully seeded ${trips.length} trips!`);

    // Display summary
    const summary = await Trip.aggregate([
      {
        $group: {
          _id: '$departure',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📊 Trips by departure city:');
    summary.forEach(item => {
      console.log(`   ${item._id}: ${item.count} trips`);
    });

    // Price statistics
    const priceStats = await Trip.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          avgPrice: { $avg: '$price' }
        }
      }
    ]);

    if (priceStats.length > 0) {
      console.log('\n💰 Price statistics:');
      console.log(`   Min: ${priceStats[0].minPrice} MAD`);
      console.log(`   Max: ${priceStats[0].maxPrice} MAD`);
      console.log(`   Average: ${Math.round(priceStats[0].avgPrice)} MAD`);
    }

    console.log('\n🎉 Trip seeding completed successfully!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding trips:', error);
    process.exit(1);
  }
};

// Run seeder
if (require.main === module) {
  tripSeeder();
}

module.exports = tripSeeder;

