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

    // Liste d'images par défaut pour les trajets sans image
    const defaultCarImages = [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&h=600&fit=crop',
    ];

    // S'assurer que tous les trajets ont une image
    const tripsWithImages = trips.map((trip, index) => {
      if (!trip.image || trip.image.trim() === '') {
        const imageIndex = (trip._id.toString().charCodeAt(0) + index) % defaultCarImages.length;
        trip.image = defaultCarImages[imageIndex];
      }
      return trip;
    });

    const total = await Trip.countDocuments(query);

    res.json({
      trips: tripsWithImages,
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

    // Liste d'images par défaut pour les trajets sans image
    const defaultCarImages = [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&h=600&fit=crop',
    ];

    // S'assurer que le trajet a une image
    if (!trip.image || trip.image.trim() === '') {
      const imageIndex = trip._id.toString().charCodeAt(0) % defaultCarImages.length;
      trip.image = defaultCarImages[imageIndex];
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