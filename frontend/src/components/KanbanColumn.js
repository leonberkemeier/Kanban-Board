import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import './KanbanColumn.css';

const KanbanColumn = ({ column, tasks, onEditTask, onDeleteTask, onTaskClick }) => {
  const {
    setNodeRef,
    isOver,
  } = useDroppable({
    id: column.id,
  });

  return (
    <div className="kanban-column">
      <div 
        className="column-header"
        style={{ borderTopColor: column.color }}
      >
        <div className="column-title-container">
          <div 
            className="column-color-indicator"
            style={{ backgroundColor: column.color }}
          />
          <h3 className="column-title">{column.title}</h3>
        </div>
        <div className="task-count">
          {tasks.length}
        </div>
      </div>
      
      <div 
        ref={setNodeRef}
        className={`column-content ${isOver ? 'column-over' : ''}`}
      >
        <SortableContext 
          items={tasks.map(task => task.id)} 
          strategy={verticalListSortingStrategy}
        >
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onTaskClick={onTaskClick}
            />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="empty-column">
            <p>No tasks yet</p>
            <p>Drop tasks here or create a new one</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;