const express = require('express');
const Reservation = require('../models/Reservation');
const Hotel = require('../models/Hotel');
const { auth, admin } = require('../middleware/auth');

const router = express.Router();

// Get user's reservations
router.get('/', auth, async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate('hotel', 'name location images price')
      .sort({ createdAt: -1 });

    res.json({ reservations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create reservation
router.post('/', auth, async (req, res) => {
  try {
    const { hotelId, checkIn, checkOut, guests } = req.body;

    // Validate input
    if (!hotelId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ message: 'Check-out must be after check-in' });
    }

    if (checkInDate < new Date()) {
      return res.status(400).json({ message: 'Check-in date cannot be in the past' });
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // Check if user already has a reservation for these dates at this hotel
    const existingReservation = await Reservation.findOne({
      user: req.user._id,
      hotel: hotelId,
      $or: [
        { checkIn: { $lt: checkOutDate, $gte: checkInDate } },
        { checkOut: { $gt: checkInDate, $lte: checkOutDate } }
      ],
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingReservation) {
      return res.status(400).json({ message: 'You already have a reservation for these dates' });
    }

    // Calculate nights and total price
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = hotel.price * guests * nights;

    // Create reservation
    const reservation = new Reservation({
      user: req.user._id,
      hotel: hotelId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice,
      nights
    });

    await reservation.save();

    // Populate hotel info
    await reservation.populate('hotel', 'name location images price');

    res.status(201).json({ 
      reservation,
      message: 'Reservation created successfully. Proceed to payment.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get reservation by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('hotel', 'name location images price')
      .populate('user', 'name email phone');

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check ownership or admin
    if (reservation.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ reservation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel reservation
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check ownership
    if (reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Can only cancel pending or confirmed reservations
    if (!['pending', 'confirmed'].includes(reservation.status)) {
      return res.status(400).json({ message: 'Cannot cancel this reservation' });
    }

    // Check if cancellation is within 24 hours
    const now = new Date();
    const checkIn = new Date(reservation.checkIn);
    const hoursUntilCheckIn = (checkIn - now) / (1000 * 60 * 60);

    if (hoursUntilCheckIn < 24) {
      return res.status(400).json({ message: 'Cannot cancel within 24 hours of check-in' });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    // TODO: Refund payment if applicable

    res.json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update reservation status (admin only)
router.put('/:id/status', auth, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    ).populate('hotel user', 'name email');

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.json({ reservation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all reservations (admin only)
router.get('/admin/all', auth, admin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, hotel } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (hotel) query.hotel = hotel;

    const skip = (page - 1) * limit;
    const reservations = await Reservation.find(query)
      .populate('hotel', 'name location')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Reservation.countDocuments(query);

    res.json({
      reservations,
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