# Task Management API Documentation

## Overview

This is a RESTful API for task management with user authentication. The API allows users to create, read, update, delete, and reorder tasks with filtering capabilities.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All task-related endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Data Models

### User Model

```json
{
  "_id": "ObjectId",
  "name": "String (required)",
  "username": "String (required, unique)",
  "email": "String (required, unique)",
  "password": "String (required, hashed)",
  "role": "String (enum: ['user', 'admin'], default: 'user')",
  "createdAt": "Date"
}
```

### Task Model

```json
{
  "_id": "ObjectId",
  "title": "String (required, max: 150)",
  "description": "String (optional)",
  "status": "String (enum: ['pending', 'in-progress', 'completed'], default: 'pending')",
  "priority": "String (enum: ['low', 'medium', 'high'], default: 'medium')",
  "dueDate": "Date (optional)",
  "completedAt": "Date (optional)",
  "order": "Number (required)",
  "createdBy": "ObjectId (ref: User, required)",
  "assignedTo": "ObjectId (ref: User, optional)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## API Endpoints

### Authentication Routes

#### 1. User Signup
- **Endpoint:** `POST /api/signup`
- **Description:** Register a new user
- **Request Body:**
```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response:**
```json
{
  "message": "Signup successful",
  "user": {
    "id": "userId",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### 2. User Login
- **Endpoint:** `POST /api/login`
- **Description:** Authenticate user and get JWT token
- **Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **OR**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```
- **Response:**
```json
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "userId",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Task Routes (All require authentication)

#### 3. Create Task
- **Endpoint:** `POST /api/createtask`
- **Headers:** `Authorization: Bearer <token>`
- **Description:** Create a new task for the authenticated user
- **Request Body:**
```json
{
  "title": "Complete project",
  "description": "Finish the task management project",
  "priority": "high",
  "dueDate": "2024-12-31T23:59:59.000Z"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Task created",
  "data": {
    "_id": "taskId",
    "title": "Complete project",
    "description": "Finish the task management project",
    "status": "pending",
    "priority": "high",
    "dueDate": "2024-12-31T23:59:59.000Z",
    "order": 1,
    "createdBy": "userId",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 4. Get My Tasks
- **Endpoint:** `GET /api/gettasks`
- **Headers:** `Authorization: Bearer <token>`
- **Description:** Get all tasks for the authenticated user with optional filters
- **Query Parameters:**
  - `status` (optional): Filter by status (`pending`, `in-progress`, `completed`)
  - `priority` (optional): Filter by priority (`low`, `medium`, `high`)
- **Examples:**
  - `GET /api/gettasks` - Get all tasks
  - `GET /api/gettasks?status=pending` - Get only pending tasks
  - `GET /api/gettasks?priority=high` - Get only high priority tasks
  - `GET /api/gettasks?status=pending&priority=high` - Get pending high priority tasks
- **Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "taskId",
      "title": "Task title",
      "description": "Task description",
      "status": "pending",
      "priority": "medium",
      "dueDate": "2024-12-31T23:59:59.000Z",
      "order": 1,
      "createdBy": "userId",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 5. Update Task
- **Endpoint:** `PUT /api/updatetask/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Description:** Update a task (only if it belongs to the authenticated user)
- **URL Parameters:** `id` - Task ID
- **Request Body:** (any of these fields are optional)
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "completed",
  "priority": "low",
  "dueDate": "2024-12-25T23:59:59.000Z",
  "assignedTo": "anotherUserId"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Task updated",
  "data": {
    "_id": "taskId",
    "title": "Updated title",
    "description": "Updated description",
    "status": "completed",
    "priority": "low",
    "dueDate": "2024-12-25T23:59:59.000Z",
    "completedAt": "2024-01-01T12:00:00.000Z",
    "order": 1,
    "createdBy": "userId",
    "assignedTo": "anotherUserId",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

#### 6. Delete Task
- **Endpoint:** `DELETE /api/deletetask/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Description:** Delete a task (only if it belongs to the authenticated user)
- **URL Parameters:** `id` - Task ID
- **Response:**
```json
{
  "success": true,
  "message": "Task deleted"
}
```

#### 7. Reorder Tasks
- **Endpoint:** `PUT /api/reorder/all`
- **Headers:** `Authorization: Bearer <token>`
- **Description:** Reorder multiple tasks (for drag and drop functionality)
- **Request Body:**
```json
[
  { "id": "taskId1", "order": 1 },
  { "id": "taskId2", "order": 2 },
  { "id": "taskId3", "order": 3 }
]
```
- **Response:**
```json
{
  "success": true,
  "message": "Tasks reordered"
}
```

#### 8. Get Task Days Count
- **Endpoint:** `GET /api/taskdayscount/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Description:** Get the number of days since a task was created or completed
- **URL Parameters:** `id` - Task ID
- **Logic:** 
  - If task is completed, calculates days from `completedAt`
  - If task is not completed, calculates days from `createdAt`
- **Response:**
```json
{
  "success": true,
  "taskId": "6982ebafcd5e5d612e672388",
  "status": "pending",
  "days": 15
}
```
- **Error Response:**
```json
{
  "success": false,
  "message": "Task not found"
}
```

## Error Responses

### Authentication Errors
```json
{
  "message": "No token provided"
}
```
```json
{
  "message": "Invalid token"
}
```

### Validation Errors
```json
{
  "success": false,
  "message": "Task validation failed: title: Path `title` is required."
}
```

### Not Found Errors
```json
{
  "success": false,
  "message": "Task not found"
}
```

### Server Errors
```json
{
  "success": false,
  "message": "Internal server error message"
}
```

## Usage Examples

### Complete Workflow

1. **Signup:**
```bash
curl -X POST http://localhost:5000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","username":"johndoe","email":"john@example.com","password":"password123"}'
```

2. **Login:**
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

3. **Create Task:**
```bash
curl -X POST http://localhost:5000/api/createtask \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"My first task","description":"Task description","priority":"high"}'
```

4. **Get Tasks:**
```bash
curl -X GET http://localhost:5000/api/gettasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

5. **Update Task:**
```bash
curl -X PUT http://localhost:5000/api/updatetask/TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"status":"completed"}'
```

6. **Delete Task:**
```bash
curl -X DELETE http://localhost:5000/api/deletetask/TASK_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

7. **Get Task Days Count:**
```bash
curl -X GET http://localhost:5000/api/taskdayscount/6982ebafcd5e5d612e672388 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Database Schema

### Collections
- **users:** Stores user information
- **tasks:** Stores task information with references to users

### Indexes
- Users: `{ email: 1, username: 1 }`
- Tasks: 
  - `{ createdBy: 1, order: 1 }`
  - `{ createdBy: 1, status: 1 }`
  - `{ createdBy: 1, priority: 1 }`
  - `{ createdBy: 1, dueDate: 1 }`

## Environment Variables

Create a `.env` file with:
```
JWT_SECRET=your-secret-key
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
```

## Features

- ✅ User authentication with JWT
- ✅ Task CRUD operations
- ✅ Task filtering by status and priority
- ✅ Task ordering and reordering
- ✅ Task days count calculation
- ✅ Automatic timestamps
- ✅ Input validation
- ✅ Error handling
- ✅ Database indexing for performance
- ✅ User-specific task isolation
