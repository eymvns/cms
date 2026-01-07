import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import SearchBar from '../components/SearchBar';
import Card from '../components/Card';

const Home = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await api.get('/trips');
      setTrips(response.data.trips || []);
    } catch (error) {
      console.error('Error fetching trips:', error);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Tous les trajets', icon: '🚗', count: trips.length },
    { name: 'Casablanca', icon: '🏙️', count: trips.filter(t => t.departure?.includes('Casablanca') || t.arrival?.includes('Casablanca')).length },
    { name: 'Rabat', icon: '🏛️', count: trips.filter(t => t.departure?.includes('Rabat') || t.arrival?.includes('Rabat')).length },
    { name: 'Marrakech', icon: '🏜️', count: trips.filter(t => t.departure?.includes('Marrakech') || t.arrival?.includes('Marrakech')).length },
    { name: 'Fès', icon: '🕌', count: trips.filter(t => t.departure?.includes('Fès') || t.arrival?.includes('Fès')).length },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center bg-gradient-to-br from-primary via-primary-light to-accent">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1539020140153-e479b8c22e70?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
          }}
        ></div>
        
        <div className="container-custom relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            Voyagez ensemble au Maroc
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto animate-slide-up">
            Trouvez des covoiturages pour découvrir le Maroc de manière économique et conviviale
          </p>
          
          <div className="animate-scale-in">
            <SearchBar variant="hero" className="max-w-5xl mx-auto" />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50 border-b border-gray-200">
        <div className="container-custom">
          <div className="flex items-center gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => navigate('/search')}
                className="flex flex-col items-center gap-2 px-6 py-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 min-w-[140px] border border-gray-100"
              >
                <span className="text-3xl">{category.icon}</span>
                <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">{category.name}</span>
                <span className="text-xs text-gray-500">{category.count} trajets</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Trips Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              <span className="gradient-text">Trajets disponibles</span>
            </h2>
            <p className="text-lg text-gray-600">
              Rejoignez des conducteurs pour voyager ensemble
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              <div className="text-6xl mb-4">🚗</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Aucun trajet disponible
              </h3>
              <p className="text-gray-600 mb-8">
                Soyez le premier à publier un trajet !
              </p>
              <button
                onClick={() => navigate('/auth')}
                className="btn-primary"
              >
                Créer un compte
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trips.map((trip) => (
                <Card key={trip._id} trip={trip} className="card-hover" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-light">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt à voyager ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Rejoignez notre communauté de voyageurs et découvrez le Maroc autrement
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/auth')}
              className="btn-secondary bg-white text-primary hover:bg-gray-50"
            >
              Créer un compte
            </button>
            <button
              onClick={() => navigate('/search')}
              className="btn-secondary bg-white/10 text-white border-white/30 hover:bg-white/20"
            >
              Explorer les trajets
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
