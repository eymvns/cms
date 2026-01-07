import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './HotelDetail.css';

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reservationData, setReservationData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1
  });
  const [showReservationModal, setShowReservationModal] = useState(false);

  useEffect(() => {
    fetchHotel();
  }, [id]);

  const fetchHotel = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/hotels/${id}`);
      setHotel(response.data.hotel);
    } catch (error) {
      console.error('Error fetching hotel:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReservation = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    try {
      const response = await api.post('/reservations', {
        hotelId: id,
        ...reservationData
      });
      
      // Redirect to payment
      navigate(`/payment/${response.data.reservation._id}`);
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de la réservation');
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (!hotel) {
    return (
      <div className="error-page">
        <h2>Hôtel introuvable</h2>
        <button onClick={() => navigate('/')}>Retour à l'accueil</button>
      </div>
    );
  }

  const image = hotel.images?.[0] || 'https://via.placeholder.com/1200x800?text=Hotel';

  return (
    <div className="hotel-detail">
      <header className="details-header" style={{ backgroundImage: `url('${image}')` }}>
        <div className="hero-overlay"></div>
      </header>

      <div className="details-container">
        <div className="hotel-meta">
          <div className="hotel-title">
            <h1>{hotel.name}</h1>
            <p className="location">
              <i className="fa-solid fa-location-dot"></i> {hotel.location}
            </p>
          </div>
          <div className="hotel-price">
            <div className="price">{hotel.price} MAD</div>
            <span>par nuit / personne</span>
          </div>
        </div>

        <hr />

        <h3>À propos de l'établissement</h3>
        <p className="description">{hotel.description || 'Description non disponible.'}</p>

        <h3>Les équipements</h3>
        <div className="features-grid">
          {hotel.features?.map((feature, index) => (
            <div key={index} className="feature-item">
              <i className="fa-solid fa-check-circle"></i> {feature}
            </div>
          ))}
        </div>

        <div className="action-area">
          <div style={{ fontSize: '0.9rem', color: '#666' }}>
            <i className="fa-solid fa-shield-halved"></i> Annulation gratuite jusqu'à 24h
          </div>
          <button 
            className="btn-reserve-big"
            onClick={() => setShowReservationModal(true)}
          >
            Réserver ce séjour <i className="fa-solid fa-arrow-right" style={{ marginLeft: '10px' }}></i>
          </button>
        </div>
      </div>

      {showReservationModal && (
        <div className="modal" onClick={() => setShowReservationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setShowReservationModal(false)}>&times;</span>
            <h2>Réserver votre séjour</h2>
            <form onSubmit={handleReservation}>
              <div className="form-group">
                <label>Date d'arrivée</label>
                <input
                  type="date"
                  required
                  value={reservationData.checkIn}
                  onChange={(e) => setReservationData({ ...reservationData, checkIn: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label>Date de départ</label>
                <input
                  type="date"
                  required
                  value={reservationData.checkOut}
                  onChange={(e) => setReservationData({ ...reservationData, checkOut: e.target.value })}
                  min={reservationData.checkIn || new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label>Nombre de personnes</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="10"
                  value={reservationData.guests}
                  onChange={(e) => setReservationData({ ...reservationData, guests: parseInt(e.target.value) })}
                />
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

export default HotelDetail;

