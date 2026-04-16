import firebase_admin
from firebase_admin import auth, credentials
from flask import request, jsonify, current_app
from functools import wraps
import os

def init_firebase():
    """Initializes the Firebase Admin SDK."""
    if not firebase_admin._apps:
        # 1. Check for raw JSON string in environment (ideal for Render/Vercel)
        service_account_json = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON")
        if service_account_json:
            import json
            try:
                cred_dict = json.loads(service_account_json)
                cred = credentials.Certificate(cred_dict)
                firebase_admin.initialize_app(cred)
                print("Firebase Admin initialized via JSON environmental variable.")
                return
            except Exception as e:
                print(f"FAILED to initialize Firebase via JSON env var: {e}")

        # 2. Fallback to file path
        cred_path = os.environ.get("FIREBASE_SERVICE_ACCOUNT", "serviceAccountKey.json")
        abs_cred_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', cred_path))
        
        if os.path.exists(abs_cred_path):
            cred = credentials.Certificate(abs_cred_path)
            firebase_admin.initialize_app(cred)
            print(f"Firebase Admin initialized via file: {abs_cred_path}")
        else:
            print(f"CRITICAL: Firebase service account key not found at {abs_cred_path}")

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        id_token = None
        
        # Look for the token in the Authorization header
        if "Authorization" in request.headers:
            parts = request.headers["Authorization"].split(" ")
            if len(parts) == 2 and parts[0] == "Bearer":
                id_token = parts[1]
        
        if not id_token:
            return jsonify({
                "error": "Authentication required",
                "message": "Bearer token missing from Authorization header"
            }), 401
        
        try:
            # Verify the token
            decoded_token = auth.verify_id_token(id_token)
            # Add user info to the request for use in the route
            request.user = decoded_token
        except Exception as e:
            return jsonify({
                "error": "Invalid token",
                "message": str(e)
            }), 401
        
        return f(*args, **kwargs)
    
    return decorated
