import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Payment.css';

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [payerInfo, setPayerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const fetchBooking = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/bookings/${bookingId}`);
      setBooking(response.data.booking);
    } catch (error) {
      console.error('Error fetching booking:', error);
      navigate('/search');
    } finally {
      setLoading(false);
    }
  }, [bookingId, navigate]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    fetchBooking();
    
    // Pré-remplir les informations du payeur avec les données de l'utilisateur
    if (user) {
      const nameParts = user.name?.split(' ') || [];
      setPayerInfo({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [bookingId, isAuthenticated, navigate, fetchBooking, user]);

  const handlePayment = async () => {
    // Valider les informations du payeur
    if (!payerInfo.firstName || !payerInfo.lastName || !payerInfo.email) {
      alert('Veuillez remplir tous les champs obligatoires (Prénom, Nom, Email)');
      return;
    }

    setProcessing(true);
    try {
      const response = await api.post('/payments/create-booking-session', {
        bookingId,
        paymentMethod,
        payerInfo
      });

      if (response.data.url) {
        // Redirect to payment provider (Stripe)
        window.location.href = response.data.url;
      } else if (response.data.message) {
        // Payment confirmed directly (PayPal, bank transfer, cash)
        alert(response.data.message);
        navigate('/profile');
      } else {
        // Fallback - should not happen
        alert('Paiement traité avec succès!');
        navigate('/profile');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Erreur lors du paiement. Veuillez réessayer.');
    } finally {
      setProcessing(false);
    }
  };

  const confirmPayment = async () => {
    try {
      await api.post('/payments/confirm-booking-payment', {
        bookingId,
        paymentMethod
      });

      let successMessage = 'Paiement confirmé avec succès!';
      if (paymentMethod === 'cash') {
        successMessage = 'Réservation confirmée! Vous paierez en espèces à bord du véhicule.';
      } else if (paymentMethod === 'bank') {
        successMessage = 'Demande de virement bancaire enregistrée. Vous recevrez les instructions par email.';
      }

      alert(successMessage);
      navigate('/profile');
    } catch (error) {
      console.error('Confirmation error:', error);
      alert('Erreur lors de la confirmation du paiement.');
    }
  };

  if (loading) {
    return (
      <div className="payment-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement de votre réservation...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="payment-page">
        <div className="error-container">
          <h2>Réservation introuvable</h2>
          <button onClick={() => navigate('/search')} className="btn-primary">
            Retour à la recherche
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h1>Paiement sécurisé</h1>
          <p>Finalisez votre réservation de covoiturage</p>
        </div>

        <div className="booking-summary">
          <h3>Récapitulatif de la réservation</h3>
          <div className="summary-details">
            <div className="summary-item">
              <span>Départ:</span>
              <span>{booking.trip.departure}</span>
            </div>
            <div className="summary-item">
              <span>Destination:</span>
              <span>{booking.trip.destination}</span>
            </div>
            <div className="summary-item">
              <span>Date:</span>
              <span>{new Date(booking.trip.date).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="summary-item">
              <span>Heure:</span>
              <span>{booking.trip.time}</span>
            </div>
            <div className="summary-item">
              <span>Places réservées:</span>
              <span>{booking.seats}</span>
            </div>
            <div className="summary-item">
              <span>Conducteur:</span>
              <span>{booking.trip?.driver?.name || 'Non spécifié'}</span>
            </div>
            <div className="summary-item total">
              <span>Total à payer:</span>
              <span>{booking.totalPrice} MAD</span>
            </div>
          </div>
        </div>

        <div className="payer-info-section">
          <h3>Informations du payeur</h3>
          <div className="payer-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Prénom *</label>
                <input
                  type="text"
                  id="firstName"
                  value={payerInfo.firstName}
                  onChange={(e) => setPayerInfo({ ...payerInfo, firstName: e.target.value })}
                  required
                  className="input-field"
                  placeholder="Votre prénom"
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Nom *</label>
                <input
                  type="text"
                  id="lastName"
                  value={payerInfo.lastName}
                  onChange={(e) => setPayerInfo({ ...payerInfo, lastName: e.target.value })}
                  required
                  className="input-field"
                  placeholder="Votre nom"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  value={payerInfo.email}
                  onChange={(e) => setPayerInfo({ ...payerInfo, email: e.target.value })}
                  required
                  className="input-field"
                  placeholder="votre@email.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Téléphone</label>
                <input
                  type="tel"
                  id="phone"
                  value={payerInfo.phone}
                  onChange={(e) => setPayerInfo({ ...payerInfo, phone: e.target.value })}
                  className="input-field"
                  placeholder="+212 6XX XXX XXX"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="payment-methods">
          <h3>Choisissez votre mode de paiement</h3>

          <div className="payment-options">
            <div
              className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              <div className="payment-icon">
                <i className="fas fa-credit-card"></i>
              </div>
              <div className="payment-info">
                <h4>Carte bancaire</h4>
                <p>Visa, Mastercard, American Express</p>
              </div>
              <div className="payment-check">
                <i className="fas fa-check"></i>
              </div>
            </div>

            <div
              className={`payment-option ${paymentMethod === 'paypal' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('paypal')}
            >
              <div className="payment-icon paypal">
                <i className="fab fa-paypal"></i>
              </div>
              <div className="payment-info">
                <h4>PayPal</h4>
                <p>Paiement rapide et sécurisé</p>
              </div>
              <div className="payment-check">
                <i className="fas fa-check"></i>
              </div>
            </div>

            <div
              className={`payment-option ${paymentMethod === 'bank' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('bank')}
            >
              <div className="payment-icon">
                <i className="fas fa-university"></i>
              </div>
              <div className="payment-info">
                <h4>Virement bancaire</h4>
                <p>Transfert direct depuis votre banque</p>
              </div>
              <div className="payment-check">
                <i className="fas fa-check"></i>
              </div>
            </div>

            <div
              className={`payment-option ${paymentMethod === 'cash' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('cash')}
            >
              <div className="payment-icon">
                <i className="fas fa-money-bill-wave"></i>
              </div>
              <div className="payment-info">
                <h4>Espèces</h4>
                <p>Paiement à bord du véhicule</p>
              </div>
              <div className="payment-check">
                <i className="fas fa-check"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="payment-actions">
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary"
            disabled={processing}
          >
            Retour
          </button>
          <button
            onClick={handlePayment}
            className="btn-primary"
            disabled={processing}
          >
            {processing ? (
              <>
                <div className="spinner"></div>
                Traitement...
              </>
            ) : (
              `Payer ${booking.totalPrice} MAD`
            )}
          </button>
        </div>

        <div className="payment-security">
          <div className="security-badges">
            <i className="fas fa-shield-alt"></i>
            <span>Paiement 100% sécurisé</span>
          </div>
          <div className="security-badges">
            <i className="fas fa-lock"></i>
            <span>Données chiffrées SSL</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;