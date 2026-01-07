import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Hotels API
export const hotelsAPI = {
  getAll: (params) => api.get('/hotels', { params }),
  getById: (id) => api.get(`/hotels/${id}`),
  checkAvailability: (id, params) => api.get(`/hotels/${id}/availability`, { params }),
  getReviews: (id) => api.get(`/hotels/${id}/reviews`),
  addReview: (id, data) => api.post(`/hotels/${id}/reviews`, data)
};

// Reservations API
export const reservationsAPI = {
  create: (data) => api.post('/reservations', data),
  getAll: (params) => api.get('/reservations', { params }),
  getById: (id) => api.get(`/reservations/${id}`),
  cancel: (id) => api.post(`/reservations/${id}/cancel`)
};

// Payments API
export const paymentsAPI = {
  createIntent: (data) => api.post('/payments/create-intent', data),
  confirm: (id) => api.post(`/payments/${id}/confirm`)
};

// Messages API
export const messagesAPI = {
  getAll: (params) => api.get('/messages', { params }),
  send: (data) => api.post('/messages', data),
  markAsRead: (id) => api.patch(`/messages/${id}/read`)
};

export default api;

