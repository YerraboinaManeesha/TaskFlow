import os
from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)

db = client["taskflow"]

users_collection = db["users"]
tasks_collection = db["tasks"]
projects_collection = db["projects"]