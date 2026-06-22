import axios from 'axios';

// Base API setup
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Interceptor for Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      const isAuthUrl = ['login', 'logout', 'sanctum', 'api/me'].some(p => url.includes(p));
      if (!isAuthUrl) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
