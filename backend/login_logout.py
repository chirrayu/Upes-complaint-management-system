from flask import Blueprint, request, jsonify, make_response
from pymongo import MongoClient
import jwt
from datetime import datetime, timedelta
import config
from database import users_col
from middleware import token_required

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password') # In a real app, use hashed passwords

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Check against the email and password
    user = users_col.find_one({"email": email, "password": password}, {"_id": 0, "password": 0})
    
    if user:
        # Generate JWT Token
        token = jwt.encode({
            'user_id': user['id'],
            'role': user['role'],
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, config.SECRET_KEY, algorithm="HS256")
        
        response = make_response(jsonify({
            "message": "Login successful", 
            "user": user
        }))
        
        # Set HttpOnly Cookie
        response.set_cookie(
            'token',
            token,
            httponly=True,
            secure=False, # Set to True in production with HTTPS
            samesite='Lax',
            max_age=24 * 60 * 60 # 24 hours
        )
        
        return response, 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

@auth_bp.route('/api/me', methods=['GET'])
@token_required
def get_me():
    user = users_col.find_one({"id": request.user_id}, {"_id": 0, "password": 0})
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user), 200

@auth_bp.route('/api/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({"message": "Logout successful"}))
    response.set_cookie('token', '', expires=0)
    return response, 200
