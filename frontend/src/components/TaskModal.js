import React, { useState, useEffect } from 'react';
import './TaskModal.css';

const COLUMNS = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'todo', label: 'To-Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'Review/Testing' },
  { value: 'done', label: 'Done' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const TaskModal = ({ task, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detailed_information: '',
    assignee: '',
    priority: 'medium',
    column: 'backlog',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when task changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        detailed_information: task.detailed_information || '',
        assignee: task.assignee || '',
        priority: task.priority || 'medium',
        column: task.column || 'backlog',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        detailed_information: '',
        assignee: '',
        priority: 'medium',
        column: 'backlog',
      });
    }
  }, [task]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }
    
    if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }
    
    if (formData.assignee.length > 100) {
      newErrors.assignee = 'Assignee name must be less than 100 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare the data
      const submitData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        detailed_information: formData.detailed_information.trim(),
        assignee: formData.assignee.trim(),
      };
      
      await onSave(submitData);
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isEditing = !!task;

  return (
    <div className="task-modal-backdrop" onClick={handleBackdropClick}>
      <div className="task-modal">
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
          <button 
            className="close-btn"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter task title"
                className={errors.title ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.title && (
                <span className="error-message">{errors.title}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the task"
                rows={3}
                className={errors.description ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.description && (
                <span className="error-message">{errors.description}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="detailed_information">Detailed Information</label>
              <textarea
                id="detailed_information"
                name="detailed_information"
                value={formData.detailed_information}
                onChange={handleInputChange}
                placeholder="Detailed information about the task (only visible in task details)"
                rows={4}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="assignee">Assignee</label>
              <input
                type="text"
                id="assignee"
                name="assignee"
                value={formData.assignee}
                onChange={handleInputChange}
                placeholder="Person assigned to this task"
                className={errors.assignee ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.assignee && (
                <span className="error-message">{errors.assignee}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                disabled={isSubmitting}
              >
                {PRIORITY_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="column">Column</label>
              <select
                id="column"
                name="column"
                value={formData.column}
                onChange={handleInputChange}
                disabled={isSubmitting}
              >
                {COLUMNS.map(column => (
                  <option key={column.value} value={column.value}>
                    {column.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-btn"
              disabled={isSubmitting || !formData.title.trim()}
            >
              {isSubmitting ? 'Saving...' : (isEditing ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;