from pymongo import MongoClient
from datetime import datetime, timedelta

from database import db

# Initializing counter for future complaints
db["counters"].insert_one({"_id": "complaint_id", "sequence_value": 0})

users = [
    {"id": "1", "name": "Chirrayu_staff_id", "email": "Chirrayu.26085@upes.ac.in", "password": "monty@1828", "role": "staff", "department": "Facilities", "assignedComplaints": 2},
    {"id": "2", "name": "Chirrayu_admin_id", "email": "chirrayusharma@gmail.com", "password": "monty@1828", "role": "admin", "assignedComplaints": 0},
    {"id": "3", "name": "Chirrayu_student_id", "email": "backupchirrayusharma@gmail.com", "password": "monty@1828", "role": "student", "studentId": "590026085", "assignedComplaints": 0}
]

categories = [
    {"id": "1", "name": "Infrastructure", "description": "Building maintenance, AC, electrical issues", "color": "#1e3a8a", "complaintCount": 1},
    {"id": "2", "name": "Academics", "description": "Course-related, lab equipment, library", "color": "#06b6d4", "complaintCount": 1},
    {"id": "3", "name": "Facilities", "description": "WiFi, canteen, hostel services", "color": "#ec4899", "complaintCount": 2},
    {"id": "4", "name": "Other", "description": "General complaints and suggestions", "color": "#f97316", "complaintCount": 0}
]

print("Inserting users...")
db["users"].insert_many(users)
print("Inserting categories...")
db["categories"].insert_many(categories)

print("hogaya 🤣🤣 now the data should be seeded in the database")
