const mongoose = require('mongoose');
const Trip = require('../models/Trip');
require('dotenv').config();

// Helper function to generate car images
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
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800&h=600&fit=crop',
  ];
  return carImages[index % carImages.length];
};

const fixTripImages = async () => {
  try {
    // Connect to MongoDB
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
    console.log('✅ MongoDB connected');

    // Find trips without images
    const tripsWithoutImage = await Trip.find({
      $or: [
        { image: null },
        { image: '' },
        { image: { $exists: false } }
      ]
    });

    console.log(`\n📊 Found ${tripsWithoutImage.length} trips without images`);

    if (tripsWithoutImage.length === 0) {
      console.log('✅ All trips already have images!');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Update trips with images
    let updated = 0;
    for (let i = 0; i < tripsWithoutImage.length; i++) {
      const trip = tripsWithoutImage[i];
      const imageUrl = getCarImage(i + trip._id.toString().charCodeAt(0));
      
      await Trip.findByIdAndUpdate(trip._id, {
        $set: { image: imageUrl }
      });
      updated++;
    }

    console.log(`\n✅ Updated ${updated} trips with images!`);

    // Verify
    const remaining = await Trip.find({
      $or: [
        { image: null },
        { image: '' },
        { image: { $exists: false } }
      ]
    });

    if (remaining.length === 0) {
      console.log('✅ All trips now have images!');
    } else {
      console.log(`⚠️  ${remaining.length} trips still without images`);
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  fixTripImages();
}

module.exports = fixTripImages;

