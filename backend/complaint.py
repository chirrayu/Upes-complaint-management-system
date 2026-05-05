from flask import Blueprint, request, jsonify
from pymongo import MongoClient, ReturnDocument
from datetime import datetime
import threading
import send_email

from database import complaints_col, counters_col, users_col

complaint_bp = Blueprint('complaint', __name__)

def get_next_complaint_id():
    try:
        result = counters_col.find_one_and_update(
            {"_id": "complaint_id"},
            {"$inc": {"sequence_value": 1}},
            upsert=True,
            return_document=ReturnDocument.AFTER
        )
        return result["sequence_value"]
    except Exception:
        return None

def run_async(target, *args):
    def wrapper():
        try:
            target(*args)
        except Exception as e:
            print(f"[ASYNC ERROR] Error in background thread: {e}")
            
    thread = threading.Thread(target=wrapper)
    thread.start()

def get_least_busy_staff():
    """Finds the staff member with the lowest count of active complaints."""
    staff_members = list(users_col.find({"role": "staff"}))
    if not staff_members:
        return None
    
    least_busy = None
    min_complaints = float('inf')
    
    for staff in staff_members:
        # Count complaints that are NOT resolved and assigned to this staff
        count = complaints_col.count_documents({
            "assignedTo": staff['name'],
            "status": {"$ne": "resolved"}
        })
        
        if count < min_complaints:
            min_complaints = count
            least_busy = staff
            
    return least_busy

from middleware import token_required

@complaint_bp.route('/api/complaints', methods=['POST'])
@token_required
def file_complaint():
    # Only students should file complaints, or admin
    if request.user_role not in ['student', 'admin']:
        return jsonify({"error": "Unauthorized"}), 403
        
    data = request.json
    title = data.get('title')
    description = data.get('description')
    category = data.get('category')
    student_email = data.get('email', 'chirrayusharma@gmail.com')
    student_name = data.get('name', 'Student User')

    if not title or not description or not category:
        return jsonify({"error": "Missing required fields"}), 400

    next_id = get_next_complaint_id()
    if next_id is None:
        return jsonify({"error": "ID generation failed"}), 500
    
    string_id = f"CMP-{next_id:04d}"

    complaint = {
        "id": string_id,
        "title": title,
        "description": description,
        "category": category,
        "status": "pending",
        "priority": data.get("priority", "medium"),
        "date": datetime.utcnow().isoformat() + "Z",
        "name": student_name,
        "email": student_email,
        "remarks": []
    }

    # Automatically assign to the least busy staff
    staff = get_least_busy_staff()
    if staff:
        complaint["assignedTo"] = staff['name']
        complaint["assignedDate"] = datetime.utcnow().isoformat() + "Z"
        
    complaints_col.insert_one(complaint)
    if "_id" in complaint: del complaint["_id"]

    # Trigger Emails
    run_async(send_email.send_complaint_submitted, student_email, student_name, string_id, title)
    if staff:
        # Redirecting staff notification to Admin for reliability
        import portal_config
        run_async(send_email.send_complaint_assigned, portal_config.SENDER_EMAIL, staff['name'], string_id, student_email, student_name)

    return jsonify(complaint), 201

@complaint_bp.route('/api/complaints/<string:id>/assign', methods=['PATCH'])
@token_required
def assign_complaint(id):
    # Only admin should assign staff
    if request.user_role != 'admin':
        return jsonify({"error": "Unauthorized"}), 403
        
    """Manually assign to a specific staff OR auto-assign if none provided."""
    data = request.json
    staff_name = data.get('assignedTo')
    
    if not staff_name:
        staff = get_least_busy_staff()
        if not staff:
            return jsonify({"error": "No staff available for assignment"}), 400
        staff_name = staff['name']
    else:
        # Validate that the staff member exists
        staff = users_col.find_one({"name": staff_name, "role": "staff"})
        if not staff:
            return jsonify({"error": f"Staff member '{staff_name}' not found"}), 404

    result = complaints_col.update_one(
        {"id": id},
        {"$set": {"assignedTo": staff_name, "assignedDate": datetime.utcnow().isoformat() + "Z"}}
    )
    
    if result.matched_count == 0:
        return jsonify({"error": "Complaint not found"}), 404

    # Trigger Email Notification
    complaint = complaints_col.find_one({"id": id})
    staff = users_col.find_one({"name": staff_name, "role": "staff"})
    if staff and complaint:
        import portal_config
        run_async(send_email.send_complaint_assigned, 
                  portal_config.SENDER_EMAIL, 
                  staff['name'], 
                  id, 
                  complaint.get('email'), 
                  complaint.get('name'))

    return jsonify({"message": "Assigned to " + staff_name}), 200

@complaint_bp.route('/api/complaints/<string:id>/status', methods=['PATCH'])
@token_required
def update_status(id):
    # Only admin and staff can change status
    if request.user_role not in ['admin', 'staff']:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.json
    new_status = data.get('status')
    
    if not new_status:
        return jsonify({"error": "Status is required"}), 400
        
    complaint = complaints_col.find_one({"id": id})
    if not complaint:
        return jsonify({"error": "Complaint not found"}), 404
        
    old_status = complaint.get("status")
    
    complaints_col.update_one({"id": id}, {"$set": {"status": new_status}})
    
    student_email = complaint.get("email")
    student_name = complaint.get("name")
    
    if student_email and student_name:
        run_async(send_email.send_status_updated, student_email, student_name, id, old_status, new_status)
        if new_status == "resolved":
            run_async(send_email.send_complaint_resolved, student_email, student_name, id)
            
    return jsonify({"message": "Status updated successfully"}), 200

@complaint_bp.route('/api/complaints/<string:id>/remarks', methods=['POST'])
def add_remark(id):
    data = request.json
    text = data.get('text')
    author = data.get('author', 'Staff Member')
    
    if not text:
        return jsonify({"error": "Remark text is required"}), 400
        
    complaint = complaints_col.find_one({"id": id})
    if not complaint:
        return jsonify({"error": "Complaint not found"}), 404
        
    remark = {
        "text": text,
        "date": datetime.utcnow().isoformat() + "Z",
        "author": author
    }
    
    complaints_col.update_one(
        {"id": id}, 
        {"$push": {"remarks": remark}}
    )
    
    student_email = complaint.get("email")
    student_name = complaint.get("name")
    
    if student_email and student_name:
        run_async(send_email.send_staff_comment, student_email, student_name, id, text)
    
    return jsonify(remark), 201

@complaint_bp.route('/api/complaints/<string:id>', methods=['DELETE'])
def delete_complaint(id):
    result = complaints_col.delete_one({"id": id})
    if result.deleted_count == 0:
        return jsonify({"error": "Complaint not found"}), 404
    return jsonify({"message": "Complaint deleted successfully"}), 200

@complaint_bp.route('/api/complaints', methods=['GET'])
def get_all_complaints():
    complaints = list(complaints_col.find({}, {"_id": 0}))
    return jsonify(complaints), 200
