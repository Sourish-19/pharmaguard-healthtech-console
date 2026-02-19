import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import requests
import time

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DB_NAME = os.getenv("DB_NAME", "precisionrx")

import certifi

async def test_mongo():
    print(f"Testing MongoDB Connection to: {DB_NAME}")
    try:
        start = time.time()
        client = AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=5000, tlsAllowInvalidCertificates=True)
        db = client[DB_NAME]
        # Force a connection check
        await client.server_info()
        end = time.time()
        print(f"SUCCESS: MongoDB Connection Success! Time: {end - start:.2f}s")
        
        # Check if users collection exists or is accessible
        count = await db.users.count_documents({})
        print(f"SUCCESS: Users collection accessible. Count: {count}")
        
    except Exception as e:
        print(f"FAILED: MongoDB Connection Failed: {e}")

def test_api():
    print("\nTesting Local API Endpoint (Login)...")
    url = "http://127.0.0.1:8000/auth/login"
    payload = {
        "email": "test@example.com",
        "password": "wrongpassword"
    }
    try:
        start = time.time()
        response = requests.post(url, json=payload)
        end = time.time()
        print(f"API Response Status: {response.status_code}")
        print(f"API Response Time: {end - start:.2f}s")
        print(f"API Response Body: {response.text}")
        if response.status_code in [400, 401, 200]:
            print("SUCCESS: API is reachable and handling requests.")
        else:
            print("WARNING: API returned unexpected status.")
    except Exception as e:
        print(f"FAILED: API Connection Failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_mongo())
    test_api()
