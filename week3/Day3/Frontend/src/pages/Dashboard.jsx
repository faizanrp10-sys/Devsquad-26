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
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Welcome Section */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/5">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight leading-none mb-3">
              Good Morning!
            </h1>
            <p className="text-slate-400 font-medium">Keep track of your productivity and goals today.</p>
          </div>
          <div className="flex gap-4">
            <div className="px-5 py-3 bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl flex flex-col items-center min-w-[100px]">
              <span className="text-2xl font-black text-indigo-500 leading-none mb-1">{tasks.length}</span>
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest leading-none">Total</span>
            </div>
            <div className="px-5 py-3 bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl flex flex-col items-center min-w-[100px]">
              <span className="text-2xl font-black text-emerald-500 leading-none mb-1">
                {tasks.filter(t => t.completed).length}
              </span>
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest leading-none">Done</span>
            </div>
          </div>
        </section>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Form Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24">
              <TaskForm 
                onTaskAdded={handleTaskAction} 
                editingTask={editingTask}
                onCancel={editingTask ? () => setEditingTask(null) : null}
              />
            </div>
          </div>

          {/* Right Column: Content Section */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-400">
                  <CheckSquare className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Active Tasks</h2>
              </div>
              <div className="flex items-center space-x-2 bg-slate-900/50 backdrop-blur-sm border border-white/5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400">
                <Filter className="w-4 h-4 text-slate-500" />
                <span>ALL TASKS</span>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin shadow-lg"></div>
                <p className="text-slate-500 font-bold animate-pulse text-sm">Fetching your tasks... hang tight!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <TaskList 
                  tasks={tasks} 
                  onEdit={setEditingTask} 
                  onDelete={handleTaskAction}
                  onToggleComplete={handleTaskAction}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
