const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('./models/User');
const Trip = require('./models/Trip');
const Booking = require('./models/Booking');
require('dotenv').config();

const seedData = async () => {
  let mongoServer;

  try {
    // Démarrer MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    console.log('🚀 MongoDB Memory Server started at:', mongoUri);

    // Se connecter à MongoDB
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');
    // Nettoyer la base de données
    await User.deleteMany({});
    await Trip.deleteMany({});
    await Booking.deleteMany({});

    console.log('🧹 Base de données nettoyée');

    // Créer des utilisateurs de test
    const users = await User.create([
      {
        name: 'Ahmed Diallo',
        email: 'ahmed@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password
        phone: '+212600000001',
        role: 'user'
      },
      {
        name: 'Fatima Alaoui',
        email: 'fatima@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password
        phone: '+212600000002',
        role: 'user'
      },
      {
        name: 'Youssef Tazi',
        email: 'youssef@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password
        phone: '+212600000003',
        role: 'user'
      }
    ]);

    console.log('👥 Utilisateurs créés:', users.length);

    // Créer des trips de test
    const trips = await Trip.create([
      {
        driver: users[0]._id,
        departure: 'Casablanca',
        arrival: 'Rabat',
        date: new Date('2026-04-10'),
        time: '08:00',
        price: 50,
        seats: 4,
        availableSeats: 3,
        description: 'Trajet direct Casablanca-Rabat, climatisation, musique autorisée'
      },
      {
        driver: users[1]._id,
        departure: 'Rabat',
        arrival: 'Marrakech',
        date: new Date('2026-04-15'),
        time: '14:30',
        price: 120,
        seats: 4,
        availableSeats: 2,
        description: 'Voyage confortable vers Marrakech, arrêt à Settat'
      },
      {
        driver: users[2]._id,
        departure: 'Marrakech',
        arrival: 'Agadir',
        date: new Date('2026-04-20'),
        time: '10:00',
        price: 80,
        seats: 5,
        availableSeats: 4,
        description: 'Trajet touristique avec vue sur l\'Atlas'
      },
      {
        driver: users[0]._id,
        departure: 'Tanger',
        arrival: 'Fès',
        date: new Date('2026-04-25'),
        time: '09:15',
        price: 90,
        seats: 4,
        availableSeats: 3,
        description: 'Route côtière puis montagneuse, paysages magnifiques'
      }
    ]);

    console.log('🚗 Trips créés:', trips.length);

    // Créer des réservations de test
    const bookings = await Booking.create([
      {
        user: users[1]._id,
        trip: trips[0]._id,
        seats: 1,
        totalPrice: 50,
        status: 'confirmed',
        paymentId: 'cash-payment-1'
      },
      {
        user: users[2]._id,
        trip: trips[1]._id,
        seats: 2,
        totalPrice: 240,
        status: 'pending',
        paymentId: null
      }
    ]);

    console.log('📝 Réservations créées:', bookings.length);

    // Mettre à jour les trips avec les réservations
    for (const booking of bookings) {
      const trip = await Trip.findById(booking.trip);
      if (trip) {
        trip.availableSeats -= booking.seats;
        trip.bookings.push(booking._id);
        await trip.save();
      }
    }

    // Mettre à jour les utilisateurs avec leurs réservations
    for (const booking of bookings) {
      const user = await User.findById(booking.user);
      if (user) {
        user.tripsTaken.push(booking._id);
        await user.save();
      }
    }

    console.log('✅ Données de test créées avec succès!');
    console.log('\n📊 Résumé:');
    console.log(`   👥 ${users.length} utilisateurs`);
    console.log(`   🚗 ${trips.length} trajets`);
    console.log(`   📝 ${bookings.length} réservations`);

    console.log('\n🔑 Comptes de test:');
    users.forEach(user => {
      console.log(`   📧 ${user.email} - Mot de passe: password`);
    });

  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
  } finally {
    // Fermer la connexion et arrêter le serveur
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
      console.log('🛑 MongoDB Memory Server stopped');
    }
  }
};

// Exécuter le seeding si appelé directement
if (require.main === module) {
  seedData();
}

module.exports = seedData;