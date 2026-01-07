import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = user?.role === 'admin';
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled || !isHomePage 
        ? 'bg-white shadow-md border-b border-gray-200' 
        : 'bg-transparent'
    }`}>
      <nav className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className={`flex items-center gap-2 text-2xl font-bold transition-colors ${
              isScrolled || !isHomePage ? 'text-gray-900' : 'text-white'
            } hover:text-primary`}
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <span className="hidden sm:inline">EYM</span>
          </Link>

          {/* Desktop Search Bar (not on home) */}
          {!isHomePage && (
            <div className="hidden lg:flex flex-1 max-w-xl mx-8">
              <SearchBar />
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`font-medium transition-colors ${
                isScrolled || !isHomePage 
                  ? 'text-gray-700 hover:text-primary' 
                  : 'text-white/90 hover:text-white'
              }`}
            >
              Accueil
            </Link>
            <Link 
              to="/search" 
              className={`font-medium transition-colors ${
                isScrolled || !isHomePage 
                  ? 'text-gray-700 hover:text-primary' 
                  : 'text-white/90 hover:text-white'
              }`}
            >
              Rechercher
            </Link>
            {isAdmin && (
              <Link 
                to="/admin" 
                className={`font-medium transition-colors ${
                  isScrolled || !isHomePage 
                    ? 'text-gray-700 hover:text-primary' 
                    : 'text-white/90 hover:text-white'
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative group">
                <button className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  isScrolled || !isHomePage 
                    ? 'hover:bg-gray-100' 
                    : 'hover:bg-white/10'
                }`}>
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className={`font-medium ${
                    isScrolled || !isHomePage ? 'text-gray-900' : 'text-white'
                  }`}>
                    {user?.name}
                  </span>
                </button>
                
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Mon Profil</span>
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-red-600 transition-colors w-full text-left border-t border-gray-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Déconnexion</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/auth" 
                  className={`font-medium transition-colors ${
                    isScrolled || !isHomePage 
                      ? 'text-gray-700 hover:text-primary' 
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  Connexion
                </Link>
                <Link 
                  to="/auth" 
                  className="btn-primary rounded-full px-6"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className={`md:hidden p-2 rounded-full transition-colors ${
              isScrolled || !isHomePage 
                ? 'hover:bg-gray-100 text-gray-900' 
                : 'hover:bg-white/10 text-white'
            }`}
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-fade-in bg-white">
            <div className="flex flex-col gap-2">
              <Link 
                to="/" 
                className="px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors font-medium" 
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link 
                to="/search" 
                className="px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors font-medium" 
                onClick={() => setIsMenuOpen(false)}
              >
                Rechercher
              </Link>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors font-medium" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              {isAuthenticated ? (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <Link 
                    to="/profile" 
                    className="px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors font-medium" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mon Profil
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="px-4 py-3 rounded-lg hover:bg-gray-50 text-red-600 transition-colors text-left font-medium"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <Link 
                    to="/auth" 
                    className="btn-primary mx-4 text-center" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
