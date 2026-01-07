const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  guests: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentId: {
    type: String,
    default: null
  },
  nights: {
    type: Number,
    required: true,
    min: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Validate check-in is before check-out
reservationSchema.pre('validate', function(next) {
  if (this.checkIn >= this.checkOut) {
    next(new Error('Check-out date must be after check-in date'));
  } else {
    const diffTime = Math.abs(this.checkOut - this.checkIn);
    this.nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    next();
  }
});

// Index for queries
reservationSchema.index({ user: 1, createdAt: -1 });
reservationSchema.index({ hotel: 1, checkIn: 1, checkOut: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);