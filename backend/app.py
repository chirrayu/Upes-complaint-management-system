import os
import sys

# Ensure the backend directory is in the python path for Render
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, jsonify
from flask_cors import CORS
from login_logout import auth_bp
from user_update import user_update_bp
from complaint import complaint_bp
from pymongo import MongoClient

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Register Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(user_update_bp)
app.register_blueprint(complaint_bp)

from app_db import categories_col, users_col

@app.route('/api/categories', methods=['GET'])
def get_categories():
    categories = list(categories_col.find({}, {"_id": 0}))
    return jsonify(categories), 200

# Endpoint to fetch all users (needed by admin panel)
@app.route('/api/users', methods=['GET'])
def get_users():
    users = list(users_col.find({}, {"_id": 0}))
    return jsonify(users), 200

if __name__ == '__main__':
    import os
    # Print success message safely
    print("[SUCCESS] Flask server starting...")
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
