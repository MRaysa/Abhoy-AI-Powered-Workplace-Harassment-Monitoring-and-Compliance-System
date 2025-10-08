# SafeDesk - AI-Powered Workplace Harassment Monitoring System

![SafeDesk](https://img.shields.io/badge/SafeDesk-Workplace%20Safety-blue)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react)
![Firebase](https://img.shields.io/badge/Firebase-11.7.3-FFCA28?logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.7-38B2AC?logo=tailwind-css)
![Build](https://img.shields.io/badge/build-passing-brightgreen)

**A comprehensive workplace harassment monitoring and compliance management system**

## 🌟 Features

### 👥 Employee Portal
- **Incident Reporting** - Submit harassment/safety concerns anonymously or publicly
- **Report Tracking** - Monitor status and updates on submitted reports
- **Legal Support** - Access legal resources and emergency contacts
- **Workplace Finder** - Discover safe workplace environments
- **Settings** - Manage profile and notification preferences

### 🛡️ Admin Panel
- **Dashboard** - Real-time statistics and activity overview
- **Report Management** - Review, process, and resolve incident reports
- **Analytics** - Visualize trends and patterns
- **Department View** - Department-wise incident tracking
- **Certification Management** - Track compliance certifications
- **User Management** - Administer users and permissions

### 🔐 Authentication
- Email/password authentication
- Google OAuth integration
- Password reset functionality
- Protected routes with role-based access

---

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Setup

Create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 📁 Project Structure

```
src/
├── pages/
│   ├── Auth/           # Login, Signup, Password Reset
│   ├── Employee/       # Employee portal (6 pages)
│   └── Admin/          # Admin panel (6 pages)
├── components/
│   ├── layouts/        # EmployeeLayout, AdminLayout
│   └── shared/         # Reusable components
├── routes/             # Route configurations
├── services/           # API services
├── utils/              # Utilities and helpers
└── contexts/           # React Context providers
```

📖 **[View Full Documentation](PROJECT_STRUCTURE.md)**

---

## 🎯 Routes

**Public:** `/`, `/signin`, `/signup`, `/forgot-password`

**Employee:** `/employee/home`, `/employee/report`, `/employee/reports`, `/employee/legal-support`, `/employee/workplace-finder`, `/employee/settings`

**Admin:** `/admin/dashboard`, `/admin/reports`, `/admin/analytics`, `/admin/departments`, `/admin/certifications`, `/admin/users`

---

## 🛠️ Tech Stack

- React 19.1 + React Router 7.6
- Firebase 11.7 (Auth & Database)
- Tailwind CSS 4.1 + DaisyUI 5.0
- Framer Motion 12.12
- Vite 6.3

---

## 📖 Documentation

- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Complete architecture guide
- **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - Migration from old structure

---

## 👨‍💻 Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production
npm run lint     # Run ESLint
```

---

**Built with ❤️ for a safer workplace**
