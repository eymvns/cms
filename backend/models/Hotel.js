const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Marrakech', 'Agadir', 'Fès', 'Tanger', 'Rabat', 'Casablanca', 'Chefchaouen', 'Désert', 'Atlas Mountains', 'El Jadida', 'Essaouira', 'Dakhla', 'Nord', 'Villes Impériales', 'Business', 'Luxe', 'Economique', 'Ouarzazate', 'Meknès', 'Tétouan', 'Asilah', 'Ifrane', 'Azrou', 'Errachidia', 'Oujda', 'Nador', 'Larache', 'Safi', 'Laâyoune']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  features: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String // URLs or paths
  }],
  availability: [{
    date: {
      type: Date,
      required: true
    },
    rooms: {
      type: Number,
      default: 10,
      min: 0
    },
    booked: {
      type: Number,
      default: 0,
      min: 0
    }
  }],
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    review: {
      type: String,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate average rating before saving
hotelSchema.pre('save', function(next) {
  if (this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
    this.averageRating = sum / this.ratings.length;
  } else {
    this.averageRating = 0;
  }
  next();
});

// Index for search
hotelSchema.index({ name: 'text', location: 'text', category: 'text' });

module.exports = mongoose.model('Hotel', hotelSchema);