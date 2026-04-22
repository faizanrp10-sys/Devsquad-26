import axios from 'axios';

// Default base URL for NestJS backend
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://prolific-empathy-production-e8a9.up.railway.app';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Attempt to grab token from local storage (or you can use cookies alternatively)
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

export default axiosInstance;
