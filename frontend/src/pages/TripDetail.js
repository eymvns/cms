import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './HotelDetail.css';

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    seats: 1
  });
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/trips/${id}`);
      setTrip(response.data.trip);
    } catch (error) {
      console.error('Error fetching trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    try {
      const response = await api.post('/bookings', {
        tripId: id,
        ...bookingData
      });

      // Redirect to payment
      navigate(`/payment/${response.data.booking._id}`);
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de la réservation');
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (!trip) {
    return (
      <div className="error-page">
        <h2>Trajet introuvable</h2>
        <button onClick={() => navigate('/')}>Retour à l'accueil</button>
      </div>
    );
  }

  return (
    <div className="hotel-detail">
      <header className="details-header" style={{ backgroundImage: `url('https://via.placeholder.com/1200x800?text=Trajet')` }}>
        <div className="hero-overlay"></div>
      </header>

      <div className="details-container">
        <div className="hotel-meta">
          <div className="hotel-title">
            <h1>{trip.departure} → {trip.arrival}</h1>
            <p className="location">
              <i className="fa-solid fa-calendar"></i> {new Date(trip.date).toLocaleDateString('fr-FR')} à {trip.time}
            </p>
          </div>
          <div className="hotel-price">
            <div className="price">{trip.price} MAD</div>
            <span>par place</span>
          </div>
        </div>

        <hr />

        <h3>Conducteur</h3>
        <p><i className="fa-solid fa-user"></i> {trip.driver?.name || 'Non spécifié'}</p>
        {trip.driver?.rating && <p><i className="fa-solid fa-star"></i> Note: {trip.driver.rating}/5</p>}

        <h3>Détails du trajet</h3>
        <p><i className="fa-solid fa-car"></i> Véhicule: {trip.vehicle || 'Non spécifié'}</p>
        <p><i className="fa-solid fa-users"></i> Places disponibles: {trip.availableSeats}/{trip.seats}</p>
        {trip.restrictions && <p><i className="fa-solid fa-info-circle"></i> Restrictions: {trip.restrictions}</p>}

        <h3>Description</h3>
        <p className="description">{trip.description || 'Aucune description.'}</p>

        <div className="action-area">
          <div style={{ fontSize: '0.9rem', color: '#666' }}>
            <i className="fa-solid fa-shield-halved"></i> Annulation gratuite jusqu'à 24h
          </div>
          <button
            className="btn-reserve-big"
            onClick={() => setShowBookingModal(true)}
            disabled={trip.availableSeats === 0}
          >
            {trip.availableSeats === 0 ? 'Complet' : 'Réserver une place'} <i className="fa-solid fa-arrow-right" style={{ marginLeft: '10px' }}></i>
          </button>
        </div>
      </div>

      {showBookingModal && (
        <div className="modal" onClick={() => setShowBookingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setShowBookingModal(false)}>&times;</span>
            <h2>Réserver une place</h2>
            <form onSubmit={handleBooking}>
              <div className="form-group">
                <label>Nombre de places</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={trip.availableSeats}
                  value={bookingData.seats}
                  onChange={(e) => setBookingData({ ...bookingData, seats: parseInt(e.target.value) })}
                />
              </div>
              <div className="price-summary">
                <p>Prix total: {trip.price * bookingData.seats} MAD</p>
              </div>
              <button type="submit" className="btn-reserve-submit">
                Continuer vers le paiement
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripDetail;