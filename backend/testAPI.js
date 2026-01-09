const mongoose = require('mongoose');
const Trip = require('./models/Trip');
require('./models/User'); // Load User model
require('dotenv').config();

const testAPI = async () => {
  try {
    let mongoUri;
    
    if (process.env.MONGO_URI) {
      mongoUri = process.env.MONGO_URI;
      console.log('📡 Using MONGO_URI from environment');
    } else {
      mongoUri = 'mongodb://localhost:27017/hotelreserve';
      console.log('📡 Using local MongoDB');
    }
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    
    // Test query like the API does
    const query = { availableSeats: { $gt: 0 } };
    const trips = await Trip.find(query)
      .sort({ date: 1, price: 1 })
      .limit(10)
      .populate('driver', 'name');
    
    console.log(`\n📈 Found ${trips.length} trips with available seats (showing first 10):`);
    
    trips.forEach((trip, i) => {
      console.log(`\n   ${i + 1}. ${trip.departure} → ${trip.arrival}`);
      console.log(`      Price: ${trip.price} MAD`);
      console.log(`      Date: ${trip.date.toLocaleDateString()} ${trip.time}`);
      console.log(`      Seats: ${trip.availableSeats}/${trip.seats}`);
      console.log(`      Driver: ${trip.driver?.name || 'N/A'}`);
      console.log(`      Vehicle: ${trip.vehicle || 'N/A'}`);
    });
    
    const total = await Trip.countDocuments(query);
    console.log(`\n✅ Total trips available: ${total}`);
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testAPI();

