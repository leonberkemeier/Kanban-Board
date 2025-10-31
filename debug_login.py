#!/usr/bin/env python3
"""
Debug script to test login API and identify the 400 error cause
"""
import json
import urllib.request
import urllib.error

def test_login(base_url="https://kanban.leonberkemeier.de"):
    """Test login with various configurations"""
    
    print("🔍 Debugging Login API")
    print("=" * 60)
    
    # Test 1: Simple POST with minimal headers
    print("\n1️⃣  Test: Minimal headers")
    try:
        data = json.dumps({"username": "testdrag", "password": "test123"}).encode('utf-8')
        req = urllib.request.Request(
            f"{base_url}/api/auth/login/",
            data=data,
            method='POST'
        )
        req.add_header('Content-Type', 'application/json')
        
        with urllib.request.urlopen(req) as response:
            print(f"   ✅ Status: {response.status}")
            print(f"   Response: {response.read().decode()}")
    except urllib.error.HTTPError as e:
        print(f"   ❌ HTTP {e.code}: {e.reason}")
        print(f"   Headers: {dict(e.headers)}")
        print(f"   Body: {e.read().decode()[:500]}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 2: GET request to check if endpoint exists
    print("\n2️⃣  Test: GET request to login endpoint")
    try:
        req = urllib.request.Request(f"{base_url}/api/auth/login/", method='GET')
        req.add_header('Accept', 'application/json')
        
        with urllib.request.urlopen(req) as response:
            print(f"   ✅ Status: {response.status}")
    except urllib.error.HTTPError as e:
        print(f"   Status: {e.code} (expected 405 Method Not Allowed)")
    
    # Test 3: Check API root
    print("\n3️⃣  Test: API root endpoint")
    try:
        req = urllib.request.Request(f"{base_url}/api/")
        req.add_header('Accept', 'application/json')
        
        with urllib.request.urlopen(req) as response:
            print(f"   ✅ Status: {response.status}")
            print(f"   Response: {response.read().decode()}")
    except urllib.error.HTTPError as e:
        print(f"   ❌ HTTP {e.code}")
        print(f"   Body: {e.read().decode()[:200]}")
    
    # Test 4: Check with all browser headers
    print("\n4️⃣  Test: With full browser headers")
    try:
        data = json.dumps({"username": "testdrag", "password": "test123"}).encode('utf-8')
        req = urllib.request.Request(
            f"{base_url}/api/auth/login/",
            data=data,
            method='POST',
            headers={
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0',
                'Origin': base_url,
                'Referer': f'{base_url}/login'
            }
        )
        
        with urllib.request.urlopen(req) as response:
            print(f"   ✅ Status: {response.status}")
            print(f"   Response: {response.read().decode()}")
    except urllib.error.HTTPError as e:
        print(f"   ❌ HTTP {e.code}")
        print(f"   Body: {e.read().decode()[:500]}")

if __name__ == "__main__":
    test_login()
