# SafeDesk Project Structure

## Overview
SafeDesk is an AI-powered workplace harassment monitoring and compliance system built with React, Firebase, and Tailwind CSS.

## Directory Structure

```
src/
├── assets/                     # Static assets (images, icons, logos)
│   └── react.svg
│
├── components/                 # React components
│   ├── layouts/               # Layout components
│   │   ├── EmployeeLayout.jsx # Employee section layout with sidebar
│   │   └── AdminLayout.jsx    # Admin section layout with sidebar
│   │
│   ├── shared/                # Reusable shared components
│   │   ├── Sidebar.jsx        # Navigation sidebar component
│   │   └── Card.jsx           # Card wrapper component
│   │
│   ├── employee/              # Employee-specific components (future)
│   ├── admin/                 # Admin-specific components (future)
│   │
│   ├── Navbar/                # Header navigation
│   │   └── Navbar.jsx
│   │
│   └── Footer/                # Footer component
│       └── Footer.jsx
│
├── pages/                     # Page components
│   ├── Auth/                  # Authentication pages
│   │   ├── Login.jsx          # Sign in page
│   │   ├── Signup.jsx         # Sign up page
│   │   └── ForgotPassword.jsx # Password reset page
│   │
│   ├── Employee/              # Employee portal pages
│   │   ├── Home.jsx           # Employee dashboard/home
│   │   ├── ReportForm.jsx     # Incident reporting form
│   │   ├── MyReports.jsx      # View user's submitted reports
│   │   ├── LegalSupport.jsx   # Legal resources and support
│   │   ├── WorkplaceFinder.jsx # Safe workplace finder
│   │   └── Settings.jsx       # User settings and preferences
│   │
│   ├── Admin/                 # Admin panel pages
│   │   ├── Dashboard.jsx      # Admin dashboard with stats
│   │   ├── ReportsTable.jsx   # All reports management
│   │   ├── Analytics.jsx      # Analytics and charts
│   │   ├── DepartmentView.jsx # Department-wise view
│   │   ├── CertificationPanel.jsx # Compliance certifications
│   │   └── UserManagement.jsx # User management
│   │
│   ├── Common/                # Shared pages (future)
│   ├── HomePage.jsx           # Landing page
│   ├── ErrorPage.jsx          # 404 and error pages
│   └── Root.jsx               # Root layout component
│
├── routes/                    # Routing configuration
│   ├── router.jsx             # Main router setup
│   ├── EmployeeRoutes.jsx     # Employee route definitions
│   ├── AdminRoutes.jsx        # Admin route definitions
│   └── PrivateRoute.jsx       # Protected route wrapper
│
├── contexts/                  # React Context providers
│   ├── AuthContext.jsx        # Authentication context
│   └── AuthProvider.jsx       # Auth provider implementation
│
├── firebase/                  # Firebase configuration
│   └── firebase.init.js       # Firebase initialization
│
├── services/                  # API and external services
│   └── api.js                 # API request handlers (reportAPI, userAPI, analyticsAPI)
│
├── utils/                     # Utility functions and helpers
│   ├── constants.js           # App constants and configuration
│   └── helpers.js             # Helper functions (formatting, validation, etc.)
│
├── hooks/                     # Custom React hooks (future)
├── constants/                 # Additional constants (future)
├── styles/                    # Global styles and themes (future)
├── lib/                       # Third-party library configurations (future)
│
├── App.jsx                    # Main App component
├── App.css                    # App styles
└── main.jsx                   # Application entry point
```

## Key Features by Section

### Authentication (`pages/Auth/`)
- **Login**: Email/password and social authentication (Google, Facebook, GitHub)
- **Signup**: User registration with profile information
- **ForgotPassword**: Password reset functionality

### Employee Portal (`pages/Employee/`)
- **Home**: Dashboard with quick actions and activity stats
- **ReportForm**: Submit harassment/safety incident reports
- **MyReports**: Track submitted reports and their status
- **LegalSupport**: Access legal resources and emergency contacts
- **WorkplaceFinder**: Find and review safe workplaces
- **Settings**: Manage profile and notification preferences

### Admin Panel (`pages/Admin/`)
- **Dashboard**: Overview with statistics and recent activity
- **ReportsTable**: Manage all submitted reports
- **Analytics**: Visual analytics and trends
- **DepartmentView**: Department-wise statistics
- **CertificationPanel**: Compliance certification management
- **UserManagement**: User administration

## Routing Structure

### Public Routes
- `/` - Landing page
- `/signin` - Login page
- `/signup` - Registration page
- `/forgot-password` - Password reset

### Protected Employee Routes
- `/employee/home` - Employee dashboard
- `/employee/report` - Report incident
- `/employee/reports` - My reports
- `/employee/legal-support` - Legal resources
- `/employee/workplace-finder` - Workplace finder
- `/employee/settings` - User settings

### Protected Admin Routes (Requires Admin Role)
- `/admin/dashboard` - Admin dashboard
- `/admin/reports` - All reports
- `/admin/analytics` - Analytics
- `/admin/departments` - Department view
- `/admin/certifications` - Certifications
- `/admin/users` - User management

## Services & APIs

### API Services (`services/api.js`)
- **reportAPI**: Create, read, update, delete reports
- **userAPI**: User management operations
- **analyticsAPI**: Dashboard and analytics data

### Utilities (`utils/`)
- **constants.js**: API URLs, status codes, routes, storage keys
- **helpers.js**: Date formatting, validation, text utilities, color helpers

## State Management

### Context API
- **AuthContext**: Authentication state and user information
- **AuthProvider**: Firebase authentication integration

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **DaisyUI**: Tailwind component library
- **Framer Motion**: Animation library
- **React Icons**: Icon library

## Firebase Integration

- **Authentication**: Email/password and social login
- **Database**: User and report data storage
- **Storage**: File uploads (future)

## Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## Environment Variables

Create a `.env` file:
```
VITE_API_BASE_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
# ... other Firebase config
```

## Next Steps

1. Set up backend API endpoints
2. Implement AI-powered incident analysis
3. Add real-time notifications
4. Integrate charting library for analytics
5. Add file upload functionality
6. Implement email notifications
7. Add two-factor authentication
8. Create admin approval workflows
