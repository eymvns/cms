import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const TripDetails = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [seats, setSeats] = useState(1);

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  const fetchTripDetails = async () => {
    try {
      const response = await api.get(`/trips/${id}`);
      setTrip(response.data.trip);
    } catch (error) {
      console.error('Error fetching trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    if (seats > trip.availableSeats) {
      alert('Pas assez de places disponibles');
      return;
    }

    setBookingLoading(true);
    try {
      await api.post(`/bookings`, {
        tripId: id,
        seats: seats
      });
      alert('Réservation effectuée avec succès!');
      navigate('/profile');
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de la réservation');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Trajet non trouvé</h2>
          <button onClick={() => navigate('/')} className="text-primary hover:underline">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                {trip.departure} → {trip.arrival}
              </h1>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">{trip.price} DH</div>
                <div className="text-sm text-gray-500">par place</div>
              </div>
            </div>

            {/* Trip Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Date</div>
                  <div className="font-semibold">{new Date(trip.date).toLocaleDateString('fr-FR')}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Heure</div>
                  <div className="font-semibold">{trip.time}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Places disponibles</div>
                  <div className="font-semibold">{trip.availableSeats}/{trip.seats}</div>
                </div>
              </div>
            </div>

            {/* Driver Info */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold mb-4">Conducteur</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
                  {trip.driver?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-lg">{trip.driver?.name}</div>
                  <div className="text-gray-600">{trip.driver?.phone}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold mb-6">Réserver ce trajet</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de places
              </label>
              <select
                value={seats}
                onChange={(e) => setSeats(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                {[...Array(Math.min(trip.availableSeats, 4))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? 'place' : 'places'}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-t border-gray-200 py-4 mb-6">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total</span>
                <span className="text-2xl text-primary">{trip.price * seats} DH</span>
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={bookingLoading || trip.availableSeats === 0}
              className="w-full bg-primary text-white py-4 rounded-lg font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bookingLoading ? 'Réservation...' : trip.availableSeats === 0 ? 'Complet' : 'Réserver maintenant'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;