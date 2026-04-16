import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Guard against multiple simultaneous 401s triggering multiple redirects
let isRedirectingToLogin = false;

apiClient.interceptors.response.use(
  (response) => {
    // Handle empty AI responses depending on data structure expectations
    if (response.config.url?.includes('next-unit') && !response.data) {
      console.warn('Received empty AI response');
    }
    return response;
  },
  (error) => {
    if (!error.response) {
      console.error('Network error. Is the backend running?');
    } else if (error.response.status === 401) {
      if (typeof window !== 'undefined' && !isRedirectingToLogin) {
        isRedirectingToLogin = true;
        // Clear stale / expired credentials
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Hard-redirect so the AuthContext re-hydrates cleanly from empty storage
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
