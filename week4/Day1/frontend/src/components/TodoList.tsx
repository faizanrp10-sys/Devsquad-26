import React from 'react';
import { ClipboardList } from 'lucide-react';
import { Task, CreateTaskInput, UpdateTaskInput } from '../types/todo';
import TodoItem from './TodoItem';

interface TodoListProps {
  tasks: Task[];
  filter: 'all' | 'active' | 'completed';
  onToggle: (id: string, updates: UpdateTaskInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const TodoList: React.FC<TodoListProps> = ({ tasks, filter, onToggle, onDelete }) => {
  const filtered = tasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  if (filtered.length === 0) {
    return (
      <div className="empty-state">
        <ClipboardList size={48} className="empty-icon" />
        <p>
          {filter === 'completed'
            ? 'No completed tasks yet.'
            : filter === 'active'
            ? 'No pending tasks. Great job! 🎉'
            : 'No tasks yet. Add one above!'}
        </p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {filtered.map((task) => (
        <TodoItem
          key={task.id}
          task={task}
          onToggle={(id, completed) => onToggle(id, { completed })}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TodoList;
