const express = require('express');
const Booking = require('../models/Booking');
const Trip = require('../models/Trip');
const User = require('../models/User');
const { auth, admin } = require('../middleware/auth');

const router = express.Router();

// Get user's bookings
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('trip', 'departure arrival date time price')
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const { tripId, seats } = req.body;

    // Validate input
    if (!tripId || !seats || seats < 1) {
      return res.status(400).json({ message: 'Trip ID and valid number of seats required' });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if trip is in the past
    if (new Date(trip.date) < new Date()) {
      return res.status(400).json({ message: 'Cannot book past trips' });
    }

    // Check if user is the driver
    if (trip.driver.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot book your own trip' });
    }

    // Check available seats
    if (trip.availableSeats < seats) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    // Check if user already booked this trip
    const existingBooking = await Booking.findOne({
      user: req.user._id,
      trip: tripId,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'You have already booked this trip' });
    }

    // Calculate total price
    const totalPrice = trip.price * seats;

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      trip: tripId,
      seats,
      totalPrice
    });

    await booking.save();

    // Decrement available seats
    trip.availableSeats -= seats;
    trip.bookings.push(booking._id);
    await trip.save();

    // Add to user's tripsTaken
    await User.findByIdAndUpdate(req.user._id, {
      $push: { tripsTaken: booking._id }
    });

    // Populate trip info
    await booking.populate('trip', 'departure arrival date time price driver');

    res.status(201).json({
      booking,
      message: 'Booking created successfully. Proceed to payment.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get booking by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('trip', 'departure arrival date time price')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check ownership or admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel booking
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('trip');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check ownership
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Can only cancel pending or confirmed
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({ message: 'Cannot cancel this booking' });
    }

    // Check if within 24 hours of trip
    const now = new Date();
    const tripDate = new Date(booking.trip.date);
    const hoursUntilTrip = (tripDate - now) / (1000 * 60 * 60);

    if (hoursUntilTrip < 24) {
      return res.status(400).json({ message: 'Cannot cancel within 24 hours of trip' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Increment available seats back
    const trip = await Trip.findById(booking.trip._id);
    trip.availableSeats += booking.seats;
    trip.bookings = trip.bookings.filter(b => b.toString() !== booking._id.toString());
    await trip.save();

    // Remove from user's tripsTaken
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { tripsTaken: booking._id }
    });

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update booking status (admin only)
router.put('/:id/status', auth, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('trip user', 'departure arrival name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all bookings (admin only)
router.get('/admin/all', auth, admin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, trip } = req.query;

    let query = {};
    if (status) query.status = status;
    if (trip) query.trip = trip;

    const skip = (page - 1) * limit;
    const bookings = await Booking.find(query)
      .populate('trip', 'departure arrival date')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;