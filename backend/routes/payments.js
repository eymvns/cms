const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Reservation = require('../models/Reservation');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
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

// Create payment session for booking
router.post('/create-booking-session', auth, async (req, res) => {
  try {
    const { bookingId, paymentMethod, payerInfo } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate('trip', 'departure arrival date time driver')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check ownership
    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Booking is not payable' });
    }

    // Préparer les informations du payeur
    const payerData = {
      firstName: payerInfo?.firstName || req.user.name?.split(' ')[0] || req.user.name || 'Non spécifié',
      lastName: payerInfo?.lastName || req.user.name?.split(' ').slice(1).join(' ') || '',
      email: payerInfo?.email || req.user.email,
      phone: payerInfo?.phone || req.user.phone || ''
    };

    // Handle different payment methods
    if (paymentMethod === 'paypal') {
      // Créer l'enregistrement de paiement
      const payment = new Payment({
        booking: booking._id,
        user: req.user._id,
        payerInfo: payerData,
        paymentMethod: 'paypal',
        amount: booking.totalPrice,
        status: 'completed',
        paidAt: new Date(),
        transactionId: `paypal-${Date.now()}`,
        paymentDetails: {
          paypalTransactionId: `PP-${Date.now()}-${booking._id}`
        }
      });
      await payment.save();

      // Mettre à jour la réservation
      booking.status = 'confirmed';
      booking.paymentId = payment.transactionId;
      booking.payment = payment._id;
      await booking.save();

      return res.json({ 
        message: 'Paiement PayPal confirmé avec succès!',
        paymentId: payment._id
      });
    }

    if (paymentMethod === 'bank') {
      // Créer l'enregistrement de paiement
      const reference = `BOOKING-${booking._id}-${Date.now()}`;
      const payment = new Payment({
        booking: booking._id,
        user: req.user._id,
        payerInfo: payerData,
        paymentMethod: 'bank',
        amount: booking.totalPrice,
        status: 'pending',
        transactionId: `bank-transfer-${Date.now()}`,
        paymentDetails: {
          bankName: 'Banque Centrale Populaire',
          accountNumber: '12345678901234567890',
          reference: reference
        }
      });
      await payment.save();

      // Mettre à jour la réservation
      booking.status = 'confirmed';
      booking.paymentId = payment.transactionId;
      booking.payment = payment._id;
      await booking.save();

      return res.json({
        message: 'Demande de virement bancaire confirmée. Vous recevrez les instructions par email.',
        paymentId: payment._id,
        bankDetails: {
          bankName: payment.paymentDetails.bankName,
          accountNumber: payment.paymentDetails.accountNumber,
          reference: reference,
          amount: booking.totalPrice
        }
      });
    }

    if (paymentMethod === 'cash') {
      // Créer l'enregistrement de paiement
      const payment = new Payment({
        booking: booking._id,
        user: req.user._id,
        payerInfo: payerData,
        paymentMethod: 'cash',
        amount: booking.totalPrice,
        status: 'pending',
        transactionId: `cash-payment-${Date.now()}`,
        paymentDetails: {
          cashReceived: false
        }
      });
      await payment.save();

      // Mettre à jour la réservation
      booking.status = 'confirmed';
      booking.paymentId = payment.transactionId;
      booking.payment = payment._id;
      await booking.save();

      return res.json({ 
        message: 'Réservation confirmée - Paiement en espèces à bord du véhicule',
        paymentId: payment._id
      });
    }

    // Default to Stripe for card payments
    // Créer d'abord l'enregistrement de paiement en statut pending
    const payment = new Payment({
      booking: booking._id,
      user: req.user._id,
      payerInfo: payerData,
      paymentMethod: 'card',
      amount: booking.totalPrice,
      status: 'pending'
    });
    await payment.save();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'mad',
            product_data: {
              name: `Covoiturage - ${booking.trip.departure} → ${booking.trip.arrival}`,
              description: `${booking.seats} place(s) - ${new Date(booking.trip.date).toLocaleDateString('fr-FR')} à ${booking.trip.time}`,
            },
            unit_amount: Math.round(booking.totalPrice * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
      customer_email: booking.user.email,
      metadata: {
        bookingId: booking._id.toString(),
        userId: req.user._id.toString(),
        paymentId: payment._id.toString(),
        paymentMethod: 'card'
      }
    });

    // Mettre à jour le paiement avec le sessionId
    payment.sessionId = session.id;
    await payment.save();

    res.json({
      sessionId: session.id,
      url: session.url,
      paymentId: payment._id
    });
  } catch (error) {
    console.error('Payment session creation error:', error);
    res.status(500).json({ message: 'Erreur lors de la création de la session de paiement' });
  }
});

// Confirm booking payment (mainly for Stripe card payments)
router.post('/confirm-booking-payment', auth, async (req, res) => {
  try {
    const { bookingId, paymentMethod, sessionId } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate('payment');
    
    if (!booking) {
      return res.status(404).json({ message: 'Réservation introuvable' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    let payment = booking.payment;

    // Si pas de paiement existant, en créer un
    if (!payment) {
      const payerData = {
        firstName: req.user.name?.split(' ')[0] || req.user.name || 'Non spécifié',
        lastName: req.user.name?.split(' ').slice(1).join(' ') || '',
        email: req.user.email,
        phone: req.user.phone || ''
      };

      payment = new Payment({
        booking: booking._id,
        user: req.user._id,
        payerInfo: payerData,
        paymentMethod: paymentMethod || 'card',
        amount: booking.totalPrice,
        status: 'completed',
        paidAt: new Date(),
        sessionId: sessionId || null,
        transactionId: sessionId || `payment-${Date.now()}`
      });
    } else {
      // Mettre à jour le paiement existant
      payment.status = 'completed';
      payment.paidAt = new Date();
      if (sessionId) {
        payment.sessionId = sessionId;
        payment.transactionId = sessionId;
      }
    }

    // Si c'est un paiement Stripe, récupérer les détails de la carte
    if (sessionId && paymentMethod === 'card') {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_intent) {
          const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
          if (paymentIntent.payment_method) {
            const paymentMethodDetails = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);
            payment.paymentDetails = {
              cardLast4: paymentMethodDetails.card?.last4 || '',
              cardBrand: paymentMethodDetails.card?.brand || ''
            };
          }
        }
      } catch (stripeError) {
        console.error('Stripe details error:', stripeError);
      }
    }

    await payment.save();

    // Mettre à jour la réservation
    if (booking.status !== 'confirmed') {
      booking.status = 'confirmed';
      booking.paymentId = payment.transactionId;
      booking.payment = payment._id;
      await booking.save();
    }

    res.json({
      message: 'Paiement confirmé',
      booking,
      payment: {
        id: payment._id,
        amount: payment.amount,
        method: payment.paymentMethod,
        status: payment.status,
        paidAt: payment.paidAt,
        payerInfo: payment.payerInfo
      }
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ message: 'Erreur lors de la confirmation du paiement' });
  }
});

// Get booking payment status
router.get('/booking-session/:sessionId', auth, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);

    res.json({
      status: session.payment_status,
      bookingId: session.metadata.bookingId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;