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

// Helper function to generate car images
const getCarImage = (index) => {
  const carImages = [
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
  ];
  return carImages[index % carImages.length];
};

// Moroccan cities
const cities = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 
  'Meknès', 'Oujda', 'Kenitra', 'Tétouan', 'Safi', 'Mohammedia',
  'El Jadida', 'Nador', 'Beni Mellal', 'Taza', 'Khouribga', 'Settat'
];

const vehicles = [
  'Mercedes Classe C', 'BMW Série 3', 'Audi A4', 'Peugeot 308', 
  'Renault Clio', 'Volkswagen Golf', 'Toyota Corolla', 'Hyundai i20',
  'Dacia Sandero', 'Ford Focus', 'Opel Corsa', 'Citroën C3'
];

const names = [
  'Ahmed', 'Fatima', 'Mohammed', 'Aicha', 'Hassan', 'Sanae', 
  'Youssef', 'Khadija', 'Omar', 'Laila', 'Ali', 'Nadia',
  'Mehdi', 'Souad', 'Karim', 'Salma', 'Amine', 'Imane'
];

const tripSeeder = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/voima');
    console.log('MongoDB connected for trip seeding');

    // Clear existing trips
    await Trip.deleteMany({});
    console.log('Cleared existing trips');

    // Get or create users
    let users = await User.find().limit(10);
    
    if (users.length === 0) {
      // Create sample users if none exist
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('password123', 12);
      
      for (let i = 0; i < 10; i++) {
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
      console.log('Created sample users');
    }

    // Generate trips
    const trips = [];
    const today = new Date();

    for (let i = 0; i < 50; i++) {
      const departure = cities[Math.floor(Math.random() * cities.length)];
      let arrival = cities[Math.floor(Math.random() * cities.length)];
      // Ensure departure and arrival are different
      while (arrival === departure) {
        arrival = cities[Math.floor(Math.random() * cities.length)];
      }

      const daysFromNow = Math.floor(Math.random() * 60); // Within next 60 days
      const date = getRandomDate(daysFromNow);
      const time = getRandomTime();
      
      // Price based on distance (simulated)
      const basePrice = 50 + Math.floor(Math.random() * 200);
      const seats = 2 + Math.floor(Math.random() * 4); // 2-5 seats
      const availableSeats = Math.floor(Math.random() * seats) + 1;

      const driver = users[Math.floor(Math.random() * users.length)];
      const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];

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
        description: `Trajet confortable de ${departure} à ${arrival}. Véhicule ${vehicle} bien entretenu.`,
        restrictions: Math.random() > 0.7 ? 'Non-fumeur uniquement' : '',
        image: getCarImage(i)
      });

      trips.push(trip);
    }

    // Save all trips
    await Trip.insertMany(trips);
    console.log(`✅ Successfully seeded ${trips.length} trips!`);

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

    process.exit(0);
  } catch (error) {
    console.error('Error seeding trips:', error);
    process.exit(1);
  }
};

// Run seeder
if (require.main === module) {
  tripSeeder();
}

module.exports = tripSeeder;

