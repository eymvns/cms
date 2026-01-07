const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  departure: {
    type: String,
    required: true,
    trim: true
  },
  arrival: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  seats: {
    type: Number,
    required: true,
    min: 1
  },
  availableSeats: {
    type: Number,
    default: function() { return this.seats; },
    min: 0
  },
  restrictions: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  vehicle: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for search
tripSchema.index({ departure: 'text', arrival: 'text' });

module.exports = mongoose.model('Trip', tripSchema);