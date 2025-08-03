import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE = '/api/components';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
  signup: (userData) => api.post('/auth/signup', userData),
};

// Components API
export const componentsAPI = {
  getAll: (params) => api.get('/components', { params }),
  getById: (id) => api.get(`/components/${id}`),
  create: (data) => api.post('/components', data),
  update: (id, data) => api.put(`/components/${id}`, data),
  delete: (id) => api.delete(`/components/${id}`),
 bulkImport: (formData) =>
  api.post('/components/bulk-import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Stock Logs API
export const stockLogsAPI = {
  getAll: (params) => api.get('/stocklogs', { params }),
  getById: (id) => api.get(`/stocklogs/${id}`),
  create: (data) => api.post('/stocklogs', data),
};

// Dashboard API
export const dashboardAPI = {
  getStats: (params) => api.get('/dashboard/stats', { params }),
  getCharts: (params) => api.get('/dashboard/charts', { params }),
};


export default api; 