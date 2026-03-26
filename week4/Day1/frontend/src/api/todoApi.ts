import axios from 'axios';
import { Task, CreateTaskInput, UpdateTaskInput, ApiResponse } from '../types/todo';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const fetchTasks = async (): Promise<Task[]> => {
  const res = await api.get<ApiResponse<Task[]>>('/tasks');
  return res.data.data ?? [];
};

export const createTask = async (input: CreateTaskInput): Promise<Task> => {
  const res = await api.post<ApiResponse<Task>>('/tasks', input);
  if (!res.data.data) throw new Error('Failed to create task');
  return res.data.data;
};

export const updateTask = async (id: string, updates: UpdateTaskInput): Promise<Task> => {
  const res = await api.put<ApiResponse<Task>>(`/tasks/${id}`, updates);
  if (!res.data.data) throw new Error('Failed to update task');
  return res.data.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};
