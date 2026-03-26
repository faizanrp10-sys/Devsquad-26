import React, { useState } from 'react';
import { CheckCircle2, Circle, Trash2, Loader2 } from 'lucide-react';
import { Task } from '../types/todo';

interface TodoItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const TodoItem: React.FC<TodoItemProps> = ({ task, onToggle, onDelete }) => {
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    try { await onToggle(task.id, !task.completed); }
    finally { setToggling(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try { await onDelete(task.id); }
    finally { setDeleting(false); }
  };

  const formattedDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <div className={`todo-item ${task.completed ? 'completed' : ''} ${deleting ? 'deleting' : ''}`}>
      <button
        className="toggle-btn"
        onClick={handleToggle}
        disabled={toggling || deleting}
        title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {toggling
          ? <Loader2 size={22} className="spin" />
          : task.completed
            ? <CheckCircle2 size={22} className="check-icon done" />
            : <Circle size={22} className="check-icon pending" />
        }
      </button>

      <div className="todo-content">
        <span className={`todo-title ${task.completed ? 'strikethrough' : ''}`}>
          {task.title}
        </span>
        {task.description && (
          <span className="todo-description">{task.description}</span>
        )}
        <span className="todo-date">{formattedDate}</span>
      </div>

      <button
        className="delete-btn"
        onClick={handleDelete}
        disabled={toggling || deleting}
        title="Delete task"
      >
        {deleting ? <Loader2 size={16} className="spin" /> : <Trash2 size={16} />}
      </button>
    </div>
  );
};

export default TodoItem;
