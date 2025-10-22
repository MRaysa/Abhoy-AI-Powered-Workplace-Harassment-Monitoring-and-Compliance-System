// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

// Report Status
export const REPORT_STATUS = {
  PENDING: "Pending",
  UNDER_REVIEW: "Under Review",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

// Incident Types
export const INCIDENT_TYPES = {
  HARASSMENT: "Harassment",
  DISCRIMINATION: "Discrimination",
  BULLYING: "Bullying",
  SAFETY_VIOLATION: "Safety Violation",
  OTHER: "Other",
};

// Priority Levels
export const PRIORITY_LEVELS = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

// User Roles
export const USER_ROLES = {
  EMPLOYEE: "Employee",
  ADMIN: "Admin",
  SUPER_ADMIN: "Super Admin",
};

// Route Paths
export const ROUTES = {
  // Auth Routes
  LOGIN: "/signin",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",

  // Employee Routes
  EMPLOYEE_HOME: "/employee/home",
  EMPLOYEE_REPORT: "/employee/report",
  EMPLOYEE_REPORTS: "/employee/reports",
  EMPLOYEE_LEGAL: "/employee/legal-support",
  EMPLOYEE_FINDER: "/employee/workplace-finder",
  EMPLOYEE_SETTINGS: "/employee/settings",

  // Admin Routes
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_REPORTS: "/admin/reports",
  ADMIN_ANALYTICS: "/admin/analytics",
  ADMIN_DEPARTMENTS: "/admin/departments",
  ADMIN_CERTIFICATIONS: "/admin/certifications",
  ADMIN_USERS: "/admin/users",
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: "safedesk_user",
  TOKEN: "safedesk_token",
  THEME: "safedesk_theme",
};
