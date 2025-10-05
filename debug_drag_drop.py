#!/usr/bin/env python3

import requests
import json

# Test the drag and drop functionality from Python to understand the issue

def test_drag_drop_api():
    base_url = "http://localhost:8001/api"
    
    print("=== Debugging Drag and Drop API ===\n")
    
    # Step 1: Login and get token
    print("1. Testing authentication...")
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    
    try:
        login_response = requests.post(f"{base_url}/auth/login/", json=login_data)
        login_response.raise_for_status()
        tokens = login_response.json()["tokens"]
        access_token = tokens["access"]
        print("✅ Authentication successful")
        print(f"   Access token (first 50 chars): {access_token[:50]}...")
    except Exception as e:
        print(f"❌ Authentication failed: {e}")
        return
    
    # Step 2: Get current tasks
    print("\n2. Fetching current tasks...")
    headers = {"Authorization": f"Bearer {access_token}"}
    
    try:
        tasks_response = requests.get(f"{base_url}/tasks/", headers=headers)
        tasks_response.raise_for_status()
        tasks = tasks_response.json()
        print(f"✅ Found {len(tasks)} tasks")
        
        # Show current task distribution
        columns = {}
        for task in tasks:
            col = task["column"]
            if col not in columns:
                columns[col] = []
            columns[col].append(f"ID:{task['id']} '{task['title'][:30]}' (order:{task['order']})")
        
        print("   Current task distribution:")
        for col, task_list in columns.items():
            print(f"     {col}: {len(task_list)} tasks")
            for task_desc in task_list[:3]:  # Show first 3 tasks
                print(f"       - {task_desc}")
        
    except Exception as e:
        print(f"❌ Failed to fetch tasks: {e}")
        return
    
    # Step 3: Test update_positions endpoint
    print("\n3. Testing drag and drop (update_positions)...")
    
    if not tasks:
        print("❌ No tasks available to test with")
        return
    
    # Find a task to move
    test_task = tasks[0]
    original_column = test_task["column"]
    target_column = "in_progress" if original_column != "in_progress" else "todo"
    
    print(f"   Moving task {test_task['id']} '{test_task['title'][:30]}'")
    print(f"   From: {original_column} -> To: {target_column}")
    
    # Create payload (simulate what frontend would send)
    payload = {
        "tasks": [
            {
                "id": test_task["id"],
                "column": target_column,
                "order": 0
            }
        ]
    }
    
    try:
        update_response = requests.post(
            f"{base_url}/tasks/update_positions/",
            json=payload,
            headers=headers
        )
        print(f"   HTTP Status: {update_response.status_code}")
        print(f"   Response: {update_response.text}")
        
        update_response.raise_for_status()
        print("✅ Drag and drop API call successful")
        
        # Step 4: Verify the change
        print("\n4. Verifying the change...")
        verify_response = requests.get(f"{base_url}/tasks/", headers=headers)
        verify_response.raise_for_status()
        updated_tasks = verify_response.json()
        
        updated_task = next((t for t in updated_tasks if t["id"] == test_task["id"]), None)
        if updated_task:
            print(f"✅ Task successfully moved to column: {updated_task['column']}")
            if updated_task["column"] == target_column:
                print("✅ Column update confirmed in database")
            else:
                print(f"❌ Column mismatch! Expected: {target_column}, Got: {updated_task['column']}")
        else:
            print("❌ Could not find updated task")
            
    except Exception as e:
        print(f"❌ Drag and drop API call failed: {e}")
        if hasattr(e, 'response') and e.response:
            print(f"   Response status: {e.response.status_code}")
            print(f"   Response text: {e.response.text}")
    
    print("\n=== Test Complete ===")

if __name__ == "__main__":
    test_drag_drop_api()