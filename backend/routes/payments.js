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

    // If Stripe is misconfigured (invalid API key), provide a demo fallback so bookings can be completed locally
    const isStripeAuthError = error && (error.type === 'StripeAuthenticationError' || error?.raw?.statusCode === 401);

    if (isStripeAuthError && typeof booking !== 'undefined') {
      try {
        const fallbackPayment = new Payment({
          booking: booking._id,
          user: req.user._id,
          payerInfo: payerData,
          paymentMethod: 'card',
          amount: booking.totalPrice,
          status: 'completed',
          paidAt: new Date(),
          transactionId: `demo-${Date.now()}`
        });
        await fallbackPayment.save();

        booking.status = 'confirmed';
        booking.paymentId = fallbackPayment.transactionId;
        booking.payment = fallbackPayment._id;
        await booking.save();

        return res.json({
          message: 'Paiement simulé (demo) enregistré — Stripe non configuré',
          paymentId: fallbackPayment._id,
          demo: true
        });
      } catch (fallbackErr) {
        console.error('Fallback payment error:', fallbackErr);
        return res.status(500).json({ message: 'Erreur lors de la création de la session de paiement (fallback failed)' });
      }
    }

    return res.status(500).json({ message: 'Erreur lors de la création de la session de paiement' });
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

// Process card payment directly (simulate payment processing)
router.post('/process-booking', auth, async (req, res) => {
  try {
    const { bookingId, paymentMethod, payerInfo, card } = req.body;

    // Basic validation
    if (!bookingId) {
      return res.status(400).json({ message: 'bookingId is required' });
    }

    if (!payerInfo || !payerInfo.firstName || !payerInfo.lastName || !payerInfo.email) {
      return res.status(400).json({ message: 'Payer information is incomplete' });
    }

    if (!card || !card.lastFour) {
      return res.status(400).json({ message: 'Card information is missing or incomplete' });
    }

    const booking = await Booking.findById(bookingId)
      .populate('trip', 'departure arrival date time vehicle price')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Support either populated user subdocument or plain ObjectId
    const bookingUserId = booking.user && (booking.user._id ? booking.user._id.toString() : booking.user.toString());
    if (bookingUserId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Generate receipt number
    const receiptNumber = `RCP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create payment record
    const payment = new Payment({
      booking: booking._id,
      user: req.user._id,
      payerInfo: {
        firstName: payerInfo.firstName,
        lastName: payerInfo.lastName,
        email: payerInfo.email,
        phone: payerInfo.phone || ''
      },
      paymentMethod: 'card',
      amount: booking.totalPrice,
      status: 'completed',
      paidAt: new Date(),
      transactionId: receiptNumber,
      paymentDetails: {
        cardLast4: card.lastFour,
        cardHolder: card.holderName || '',
        receiptNumber: receiptNumber
      },
      receiptNumber: receiptNumber
    });

    await payment.save();

    // Update booking
    booking.status = 'confirmed';
    booking.paymentId = receiptNumber;
    booking.payment = payment._id;
    await booking.save();

    res.json({
      message: 'Payment processed successfully',
      paymentId: payment._id,
      receiptNumber: receiptNumber,
      booking: {
        id: booking._id,
        totalPrice: booking.totalPrice,
        status: booking.status
      }
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    // Return actual error message to help debugging locally
    const message = error?.message || 'Error processing payment';
    res.status(500).json({ message });
  }
});

// Get receipt
router.get('/receipt/:paymentId', auth, async (req, res) => {
  try {
    const Trip = require('../models/Trip');
    
    const payment = await Payment.findById(req.params.paymentId)
      .populate('booking')
      .populate('user');

    if (!payment) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    if (payment.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get booking and trip details
    const booking = payment.booking;
    const trip = await Trip.findById(booking.trip).lean();

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Calculate fees (5%)
    const subtotal = trip.price * booking.seats;
    const serviceCharge = Math.round((subtotal * 0.05) * 100) / 100;
    const total = payment.amount;

    res.json({
      receiptNumber: payment.receiptNumber || payment.transactionId,
      paymentDate: payment.paidAt,
      booking: {
        id: booking._id,
        seats: booking.seats
      },
      payerInfo: payment.payerInfo,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      tripDetails: {
        departure: trip.departure,
        arrival: trip.arrival,
        date: trip.date,
        time: trip.time,
        price: trip.price,
        vehicle: trip.vehicle || 'Non spécifié'
      },
      billing: {
        subtotal: subtotal,
        serviceCharge: serviceCharge,
        total: total
      }
    });
  } catch (error) {
    console.error('Receipt retrieval error:', error);
    res.status(500).json({ message: 'Error retrieving receipt' });
  }
});

// Download receipt as PDF (simplified version)
router.get('/receipt/:paymentId/pdf', auth, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId)
      .populate('booking')
      .populate('user');

    if (!payment) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    if (payment.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // For now, return a simple text file that can be converted to PDF
    // In production, use a library like puppeteer or pdfkit
    const receiptText = `
EYM COVOITURAGE - REÇU DE PAIEMENT
=====================================
Numéro: ${payment.receiptNumber || payment.transactionId}
Date: ${new Date(payment.paidAt).toLocaleDateString('fr-FR')}

INFORMATIONS DU PAYEUR
Nom: ${payment.payerInfo.firstName} ${payment.payerInfo.lastName}
Email: ${payment.payerInfo.email}
Téléphone: ${payment.payerInfo.phone}

DÉTAILS DE LA RÉSERVATION
Statut: CONFIRMÉ
Montant: ${payment.amount} MAD
Méthode: ${payment.paymentMethod.toUpperCase()}

Merci pour votre paiement!
    `;

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="receipt-${payment.receiptNumber}.txt"`);
    res.send(receiptText);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: 'Error generating PDF' });
  }
});

module.exports = router;