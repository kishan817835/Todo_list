# Task Management API Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [Task Management](#task-management)
3. [Task Visibility](#task-visibility)
4. [Public Task Access](#public-task-access)
5. [Error Responses](#error-responses)
6. [Data Models](#data-models)

---

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Task Management

### Create Task
```http
POST /api/createtask
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Task Title",
  "description": "Task Description",
  "priority": "low|medium|high",
  "dueDate": "2024-01-01T00:00:00.000Z",
  "deadlineTime": "23:59"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task created",
  "data": {
    "_id": "task_id",
    "title": "Task Title",
    "description": "Task Description",
    "status": "pending",
    "priority": "medium",
    "visibility": "private",
    "createdBy": "user_id",
    "order": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get My Tasks
```http
GET /api/gettasks?status=pending&priority=high
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): Filter by status (`pending`, `in-progress`, `completed`)
- `priority` (optional): Filter by priority (`low`, `medium`, `high`)

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "task_id",
      "title": "Task Title",
      "description": "Task Description",
      "status": "pending",
      "priority": "medium",
      "visibility": "private",
      "createdBy": "user_id",
      "order": 1,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Update Task
```http
PUT /api/updatetask/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "status": "completed",
  "priority": "high"
}
```

### Delete Task
```http
DELETE /api/deletetask/:id
Authorization: Bearer <token>
```

---

## Task Visibility

### Update Task Visibility
```http
POST /api/task/visibility
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "taskId": "task_id",
  "visibility": "public"
}
```

**Visibility Options:**
- `public`: Task can be accessed by anyone without authentication
- `private`: Task can only be accessed by the owner (default)

**Response:**
```json
{
  "success": true,
  "message": "Task visibility updated",
  "data": {
    "_id": "task_id",
    "title": "Task Title",
    "visibility": "public",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get Recent Tasks
```http
GET /api/gettasks/recent
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "counts": {
    "total": 25,
    "completed": 10,
    "pending": 15
  },
  "recentCount": 6,
  "data": [
    {
      "_id": "task_id",
      "title": "Task Title",
      "status": "pending",
      "priority": "medium",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## Public Task Access

### Get Public Task by ID
```http
GET /api/task/:id
```

**Description:** Access a specific public task without authentication. The task must have `visibility: "public"` to be accessible.

**Path Parameters:**
- `id`: The ID of the task to retrieve

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "_id": "task_id",
    "title": "Public Task",
    "description": "This is a public task",
    "status": "pending",
    "priority": "medium",
    "visibility": "public",
    "dueDate": "2024-01-01T00:00:00.000Z",
    "deadlineTime": "23:59",
    "completedAt": null,
    "order": 1,
    "createdBy": {
      "name": "User Name",
      "email": "user@example.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response (Task not found or not public):**
```json
{
  "success": false,
  "message": "Public task not found"
}
```

**Use Cases:**
- Share specific tasks with external users
- Create public task portfolios
- Allow anonymous access to specific tasks
- Embed tasks in external applications

---

## Other Task Operations

### Reorder Tasks
```http
PUT /api/reorder/all
Authorization: Bearer <token>
```

**Request Body:**
```json
[
  {
    "id": "task_id_1",
    "order": 1
  },
  {
    "id": "task_id_2",
    "order": 2
  }
]
```

### Get Task Days Count
```http
GET /api/taskdayscount/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "taskId": "task_id",
  "status": "completed",
  "days": 5
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Visibility must be 'public' or 'private'"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Task not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error message details"
}
```

---

## Data Models

### Task Model
```json
{
  "_id": "ObjectId",
  "title": "String (required, max 150 chars)",
  "description": "String (optional)",
  "status": "String (enum: pending, in-progress, completed, default: pending)",
  "priority": "String (enum: low, medium, high, default: medium)",
  "dueDate": "Date (optional)",
  "deadlineTime": "String (optional)",
  "completedAt": "Date (optional)",
  "order": "Number (required)",
  "visibility": "String (enum: public, private, default: private)",
  "createdBy": "ObjectId (ref: User, required)",
  "assignedTo": "ObjectId (ref: User, optional)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### User Model (Basic)
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## Database Schema Updates

### Tasks Table Structure
The tasks collection includes the following updated fields:

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| visibility | String | Task visibility level | "private" |
| createdBy | ObjectId | Reference to User who created task | Required |
| assignedTo | ObjectId | Reference to User assigned to task | Optional |
| order | Number | Task order for sorting | Required |
| completedAt | Date | When task was completed | null |

### Indexes
- `{ createdBy: 1, order: 1 }` - For user's ordered tasks
- `{ createdBy: 1, status: 1 }` - For user's tasks by status
- `{ createdBy: 1, priority: 1 }` - For user's tasks by priority
- `{ createdBy: 1, dueDate: 1 }` - For user's tasks by due date
- `{ createdBy: 1, visibility: 1 }` - For user's public/private tasks
- `{ visibility: 1 }` - For public tasks access

---

## Usage Examples

### Complete Workflow: Making a Task Public

1. **Create a task:**
```bash
curl -X POST http://localhost:5000/api/createtask \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Public Task",
    "description": "This task will be public",
    "priority": "high"
  }'
```

2. **Make task public:**
```bash
curl -X POST http://localhost:5000/api/task/visibility \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": "task_id_from_step_1",
    "visibility": "public"
  }'
```

3. **Access public task without authentication:**
```bash
curl http://localhost:5000/api/task/task_id_from_step_1
```

### Filtering Examples

**Get all my pending high-priority tasks:**
```bash
curl -X GET "http://localhost:5000/api/gettasks?status=pending&priority=high" \
  -H "Authorization: Bearer <token>"
```

**Get a specific public task:**
```bash
curl http://localhost:5000/api/task/60f1b2c3d4e5f6789012345
```

---

## Security Considerations

1. **Public Tasks:** Only tasks with `visibility: "public"` are accessible without authentication
2. **Private Tasks:** Require valid JWT token and ownership verification
3. **Task Ownership:** Users can only modify/delete their own tasks
4. **Input Validation:** All inputs are validated before processing
5. **Rate Limiting:** Consider implementing rate limiting for public endpoints

---

## API Version History

### v1.0.0
- Basic task CRUD operations
- User authentication
- Task ordering and filtering

### v1.1.0 (Current)
- Added task visibility feature
- Public task access without authentication
- Updated database schema with visibility field
- Enhanced security for public/private task separation

---

## Testing the API

### Public Task Testing
1. Create a task as a logged-in user
2. Update its visibility to "public"
3. Access the task using the public endpoint without authentication
4. Verify that private tasks return 404 when accessed publicly

### Authentication Testing
1. Try accessing protected endpoints without token (should return 401)
2. Try accessing other users' private tasks (should return 404)
3. Verify that users can only modify their own tasks

---

For any questions or issues, please refer to the development team or check the API logs for detailed error information.
