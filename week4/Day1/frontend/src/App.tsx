import React, { useEffect, useState, useCallback } from 'react';
import { Zap, RefreshCw } from 'lucide-react';
import { Task, CreateTaskInput, UpdateTaskInput } from './types/todo';
import * as api from './api/todoApi';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Stats from './components/Stats';

type Filter = 'all' | 'active' | 'completed';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.fetchTasks();
      setTasks(data);
    } catch {
      setError('Could not connect to server. Is the backend running on port 5000?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const handleAdd = async (input: CreateTaskInput) => {
    const newTask = await api.createTask(input);
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggle = async (id: string, updates: UpdateTaskInput) => {
    const updated = await api.updateTask(id, updates);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const handleDelete = async (id: string) => {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="app">
      <div className="bg-orb orb1" />
      <div className="bg-orb orb2" />

      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <Zap size={28} className="logo-icon" />
            <h1>TaskFlow</h1>
          </div>
          <p className="subtitle">Stay organised. Get things done.</p>
        </div>
      </header>

      <main className="main">
        <div className="card">
          <Stats tasks={tasks} />
        </div>

        <div className="card">
          <TodoForm onAdd={handleAdd} />
        </div>

        <div className="card">
          <div className="list-header">
            <div className="filter-tabs">
              {(['all', 'active', 'completed'] as Filter[]).map((f) => (
                <button
                  key={f}
                  id={`filter-${f}`}
                  className={`filter-tab ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <button className="refresh-btn" onClick={loadTasks} title="Refresh tasks">
              <RefreshCw size={16} />
            </button>
          </div>

          {error && (
            <div className="server-error">
              <span>⚠️ {error}</span>
            </div>
          )}

          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Loading tasks…</p>
            </div>
          ) : (
            <TodoList
              tasks={tasks}
              filter={filter}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          )}
        </div>
      </main>

      <footer className="footer">
        <p>Built with React + TypeScript + Express</p>
      </footer>
    </div>
  );
};

export default App;
