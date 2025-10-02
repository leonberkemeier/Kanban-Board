from django.core.management.base import BaseCommand
from kanban.models import Task

class Command(BaseCommand):
    help = 'Load sample tasks for testing'

    def handle(self, *args, **options):
        # Clear existing tasks
        Task.objects.all().delete()
        
        # Create sample tasks
        sample_tasks = [
            {
                'title': 'Set up project repository',
                'description': 'Initialize Git repository and set up project structure',
                'column': 'done',
                'priority': 'high',
                'assignee': 'Alice',
                'order': 0,
            },
            {
                'title': 'Design user interface mockups',
                'description': 'Create wireframes and mockups for the application',
                'column': 'done',
                'priority': 'medium',
                'assignee': 'Bob',
                'order': 1,
            },
            {
                'title': 'Implement user authentication',
                'description': 'Add login, logout, and registration functionality',
                'column': 'in_progress',
                'priority': 'high',
                'assignee': 'Alice',
                'order': 0,
                'detailed_information': 'Technical Requirements:\n\n1. Use JWT tokens for session management\n2. Implement password hashing with bcrypt\n3. Add OAuth integration for Google/GitHub\n4. Include password reset functionality\n5. Add rate limiting for login attempts\n\nAcceptance Criteria:\n- Users can register with email/password\n- Users can login and logout\n- Sessions expire after 24 hours\n- Failed login attempts are logged\n- Password must meet security requirements (8+ chars, special chars)\n\nNotes:\n- Consider implementing 2FA in future iteration\n- Coordinate with frontend team for UI components',
            },
            {
                'title': 'Create API endpoints',
                'description': 'Develop REST API for CRUD operations',
                'column': 'review',
                'priority': 'high',
                'assignee': 'Charlie',
                'order': 0,
                'detailed_information': 'API Endpoints to implement:\n\n1. User Management\n   - POST /api/users/register\n   - POST /api/users/login\n   - GET /api/users/profile\n   - PUT /api/users/profile\n\n2. Tasks Management\n   - GET /api/tasks/\n   - POST /api/tasks/\n   - PUT /api/tasks/{id}/\n   - DELETE /api/tasks/{id}/\n   - POST /api/tasks/bulk-update/\n\n3. Categories\n   - GET /api/categories/\n   - POST /api/categories/\n\nTesting Status:\n✅ User endpoints tested\n✅ Task CRUD operations tested\n⏳ Bulk update endpoint needs testing\n⏳ Error handling review needed\n\nDeployment Notes:\n- API documentation generated with Swagger\n- Rate limiting configured\n- CORS properly set up for frontend',
            },
            {
                'title': 'Write unit tests',
                'description': 'Add comprehensive test coverage for all components',
                'column': 'todo',
                'priority': 'medium',
                'assignee': 'Bob',
                'order': 0,
            },
            {
                'title': 'Optimize database queries',
                'description': 'Analyze and optimize slow database queries',
                'column': 'todo',
                'priority': 'low',
                'assignee': 'Alice',
                'order': 1,
            },
            {
                'title': 'Research new libraries',
                'description': 'Investigate new tools and libraries for future features',
                'column': 'backlog',
                'priority': 'low',
                'assignee': '',
                'order': 0,
            },
            {
                'title': 'Performance monitoring',
                'description': 'Set up application performance monitoring',
                'column': 'backlog',
                'priority': 'medium',
                'assignee': 'Charlie',
                'order': 1,
            },
        ]

        for task_data in sample_tasks:
            Task.objects.create(**task_data)
            
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {len(sample_tasks)} sample tasks')
        )