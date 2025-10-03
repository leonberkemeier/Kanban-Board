#!/usr/bin/env python3
"""
Test script for Kanban Board Authentication

This script demonstrates:
1. User registration
2. User login
3. Creating tasks with authentication
4. Accessing protected endpoints

Usage: python test_auth.py [base_url]
Example: python test_auth.py http://localhost:8001
"""

import requests
import json
import sys


def test_authentication(base_url="http://localhost:8001"):
    """Test the complete authentication flow"""
    
    print("🔐 Testing Kanban Board Authentication System")
    print("=" * 50)
    
    # 1. Test Registration
    print("\n1️⃣  Testing User Registration...")
    register_data = {
        "username": "demo_user",
        "email": "demo@example.com",
        "first_name": "Demo",
        "last_name": "User",
        "password": "demo_password123",
        "password_confirm": "demo_password123"
    }
    
    try:
        response = requests.post(f"{base_url}/api/auth/register/", 
                               json=register_data, 
                               timeout=10)
        if response.status_code == 201:
            print("   ✅ Registration successful!")
            user_data = response.json()
            access_token = user_data["tokens"]["access"]
            refresh_token = user_data["tokens"]["refresh"]
            print(f"   👤 User: {user_data['user']['username']} (ID: {user_data['user']['id']})")
        else:
            print(f"   ❌ Registration failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return
    except requests.exceptions.ConnectionError:
        print(f"   ❌ Cannot connect to {base_url}")
        print("   Make sure the server is running!")
        return
    except Exception as e:
        print(f"   ❌ Registration error: {e}")
        return

    # 2. Test Login
    print("\n2️⃣  Testing User Login...")
    login_data = {
        "username": "demo_user",
        "password": "demo_password123"
    }
    
    response = requests.post(f"{base_url}/api/auth/login/", json=login_data)
    if response.status_code == 200:
        print("   ✅ Login successful!")
        login_result = response.json()
        access_token = login_result["tokens"]["access"]  # Use fresh token
    else:
        print(f"   ❌ Login failed: {response.status_code}")
        return

    # 3. Test accessing protected endpoint without auth
    print("\n3️⃣  Testing Protected Endpoint (without auth)...")
    response = requests.get(f"{base_url}/api/tasks/")
    if response.status_code == 401:
        print("   ✅ Endpoint properly protected! (401 Unauthorized)")
    else:
        print(f"   ⚠️  Unexpected status: {response.status_code}")

    # 4. Test accessing protected endpoint with auth
    print("\n4️⃣  Testing Protected Endpoint (with auth)...")
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(f"{base_url}/api/tasks/", headers=headers)
    if response.status_code == 200:
        tasks = response.json()
        print(f"   ✅ Authentication working! Found {len(tasks)} tasks")
    else:
        print(f"   ❌ Auth failed: {response.status_code}")

    # 5. Test creating a task
    print("\n5️⃣  Testing Task Creation...")
    task_data = {
        "title": "Test Task via API",
        "description": "This task was created through the authentication test",
        "column": "todo",
        "priority": "medium",
        "assignee": "demo_user"
    }
    
    response = requests.post(f"{base_url}/api/tasks/", 
                           json=task_data, 
                           headers=headers)
    if response.status_code == 201:
        task = response.json()
        print("   ✅ Task created successfully!")
        print(f"   📝 Task: {task['title']} (Owner: {task['owner_username']})")
    else:
        print(f"   ❌ Task creation failed: {response.status_code}")

    # 6. Test user info endpoint
    print("\n6️⃣  Testing User Info...")
    response = requests.get(f"{base_url}/api/auth/me/", headers=headers)
    if response.status_code == 200:
        user_info = response.json()
        print("   ✅ User info retrieved!")
        print(f"   👤 {user_info['user']['first_name']} {user_info['user']['last_name']} ({user_info['user']['username']})")
    else:
        print(f"   ❌ User info failed: {response.status_code}")

    print("\n🎉 Authentication testing complete!")
    print("\n🔗 Available endpoints:")
    print(f"   • API Root: {base_url}/api/")
    print(f"   • Register: {base_url}/api/auth/register/")
    print(f"   • Login: {base_url}/api/auth/login/")
    print(f"   • Tasks: {base_url}/api/tasks/")
    print(f"   • User Profile: {base_url}/api/auth/me/")


if __name__ == "__main__":
    base_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8001"
    test_authentication(base_url)