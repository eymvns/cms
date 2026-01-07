import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`toast ${type}`}>
      <div className="toast-icon">
        {type === 'success' && <i className="fa-solid fa-check-circle"></i>}
        {type === 'error' && <i className="fa-solid fa-exclamation-circle"></i>}
        {type === 'info' && <i className="fa-solid fa-info-circle"></i>}
      </div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={onClose}>
        <i className="fa-solid fa-times"></i>
      </button>
    </div>
  );
};

export default Toast;

