#!/usr/bin/env python
import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User

def create_test_user():
    username = 'testuser'
    email = 'test@example.com'
    password = 'testpass123'
    
    # Check if user already exists
    if User.objects.filter(username=username).exists():
        print(f"User '{username}' already exists.")
        user = User.objects.get(username=username)
        # Update password in case it was changed
        user.set_password(password)
        user.save()
        print(f"Password updated for user '{username}'.")
    else:
        # Create new user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name='Test',
            last_name='User'
        )
        print(f"Created user '{username}' with password '{password}'")
    
    print(f"\nLogin credentials:")
    print(f"Username: {username}")
    print(f"Password: {password}")

if __name__ == '__main__':
    create_test_user()