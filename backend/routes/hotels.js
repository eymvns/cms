const express = require('express');
const Hotel = require('../models/Hotel');
const { auth, admin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all hotels with filters
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      location, 
      category, 
      checkIn, 
      checkOut, 
      guests = 1,
      minPrice,
      maxPrice,
      search,
      page = 1,
      limit = 12
    } = req.query;

    let query = {};

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    // Availability filter (if dates provided)
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      
      // Find hotels with availability for the date range
      // This is simplified; in production, check availability array
      query.$or = [
        { availability: { $exists: false } }, // No availability tracking
        { availability: { $size: 0 } }
      ];
      // For full implementation, complex aggregation pipeline needed
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { averageRating: -1, price: 1 }
    };

    // Simple pagination without mongoose-paginate-v2
    const skip = (options.page - 1) * options.limit;
    const hotels = await Hotel.find(query)
      .sort(options.sort)
      .skip(skip)
      .limit(options.limit)
      .populate('ratings.user', 'name');

    const total = await Hotel.countDocuments(query);

    res.json({
      hotels,
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

// Get hotel by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('ratings.user', 'name');
    
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.json({ hotel });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check availability for specific dates
router.get('/:id/availability', async (req, res) => {
  try {
    const { checkIn, checkOut, guests = 1 } = req.query;
    
    if (!checkIn || !checkOut) {
      return res.status(400).json({ message: 'Check-in and check-out dates required' });
    }

    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // Simplified availability check
    // In production, check availability array for date range
    const available = hotel.availability.length === 0 || 
      hotel.availability.some(a => {
        const date = new Date(a.date);
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        return date >= checkInDate && date < checkOutDate && a.rooms > a.booked;
      });

    res.json({ 
      available,
      hotelId: hotel._id,
      checkIn,
      checkOut,
      guests: parseInt(guests)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add review (only for users who have reserved)
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const { rating, review } = req.body;
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // Check if user has a completed reservation
    const Reservation = require('../models/Reservation');
    const hasReservation = await Reservation.findOne({
      user: req.user._id,
      hotel: req.params.id,
      status: 'completed'
    });

    if (!hasReservation) {
      return res.status(403).json({ message: 'You must have stayed at this hotel to leave a review' });
    }

    // Check if user already reviewed
    const existingReview = hotel.ratings.find(r => r.user.toString() === req.user._id.toString());
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this hotel' });
    }

    hotel.ratings.push({
      user: req.user._id,
      rating: parseInt(rating),
      review: review || ''
    });

    await hotel.save();

    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get reviews for hotel
router.get('/:id/reviews', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('ratings.user', 'name')
      .select('ratings averageRating');
    
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.json({ 
      reviews: hotel.ratings,
      averageRating: hotel.averageRating 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin routes
// Create hotel (admin only)
router.post('/', auth, admin, async (req, res) => {
  try {
    const hotel = new Hotel(req.body);
    await hotel.save();
    res.status(201).json({ hotel });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update hotel (admin only)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.json({ hotel });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete hotel (admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;