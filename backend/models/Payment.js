const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Informations du payeur
  payerInfo: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    }
  },
  // Informations de paiement
  paymentMethod: {
    type: String,
    enum: ['card', 'paypal', 'bank', 'cash'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'MAD'
  },
  // Informations de transaction
  transactionId: {
    type: String,
    default: null
  },
  sessionId: {
    type: String,
    default: null
  },
  // Statut du paiement
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  // Date de paiement
  paidAt: {
    type: Date,
    default: null
  },
  // Informations supplémentaires selon la méthode
  paymentDetails: {
    // Pour carte bancaire (Stripe)
    cardLast4: String,
    cardBrand: String,
    // Pour virement bancaire
    bankName: String,
    accountNumber: String,
    reference: String,
    // Pour PayPal
    paypalTransactionId: String,
    // Pour espèces
    cashReceived: Boolean
  },
  // Métadonnées
  metadata: {
    type: Map,
    of: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour recherche rapide
paymentSchema.index({ booking: 1 });
paymentSchema.index({ user: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ status: 1 });

// Middleware pour mettre à jour updatedAt
paymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);

