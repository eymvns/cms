import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './PaymentForm.css';

const PaymentForm = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [payerInfo, setPayerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    fetchBooking();
  }, [bookingId, isAuthenticated, navigate]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/bookings/${bookingId}`);
      const bookingData = response.data.booking;
      setBooking(bookingData);

      // Pré-remplir les informations
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
    } catch (error) {
      console.error('Error fetching booking:', error);
      setError('Erreur lors du chargement de la réservation');
    } finally {
      setLoading(false);
    }
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      // Format: XXXX XXXX XXXX XXXX
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    } else if (name === 'expiryDate') {
      // Format: MM/YY
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2);
      }
    } else if (name === 'cvv') {
      // Only numbers, max 4
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handlePayerInfoChange = (e) => {
    const { name, value } = e.target;
    setPayerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!payerInfo.firstName || !payerInfo.lastName || !payerInfo.email || !payerInfo.phone) {
      setError('Veuillez remplir tous les champs du payeur');
      return false;
    }

    if (!cardData.cardName || !cardData.cardNumber || !cardData.expiryDate || !cardData.cvv) {
      setError('Veuillez remplir tous les champs de la carte');
      return false;
    }

    // Validate card number (simple check)
    const cardNum = cardData.cardNumber.replace(/\s/g, '');
    if (cardNum.length !== 16) {
      setError('Le numéro de carte doit contenir 16 chiffres');
      return false;
    }

    // Validate expiry date
    const [month, year] = cardData.expiryDate.split('/');
    if (!month || !year || month < 1 || month > 12) {
      setError('Date d\'expiration invalide (MM/YY)');
      return false;
    }

    // Validate CVV
    if (cardData.cvv.length < 3) {
      setError('CVV invalide');
      return false;
    }

    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setProcessing(true);
    try {
      const response = await api.post('/payments/process-booking', {
        bookingId,
        paymentMethod: 'card',
        payerInfo,
        card: {
          lastFour: cardData.cardNumber.slice(-4),
          holderName: cardData.cardName
        }
      });

      setSuccess('Paiement traité avec succès!');
      setTimeout(() => {
        navigate(`/receipt/${response.data.paymentId}`);
      }, 2000);
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.response?.data?.message || 'Erreur lors du paiement. Veuillez réessayer.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="payment-form loading">Chargement...</div>;
  }

  if (!booking) {
    return <div className="payment-form error">Réservation non trouvée</div>;
  }

  return (
    <div className="payment-form-container">
      <div className="payment-form">
        <h2>Paiement par Carte</h2>

        {/* Résumé de la réservation */}
        <div className="booking-summary">
          <h3>Résumé de la réservation</h3>
          <div className="summary-item">
            <span>Trajet:</span>
            <span>{booking.trip?.departure} → {booking.trip?.arrival}</span>
          </div>
          <div className="summary-item">
            <span>Date:</span>
            <span>{new Date(booking.trip?.date).toLocaleDateString('fr-FR')}</span>
          </div>
          <div className="summary-item">
            <span>Nombre de places:</span>
            <span>{booking.seats}</span>
          </div>
          <div className="summary-item total">
            <span>Total à payer:</span>
            <span>{booking.totalPrice} MAD</span>
          </div>
        </div>

        <form onSubmit={handlePayment}>
          {/* Informations du payeur */}
          <fieldset>
            <legend>Informations du payeur</legend>
            <div className="form-group">
              <label>Prénom *</label>
              <input
                type="text"
                name="firstName"
                value={payerInfo.firstName}
                onChange={handlePayerInfoChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Nom *</label>
              <input
                type="text"
                name="lastName"
                value={payerInfo.lastName}
                onChange={handlePayerInfoChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={payerInfo.email}
                onChange={handlePayerInfoChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Téléphone *</label>
              <input
                type="tel"
                name="phone"
                value={payerInfo.phone}
                onChange={handlePayerInfoChange}
                required
              />
            </div>
          </fieldset>

          {/* Informations de la carte */}
          <fieldset>
            <legend>Informations de la carte</legend>
            <div className="form-group">
              <label>Nom sur la carte *</label>
              <input
                type="text"
                name="cardName"
                value={cardData.cardName}
                onChange={handleCardInputChange}
                placeholder="Nom du titulaire"
                required
              />
            </div>
            <div className="form-group">
              <label>Numéro de carte *</label>
              <input
                type="text"
                name="cardNumber"
                value={cardData.cardNumber}
                onChange={handleCardInputChange}
                placeholder="XXXX XXXX XXXX XXXX"
                maxLength="19"
                required
              />
              <small>Format: 16 chiffres</small>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Expiration *</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={cardData.expiryDate}
                  onChange={handleCardInputChange}
                  placeholder="MM/YY"
                  maxLength="5"
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
                  required
                />
              </div>
            </div>
          </fieldset>

          {/* Messages d'erreur/succès */}
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* Bouton soumettre */}
          <button
            type="submit"
            disabled={processing}
            className="btn-payment"
          >
            {processing ? 'Traitement...' : `Payer ${booking.totalPrice} MAD`}
          </button>
        </form>

        <p className="security-info">
          🔒 Paiement sécurisé - Vos données sont chiffrées
        </p>
      </div>
    </div>
  );
};

export default PaymentForm;
