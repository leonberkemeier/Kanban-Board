# Kanban Board Authentication System

This document describes the authentication system implemented for the Kanban Board application.

## Overview

The application uses JWT (JSON Web Token) authentication with the following features:

- **Backend**: Django REST Framework with JWT tokens
- **Frontend**: React with context-based authentication
- **Security**: Admin-only user creation (no public registration)
- **Token Management**: Automatic token refresh and secure storage

## Backend Features

### Authentication Endpoints

- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout  
- `POST /api/auth/refresh/` - Refresh access token
- `GET /api/auth/me/` - Get current user info
- `GET /api/auth/profile/` - Get/update user profile

### Protected API Endpoints

All task endpoints now require authentication:
- `GET /api/tasks/` - List user's tasks
- `POST /api/tasks/` - Create new task (auto-assigned to user)
- `PUT /api/tasks/{id}/` - Update user's task
- `DELETE /api/tasks/{id}/` - Delete user's task

## Frontend Features

### Components

- **Login Component**: Secure login form with validation
- **ProtectedRoute**: Route protection wrapper
- **Header**: User menu with profile info and logout
- **AuthContext**: Global authentication state management

### Authentication Flow

1. User visits the app
2. If not authenticated, shows login page
3. After login, redirects to main Kanban board
4. Tokens are automatically managed (refresh/expiry)
5. User can logout from header menu

## User Management

### Creating Users (Admin Only)

Use the Django management command to create users:

```bash
# Basic user
python manage.py createkuser john_doe --email john@example.com --first-name John --last-name Doe

# Superuser  
python manage.py createkuser admin_user --email admin@example.com --superuser

# Interactive (prompts for details)
python manage.py createkuser username
```

### Command Options

- `username` - Required username
- `--email` - Email address
- `--first-name` - First name
- `--last-name` - Last name  
- `--superuser` - Create superuser
- `--password` - Password (will prompt if not provided)

## Setup Instructions

### Backend Setup

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run migrations**:
   ```bash
   python manage.py migrate
   ```

3. **Create a superuser**:
   ```bash
   python manage.py createkuser admin --superuser --email admin@example.com
   ```

4. **Start the backend**:
   ```bash
   # Development
   python manage.py runserver 8001
   
   # Production (Docker)
   docker-compose up -d
   ```

### Frontend Setup

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start the frontend**:
   ```bash
   npm start
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8001/api/

## Security Features

### JWT Configuration

- **Access Token**: 60 minutes lifetime
- **Refresh Token**: 7 days lifetime
- **Token Rotation**: New refresh token on each refresh
- **Blacklisting**: Old tokens are blacklisted

### Frontend Security

- **Secure Storage**: Tokens stored in localStorage
- **Auto Refresh**: Tokens refreshed automatically before expiry
- **Route Protection**: Unauthenticated users redirected to login
- **API Integration**: All API calls include authentication headers

### Backend Security

- **No Public Registration**: Only admins can create users
- **User Isolation**: Users can only see/modify their own tasks
- **Password Validation**: Django password validation enforced
- **CORS Protection**: Configured for frontend origin

## API Usage Examples

### Login
```bash
curl -X POST http://localhost:8001/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe", "password": "password123"}'
```

### Access Protected Endpoint
```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost:8001/api/tasks/
```

### Create Task
```bash
curl -X POST http://localhost:8001/api/tasks/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "New Task", "description": "Task description", "column": "todo"}'
```

## Troubleshooting

### Common Issues

1. **Token Expired**: Frontend automatically handles token refresh
2. **CORS Errors**: Check CORS_ALLOWED_ORIGINS in Django settings
3. **Authentication Failed**: Verify username/password and user exists
4. **API 401 Errors**: Check token validity and authentication headers

### Reset User Password

```bash
python manage.py shell -c "
from django.contrib.auth.models import User; 
user = User.objects.get(username='username'); 
user.set_password('new_password'); 
user.save(); 
print('Password updated')
"
```

## Development Notes

- **Environment Variables**: Use REACT_APP_API_URL for API base URL
- **Token Storage**: Consider using httpOnly cookies for production
- **Error Handling**: All API errors are properly handled in frontend
- **User Experience**: Smooth transitions between authenticated states

## Production Deployment

### Backend (Docker)
```bash
./docker-run-prod.sh
```

### Frontend
```bash
npm run build
# Serve the build folder with your web server
```

### Environment Variables
- `REACT_APP_API_URL`: Backend API URL
- `DEBUG`: Django debug mode (set to 0 in production)
- `ALLOWED_HOSTS`: Django allowed hosts