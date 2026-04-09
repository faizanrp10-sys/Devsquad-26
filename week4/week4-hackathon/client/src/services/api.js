import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('token');
    if (!token) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo && userInfo.token) {
          token = userInfo.token;
        }
      } catch (e) {
        // Ignore JSON parse error
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const videoService = {
  getVideos: () => api.get('/videos'),
  getVideoById: (id) => api.get(`/videos/${id}`),
  streamVideo: (id) => api.get(`/videos/${id}/stream`),
};

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  toggleBlockUser: (id) => api.put(`/admin/users/${id}/block`),
  getVideos: () => api.get('/videos/admin/all'),
  createVideo: (data) => api.post('/videos', data),
  updateVideo: (id, data) => api.put(`/videos/${id}`, data),
  deleteVideo: (id) => api.delete(`/videos/${id}`),
  uploadFile: (formData) => api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  createPlan: (data) => api.post('/plans', data),
  updatePlan: (id, data) => api.put(`/plans/${id}`, data),
  deletePlan: (id) => api.delete(`/plans/${id}`),
};

export const planService = {
  getPlans: () => api.get('/plans'),
  createPlan: (data) => api.post('/plans', data),
  updatePlan: (id, data) => api.put(`/plans/${id}`, data),
  deletePlan: (id) => api.delete(`/plans/${id}`),
};

export default api;
