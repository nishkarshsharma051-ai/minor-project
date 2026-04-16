from flask import Blueprint, request, jsonify
from models.user_model import UserProfile, db
from utils.auth_middleware import token_required

user_bp = Blueprint("user", __name__)

@user_bp.route("/profile", methods=["GET"])
@token_required
def get_profile():
    uid = request.user["uid"]
    email = request.user.get("email")
    
    user = UserProfile.query.filter_by(firebase_uid=uid).first()
    
    if not user:
        # Auto-create profile if it doesn't exist
        user = UserProfile(firebase_uid=uid, email=email, name=request.user.get("name", "New User"))
        db.session.add(user)
        db.session.commit()
    
    return jsonify(user.to_dict()), 200

@user_bp.route("/profile", methods=["POST"])
@token_required
def update_profile():
    uid = request.user["uid"]
    data = request.json
    
    user = UserProfile.query.filter_by(firebase_uid=uid).first()
    
    if not user:
        return jsonify({"error": "Profile not found"}), 404
        
    # Update fields
    if "name" in data: user.name = data["name"]
    if "role" in data: user.role = data["role"]
    if "department" in data: user.department = data["department"]
    if "institution" in data: user.institution = data["institution"]
    
    db.session.commit()
    
    return jsonify(user.to_dict()), 200
