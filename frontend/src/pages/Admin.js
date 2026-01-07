import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './Admin.css';

const Admin = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchDashboard();
  }, [isAdmin, navigate]);

  const fetchDashboard = async () => {
    try {
      const [statsRes, usersRes, hotelsRes, reservationsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/hotels'),
        api.get('/reservations/admin/all')
      ]);
      
      setStats(statsRes.data);
      setUsers(usersRes.data.users || []);
      setHotels(hotelsRes.data.hotels || []);
      setReservations(reservationsRes.data.reservations || []);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId, field, value) => {
    try {
      await api.put(`/admin/users/${userId}`, { [field]: value });
      fetchDashboard();
    } catch (error) {
      alert('Erreur lors de la mise à jour');
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1>Panneau d'administration</h1>

        <div className="admin-tabs">
          <button
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            Tableau de bord
          </button>
          <button
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            Utilisateurs
          </button>
          <button
            className={activeTab === 'hotels' ? 'active' : ''}
            onClick={() => setActiveTab('hotels')}
          >
            Hôtels
          </button>
          <button
            className={activeTab === 'reservations' ? 'active' : ''}
            onClick={() => setActiveTab('reservations')}
          >
            Réservations
          </button>
        </div>

        {loading ? (
          <div className="loading">Chargement...</div>
        ) : (
          <>
            {activeTab === 'dashboard' && stats && (
              <div className="dashboard">
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>Utilisateurs</h3>
                    <p className="stat-number">{stats.totalUsers}</p>
                    <small>+{stats.newUsersThisMonth} ce mois</small>
                  </div>
                  <div className="stat-card">
                    <h3>Hôtels</h3>
                    <p className="stat-number">{stats.totalHotels}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Réservations</h3>
                    <p className="stat-number">{stats.totalReservations}</p>
                    <small>{stats.confirmedReservations} confirmées</small>
                  </div>
                  <div className="stat-card">
                    <h3>Revenus</h3>
                    <p className="stat-number">{stats.totalRevenue} MAD</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="admin-table">
                <table>
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Téléphone</th>
                      <th>Vérifié</th>
                      <th>Rôle</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>
                          <span className={user.verified ? 'badge-success' : 'badge-warning'}>
                            {user.verified ? 'Oui' : 'Non'}
                          </span>
                        </td>
                        <td>{user.role}</td>
                        <td>
                          <button
                            onClick={() => updateUserStatus(user._id, 'verified', !user.verified)}
                            className="btn-small"
                          >
                            {user.verified ? 'Désactiver' : 'Activer'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'hotels' && (
              <div className="hotels-list">
                {hotels.map((hotel) => (
                  <div key={hotel._id} className="hotel-item">
                    <h3>{hotel.name}</h3>
                    <p>{hotel.location} - {hotel.price} MAD/nuit</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reservations' && (
              <div className="admin-table">
                <table>
                  <thead>
                    <tr>
                      <th>Hôtel</th>
                      <th>Client</th>
                      <th>Dates</th>
                      <th>Prix</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((reservation) => (
                      <tr key={reservation._id}>
                        <td>{reservation.hotel?.name}</td>
                        <td>{reservation.user?.name}</td>
                        <td>
                          {new Date(reservation.checkIn).toLocaleDateString('fr-FR')} -{' '}
                          {new Date(reservation.checkOut).toLocaleDateString('fr-FR')}
                        </td>
                        <td>{reservation.totalPrice} MAD</td>
                        <td>
                          <span className={`badge badge-${reservation.status}`}>
                            {reservation.status}
                          </span>
                        </td>
                        <td>
                          <select
                            value={reservation.status}
                            onChange={(e) => {
                              api.put(`/reservations/${reservation._id}/status`, {
                                status: e.target.value
                              }).then(() => fetchDashboard());
                            }}
                          >
                            <option value="pending">En attente</option>
                            <option value="confirmed">Confirmée</option>
                            <option value="cancelled">Annulée</option>
                            <option value="completed">Terminée</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;

