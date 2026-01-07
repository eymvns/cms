const express = require('express');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Add review
router.post('/', auth, async (req, res) => {
  try {
    const { to, trip, rating, comment } = req.body;

    if (!to || !trip || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'All fields required and rating 1-5' });
    }

    // Check if user has completed booking for this trip
    const booking = await Booking.findOne({
      user: req.user._id,
      trip: trip,
      status: 'completed'
    });

    if (!booking) {
      return res.status(403).json({ message: 'You must have completed this trip to leave a review' });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({
      from: req.user._id,
      to: to,
      trip: trip
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this user for this trip' });
    }

    const review = new Review({
      from: req.user._id,
      to: to,
      trip: trip,
      rating: parseInt(rating),
      comment: comment || ''
    });

    await review.save();

    // Update user's rating
    const userReviews = await Review.find({ to: to });
    const totalRating = userReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / userReviews.length;

    await User.findByIdAndUpdate(to, {
      rating: Math.round(averageRating * 10) / 10 // round to 1 decimal
    });

    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get reviews for user
router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ to: req.params.userId })
      .populate('from', 'name')
      .populate('trip', 'departure arrival date')
      .sort({ createdAt: -1 });

    const user = await User.findById(req.params.userId).select('name rating');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      reviews,
      userRating: user.rating,
      totalReviews: reviews.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get reviews for trip
router.get('/trip/:tripId', async (req, res) => {
  try {
    const reviews = await Review.find({ trip: req.params.tripId })
      .populate('from to', 'name')
      .sort({ createdAt: -1 });

    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;