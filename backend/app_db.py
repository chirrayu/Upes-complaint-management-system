from pymongo import MongoClient
import portal_config

client = MongoClient(portal_config.MONGO_URI)
db = client[portal_config.DB_NAME]

# Collections
complaints_col = db["complaints"]
users_col = db["users"]
categories_col = db["categories"]
counters_col = db["counters"]
