# 📚 Backend API Documentation

## 🚀 Overview

TaskMaster Backend API - RESTful API for task management with authentication, email notifications, and real-time updates.

## 🔗 Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## 🔐 Authentication

### JWT Token Required
All protected endpoints require a valid JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

## 📋 Endpoints

### Authentication Routes (`/api/auth`)

#### User Registration
```http
POST /api/auth/createaccount
```

**Request Body:**
```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": { ... },
    "token": "jwt-token-here"
  }
}
```

#### User Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "jwt-token-here"
  }
}
```

#### Send OTP
```http
POST /api/auth/sendOtp
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

#### Reset Password with OTP
```http
POST /api/auth/changePasswordWithOtp
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

### Task Routes (`/api/tasks`)

#### Create Task
```http
POST /api/tasks
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "<p>Detailed task description with rich text</p>",
  "priority": "high",
  "dueDate": "2024-12-31",
  "deadlineTime": "18:00",
  "multipleEmails": ["user1@example.com", "user2@example.com"],
  "visibility": "private"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "task-id-here",
    "title": "Complete project documentation",
    "description": "<p>Detailed task description</p>",
    "priority": "high",
    "status": "pending",
    "dueDate": "2024-12-31",
    "deadlineTime": "18:00",
    "multipleEmails": ["user1@example.com", "user2@example.com"],
    "visibility": "private",
    "createdBy": "user-id",
    "order": 1,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get Recent Tasks
```http
GET /api/tasks/recent
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional): Filter by status (pending, in-progress, completed)
- `priority` (optional): Filter by priority (low, medium, high)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "task-id",
      "title": "Task title",
      "description": "Task description",
      "priority": "high",
      "status": "pending",
      "dueDate": "2024-12-31",
      "deadlineTime": "18:00",
      "multipleEmails": ["email@example.com"],
      "visibility": "private",
      "days": 5,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "counts": {
    "total": 10,
    "pending": 6,
    "completed": 4
  }
}
```

#### Get Task by ID
```http
GET /api/tasks/:id
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "task-id",
    "title": "Task title",
    "description": "Task description",
    "priority": "high",
    "status": "pending",
    "dueDate": "2024-12-31",
    "deadlineTime": "18:00",
    "multipleEmails": ["email1@example.com", "email2@example.com"],
    "visibility": "private",
    "days": 5,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "completedAt": null
  }
}
```

#### Get Public Task by ID
```http
GET /api/tasks/public/:id
```

**No authentication required**

**Response:** Same as private task but only if visibility is "public"

#### Update Task
```http
PUT /api/tasks/:id
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:** (any of the following fields)
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "priority": "medium",
  "status": "completed",
  "dueDate": "2024-12-25",
  "deadlineTime": "17:00",
  "visibility": "public",
  "completedAt": "2024-01-15T10:30:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": { /* updated task object */ }
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

#### Reorder Tasks
```http
PUT /api/tasks/reorder
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
[
  { "id": "task-id-1", "order": 1 },
  { "id": "task-id-2", "order": 2 },
  { "id": "task-id-3", "order": 3 }
]
```

**Response:**
```json
{
  "success": true,
  "message": "Tasks reordered successfully"
}
```

#### Update Task Visibility
```http
POST /api/tasks/visibility
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "taskId": "task-id-here",
  "visibility": "public"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task visibility updated successfully",
  "data": { /* updated task object */ }
}
```

#### Get Task Days Count
```http
GET /api/tasks/:id/days
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "days": 5,
  "message": "5 days remaining"
}
```

### Email Routes (`/api/mail`)

#### Send Manual Reminder
```http
POST /api/mail/send-reminder
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "taskId": "task-id-here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reminder sent successfully"
}
```

#### Get Task Days Remaining (Email Endpoint)
```http
GET /api/mail/task/:id/days
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "days": 3,
  "message": "3 days remaining until deadline"
}
```

## 📊 Data Models

### Task Model
```json
{
  "_id": "string (ObjectId)",
  "title": "string (required)",
  "description": "string (HTML)",
  "priority": "string (low|medium|high)",
  "status": "string (pending|in-progress|completed)",
  "dueDate": "string (YYYY-MM-DD)",
  "deadlineTime": "string (HH:mm)",
  "multipleEmails": ["string (email addresses)"],
  "visibility": "string (public|private)",
  "createdBy": "string (ObjectId)",
  "order": "number",
  "days": "number (calculated)",
  "createdAt": "string (ISO date)",
  "completedAt": "string (ISO date, optional)"
}
```

### User Model
```json
{
  "_id": "string (ObjectId)",
  "name": "string (required)",
  "username": "string (required, unique)",
  "email": "string (required, unique)",
  "password": "string (hashed, required)",
  "role": "string (user|admin)",
  "createdAt": "string (ISO date)"
}
```

### OTP Model
```json
{
  "_id": "string (ObjectId)",
  "email": "string (required)",
  "otp": "string (6-digit)",
  "expiresAt": "string (ISO date)",
  "createdAt": "string (ISO date)"
}
```

## 🔒 Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (optional)"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

### Error Messages
- `"User already exists"` - Registration with existing email
- `"Invalid credentials"` - Wrong email/password
- `"Task not found"` - Task doesn't exist
- `"Access denied"` - No permission to access resource
- `"Validation error"` - Required fields missing
- `"Server error"` - Internal server error

## 🛡️ Security Features

### Authentication
- **JWT Tokens**: Secure session management
- **Password Hashing**: Bcrypt encryption
- **Token Expiration**: Configurable token lifetime
- **Rate Limiting**: Prevent brute force attacks

### Data Validation
- **Input Sanitization**: XSS protection
- **Schema Validation**: Mongoose validation
- **File Upload Security**: Safe file handling
- **SQL Injection Prevention**: NoSQL injection protection

### CORS Configuration
```javascript
{
  origin: ["http://localhost:4200", "https://your-domain.com"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}
```

## 📧 Email System

### SMTP Configuration
```javascript
{
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
}
```

### Email Templates
- **Task Reminder**: Professional HTML email with task details
- **Multiple Recipients**: Send to multiple email addresses
- **Deadline Alerts**: Automatic reminders before due date
- **Custom Templates**: Editable email content

### Email Features
- **Rich HTML Templates**: Beautiful email formatting
- **Task Details**: Complete task information
- **Multiple Recipients**: Send to multiple emails
- **Error Handling**: Failed email tracking
- **Scheduling**: Cron-based automatic reminders

## 🔄 Real-time Features

### Automatic Email Reminders
- **Cron Job**: Runs every minute
- **Time Window**: ±1 minute from deadline
- **Duplicate Prevention**: Track sent emails
- **Multiple Recipients**: Send to all configured emails

### Task Statistics
- **Real-time Counts**: Total, pending, completed tasks
- **Dynamic Updates**: Live dashboard statistics
- **User-specific**: Personal task counts
- **Performance Metrics**: Task completion rates

## 🚀 Deployment

### Environment Variables
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/taskmaster

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@taskmaster.com

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

### Production Setup
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start

# With PM2 (recommended)
pm2 start ecosystem.config.js
```

### Docker Support
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📈 Performance

### Database Optimization
- **Indexing**: Optimized queries with indexes
- **Connection Pooling**: Efficient database connections
- **Caching**: Redis for frequent queries
- **Pagination**: Large dataset handling

### API Performance
- **Compression**: Gzip response compression
- **Rate Limiting**: Prevent abuse
- **Logging**: Comprehensive error logging
- **Monitoring**: Health check endpoints

## 🧪 Testing

### Test Endpoints
- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Complete workflow testing
- **Load Testing**: Performance under load

### Test Data
```javascript
// Sample task for testing
{
  "title": "Test Task",
  "description": "<p>This is a test task</p>",
  "priority": "medium",
  "dueDate": "2024-12-31",
  "deadlineTime": "18:00",
  "multipleEmails": ["test@example.com"],
  "visibility": "private"
}
```

---

**TaskMaster Backend API** - Comprehensive API Documentation 📚✨

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
