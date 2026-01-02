import axios from 'axios';

// Base URL for backend API. Set VITE_API_URL in Vercel or local .env to override.
export const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-ks43.onrender.com';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 20000,
});

// Automatically attach bearer token from localStorage to every request (if present)
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch (e) {
    // ignore localStorage errors
  }
  return config
}, (error) => Promise.reject(error))

export const uploadsUrl = (filename) => `${API_BASE}/uploads/${encodeURIComponent(filename)}`;

export default api;
