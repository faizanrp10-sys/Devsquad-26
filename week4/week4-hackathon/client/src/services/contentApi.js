import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const contentApi = {
  getHomeContent: () => axios.get(`${API_URL}/content/home`),
  getMoviesShowsContent: () => axios.get(`${API_URL}/content/movies-shows`),
};
