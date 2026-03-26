import React from 'react';
import { Trash2, Edit3, CheckCircle, Circle, Clock } from 'lucide-react';
import api from '../services/api';

const TaskList = ({ tasks, onEdit, onDelete, onToggleComplete }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 px-4 card border-dashed border-slate-800">
        <Clock className="w-12 h-12 text-slate-700 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-400">No tasks Found</h3>
        <p className="text-slate-600">Start by creating your first task above!</p>
      </div>
    );
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${id}`);
        onDelete();
      } catch (err) {
        alert('Failed to delete task');
      }
    }
  };

  const handleToggle = async (task) => {
    try {
      await api.put(`/tasks/${task._id}`, { completed: !task.completed });
      onToggleComplete();
    } catch (err) {
      alert('Failed to update task');
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task._id} className="card group hover:border-indigo-500/30 transition-all duration-300">
          <div className="p-5 flex items-start space-x-4">
            <button 
              onClick={() => handleToggle(task)}
              className="mt-1 flex-shrink-0 text-indigo-500 hover:text-indigo-400 transition-colors"
            >
              {task.completed ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <Circle className="w-6 h-6" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <h3 className={`text-lg font-semibold truncate ${task.completed ? 'text-slate-500 line-through' : 'text-white'}`}>
                {task.title}
              </h3>
              <p className={`text-sm mt-1 break-words ${task.completed ? 'text-slate-600' : 'text-slate-400'}`}>
                {task.description}
              </p>
            </div>
            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onEdit(task)}
                className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-all"
              >
                <Edit3 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleDelete(task._id)}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
