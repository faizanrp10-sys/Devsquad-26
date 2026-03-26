import React from 'react';
import { CheckCheck, Clock, ListTodo } from 'lucide-react';
import { Task } from '../types/todo';

interface StatsProps {
  tasks: Task[];
}

const Stats: React.FC<StatsProps> = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="stats-container">
      <div className="stat-card stat-total">
        <ListTodo size={20} className="stat-icon" />
        <div className="stat-info">
          <span className="stat-value">{total}</span>
          <span className="stat-label">Total</span>
        </div>
      </div>
      <div className="stat-card stat-pending">
        <Clock size={20} className="stat-icon" />
        <div className="stat-info">
          <span className="stat-value">{pending}</span>
          <span className="stat-label">Pending</span>
        </div>
      </div>
      <div className="stat-card stat-done">
        <CheckCheck size={20} className="stat-icon" />
        <div className="stat-info">
          <span className="stat-value">{completed}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>
      {total > 0 && (
        <div className="progress-bar-wrapper">
          <div className="progress-label">
            <span>Progress</span>
            <span>{percent}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${percent}%` }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;
