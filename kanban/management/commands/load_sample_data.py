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
            },
            {
                'title': 'Create API endpoints',
                'description': 'Develop REST API for CRUD operations',
                'column': 'review',
                'priority': 'high',
                'assignee': 'Charlie',
                'order': 0,
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