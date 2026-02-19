import sys
import os

# Add current directory to sys.path to mimic uvicorn behavior
sys.path.append(os.getcwd())

try:
    from app.main import app
    print("SUCCESS: app.main imported successfully")
except Exception as e:
    print(f"FAILED: {e}")
except IndentationError as e:
    print(f"FAILED: IndentationError: {e}")
except SyntaxError as e:
    print(f"FAILED: SyntaxError: {e}")
