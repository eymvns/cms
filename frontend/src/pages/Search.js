import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import SearchBar from '../components/SearchBar';
import Card from '../components/Card';
import FilterButton from '../components/FilterButton';

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [filters, setFilters] = useState({
    departure: searchParams.get('departure') || '',
    arrival: searchParams.get('arrival') || '',
    date: searchParams.get('date') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    seats: searchParams.get('seats') || '',
  });

  // Popular cities for quick filters
  const popularCities = [
    { name: 'Casablanca', icon: '🏙️' },
    { name: 'Rabat', icon: '🏛️' },
    { name: 'Marrakech', icon: '🏜️' },
    { name: 'Fès', icon: '🕌' },
    { name: 'Tanger', icon: '🌊' },
    { name: 'Agadir', icon: '🏖️' },
  ];

  useEffect(() => {
    fetchTrips();
  }, [filters, sortBy]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.departure) params.departure = filters.departure;
      if (filters.arrival) params.arrival = filters.arrival;
      if (filters.date) params.date = filters.date;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.seats) params.seats = filters.seats;

      const response = await api.get('/trips', { params });
      let tripsData = response.data.trips || [];
      
      // Sort trips
      tripsData = sortTrips(tripsData, sortBy);
      
      setTrips(tripsData);
    } catch (error) {
      console.error('Error fetching trips:', error);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const sortTrips = (trips, sort) => {
    const sorted = [...trips];
    switch (sort) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'date':
        return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'seats':
        return sorted.sort((a, b) => b.availableSeats - a.availableSeats);
      default:
        return sorted;
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleCityClick = (cityName) => {
    if (!filters.departure) {
      handleFilterChange('departure', cityName);
    } else if (!filters.arrival) {
      handleFilterChange('arrival', cityName);
    } else {
      handleFilterChange('departure', cityName);
      handleFilterChange('arrival', '');
    }
  };

  const clearFilters = () => {
    setFilters({
      departure: '',
      arrival: '',
      date: '',
      minPrice: '',
      maxPrice: '',
      seats: '',
    });
  };

  const activeFiltersCount = Object.values(filters).filter(v => v).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-40 shadow-sm">
        <div className="container-custom py-6">
          <SearchBar className="mb-4" />
          
          {/* Quick City Filters */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Villes populaires :</p>
            <div className="flex items-center gap-2 flex-wrap">
              {popularCities.map((city) => (
                <FilterButton
                  key={city.name}
                  label={city.name}
                  icon={city.icon}
                  active={filters.departure === city.name || filters.arrival === city.name}
                  onClick={() => handleCityClick(city.name)}
                />
              ))}
            </div>
          </div>
          
          {/* Filter Toggle & Sort */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:shadow-md transition-all font-medium text-sm bg-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filtres avancés
                {activeFiltersCount > 0 && (
                  <span className="bg-primary text-white rounded-full px-2 py-0.5 text-xs font-semibold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">Trier par:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white font-medium"
              >
                <option value="date">Date (proche)</option>
                <option value="price-low">Prix croissant</option>
                <option value="price-high">Prix décroissant</option>
                <option value="seats">Places disponibles</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="mt-6 p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-lg animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    💰 Prix minimum (MAD)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    💰 Prix maximum (MAD)
                  </label>
                  <input
                    type="number"
                    placeholder="1000"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    👥 Places disponibles
                  </label>
                  <input
                    type="number"
                    placeholder="1"
                    min="1"
                    value={filters.seats}
                    onChange={(e) => handleFilterChange('seats', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="mt-6 text-sm text-primary hover:underline font-semibold flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Effacer tous les filtres
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="container-custom py-8">
        {loading ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-card animate-pulse">
                <div className="w-full h-64 bg-gray-200"></div>
                <div className="p-5">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 animate-bounce">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Aucun trajet trouvé
            </h3>
            <p className="text-gray-600 mb-8">
              Essayez de modifier vos critères de recherche
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Effacer les filtres
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {trips.length} trajet{trips.length > 1 ? 's' : ''} disponible{trips.length > 1 ? 's' : ''}
                </h2>
                {activeFiltersCount > 0 && (
                  <p className="text-gray-600 mt-1 text-sm">
                    Résultats filtrés selon vos critères
                  </p>
                )}
              </div>
            </div>
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {trips.map((trip) => (
                <Card key={trip._id} trip={trip} className="card-hover" />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
