import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { tasksAPI } from '../services/api';
import KanbanBoard from './KanbanBoard';
import TaskModal from './TaskModal';
import ThemeToggle from './ThemeToggle';
import TaskDetailsOverlay from './TaskDetailsOverlay';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskOverlay, setShowTaskOverlay] = useState(false);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getTasks();
      setTasks(response);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowTaskModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.deleteTask(taskId);
        setTasks(tasks.filter(task => task.id !== taskId));
      } catch (err) {
        console.error('Error deleting task:', err);
        setError('Failed to delete task. Please try again.');
      }
    }
  };

  const handleTaskSave = async (taskData) => {
    try {
      if (editingTask) {
        // Update existing task
        const updatedTask = await tasksAPI.updateTask(editingTask.id, taskData);
        setTasks(tasks.map(task => 
          task.id === editingTask.id ? updatedTask : task
        ));
      } else {
        // Create new task
        const newTask = await tasksAPI.createTask(taskData);
        setTasks([...tasks, newTask]);
      }
      
      setShowTaskModal(false);
      setEditingTask(null);
      setError(null);
    } catch (err) {
      console.error('Error saving task:', err);
      setError('Failed to save task. Please try again.');
    }
  };

  const handleTaskDrop = async (draggedTaskId, targetColumn, targetIndex) => {
    console.log('Dashboard handleTaskDrop called with:', draggedTaskId, targetColumn, targetIndex);
    try {
      // Find the dragged task
      const draggedTask = tasks.find(task => task.id === draggedTaskId);
      console.log('Found dragged task:', draggedTask);
      if (!draggedTask) {
        console.log('Could not find dragged task with ID:', draggedTaskId);
        return;
      }


      // Create updated tasks array
      const updatedTasks = [...tasks];
      const draggedTaskIndex = updatedTasks.findIndex(task => task.id === draggedTaskId);
      
      // Remove dragged task from its current position
      updatedTasks.splice(draggedTaskIndex, 1);
      
      // Update the dragged task with new column
      const updatedDraggedTask = {
        ...draggedTask,
        column: targetColumn,
        order: targetIndex,
      };

      // Insert at new position
      updatedTasks.splice(
        updatedTasks.findIndex(task => 
          task.column === targetColumn && task.order >= targetIndex
        ) || updatedTasks.length,
        0,
        updatedDraggedTask
      );

      // Always add the dragged task to updates since it changed position or column
      const tasksToUpdate = [];
      
      // Add the dragged task first (it definitely changed)
      tasksToUpdate.push({
        id: draggedTaskId,
        column: targetColumn,
        order: targetIndex,
      });
      
      // Recalculate orders for all tasks in the target column
      let orderCounter = 0;
      updatedTasks.forEach(task => {
        if (task.column === targetColumn) {
          const newOrder = orderCounter++;
          if (task.order !== newOrder) {
            task.order = newOrder;
            // Only add if it's not the dragged task (already added above)
            if (task.id !== draggedTaskId) {
              tasksToUpdate.push({
                id: task.id,
                column: task.column,
                order: task.order,
              });
            }
          }
        }
      });

      // If the dragged task changed columns, also recalculate the old column
      if (draggedTask.column !== targetColumn) {
        orderCounter = 0;
        updatedTasks.forEach(task => {
          if (task.column === draggedTask.column) {
            const newOrder = orderCounter++;
            if (task.order !== newOrder) {
              task.order = newOrder;
              if (!tasksToUpdate.find(t => t.id === task.id)) {
                tasksToUpdate.push({
                  id: task.id,
                  column: task.column,
                  order: task.order,
                });
              }
            }
          }
        });
      }

      // Update state immediately for better UX
      setTasks(updatedTasks);

      // Send update to backend
      if (tasksToUpdate.length > 0) {
        console.log('Sending update to backend with tasks:', tasksToUpdate);
        await tasksAPI.updateTaskPositions(tasksToUpdate);
        console.log('Backend update completed successfully');
      } else {
        console.log('No tasks to update in backend');
      }

      setError(null);
    } catch (err) {
      console.error('Error updating task position:', err);
      setError('Failed to update task position. Please try again.');
      // Reload tasks to sync with backend
      fetchTasks();
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskOverlay(true);
  };

  const handleCloseOverlay = () => {
    setShowTaskOverlay(false);
    setSelectedTask(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Kanban Board</h1>
          <p>Welcome back, {user?.first_name || user?.username}!</p>
        </div>
        
        <div className="header-actions">
          <ThemeToggle />
          <button 
            className="create-task-btn"
            onClick={handleCreateTask}
          >
            + New Task
          </button>
          <button 
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          {typeof error === 'string' ? error : 'An error occurred. Please try again.'}
          <button 
            className="dismiss-error"
            onClick={() => setError(null)}
          >
            ×
          </button>
        </div>
      )}

      <main className="dashboard-content">
        <KanbanBoard
          tasks={tasks}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onTaskDrop={handleTaskDrop}
          onTaskClick={handleTaskClick}
        />
      </main>

      {showTaskModal && (
        <TaskModal
          task={editingTask}
          onSave={handleTaskSave}
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
        />
      )}

      <TaskDetailsOverlay
        task={selectedTask}
        isOpen={showTaskOverlay}
        onClose={handleCloseOverlay}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
};

export default Dashboard;