#!/usr/bin/env python
import os
import sys
import django
from datetime import datetime

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from kanban.models import Task

def create_anna_user_and_tasks():
    # Create or get Anna user
    username = 'anna'
    email = 'anna@example.com'
    password = 'anna123'
    
    if User.objects.filter(username=username).exists():
        print(f"User '{username}' already exists.")
        user = User.objects.get(username=username)
        user.set_password(password)
        user.save()
        print(f"Password updated for user '{username}'.")
    else:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name='Anna',
            last_name='Smith'
        )
        print(f"Created user '{username}' with password '{password}'")
    
    # Clear existing tasks for Anna to avoid duplicates
    Task.objects.filter(owner=user).delete()
    print("Cleared any existing tasks for Anna")
    
    # Sample tasks for Anna across different columns and priorities
    sample_tasks = [
        {
            'title': 'Design User Authentication Flow',
            'description': 'Create wireframes and mockups for the login and registration process',
            'detailed_information': 'Need to include forgot password, email verification, and social login options. Consider accessibility and mobile responsiveness.',
            'column': 'backlog',
            'priority': 'high',
            'assignee': 'Anna Smith',
            'order': 0
        },
        {
            'title': 'Implement Dark Mode Toggle',
            'description': 'Add dark/light theme switching functionality to the application',
            'detailed_information': 'Should persist user preference in localStorage and respect system preferences. Need to update all component styles with CSS variables.',
            'column': 'in_progress',
            'priority': 'medium',
            'assignee': 'Anna Smith',
            'order': 0
        },
        {
            'title': 'Fix Responsive Layout Issues',
            'description': 'Address mobile responsiveness problems on tablet and phone screens',
            'detailed_information': 'Several components break on smaller screens. Need to test thoroughly on different devices and browsers.',
            'column': 'todo',
            'priority': 'high',
            'assignee': 'Anna Smith',
            'order': 0
        },
        {
            'title': 'Setup Database Backup Strategy',
            'description': 'Configure automated daily backups for production database',
            'detailed_information': 'Need to implement backup rotation, test restore procedures, and set up monitoring alerts.',
            'column': 'todo',
            'priority': 'medium',
            'assignee': 'Anna Smith',
            'order': 1
        },
        {
            'title': 'Write API Documentation',
            'description': 'Document all REST API endpoints with examples and response schemas',
            'detailed_information': 'Use OpenAPI/Swagger format. Include authentication requirements, error codes, and example requests/responses.',
            'column': 'review',
            'priority': 'low',
            'assignee': 'Anna Smith',
            'order': 0
        },
        {
            'title': 'Optimize Database Queries',
            'description': 'Improve performance by optimizing slow database queries',
            'detailed_information': 'Identified several N+1 query issues and missing indexes. Should result in 40-50% performance improvement.',
            'column': 'done',
            'priority': 'medium',
            'assignee': 'Anna Smith',
            'order': 0
        },
        {
            'title': 'User Onboarding Tutorial',
            'description': 'Create interactive tutorial for new users',
            'detailed_information': 'Multi-step walkthrough highlighting key features. Should be skippable and accessible from help menu.',
            'column': 'backlog',
            'priority': 'low',
            'assignee': 'Anna Smith',
            'order': 1
        },
        {
            'title': 'Implement Task Search',
            'description': 'Add search functionality to filter tasks by title, description, or assignee',
            'detailed_information': 'Should support fuzzy search and filters by priority, status, and date ranges. Consider adding keyboard shortcuts.',
            'column': 'backlog',
            'priority': 'medium',
            'assignee': 'Anna Smith',
            'order': 2
        }
    ]
    
    # Create the tasks
    created_tasks = []
    for task_data in sample_tasks:
        task = Task.objects.create(
            owner=user,
            **task_data
        )
        created_tasks.append(task)
        print(f"Created task: '{task.title}' in column '{task.column}'")
    
    print(f"\n✅ Successfully created {len(created_tasks)} sample tasks for Anna!")
    print(f"\nLogin credentials for Anna:")
    print(f"Username: {username}")
    print(f"Password: {password}")
    print(f"\nTasks created:")
    print(f"  📋 Backlog: {len([t for t in created_tasks if t.column == 'backlog'])} tasks")
    print(f"  📝 To-Do: {len([t for t in created_tasks if t.column == 'todo'])} tasks") 
    print(f"  🔄 In Progress: {len([t for t in created_tasks if t.column == 'in_progress'])} tasks")
    print(f"  👀 Review: {len([t for t in created_tasks if t.column == 'review'])} tasks")
    print(f"  ✅ Done: {len([t for t in created_tasks if t.column == 'done'])} tasks")

if __name__ == '__main__':
    create_anna_user_and_tasks()