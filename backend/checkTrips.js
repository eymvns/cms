const mongoose = require('mongoose');
const Trip = require('./models/Trip');
require('dotenv').config();

const checkTrips = async () => {
  try {
    let mongoUri;
    
    if (process.env.MONGO_URI) {
      mongoUri = process.env.MONGO_URI;
    } else {
      mongoUri = 'mongodb://localhost:27017/hotelreserve';
    }
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    
    const tripCount = await Trip.countDocuments();
    console.log(`\n📈 Total trips in database: ${tripCount}`);
    
    if (tripCount > 0) {
      const trips = await Trip.find().limit(5).select('departure arrival price date');
      console.log('\n📋 Sample trips:');
      trips.forEach((trip, i) => {
        console.log(`   ${i + 1}. ${trip.departure} → ${trip.arrival} - ${trip.price} MAD - ${trip.date.toLocaleDateString()}`);
      });
    } else {
      console.log('\n⚠️  NO TRIPS FOUND IN DATABASE!');
      console.log('💡 Run: node utils/tripSeeder.js');
    }
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkTrips();

