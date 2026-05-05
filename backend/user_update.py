from flask import Blueprint, request, jsonify
from pymongo import MongoClient
import uuid

from app_db import users_col

user_update_bp = Blueprint('user_update', __name__)

from auth_middleware import token_required

@user_update_bp.route('/api/users', methods=['POST'])
@token_required
def add_user():
    # Only admin can manage users
    if request.user_role != 'admin':
        return jsonify({"error": "Unauthorized"}), 403
        
    data = request.json
    if not data.get('email') or not data.get('name'):
        return jsonify({"error": "Name and email are required"}), 400
    
    # Check if user already exists
    if users_col.find_one({"email": data['email']}):
        return jsonify({"error": "User with this email already exists"}), 400

    user = {
        "id": str(uuid.uuid4()),
        "name": data['name'],
        "email": data['email'],
        "password": data.get('password', 'upes123'), # Default password if not provided
        "role": data.get('role', 'student'),
        "studentId": data.get('studentId', ''),
        "department": data.get('department', ''),
        "assignedComplaints": 0
    }
    
    users_col.insert_one(user)
    if "_id" in user: del user["_id"]
    if "password" in user: del user["password"] # Don't return password in response
    return jsonify(user), 201

@user_update_bp.route('/api/users/<string:user_id>', methods=['DELETE'])
@token_required
def remove_user(user_id):
    if request.user_role != 'admin':
        return jsonify({"error": "Unauthorized"}), 403
    result = users_col.delete_one({"id": user_id})
    if result.deleted_count == 0:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"message": "User removed successfully"}), 200

@user_update_bp.route('/api/users/<string:user_id>', methods=['PUT', 'PATCH'])
@token_required
def edit_user(user_id):
    if request.user_role != 'admin':
        return jsonify({"error": "Unauthorized"}), 403
    data = request.json
    result = users_col.update_one({"id": user_id}, {"$set": data})
    if result.matched_count == 0:
        return jsonify({"error": "User not found"}), 404
    
    updated_user = users_col.find_one({"id": user_id}, {"_id": 0})
    return jsonify(updated_user), 200
