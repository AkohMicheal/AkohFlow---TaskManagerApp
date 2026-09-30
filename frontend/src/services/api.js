import axios from 'axios';

// When running inside Capacitor mobile or production, use VITE_API_URL or relative /api
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Intercept requests to inject JWT auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('akohflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses for auth handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token invalid or expired
      localStorage.removeItem('akohflow_token');
      localStorage.removeItem('akohflow_user');
      window.dispatchEvent(new Event('auth_logout'));
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async register({ username, email, password, avatar = 'dog' }) {
    const res = await api.post('/auth/register', { username, email, password, avatar });
    if (res.data.token) {
      localStorage.setItem('akohflow_token', res.data.token);
      localStorage.setItem('akohflow_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async login(emailOrUsername, password) {
    const res = await api.post('/auth/login', { email: emailOrUsername, password });
    if (res.data.token) {
      localStorage.setItem('akohflow_token', res.data.token);
      localStorage.setItem('akohflow_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data;
  },

  async updateProfile(profileData) {
    const res = await api.put('/auth/profile', profileData);
    if (res.data.user) {
      localStorage.setItem('akohflow_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  logout() {
    localStorage.removeItem('akohflow_token');
    localStorage.removeItem('akohflow_user');
    window.dispatchEvent(new Event('auth_logout'));
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('akohflow_user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return Boolean(localStorage.getItem('akohflow_token'));
  },
};

export const taskService = {
  async getAll(params = {}) {
    const res = await api.get('/tasks', { params });
    return res.data;
  },

  async getStats() {
    const res = await api.get('/tasks/stats');
    return res.data;
  },

  async create(data) {
    const res = await api.post('/tasks', data);
    return res.data;
  },

  async update(id, data) {
    const res = await api.put(`/tasks/${id}`, data);
    return res.data;
  },

  async toggle(id) {
    const res = await api.patch(`/tasks/${id}/toggle`);
    return res.data;
  },

  async delete(id) {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  },
};

export const feedbackService = {
  async submit(feedback_text) {
    const res = await api.post('/feedback', { feedback_text });
    return res.data;
  }
};

export default api;
