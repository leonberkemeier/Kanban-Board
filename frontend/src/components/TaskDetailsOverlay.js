import React, { useEffect } from 'react';
import './TaskDetailsOverlay.css';

const TaskDetailsOverlay = ({ task, isOpen, onClose, onEdit, onDelete }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when overlay is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!task) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEditClick = () => {
    onEdit(task);
    onClose();
  };

  const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
      onClose();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getColumnLabel = (column) => {
    const columnMap = {
      'backlog': 'Backlog',
      'todo': 'To-Do',
      'in_progress': 'In Progress',
      'review': 'Review/Testing',
      'done': 'Done'
    };
    return columnMap[column] || column;
  };

  return (
    <div 
      className={`task-overlay-backdrop ${isOpen ? 'open' : ''}`}
      onClick={handleBackdropClick}
    >
      <div className={`task-details-overlay ${isOpen ? 'open' : ''}`}>
        <div className="overlay-header">
          <h2>Task Details</h2>
          <button 
            className="close-overlay-btn"
            onClick={onClose}
            aria-label="Close task details"
          >
            ×
          </button>
        </div>

        <div className="overlay-content">
          <div className="task-title-section">
            <h3 className="task-title">{task.title}</h3>
            <div className="task-meta-row">
              <div className="task-status">
                <span className="status-label">Status:</span>
                <span className="status-value">{getColumnLabel(task.column)}</span>
              </div>
              <div className="task-priority">
                <span className="priority-label">Priority:</span>
                <span 
                  className="priority-value"
                  style={{ color: getPriorityColor(task.priority) }}
                >
                  <span 
                    className="priority-dot"
                    style={{ backgroundColor: getPriorityColor(task.priority) }}
                  ></span>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {task.assignee && (
            <div className="task-section">
              <h4>Assignee</h4>
              <div className="assignee-info">
                <span className="assignee-icon">👤</span>
                <span className="assignee-name">{task.assignee}</span>
              </div>
            </div>
          )}

          {task.description && (
            <div className="task-section">
              <h4>Description</h4>
              <p className="task-description">{task.description}</p>
            </div>
          )}

          {task.detailed_information && (
            <div className="task-section">
              <h4>Detailed Information</h4>
              <p className="task-detailed-info">{task.detailed_information}</p>
            </div>
          )}

          <div className="task-section">
            <h4>Timeline</h4>
            <div className="timeline-info">
              <div className="timeline-item">
                <span className="timeline-label">Created:</span>
                <span className="timeline-value">{formatDate(task.created_at)}</span>
              </div>
              <div className="timeline-item">
                <span className="timeline-label">Updated:</span>
                <span className="timeline-value">{formatDate(task.updated_at)}</span>
              </div>
            </div>
          </div>

          <div className="task-actions-section">
            <button 
              className="edit-task-btn"
              onClick={handleEditClick}
            >
              <span className="btn-icon">✏️</span>
              Edit Task
            </button>
            <button 
              className="delete-task-btn"
              onClick={handleDeleteClick}
            >
              <span className="btn-icon">🗑️</span>
              Delete Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsOverlay;