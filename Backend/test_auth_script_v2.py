import urllib.request
import json
import uuid
import sys

BASE_URL = "http://127.0.0.1:8000"

def test_signup():
    random_email = f"user_{uuid.uuid4()}@example.com"
    payload = {
        "email": random_email,
        "password": "securepassword123",
        "full_name": "Test User"
    }
    print(f"Attempting signup with {random_email}...")
    
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(f"{BASE_URL}/auth/signup", data=data, method='POST')
    req.add_header('Content-Type', 'application/json')
    
    try:
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                resp_data = response.read().decode()
                print("Signup Success:", resp_data)
                return random_email
            else:
                print("Signup Failed:", response.read().decode())
                return None
    except urllib.error.HTTPError as e:
        print("HTTP Error:", e.code, e.read().decode())
        return None
    except Exception as e:
        print("Connection Error:", e)
        return None

def test_login(email):
    if not email:
        return
    payload = {
        "email": email,
        "password": "securepassword123"
    }
    print(f"Attempting login with {email}...")
    
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(f"{BASE_URL}/auth/login", data=data, method='POST')
    req.add_header('Content-Type', 'application/json')
    
    try:
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                print("Login Success:", response.read().decode())
            else:
                print("Login Failed:", response.read().decode())
    except urllib.error.HTTPError as e:
        print("HTTP Error:", e.code, e.read().decode())
    except Exception as e:
        print("Connection Error:", e)

if __name__ == "__main__":
    email = test_signup()
    test_login(email)
