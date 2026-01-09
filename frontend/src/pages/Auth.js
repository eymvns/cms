import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Auth = () => {
  const [mode, setMode] = useState('login'); // 'login', 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, register } = useAuth();
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
        await register(formData.name, formData.email, formData.password);
        await login(formData.email, formData.password);
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

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Chargement...' : (
              mode === 'login' ? 'Se connecter' : 'S\'inscrire'
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

