const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Reservation = require('../models/Reservation');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create payment session for reservation
router.post('/create-session', auth, async (req, res) => {
  try {
    const { reservationId } = req.body;

    const reservation = await Reservation.findById(reservationId)
      .populate('hotel', 'name location')
      .populate('user', 'name email');

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check ownership
    if (reservation.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (reservation.status !== 'pending') {
      return res.status(400).json({ message: 'Reservation is not payable' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'mad',
            product_data: {
              name: `Réservation - ${reservation.hotel.name}`,
              description: `${reservation.guests} personne(s) - ${reservation.nights} nuit(s) - ${reservation.checkIn.toLocaleDateString()} au ${reservation.checkOut.toLocaleDateString()}`,
            },
            unit_amount: Math.round(reservation.totalPrice * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
      customer_email: reservation.user.email,
      metadata: {
        reservationId: reservation._id.toString(),
        userId: req.user._id.toString()
      }
    });

    res.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ message: 'Payment session creation failed' });
  }
});

// Webhook to handle payment confirmation (would be implemented with Stripe webhooks)
// For now, simulate with a success endpoint
router.post('/confirm-payment', auth, async (req, res) => {
  try {
    const { reservationId, sessionId } = req.body;

    // In production, verify with Stripe webhook
    // For demo, assume payment successful

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update reservation
    reservation.status = 'confirmed';
    reservation.paymentId = sessionId;
    await reservation.save();

    res.json({ 
      message: 'Payment confirmed',
      reservation 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get payment status
router.get('/session/:sessionId', auth, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    
    res.json({
      status: session.payment_status,
      reservationId: session.metadata.reservationId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;