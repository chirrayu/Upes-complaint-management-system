from pymongo import MongoClient
from datetime import datetime, timedelta

from database import db

print("Clearing old data from collections...")
db["users"].delete_many({})
db["categories"].delete_many({})
db["complaints"].delete_many({})
db["counters"].delete_many({})

# Initializing counter for future complaints
db["counters"].insert_one({"_id": "complaint_id", "sequence_value": 4})

users = [
    {"id": "1", "name": "John Smith", "email": "john.smith@upes.ac.in", "password": "staff123", "role": "staff", "department": "IT Support", "assignedComplaints": 8},
    {"id": "2", "name": "Sarah Johnson", "email": "sarah.j@upes.ac.in", "password": "staff123", "role": "staff", "department": "Facilities", "assignedComplaints": 12},
    {"id": "3", "name": "Admin User", "email": "admin@upes.ac.in", "password": "admin123", "role": "admin", "assignedComplaints": 0},
    {"id": "4", "name": "Student User", "email": "student@upes.ac.in", "password": "student123", "role": "student", "studentId": "UPES2024001", "assignedComplaints": 0}
]

categories = [
    {"id": "1", "name": "Infrastructure", "description": "Building maintenance, AC, electrical issues", "color": "#1e3a8a", "complaintCount": 1},
    {"id": "2", "name": "Academics", "description": "Course-related, lab equipment, library", "color": "#06b6d4", "complaintCount": 1},
    {"id": "3", "name": "Facilities", "description": "WiFi, canteen, hostel services", "color": "#ec4899", "complaintCount": 2},
    {"id": "4", "name": "Other", "description": "General complaints and suggestions", "color": "#f97316", "complaintCount": 0}
]

now = datetime.utcnow()

complaints = [
    {
      "id": "CMP-0001",
      "title": "Broken AC in Library",
      "description": "The air conditioning unit in the main library is not working properly. Temperature is too high.",
      "category": "Infrastructure",
      "status": "resolved",
      "priority": "high",
      "date": (now - timedelta(days=2)).isoformat() + "Z",
      "name": "Student User",
      "email": "student@upes.ac.in",
      "assignedTo": "John Smith",
      "assignedDate": (now - timedelta(days=2)).isoformat() + "Z",
      "remarks": [
        { "text": "AC unit has been repaired", "date": (now - timedelta(days=1)).isoformat() + "Z", "author": "John Smith" }
      ]
    },
    {
      "id": "CMP-0002",
      "title": "WiFi connectivity issues in Block A",
      "description": "Students are facing frequent disconnections in Block A classrooms.",
      "category": "Facilities",
      "status": "in-progress",
      "priority": "medium",
      "date": (now - timedelta(days=5)).isoformat() + "Z",
      "name": "Student User",
      "email": "student@upes.ac.in",
      "assignedTo": "Sarah Johnson",
      "assignedDate": (now - timedelta(days=4)).isoformat() + "Z",
      "remarks": [
        { "text": "Investigating the router in Block A", "date": (now - timedelta(days=3)).isoformat() + "Z", "author": "Sarah Johnson" }
      ]
    },
    {
      "id": "CMP-0003",
      "title": "Lab equipment not working",
      "description": "Several computers in Lab 301 are not functioning.",
      "category": "Academics",
      "status": "pending",
      "priority": "low",
      "date": (now - timedelta(days=7)).isoformat() + "Z",
      "name": "Student User",
      "email": "student@upes.ac.in",
      "remarks": []
    },
    {
      "id": "CMP-0004",
      "title": "Canteen food quality issue",
      "description": "Food quality has decreased in the main canteen.",
      "category": "Facilities",
      "status": "pending",
      "priority": "medium",
      "date": (now - timedelta(days=1)).isoformat() + "Z",
      "name": "Student User",
      "email": "student@upes.ac.in",
      "remarks": []
    }
]

print("Inserting users...")
db["users"].insert_many(users)
print("Inserting categories...")
db["categories"].insert_many(categories)
print("Inserting complaints...")
db["complaints"].insert_many(complaints)

print("[SUCCESS] Database seeded successfully!")
