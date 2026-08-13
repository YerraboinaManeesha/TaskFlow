from pymongo import MongoClient

# MongoDB Atlas connection string
MONGO_URI = "mongodb+srv://taskflow_user:Taskflow%402026@cluster0.klrf1r5.mongodb.net/?appName=Cluster0"

# Create MongoDB client
client = MongoClient(MONGO_URI)

# Select database
db = client["taskflow"]

# Collections
users_collection = db["users"]
tasks_collection = db["tasks"]
projects_collection = db["projects"]