import requests
import uuid

BASE_URL = "http://127.0.0.1:8000"

def test_signup():
    random_email = f"user_{uuid.uuid4()}@example.com"
    payload = {
        "email": random_email,
        "password": "securepassword123",
        "full_name": "Test User"
    }
    print(f"Attempting signup with {random_email}...")
    try:
        response = requests.post(f"{BASE_URL}/auth/signup", json=payload)
        if response.status_code == 200:
            print("Signup Success:", response.json())
            return random_email
        else:
            print("Signup Failed:", response.text)
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
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=payload)
        if response.status_code == 200:
            print("Login Success:", response.json())
        else:
            print("Login Failed:", response.text)
    except Exception as e:
        print("Connection Error:", e)

if __name__ == "__main__":
    email = test_signup()
    test_login(email)
