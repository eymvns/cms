import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reservations');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchReservations();
  }, [user, navigate]);

  const fetchReservations = async () => {
    try {
      const response = await api.get('/reservations');
      setReservations(response.data.reservations || []);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      return;
    }

    try {
      await api.put(`/reservations/${id}/cancel`);
      fetchReservations();
      alert('Réservation annulée avec succès');
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de l\'annulation');
    }
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>Mon Profil</h1>
          <div className="user-info">
            <div className="avatar">
              <i className="fa-solid fa-user"></i>
            </div>
            <div>
              <h2>{user.name}</h2>
              <p>{user.email}</p>
              <p>{user.phone}</p>
            </div>
          </div>
        </div>

        <div className="tabs">
          <button
            className={activeTab === 'reservations' ? 'active' : ''}
            onClick={() => setActiveTab('reservations')}
          >
            Mes Réservations
          </button>
          <button
            className={activeTab === 'settings' ? 'active' : ''}
            onClick={() => setActiveTab('settings')}
          >
            Paramètres
          </button>
        </div>

        {activeTab === 'reservations' && (
          <div className="reservations-section">
            {loading ? (
              <div className="loading">Chargement...</div>
            ) : reservations.length === 0 ? (
              <div className="no-reservations">
                <p>Aucune réservation pour le moment</p>
                <button onClick={() => navigate('/')}>Explorer les hôtels</button>
              </div>
            ) : (
              <div className="reservations-list">
                {reservations.map((reservation) => (
                  <div key={reservation._id} className="reservation-card">
                    <div className="reservation-info">
                      <h3>{reservation.hotel?.name}</h3>
                      <p><i className="fa-solid fa-location-dot"></i> {reservation.hotel?.location}</p>
                      <p>
                        <i className="fa-regular fa-calendar"></i>{' '}
                        {new Date(reservation.checkIn).toLocaleDateString('fr-FR')} -{' '}
                        {new Date(reservation.checkOut).toLocaleDateString('fr-FR')}
                      </p>
                      <p><i className="fa-solid fa-users"></i> {reservation.guests} personne(s)</p>
                      <p className="price">{reservation.totalPrice} MAD</p>
                    </div>
                    <div className="reservation-actions">
                      <span className={`status status-${reservation.status}`}>
                        {reservation.status === 'pending' && 'En attente'}
                        {reservation.status === 'confirmed' && 'Confirmée'}
                        {reservation.status === 'cancelled' && 'Annulée'}
                        {reservation.status === 'completed' && 'Terminée'}
                      </span>
                      {['pending', 'confirmed'].includes(reservation.status) && (
                        <button
                          className="btn-cancel"
                          onClick={() => cancelReservation(reservation._id)}
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-section">
            <h3>Informations personnelles</h3>
            <div className="info-item">
              <label>Nom</label>
              <p>{user.name}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{user.email}</p>
            </div>
            <div className="info-item">
              <label>Téléphone</label>
              <p>{user.phone}</p>
            </div>
            <div className="info-item">
              <label>Statut de vérification</label>
              <p>
                {user.verified ? (
                  <span className="verified"><i className="fa-solid fa-check-circle"></i> Vérifié</span>
                ) : (
                  <span className="not-verified">Non vérifié</span>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

