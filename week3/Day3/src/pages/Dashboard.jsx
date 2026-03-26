import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Layout, CheckSquare, Search, Filter } from 'lucide-react';
import api from '../services/api';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const navigate = useNavigate();

  const fetchTasks = useCallback(async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleTaskAction = () => {
    fetchTasks();
    setEditingTask(null);
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-bold">T</span>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Taskly</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center space-x-3 px-4 py-2.5 bg-indigo-600/10 text-indigo-400 rounded-lg font-medium border border-indigo-600/20">
            <Layout className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-all group">
            <CheckSquare className="w-5 h-5 group-hover:text-indigo-400" />
            <span>My Tasks</span>
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2.5 text-slate-500 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-400 hover:text-white transition-colors md:hidden" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs font-bold">
              JD
            </div>
          </div>
        </header>

        <div className="p-6 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Task Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <TaskForm 
                  onTaskAdded={handleTaskAction} 
                  editingTask={editingTask}
                  onCancel={editingTask ? () => setEditingTask(null) : null}
                />
              </div>
            </div>

            {/* Right Column: Task List */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Your Tasks</h2>
                <div className="flex items-center space-x-2 text-sm text-slate-500">
                  <Filter className="w-4 h-4" />
                  <span>All Tasks</span>
                </div>
              </div>
              
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                  <p className="text-slate-500 animate-pulse">Loading your tasks...</p>
                </div>
              ) : (
                <TaskList 
                  tasks={tasks} 
                  onEdit={setEditingTask} 
                  onDelete={handleTaskAction}
                  onToggleComplete={handleTaskAction}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
