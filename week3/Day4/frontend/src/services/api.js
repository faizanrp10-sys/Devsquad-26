import axios from 'axios';

const API = axios.create({ baseURL: 'https://backend-beta-ten-72.vercel.app' });

API.interceptors.request.use((req) => {
  const profile = localStorage.getItem('profile');
  if (profile) {
    req.headers.Authorization = `Bearer ${JSON.parse(profile).token}`;
  }
  return req;
});

export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);

export const fetchProjects = () => API.get('/projects');
export const createProject = (newProject) => API.post('/projects', newProject);
export const updateProject = (id, updatedProject) => API.put(`/projects/${id}`, updatedProject);
export const deleteProject = (id) => API.delete(`/projects/${id}`);

export const fetchMembers = () => API.get('/members');
export const createMember = (newMember) => API.post('/members', newMember);
export const updateMember = (id, updatedMember) => API.put(`/members/${id}`, updatedMember);
export const deleteMember = (id) => API.delete(`/members/${id}`);

export default API;
