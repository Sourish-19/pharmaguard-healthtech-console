try:
    from google import genai
    print("SUCCESS: google-genai imported successfully.")
    print(f"File location: {genai.__file__}")
except ImportError as e:
    print(f"FAILED: {e}")
except Exception as e:
    print(f"ERROR: {e}")
