import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import Confetti from './Confetti';
import './KanbanBoard.css';

const COLUMNS = [
  { id: 'backlog', title: 'Backlog', color: '#6B7280' },
  { id: 'todo', title: 'To-Do', color: '#3B82F6' },
  { id: 'in_progress', title: 'In Progress', color: '#F59E0B' },
  { id: 'review', title: 'Review/Testing', color: '#8B5CF6' },
  { id: 'done', title: 'Done', color: '#10B981' },
];

const KanbanBoard = ({ tasks, onEditTask, onDeleteTask, onTaskDrop, onTaskClick }) => {
  const [activeId, setActiveId] = useState(null);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getTasksForColumn = (columnId) => {
    return tasks
      .filter(task => task.column === columnId)
      .sort((a, b) => a.order - b.order);
  };

  const handleDragStart = (event) => {
    console.log('Drag start:', event.active.id);
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    console.log('Drag end - active:', active.id, 'over:', over?.id);
    setActiveId(null);

    if (!over) {
      console.log('No drop target found');
      return;
    }

    const activeId = active.id;
    const overId = over.id;
    console.log('Processing drag from', activeId, 'to', overId);

    // Determine if we're dropping over a column or a task
    let targetColumn;
    let targetIndex;

    if (COLUMNS.find(col => col.id === overId)) {
      // Dropping over a column
      targetColumn = overId;
      targetIndex = getTasksForColumn(targetColumn).length;
      console.log('Dropping over column:', targetColumn, 'at index:', targetIndex);
    } else {
      // Dropping over a task
      const targetTask = tasks.find(task => task.id === overId);
      if (targetTask) {
        targetColumn = targetTask.column;
        const columnTasks = getTasksForColumn(targetColumn);
        targetIndex = columnTasks.findIndex(task => task.id === overId);
        console.log('Dropping over task in column:', targetColumn, 'at index:', targetIndex);
      } else {
        console.log('Could not find target task with ID:', overId);
      }
    }

    if (targetColumn && targetIndex !== undefined) {
      console.log('Calling onTaskDrop with:', activeId, targetColumn, targetIndex);
      
      // Get the current task to check if column changed
      const currentTask = tasks.find(task => task.id === activeId);
      const columnChanged = currentTask && currentTask.column !== targetColumn;
      
      // Trigger confetti when moving to a different column
      if (columnChanged) {
        setConfettiTrigger(prev => prev + 1);
      }
      
      onTaskDrop(activeId, targetColumn, targetIndex);
    } else {
      console.log('Missing targetColumn or targetIndex:', targetColumn, targetIndex);
    }
  };

  const activeTask = activeId ? tasks.find(task => task.id === activeId) : null;

  return (
    <div className="kanban-board">
      <Confetti trigger={confettiTrigger} />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="kanban-columns">
          {COLUMNS.map(column => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={getTasksForColumn(column.id)}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onTaskClick={onTaskClick}
            />
          ))}
        </div>
        
        <DragOverlay>
          {activeTask ? (
            <TaskCard
              task={activeTask}
              isDragging={true}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;