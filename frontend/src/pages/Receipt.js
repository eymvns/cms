import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Receipt.css';

const Receipt = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    fetchPayment();
  }, [paymentId, isAuthenticated, navigate]);

  const fetchPayment = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/payments/receipt/${paymentId}`);
      setPayment(response.data);
    } catch (error) {
      console.error('Error fetching receipt:', error);
      setError('Reçu non trouvé');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await api.get(`/payments/receipt/${paymentId}/pdf`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${paymentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Erreur lors du téléchargement du reçu');
    }
  };

  if (loading) {
    return <div className="receipt-container loading">Chargement du reçu...</div>;
  }

  if (error || !payment) {
    return (
      <div className="receipt-container error">
        <p>{error}</p>
        <button onClick={() => navigate('/profile')} className="btn-back">
          Retour au profil
        </button>
      </div>
    );
  }

  const { booking, payerInfo, amount, paymentDate, receiptNumber, tripDetails } = payment;

  return (
    <div className="receipt-container">
      <div className="receipt-header no-print">
        <h1>Reçu de Paiement</h1>
        <div className="receipt-actions">
          <button onClick={handlePrint} className="btn-print">
            🖨️ Imprimer
          </button>
          <button onClick={handleDownloadPDF} className="btn-download">
            📥 Télécharger PDF
          </button>
          <button onClick={() => navigate('/profile')} className="btn-back">
            ← Retour
          </button>
        </div>
      </div>

      <div className="receipt-content">
        {/* En-tête */}
        <div className="receipt-header-content">
          <div className="logo-section">
            <h2>EYM Covoiturage</h2>
            <p>Voyagez ensemble au Maroc</p>
          </div>
          <div className="status">
            <span className="badge-success">✓ PAIEMENT CONFIRMÉ</span>
          </div>
        </div>

        {/* Numéro et date de reçu */}
        <div className="receipt-info">
          <div className="info-row">
            <span>Numéro de reçu:</span>
            <span className="value">{receiptNumber}</span>
          </div>
          <div className="info-row">
            <span>Date de paiement:</span>
            <span className="value">{new Date(paymentDate).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
        </div>

        {/* Informations du payeur */}
        <div className="section">
          <h3>Informations du payeur</h3>
          <div className="info-block">
            <p><strong>{payerInfo.firstName} {payerInfo.lastName}</strong></p>
            <p>{payerInfo.email}</p>
            <p>{payerInfo.phone}</p>
          </div>
        </div>

        {/* Détails du trajet */}
        <div className="section">
          <h3>Détails de la réservation</h3>
          <div className="trip-details">
            <div className="trip-route">
              <div className="location">
                <span className="label">Départ</span>
                <span className="value">{tripDetails.departure}</span>
              </div>
              <div className="arrow">→</div>
              <div className="location">
                <span className="label">Arrivée</span>
                <span className="value">{tripDetails.arrival}</span>
              </div>
            </div>
            <div className="trip-info">
              <div className="info-item">
                <span className="label">📅 Date:</span>
                <span className="value">{new Date(tripDetails.date).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="info-item">
                <span className="label">⏰ Heure:</span>
                <span className="value">{tripDetails.time}</span>
              </div>
              <div className="info-item">
                <span className="label">🚗 Véhicule:</span>
                <span className="value">{tripDetails.vehicle}</span>
              </div>
              <div className="info-item">
                <span className="label">💺 Places réservées:</span>
                <span className="value">{booking.seats}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Détails de facturation */}
        <div className="section">
          <h3>Détails de facturation</h3>
          <table className="billing-table">
            <tbody>
              <tr>
                <td>Prix unitaire</td>
                <td>{tripDetails.price} MAD</td>
              </tr>
              <tr>
                <td>Nombre de places</td>
                <td>{booking.seats}</td>
              </tr>
              <tr>
                <td>Sous-total</td>
                <td>{tripDetails.price * booking.seats} MAD</td>
              </tr>
              <tr>
                <td>Frais de service (5%)</td>
                <td>{Math.round((tripDetails.price * booking.seats * 0.05) * 100) / 100} MAD</td>
              </tr>
              <tr className="total-row">
                <td>Total payé</td>
                <td>{amount} MAD</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Conditions */}
        <div className="section terms">
          <h3>Conditions</h3>
          <ul>
            <li>Ce reçu confirme votre paiement pour la réservation de trajet</li>
            <li>Veuillez garder ce reçu pour votre référence</li>
            <li>En cas de problème, contactez notre support: support@eym.ma</li>
            <li>Annulation gratuite jusqu'à 24h avant le départ</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="receipt-footer">
          <p>Merci d'avoir choisi EYM Covoiturage</p>
          <p className="contact">Besoin d'aide? support@eym.ma | +212 5XX XXX XXX</p>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
