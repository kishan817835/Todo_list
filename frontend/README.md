# Todo App Frontend

A modern, responsive Angular frontend for the Todo List application with Material Design and rich text editing capabilities.

## 🚀 Overview

This is the frontend application built with Angular 21, TypeScript, and Angular Material. It provides a beautiful and intuitive interface for managing tasks with advanced features like rich text editing, drag-and-drop reordering, and comprehensive filtering.

## 🛠️ Tech Stack

- **Angular 21** - Modern web framework with standalone components
- **TypeScript** - Type-safe JavaScript
- **Angular Material** - UI component library with Material Design
- **Angular CDK** - Component Development Kit for advanced features
- **CKEditor 5** - Rich text editor integration
- **Quill** - Alternative text editor
- **RxJS** - Reactive programming for state management
- **Font Awesome** - Icon library
- **Vitest** - Modern testing framework
- **Secure-LS** - Secure local storage

## 📋 Features

- ✅ **Modern UI** with Angular Material components
- ✅ **Responsive Design** that works on all devices
- ✅ **Rich Text Editing** with CKEditor 5
- ✅ **Drag & Drop** task reordering
- ✅ **Advanced Filtering** by status and priority
- ✅ **SEO Optimized** with proper meta tags
- ✅ **JWT Authentication** with secure token storage
- ✅ **Real-time Updates** with reactive programming
- ✅ **Form Validation** with Angular reactive forms
- ✅ **Loading States** and error handling
- ✅ **Accessibility** features
- ✅ **Forgot Password** functionality with OTP support
- ✅ **Password Recovery** via current password or OTP
- ✅ **Email Integration** with Resend API
- ✅ **Timer-based OTP** with 5-minute cooldown
- ✅ **Attempt Tracking** with maximum 3 attempts
- ✅ **Smart Validation** for email/username fields

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/       # Reusable components
│   │   ├── login/           # Login component
│   │   ├── register/        # Registration component
│   │   ├── forget-password/  # Forgot password component
│   │   ├── popup/           # Todo popup component
│   │   ├── service/         # API services
│   │   ├── utils/           # Utility functions
│   │   ├── app.component.ts # Main app component
│   │   ├── app.module.ts    # App module (if using modules)
│   │   └── app.config.ts    # App configuration
│   ├── assets/              # Static assets
│   ├── environments/        # Environment configurations
│   ├── index.html          # SEO optimized HTML
│   └── main.ts             # Application entry point
├── public/
│   ├── robots.txt          # SEO robots file
│   └── todo.svg            # App icon
├── package.json
├── angular.json
├── tsconfig.json
├── vercel.json             # Vercel deployment config
└── .env                    # Environment variables
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (globally installed)

### Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Create .env file
   echo "API_URL=http://localhost:5000/api" > .env
   ```

### Development Server

To start the development server:

```bash
ng serve
```

The application will be available at `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Build

To build the project for production:

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory. The production build is optimized for performance and speed.

### Testing

Run unit tests:

```bash
ng test
```

Run end-to-end tests:

```bash
ng e2e
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
API_URL=http://localhost:5000/api
```

### Angular Configuration

The project uses Angular's standalone components architecture. Key configuration files:

- `angular.json` - Angular CLI configuration
- `tsconfig.json` - TypeScript configuration
- `app.config.ts` - Application providers and configuration

## 🎨 UI Components

The application uses Angular Material components including:

- `MatCard` - Task cards
- `MatButton` - Action buttons
- `MatFormField` - Form inputs
- `MatSelect` - Dropdown selections
- `MatDialog` - Modal dialogs
- `MatProgressBar` - Loading indicators
- `MatSnackBar` - Notifications

## 🔐 Authentication

- JWT token-based authentication
- Secure local storage with encryption
- Automatic token refresh
- Protected routes with guards

## 📱 Responsive Design

- Mobile-first approach
- Breakpoint-based layouts
- Touch-friendly interactions
- Adaptive UI components

## 🚀 Deployment

### Vercel

The project is configured for Vercel deployment with `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/frontend"
      }
    }
  ]
}
```

### Manual Deployment

1. Build the project:
   ```bash
   ng build --configuration production
   ```

2. Deploy the `dist/` folder to your hosting provider.

## 🧪 Testing

### Unit Tests

- Component testing with Vitest
- Service testing with mocks
- Pipe and directive testing

### E2E Tests

- User flow testing
- Integration testing
- Cross-browser testing

## 📊 Performance

- Lazy loading for optimal bundle size
- Tree shaking for unused code elimination
- AOT compilation for faster rendering
- Service Worker for PWA capabilities

## 🔍 SEO Features

- Optimized meta tags
- Structured data markup
- Semantic HTML5
- Open Graph tags
- Twitter Card tags
- Robots.txt configuration

## 🤝 Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update documentation
4. Use semantic commit messages
5. Ensure all tests pass before PR

## 📝 License

This project is licensed under the MIT License.

---

For more information on the backend API, see the [backend documentation](../backend/readme.md).
