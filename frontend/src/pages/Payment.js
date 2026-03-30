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
  const [showCardForm, setShowCardForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [payerInfo, setPayerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const [cardData, setCardData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
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
    
    if (user) {
      const nameParts = user.name?.split(' ') || [];
      setPayerInfo({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || ''
      });
      setCardData(prev => ({
        ...prev,
        cardName: user.name || ''
      }));
    }
  }, [bookingId, isAuthenticated, navigate, fetchBooking, user]);

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    } else if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2);
      }
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const validateCardForm = () => {
    if (!payerInfo.firstName || !payerInfo.lastName || !payerInfo.email || !payerInfo.phone) {
      setError('Veuillez remplir tous les champs du payeur');
      return false;
    }

    if (!cardData.cardName || !cardData.cardNumber || !cardData.expiryDate || !cardData.cvv) {
      setError('Veuillez remplir tous les champs de la carte');
      return false;
    }

    const cardNum = cardData.cardNumber.replace(/\s/g, '');
    if (cardNum.length !== 16) {
      setError('Le numéro de carte doit contenir 16 chiffres');
      return false;
    }

    const [month, year] = cardData.expiryDate.split('/');
    if (!month || !year || month < 1 || month > 12) {
      setError('Date d\'expiration invalide (MM/YY)');
      return false;
    }

    if (cardData.cvv.length < 3) {
      setError('CVV invalide');
      return false;
    }

    return true;
  };

  const handlePaymentCard = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateCardForm()) {
      return;
    }

    setProcessing(true);
    try {
      const cardNum = cardData.cardNumber.replace(/\s/g, '');
      
      const response = await api.post('/payments/process-booking', {
        bookingId,
        paymentMethod: 'card',
        payerInfo: {
          firstName: payerInfo.firstName,
          lastName: payerInfo.lastName,
          email: payerInfo.email,
          phone: payerInfo.phone
        },
        card: {
          lastFour: cardNum.slice(-4),
          holderName: cardData.cardName
        }
      });

      setSuccess('✅ Paiement traité avec succès!');
      setTimeout(() => {
        if (response.data.paymentId) {
          navigate(`/receipt/${response.data.paymentId}`);
        } else {
          navigate('/profile');
        }
      }, 1500);
    } catch (error) {
      console.error('Payment error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Erreur lors du paiement';
      setError(`❌ ${errorMsg}`);
      setProcessing(false);
    }
  };

  const handlePaymentOther = async () => {
    if (!payerInfo.firstName || !payerInfo.lastName || !payerInfo.email) {
      alert('Veuillez remplir tous les champs obligatoires');
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
        window.location.href = response.data.url;
      } else if (response.data.message) {
        alert(response.data.message);
        navigate('/profile');
      }
    } catch (error) {
      console.error('Payment error:', error);
      const msg = error.response?.data?.message || error.message || 'Erreur lors du paiement. Veuillez réessayer.';
      alert(msg);
    } finally {
      setProcessing(false);
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
              <span>{booking.trip.arrival}</span>
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
              onClick={() => {
                setPaymentMethod('card');
                setShowCardForm(true);
              }}
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
              onClick={() => {
                setPaymentMethod('paypal');
                setShowCardForm(false);
              }}
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
              onClick={() => {
                setPaymentMethod('bank');
                setShowCardForm(false);
              }}
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
              onClick={() => {
                setPaymentMethod('cash');
                setShowCardForm(false);
              }}
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

        {/* Formulaire de carte bancaire */}
        {showCardForm && paymentMethod === 'card' && (
          <div className="card-form-section">
            <h3>Informations de la carte bancaire</h3>
            <form onSubmit={handlePaymentCard} className="card-form">
              {error && <div className="alert alert-error">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <div className="form-group full-width">
                <label>Nom sur la carte *</label>
                <input
                  type="text"
                  name="cardName"
                  value={cardData.cardName}
                  onChange={handleCardInputChange}
                  placeholder="Nom du titulaire"
                  className="input-field"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Numéro de carte *</label>
                <div className="card-input-wrapper">
                  <input
                    type="text"
                    name="cardNumber"
                    value={cardData.cardNumber}
                    onChange={handleCardInputChange}
                    placeholder="XXXX XXXX XXXX XXXX"
                    maxLength="19"
                    className="input-field"
                    required
                  />
                  <div className="card-type-icons">
                    {cardData.cardNumber.startsWith('4') && <i className="fab fa-cc-visa"></i>}
                    {(cardData.cardNumber.startsWith('5') || cardData.cardNumber.startsWith('2')) && <i className="fab fa-cc-mastercard"></i>}
                    {cardData.cardNumber.startsWith('3') && <i className="fab fa-cc-amex"></i>}
                  </div>
                </div>
                <small>Format: 16 chiffres</small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Expiration (MM/YY) *</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={cardData.expiryDate}
                    onChange={handleCardInputChange}
                    placeholder="MM/YY"
                    maxLength="5"
                    className="input-field"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>CVV *</label>
                  <input
                    type="text"
                    name="cvv"
                    value={cardData.cvv}
                    onChange={handleCardInputChange}
                    placeholder="XXX"
                    maxLength="4"
                    className="input-field"
                    required
                  />
                  <small>Code de sécurité au dos</small>
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="btn-primary full-width"
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
            </form>
          </div>
        )}

        {!showCardForm && (
          <div className="payment-actions">
            <button
              onClick={() => navigate(-1)}
              className="btn-secondary"
              disabled={processing}
            >
              Retour
            </button>
            <button
              onClick={handlePaymentOther}
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
        )}

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