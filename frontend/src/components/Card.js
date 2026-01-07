import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ trip, className = '' }) => {
  if (!trip) return null;

  const imageUrl = trip.image || `https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop`;

  return (
    <Link
      to={`/trip/${trip._id}`}
      className={`group block bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover-lift ${className}`}
    >
      {/* Image */}
      <div className="relative w-full h-64 overflow-hidden">
        <img
          src={imageUrl}
          alt={`${trip.departure} → ${trip.arrival}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 shadow-md">
          <span className="text-sm font-semibold text-gray-900">{trip.price} MAD</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
              {trip.departure} → {trip.arrival}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(trip.date).toLocaleDateString('fr-FR', { 
                weekday: 'short', 
                day: 'numeric', 
                month: 'short' 
              })} à {trip.time}
            </p>
          </div>
        </div>

        {/* Driver Info */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
            {trip.driver?.name?.charAt(0).toUpperCase() || 'D'}
          </div>
          <span className="text-sm text-gray-600">{trip.driver?.name || 'Conducteur'}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{trip.availableSeats}/{trip.seats} places</span>
          </div>
          <span className="text-sm font-semibold text-primary">
            {trip.price} MAD <span className="text-gray-500 font-normal">/ place</span>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Card;

