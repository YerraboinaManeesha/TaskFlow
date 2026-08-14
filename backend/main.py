from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from bson import ObjectId

from database import (
    users_collection,
    tasks_collection,
    projects_collection
)


# APP

app = FastAPI()


# CORS

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://taskflow-app-8b7p.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# MODELS

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    confirmPassword: str


class LoginRequest(BaseModel):
    email: str
    password: str


class ResetPasswordRequest(BaseModel):
    email: str
    newPassword: str
    confirmPassword: str


class TaskRequest(BaseModel):
    title: str
    description: str = ""
    priority: str
    dueDate: str = ""
    email: str


class ProjectRequest(BaseModel):
    name: str
    description: str = ""
    url: str = ""
    email: str


# HOME

@app.get("/")
def home():
    return {
        "message": "TaskFlow API is running!"
    }


# SIGNUP

@app.post("/signup")
def signup(user: SignupRequest):

    if user.password != user.confirmPassword:
        raise HTTPException(
            status_code=400,
            detail="Passwords do not match"
        )

    existing_user = users_collection.find_one({
        "email": user.email
    })

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    users_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "password": user.password
    })

    return {
        "message": "Account created successfully"
    }


# LOGIN

@app.post("/login")
def login(user: LoginRequest):

    existing_user = users_collection.find_one({
        "email": user.email,
        "password": user.password
    })

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return {
        "message": "Login successful",
        "name": existing_user["name"],
        "email": existing_user["email"]
    }


# RESET PASSWORD

@app.post("/reset-password")
def reset_password(data: ResetPasswordRequest):

    if data.newPassword != data.confirmPassword:
        raise HTTPException(
            status_code=400,
            detail="Passwords do not match"
        )

    if len(data.newPassword) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters"
        )

    existing_user = users_collection.find_one({
        "email": data.email
    })

    if not existing_user:
        raise HTTPException(
            status_code=404,
            detail="Email not registered"
        )

    result = users_collection.update_one(
        {
            "_id": existing_user["_id"]
        },
        {
            "$set": {
                "password": data.newPassword
            }
        }
    )

    if result.modified_count == 0:
        raise HTTPException(
            status_code=500,
            detail="Password could not be updated"
        )

    return {
        "message": "Password updated successfully"
    }


# CREATE TASK

@app.post("/tasks")
def create_task(task: TaskRequest):

    new_task = {
        "title": task.title,
        "description": task.description,
        "priority": task.priority,
        "dueDate": task.dueDate,
        "status": "Pending",
        "email": task.email
    }

    result = tasks_collection.insert_one(new_task)

    return {
        "message": "Task created successfully",
        "task_id": str(result.inserted_id)
    }


# GET TASKS

@app.get("/tasks")
def get_tasks(email: str):

    tasks = list(
        tasks_collection.find({
            "email": email
        })
    )

    for task in tasks:
        task["_id"] = str(task["_id"])

    return tasks


# COMPLETE TASK

@app.put("/tasks/{task_id}/complete")
def complete_task(
    task_id: str,
    email: str
):

    try:
        object_id = ObjectId(task_id)

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid task ID"
        )

    result = tasks_collection.update_one(
        {
            "_id": object_id,
            "email": email
        },
        {
            "$set": {
                "status": "Completed"
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    return {
        "message": "Task completed successfully"
    }


# DELETE TASK

@app.delete("/tasks/{task_id}")
def delete_task(
    task_id: str,
    email: str
):

    try:
        object_id = ObjectId(task_id)

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid task ID"
        )

    result = tasks_collection.delete_one(
        {
            "_id": object_id,
            "email": email
        }
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    return {
        "message": "Task deleted successfully"
    }


# CREATE PROJECT

@app.post("/projects")
def create_project(project: ProjectRequest):

    new_project = {
        "name": project.name,
        "description": project.description,
        "url": project.url,
        "email": project.email
    }

    result = projects_collection.insert_one(new_project)

    return {
        "message": "Project created successfully",
        "project_id": str(result.inserted_id)
    }


# GET PROJECTS

@app.get("/projects")
def get_projects(email: str):

    projects = list(
        projects_collection.find({
            "email": email
        })
    )

    for project in projects:
        project["_id"] = str(project["_id"])

    return projects


# DELETE PROJECT

@app.delete("/projects/{project_id}")
def delete_project(
    project_id: str,
    email: str
):

    try:
        object_id = ObjectId(project_id)

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid project ID"
        )

    result = projects_collection.delete_one(
        {
            "_id": object_id,
            "email": email
        }
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    return {
        "message": "Project deleted successfully"
    }