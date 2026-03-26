import { Task } from '../types/task';

// In-memory store
const tasks: Task[] = [];

let idCounter = 1;

export const generateId = (): string => {
  return `task_${idCounter++}_${Date.now()}`;
};

export const getAll = (): Task[] => tasks;

export const getById = (id: string): Task | undefined =>
  tasks.find((t) => t.id === id);

export const create = (title: string, description?: string): Task => {
  const task: Task = {
    id: generateId(),
    title,
    description,
    completed: false,
    createdAt: new Date(),
  };
  tasks.push(task);
  return task;
};

export const update = (id: string, updates: Partial<Task>): Task | null => {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;
  tasks[index] = { ...tasks[index], ...updates };
  return tasks[index];
};

export const remove = (id: string): boolean => {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
};
