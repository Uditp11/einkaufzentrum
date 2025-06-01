from flask import Blueprint, request, jsonify
from models.user import User
from extensions import db
from datetime import datetime, timedelta
import jwt
from werkzeug.security import check_password_hash
from flask_cors import cross_origin
from config import Config

user_bp = Blueprint("user", __name__, url_prefix="/api/users")

@user_bp.route("/signup", methods=["POST"])
@cross_origin()
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
@cross_origin()
def login():
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({"error": "Missing email or password"}), 400

        user = User.query.filter_by(email=data["email"]).first()
        
        if not user:
            return jsonify({"error": "Email not found"}), 401

        if not user.check_password(data["password"]):
            return jsonify({"error": "Invalid password"}), 401

        if user.status != 'Active':
            return jsonify({"error": "Account is not active"}), 403

        # Generate JWT token
        token = jwt.encode(
            {
                'user_id': user.user_id,
                'email': user.email,
                'exp': datetime.utcnow() + timedelta(days=1)  # Token expires in 1 day
            },
            Config.SECRET_KEY,
            algorithm='HS256'
        )

        return jsonify({
            "message": "Login successful",
            "user_id": user.user_id,
            "email": user.email,
            "token": token,
            "full_name": user.full_name
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_bp.route("/verify-token", methods=["POST"])
@cross_origin()
def verify_token():
    try:
        token = request.json.get('token')
        if not token:
            return jsonify({"error": "Token is missing"}), 401

        try:
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
            user = User.query.get(data['user_id'])
            
            if not user or user.status != 'Active':
                return jsonify({"error": "Invalid user"}), 401

            return jsonify({
                "valid": True,
                "user_id": user.user_id,
                "email": user.email
            }), 200

        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Utility function to protect routes
def token_required(f):
    from functools import wraps
    
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')

        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(" ")[1]

        if not token:
            return jsonify({'error': 'Token is missing'}), 401

        try:
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
            
            if not current_user or current_user.status != 'Active':
                return jsonify({'error': 'Invalid user'}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        except Exception as e:
            return jsonify({'error': str(e)}), 500

        return f(current_user, *args, **kwargs)

    return decorated