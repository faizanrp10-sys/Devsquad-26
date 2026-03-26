import React, { useState } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';
import { CreateTaskInput } from '../types/todo';

interface TodoFormProps {
  onAdd: (input: CreateTaskInput) => Promise<void>;
}

const TodoForm: React.FC<TodoFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onAdd({ title: title.trim(), description: description.trim() || undefined });
      setTitle('');
      setDescription('');
    } catch {
      setError('Failed to add task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Add New Task</h2>
      <div className="form-group">
        <input
          id="task-title"
          type="text"
          className={`form-input ${error ? 'input-error' : ''}`}
          placeholder="Task title *"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setError(''); }}
          disabled={loading}
        />
        {error && <span className="error-msg">{error}</span>}
      </div>
      <div className="form-group">
        <input
          id="task-description"
          type="text"
          className="form-input"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
      </div>
      <button id="add-task-btn" type="submit" className="btn-primary" disabled={loading}>
        {loading ? <Loader2 size={18} className="spin" /> : <PlusCircle size={18} />}
        <span>{loading ? 'Adding…' : 'Add Task'}</span>
      </button>
    </form>
  );
};

export default TodoForm;
