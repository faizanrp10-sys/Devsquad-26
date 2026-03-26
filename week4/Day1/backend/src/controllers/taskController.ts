import { Request, Response } from 'express';
import * as taskStore from '../store/taskStore';
import { CreateTaskDto, UpdateTaskDto } from '../types/task';

// GET /api/tasks
export const getAllTasks = (req: Request, res: Response): void => {
  const tasks = taskStore.getAll();
  res.json({ success: true, data: tasks, total: tasks.length });
};

// POST /api/tasks
export const createTask = (req: Request, res: Response): void => {
  const { title, description } = req.body as CreateTaskDto;

  if (!title || title.trim() === '') {
    res.status(400).json({ success: false, message: 'Task title is required.' });
    return;
  }

  const newTask = taskStore.create(title.trim(), description?.trim());
  res.status(201).json({ success: true, data: newTask });
};

// PUT /api/tasks/:id
export const updateTask = (req: Request, res: Response): void => {
  const { id } = req.params;
  const updates = req.body as UpdateTaskDto;

  const updatedTask = taskStore.update(id, updates);

  if (!updatedTask) {
    res.status(404).json({ success: false, message: `Task with id "${id}" not found.` });
    return;
  }

  res.json({ success: true, data: updatedTask });
};

// DELETE /api/tasks/:id
export const deleteTask = (req: Request, res: Response): void => {
  const { id } = req.params;
  const deleted = taskStore.remove(id);

  if (!deleted) {
    res.status(404).json({ success: false, message: `Task with id "${id}" not found.` });
    return;
  }

  res.json({ success: true, message: 'Task deleted successfully.' });
};
