import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './TaskCard.css';

const PRIORITY_COLORS = {
  low: '#10B981',
  medium: '#F59E0B',
  high: '#EF4444',
};

const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

const TaskCard = ({ task, onEdit, onDelete, onTaskClick, isDragging = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: (isDragging || isSortableDragging) ? 0.5 : 1,
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(task);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  const handleTaskClick = (e) => {
    // Only trigger if clicking on the task content, not on action buttons
    if (!e.target.closest('.task-action-btn')) {
      onTaskClick && onTaskClick(task);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`task-card ${isDragging ? 'task-card-dragging' : ''}`}
      onClick={handleTaskClick}
    >
      <div className="task-header">
        <div className="task-actions">
          <button
            className="task-action-btn edit-btn"
            onClick={handleEdit}
            title="Edit task"
          >
            ✏️
          </button>
          <button
            className="task-action-btn delete-btn"
            onClick={handleDelete}
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <div className="task-content">
        <h4 className="task-title">{task.title}</h4>
        
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        
        <div className="task-meta">
          <div className="task-priority">
            <span 
              className="priority-indicator"
              style={{ backgroundColor: PRIORITY_COLORS[task.priority] }}
            />
            <span className="priority-label">
              {PRIORITY_LABELS[task.priority]}
            </span>
          </div>
          
          {task.assignee && (
            <div className="task-assignee">
              <span className="assignee-icon">👤</span>
              <span className="assignee-name">{task.assignee}</span>
            </div>
          )}
        </div>
        
        <div className="task-footer">
          <div className="task-dates">
            <span className="created-date">
              Created: {new Date(task.created_at).toLocaleDateString()}
            </span>
            {task.updated_at !== task.created_at && (
              <span className="updated-date">
                Updated: {new Date(task.updated_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;