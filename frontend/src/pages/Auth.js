import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Auth = () => {
  const [mode, setMode] = useState('login'); // 'login', 'register', 'otp'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, register, verifyOTP } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
        navigate('/');
      } else if (mode === 'register') {
        await register(formData.name, formData.email, formData.phone, formData.password);
        setMode('otp');
      } else if (mode === 'otp') {
        await verifyOTP(formData.email, formData.otp);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>
            {mode === 'login' && 'Connexion'}
            {mode === 'register' && 'Inscription'}
            {mode === 'otp' && 'Vérification OTP'}
          </h2>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label>Nom complet</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}

          {mode !== 'otp' && (
            <>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {mode === 'register' && (
                <div className="form-group">
                  <label>Téléphone (+212XXXXXXXXX)</label>
                  <input
                    type="tel"
                    required
                    pattern="^\+212\d{9}$"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+212612345678"
                  />
                </div>
              )}

              <div className="form-group">
                <label>Mot de passe</label>
                <input
                  type="password"
                  required
                  minLength="6"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </>
          )}

          {mode === 'otp' && (
            <div className="form-group">
              <label>Code OTP</label>
              <input
                type="text"
                required
                maxLength="6"
                value={formData.otp}
                onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                placeholder="Entrez le code à 6 chiffres"
              />
              <small>Un code OTP a été envoyé à votre téléphone</small>
            </div>
          )}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Chargement...' : (
              mode === 'login' ? 'Se connecter' :
              mode === 'register' ? 'S\'inscrire' :
              'Vérifier'
            )}
          </button>
        </form>

        <div className="auth-footer">
          {mode === 'login' && (
            <p>
              Pas encore de compte ?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); setMode('register'); }}>
                S'inscrire
              </a>
            </p>
          )}
          {mode === 'register' && (
            <p>
              Déjà un compte ?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); setMode('login'); }}>
                Se connecter
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;

