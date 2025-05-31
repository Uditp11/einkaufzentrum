from flask import Blueprint, request, jsonify
from models.user import User
from extensions import db
from datetime import datetime

user_bp = Blueprint("user", __name__, url_prefix="/api/users")

@user_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    if not all(k in data for k in ("full_name", "email", "password")):
        return jsonify({"error": "Missing required fields"}), 400
    
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already registered"}), 400

    user = User(
        full_name=data["full_name"],
        email=data["email"],
        joined_date=datetime.utcnow()
    )
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()
    
    return jsonify({"message": "User registered successfully"}), 201

@user_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data["email"]).first()
    
    if user and user.check_password(data["password"]):
        return jsonify({"message": "Login successful", "user_id": user.user_id}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401