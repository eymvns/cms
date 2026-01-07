const express = require('express');
const Trip = require('../models/Trip');
const { auth, admin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all trips with filters
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      departure,
      arrival,
      date,
      minPrice,
      maxPrice,
      page = 1,
      limit = 12
    } = req.query;

    let query = {};

    // Text search
    if (departure) {
      query.departure = { $regex: departure, $options: 'i' };
    }
    if (arrival) {
      query.arrival = { $regex: arrival, $options: 'i' };
    }

    // Date filter
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      query.date = { $gte: start, $lt: end };
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    // Only show trips with available seats
    query.availableSeats = { $gt: 0 };

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { date: 1, price: 1 }
    };

    // Simple pagination
    const skip = (options.page - 1) * options.limit;
    const trips = await Trip.find(query)
      .sort(options.sort)
      .skip(skip)
      .limit(options.limit)
      .populate('driver', 'name rating');

    const total = await Trip.countDocuments(query);

    res.json({
      trips,
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        pages: Math.ceil(total / options.limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get trip by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('driver', 'name rating phone')
      .populate('bookings', 'user seats status');

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json({ trip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create trip (authenticated users)
router.post('/', auth, async (req, res) => {
  try {
    const tripData = {
      ...req.body,
      driver: req.user._id,
      availableSeats: req.body.seats // initially all available
    };

    const trip = new Trip(tripData);
    await trip.save();

    // Add to user's tripsDriven
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user._id, {
      $push: { tripsDriven: trip._id }
    });

    res.status(201).json({ trip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update trip (driver only)
router.put('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the driver can update the trip' });
    }

    const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ trip: updatedTrip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete trip (driver only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the driver can delete the trip' });
    }

    await Trip.findByIdAndDelete(req.params.id);

    // Remove from user's tripsDriven
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { tripsDriven: req.params.id }
    });

    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin routes
// Update trip (admin)
router.put('/:id/admin', auth, admin, async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json({ trip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete trip (admin)
router.delete('/:id/admin', auth, admin, async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;