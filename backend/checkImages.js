const mongoose = require('mongoose');
const Trip = require('./models/Trip');
require('dotenv').config();

const checkImages = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/hotelreserve';
    await mongoose.connect(mongoUri);
    
    const trips = await Trip.find().limit(10).select('_id departure arrival image');
    
    console.log('\n📊 Vérification des images des trajets:\n');
    let withImage = 0;
    let withoutImage = 0;
    
    trips.forEach(trip => {
      const hasImage = trip.image && trip.image.trim() !== '';
      if (hasImage) {
        withImage++;
        console.log(`✅ ${trip.departure} -> ${trip.arrival}: Image présente`);
      } else {
        withoutImage++;
        console.log(`❌ ${trip.departure} -> ${trip.arrival}: PAS D'IMAGE`);
      }
    });
    
    console.log(`\n📈 Résumé:`);
    console.log(`   Avec image: ${withImage}`);
    console.log(`   Sans image: ${withoutImage}`);
    
    if (withoutImage > 0) {
      console.log(`\n💡 Exécutez: node utils/fixTripImages.js pour corriger`);
    }
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkImages();

