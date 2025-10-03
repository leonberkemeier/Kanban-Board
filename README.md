# Kanban Board Application

A full-stack Kanban board application built with React (frontend) and Django (backend).

## Features

- **5 Column Board**: Backlog, To-Do, In Progress, Review/Testing, and Done
- **Drag & Drop**: Move tasks between columns and reorder within columns
- **Task Management**: Create, edit, and delete tasks
- **Task Details**: View and edit task details in a modal
- **Detailed Information**: Comprehensive notes field available when creating or editing tasks (not shown on board)
- **Priority Levels**: Low, Medium, High priority with color coding
- **Assignee Management**: Assign tasks to team members
- **Real-time Updates**: Optimistic UI updates with API synchronization
- **Responsive Design**: Balanced layout with smart margins across all devices
- **Touch-Friendly**: Optimized for mobile and tablet devices

## Architecture

### Backend (Django)
- **Framework**: Django with Django REST Framework
- **Database**: SQLite (development)
- **API**: RESTful endpoints for CRUD operations
- **CORS**: Configured for React development server

### Frontend (React)
- **Framework**: React with hooks
- **Drag & Drop**: @hello-pangea/dnd library
- **API Client**: Axios for HTTP requests
- **State Management**: React useState and useEffect

## Installation & Setup

### Backend Setup

1. Create virtual environment and install dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
pip install django djangorestframework django-cors-headers
```

2. Run migrations:
```bash
python manage.py migrate
```

3. Load sample data (optional):
```bash
python manage.py load_sample_data
```

4. Start Django development server:
```bash
python manage.py runserver 8001
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start React development server:
```bash
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001/api

## Usage

### Creating Tasks
- Click the "+ Add Task" button in the header
- Fill in task details including title, description, assignee, priority, and initial column
- Add detailed information for comprehensive notes, requirements, or specifications
- Click "Create Task" to add to the board

### Managing Tasks
- **Drag & Drop**: Click and drag tasks between columns
- **Edit**: Click on any task card to view/edit details including detailed information
- **Delete**: Click the × button on any task card
- **Detailed Information**: Comprehensive notes field available in both create and edit modals

### API Endpoints

- `GET /api/tasks/` - List all tasks
- `POST /api/tasks/` - Create new task
- `GET /api/tasks/{id}/` - Get specific task
- `PUT /api/tasks/{id}/` - Update task
- `DELETE /api/tasks/{id}/` - Delete task
- `POST /api/tasks/update_positions/` - Update multiple task positions

## Project Structure

```
KanbanBoard/
├── backend/                 # Django project settings
├── kanban/                 # Django app
│   ├── models.py          # Task model
│   ├── views.py           # API views
│   ├── serializers.py     # DRF serializers
│   └── management/commands/
│       └── load_sample_data.py
├── frontend/               # React app
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Task.jsx
│   │   │   ├── Column.jsx
│   │   │   ├── Task.css
│   │   │   └── Column.css
│   │   ├── services/
│   │   │   └── api.js     # API client
│   │   ├── App.js         # Main app component
│   │   └── App.css        # App styles
│   └── package.json
└── README.md
```

## Technologies Used

### Backend
- Django 5.2.6
- Django REST Framework 3.16.1
- django-cors-headers 4.9.0

### Frontend
- React 18
- @hello-pangea/dnd (drag & drop)
- axios (HTTP client)

## Responsive Design

### Desktop (1200px+)
- **Balanced Layout**: Board uses most of screen width with comfortable 48px side margins
- **Flexible Columns**: Columns expand to fill available space with 300px minimum width
- **Enhanced Spacing**: 20px gaps between columns for better separation
- **Enhanced Modals**: Larger modal windows for detailed editing

### Ultrawide (1600px+)
- **Generous Margins**: 80px side margins for optimal viewing on very large screens
- **Enhanced Spacing**: 24px gaps between columns for premium feel

### Tablet (768px - 1199px)
- **Flexible Layout**: Columns expand to fill available width with 280px minimum
- **Comfortable Margins**: 24px side margins for balanced tablet viewing
- **Touch Optimization**: Larger touch targets and improved spacing
- **Responsive Modals**: Modals scale appropriately for tablet screens

### Mobile (< 768px)
- **Horizontal Scroll**: Smooth scrolling across columns
- **Full-width Header**: Add Task button spans full width
- **Touch-Friendly Cards**: Larger touch targets and better finger navigation
- **Mobile-Optimized Modals**: Full-screen experience with stacked form elements
- **Gesture Support**: Optimized for touch interactions

## Development Notes

- The application uses optimistic UI updates for better user experience
- CORS is configured to allow requests from localhost:3000
- Database uses SQLite for development (easily changeable for production)
- Sample data command provides realistic tasks for testing
- Responsive breakpoints: Mobile (<768px), Tablet (768-1199px), Desktop (1200px+)

## Future Enhancements

- User authentication and authorization
- Due dates and calendar integration
- File attachments
- Comments and activity history
- Board templates
- Real-time collaboration
- Progressive Web App (PWA) capabilities
- Offline functionality
- Push notifications
- Advanced mobile gestures
