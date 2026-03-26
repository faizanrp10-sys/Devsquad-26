import React, { useState, useEffect } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import api from '../services/api';

const TaskForm = ({ onTaskAdded, editingTask, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, { title, description });
      } else {
        await api.post('/tasks', { title, description });
      }
      onTaskAdded();
      setTitle('');
      setDescription('');
    } catch (err) {
      setError('Failed to save task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6 bg-slate-900 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Plus className="w-5 h-5 mr-2 text-indigo-500" />
          {editingTask ? 'Edit Task' : 'Create New Task'}
        </h2>
        {onCancel && (
          <button 
            onClick={onCancel}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-red-400 text-sm bg-red-400/10 p-2 rounded-lg text-center">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Title</label>
          <input
            type="text"
            className="input-field"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Description</label>
          <textarea
            className="input-field min-h-[100px] resize-none"
            placeholder="Add some details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center py-3"
        >
          {loading ? (
            <Loader2 className="animate-spin w-5 h-5 mr-2" />
          ) : editingTask ? 'Update Task' : 'Add Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
