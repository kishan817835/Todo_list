# Task Management API Backend

A robust RESTful API backend for task management with user authentication, built with Node.js, Express.js, and MongoDB.

## 🚀 Overview

This backend provides a comprehensive API for task management with features like user authentication, task CRUD operations, advanced filtering, task reordering, and analytics. It's designed to work seamlessly with the Angular frontend but can be used with any frontend framework.

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime environment
- **Express.js 5** - Fast, unopinionated web framework
- **MongoDB** - NoSQL document database
- **Mongoose** - Elegant MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Passport** - Authentication middleware
- **Google OAuth 2.0** - Social authentication
- **Nodemailer** - Email sending
- **Cookie-session** - Session management
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management

## 📋 Features

- ✅ **User Authentication** with JWT and Google OAuth
- ✅ **Secure Password** hashing with bcrypt
- ✅ **Task CRUD Operations** with full validation
- ✅ **Advanced Filtering** by status and priority
- ✅ **Task Reordering** with drag-and-drop support
- ✅ **Task Analytics** with days calculation
- ✅ **Input Validation** and sanitization
- ✅ **Error Handling** with proper HTTP status codes
- ✅ **Database Indexing** for optimal performance
- ✅ **User Isolation** for data security
- ✅ **Session Management** with cookies
- ✅ **Email Notifications** support
- ✅ **API Documentation** with examples

## 📁 Project Structure

```
backend/
├── controller/              # Route controllers
│   ├── authController.js   # Authentication logic
│   ├── taskController.js   # Task operations
│   └── userController.js   # User management
├── middleware/              # Custom middleware
│   └── auth.js            # Authentication middleware
├── models/                 # Data models
│   ├── User.js            # User schema
│   └── Task.js            # Task schema
├── routes/                 # API routes
│   ├── auth.js            # Authentication routes
│   ├── tasks.js           # Task routes
│   └── users.js           # User routes
├── config/                 # Database configuration
│   └── db.js              # MongoDB connection
├── utils/                  # Utility functions
│   └── helpers.js         # Helper functions
├── API_DOCUMENTATION.md    # Detailed API documentation
├── package.json           # Dependencies and scripts
├── server.js              # Server entry point
├── seed.js                # Database seeding
└── .env                   # Environment variables
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Copy example environment file
   cp .env.example .env
   # Edit .env with your configuration
   ```

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/taskmanager

# Server
PORT=5000

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:4200
```

### Running the Server

**Development mode:**
```bash
npm start
```

**With nodemon (for auto-restart):**
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 📊 Database Schema

### User Model

```javascript
{
  _id: ObjectId,
  name: String (required),
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  googleId: String (optional, for OAuth),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model

```javascript
{
  _id: ObjectId,
  title: String (required, max: 150),
  description: String (optional),
  status: String (enum: ['pending', 'in-progress', 'completed'], default: 'pending'),
  priority: String (enum: ['low', 'medium', 'high'], default: 'medium'),
  dueDate: Date (optional),
  completedAt: Date (optional),
  order: Number (required),
  createdBy: ObjectId (ref: User, required),
  assignedTo: ObjectId (ref: User, optional),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication

### JWT Authentication

- Uses JSON Web Tokens for stateless authentication
- Tokens expire in 7 days by default
- Secure password hashing with bcrypt
- Middleware for protected routes

### Google OAuth 2.0

- Optional social authentication
- Redirects to Google for authentication
- Creates or links user accounts
- Generates JWT tokens after successful OAuth

## 🛡️ Security Features

- **Password Hashing** with bcrypt (10 rounds)
- **JWT Token** validation
- **Input Validation** and sanitization
- **CORS Configuration** for cross-origin requests
- **Rate Limiting** (can be implemented)
- **Helmet.js** for security headers (recommended)
- **Environment Variables** for sensitive data

## 📈 Performance

- **Database Indexing** for faster queries
- **Connection Pooling** with MongoDB
- **Async/Await** for non-blocking operations
- **Error Handling** with proper HTTP status codes
- **Validation** at multiple layers

## 🧪 Testing

**Unit Tests:**
```bash
npm test
```

**Integration Tests:**
```bash
npm run test:integration
```

**Test Coverage:**
```bash
npm run test:coverage
```

## 📝 API Endpoints

### Authentication Routes

- `POST /api/signup` - User registration
- `POST /api/login` - User login
- `POST /api/google` - Google OAuth
- `GET /api/logout` - User logout

### Task Routes

- `POST /api/createtask` - Create new task
- `GET /api/gettasks` - Get user tasks with filters
- `PUT /api/updatetask/:id` - Update task
- `DELETE /api/deletetask/:id` - Delete task
- `PUT /api/reorder/all` - Reorder tasks
- `GET /api/taskdayscount/:id` - Get task days count

### User Routes

- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `DELETE /api/account` - Delete user account

## 📋 Detailed API Documentation

For complete API documentation including request/response examples, error handling, and usage examples, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

## 🔧 Configuration

### MongoDB Connection

The application uses Mongoose for MongoDB connection with the following features:

- Automatic reconnection
- Connection pooling
- Retry writes
- Read preference

### Express Middleware

- `express.json()` - JSON body parsing
- `express.urlencoded()` - URL-encoded body parsing
- `cors()` - Cross-Origin Resource Sharing
- `cookie-session()` - Session management
- Custom authentication middleware

## 🚀 Deployment

### Environment Setup

1. **Production Environment Variables:**
   ```env
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/taskmanager
   JWT_SECRET=production-secret-key
   PORT=5000
   ```

2. **Build and Deploy:**
   ```bash
   # Install production dependencies
   npm ci --only=production
   
   # Start the server
   npm start
   ```

### Recommended Hosting

- **Heroku** - Easy Node.js deployment
- **AWS EC2** - Full control over environment
- **DigitalOcean** - Affordable cloud hosting
- **Vercel** - Serverless deployment
- **Railway** - Modern deployment platform

## 📊 Monitoring & Logging

**Recommended additions:**

- **Winston** - Structured logging
- **Morgan** - HTTP request logging
- **PM2** - Process management
- **New Relic** - Performance monitoring
- **Sentry** - Error tracking

## 🔄 Database Seeding

Use the provided seed script to populate the database with sample data:

```bash
npm run seed
```

## 🤝 Contributing

1. Follow REST API best practices
2. Write comprehensive tests
3. Update API documentation
4. Use semantic versioning
5. Ensure security best practices

## 📝 License

This project is licensed under the MIT License.

---

For the complete API documentation with examples, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).
