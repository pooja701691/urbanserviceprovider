import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://usp-m9by.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem('usp_auth');
    if (stored) {
      try {
        const auth = JSON.parse(stored);
        if (auth?.token) {
          config.headers.Authorization = `Bearer ${auth.token}`;
        }
      } catch (error) {
        // ignore malformed auth data
      }
    }
  }
  return config;
});

export default api;
