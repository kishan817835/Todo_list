# Todo List Application

A full-stack Todo List application built with Angular (frontend) and Node.js (backend) with RESTful API and MongoDB database.

## 🚀 Repository

**GitHub Repository:** https://github.com/kishan817835/Todo_list.git

## 📋 Features

- ✅ User Authentication (Login/Register)
- ✅ Create, Read, Update, Delete Todos
- ✅ RESTful API with Express.js
- ✅ Responsive Angular frontend with Material Design
- ✅ MongoDB database integration
- ✅ Task filtering by status and priority
- ✅ Task ordering and reordering (drag & drop)
- ✅ Rich text editing with CKEditor
- ✅ JWT authentication
- ✅ SEO optimized frontend
- ✅ Modern UI with Angular Material
- ✅ **Forgot Password** functionality with OTP support
- ✅ **Password Recovery** via current password or OTP
- ✅ **Email Integration** with Resend API
- ✅ **Timer-based OTP** with 5-minute cooldown
- ✅ **Attempt Tracking** with maximum 3 attempts
- ✅ **Smart Validation** for email/username fields

## 🛠️ Tech Stack

### Frontend
- **Angular 21** - Modern web framework
- **TypeScript** - Type-safe JavaScript
- **Angular Material** - UI component library
- **CKEditor 5** - Rich text editor
- **Quill** - Text editor
- **RxJS** - Reactive programming
- **Font Awesome** - Icons
- **Vitest** - Testing framework

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Passport** - Authentication middleware
- **Google OAuth 2.0** - Social authentication
- **Nodemailer** - Email sending

## 📁 Project Structure

```
Todo_list/
├── frontend/                 # Angular frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/       # Login component
│   │   │   ├── register/    # Registration component
│   │   │   ├── forget-password/  # Forgot password component
│   │   │   ├── popup/       # Todo popup component
│   │   │   ├── service/     # API services
│   │   │   └── utils/       # Utility functions
│   │   ├── assets/          # Static assets
│   │   ├── environments/    # Environment configs
│   │   └── index.html       # SEO optimized HTML
│   ├── public/
│   │   ├── robots.txt       # SEO robots file
│   │   └── todo.svg         # App icon
│   ├── package.json
│   ├── angular.json
│   └── vercel.json          # Deployment config
├── backend/                  # Node.js backend application
│   ├── controller/          # Route controllers
│   │   ├── authController.js # Authentication logic
│   │   ├── taskController.js # Task operations
│   │   ├── userController.js # User management
│   │   └── mailController.js # Email and OTP services
│   ├── middleware/          # Custom middleware
│   │   └── auth.js          # Authentication middleware
│   ├── models/              # Data models
│   │   ├── User.js         # User schema
│   │   ├── Task.js         # Task schema
│   │   └── otp.model.js     # OTP schema
│   ├── routes/              # API routes
│   │   ├── auth.js         # Authentication routes
│   │   ├── tasks.js        # Task routes
│   │   └── users.js        # User routes
│   ├── config/              # Database configuration
│   │   └── db.js           # MongoDB connection
│   ├── utils/               # Utility functions
│   │   └── helpers.js      # Helper functions
│   ├── API_DOCUMENTATION.md # Detailed API docs
│   ├── package.json
│   ├── server.js            # Server entry point
│   └── seed.js              # Database seeding
├── .gitignore              # Git ignore file
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kishan817835/Todo_list.git
   cd Todo_list
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup:**
   - Create a `.env` file in the `backend` directory
   - Add your MongoDB connection string and JWT secret
   - Configure Google OAuth credentials (if using OAuth)

5. **Start the application:**
   
   **Backend:**
   ```bash
   cd backend
   npm start
   ```
   
   **Frontend:**
   ```bash
   cd frontend
   ng serve
   ```

6. **Access the application:**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:5000
   - API Documentation: See `backend/API_DOCUMENTATION.md`

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-jwt-secret-key
PORT=5000
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
```

### Frontend Environment Variables (.env)
```env
API_URL=http://localhost:5000/api
```

## 🚀 Deployment

### Frontend (Vercel)
The frontend is configured for Vercel deployment with `vercel.json`.

### Backend
Deploy the backend to any Node.js hosting service (Heroku, AWS, DigitalOcean, etc.).

## 📱 Usage

1. **Register a new account** or login with existing credentials
2. **Create todos** using the add todo functionality with rich text editing
3. **Manage todos** - mark as complete, edit, or delete
4. **Filter todos** by status (pending, in-progress, completed) and priority (low, medium, high)
5. **Reorder todos** using drag and drop functionality
6. **View task analytics** including days since creation/completion

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Issues

If you encounter any issues or have suggestions, please create an issue on the GitHub repository.

## 👤 Author

**Kishan Kumar**
- GitHub: [@kishan817835](https://github.com/kishan817835)
- Repository: https://github.com/kishan817835/Todo_list.git

---

⭐ If you like this project, please give it a star!
