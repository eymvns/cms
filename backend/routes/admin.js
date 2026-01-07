const express = require('express');
const User = require('../models/User');
const Trip = require('../models/Trip');
const Booking = require('../models/Booking');
const { auth, admin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(auth, admin);

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalTrips,
      totalBookings,
      confirmedBookings,
      totalRevenue,
      newUsersThisMonth,
      newBookingsThisMonth
    ] = await Promise.all([
      User.countDocuments(),
      Trip.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.aggregate([
        { $match: { status: 'confirmed' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]),
      User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }),
      Booking.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      })
    ]);

    res.json({
      totalUsers,
      totalTrips,
      totalBookings,
      confirmedBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      newUsersThisMonth,
      newBookingsThisMonth,
      bookingRate: totalBookings > 0 ? (confirmedBookings / totalBookings * 100).toFixed(1) : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Users management
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, verified, role } = req.query;

    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (verified !== undefined) query.verified = verified === 'true';
    if (role) query.role = role;

    const skip = (page - 1) * limit;
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
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

// Update user (admin)
router.put('/users/:id', async (req, res) => {
  try {
    const updates = {};
    const allowedFields = ['name', 'email', 'phone', 'role', 'verified', 'identityVerified'];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user (admin)
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Also delete user's bookings and reviews
    await Booking.deleteMany({ user: req.params.id });
    const Review = require('../models/Review');
    await Review.deleteMany({ $or: [{ from: req.params.id }, { to: req.params.id }] });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Hotels management (already in hotels.js, but admin specific)

// Reservations management (already in reservations.js)

module.exports = router;