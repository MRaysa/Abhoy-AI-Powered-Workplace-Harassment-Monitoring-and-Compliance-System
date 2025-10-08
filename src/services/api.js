import { API_BASE_URL } from "../utils/constants";

// Base API configuration
const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
};

// Generic API request handler
const apiRequest = async (endpoint, options = {}) => {
  const url = `${apiConfig.baseURL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...apiConfig.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};

// Report API
export const reportAPI = {
  // Get all reports
  getAll: async () => {
    return apiRequest("/reports");
  },

  // Get report by ID
  getById: async (id) => {
    return apiRequest(`/reports/${id}`);
  },

  // Create new report
  create: async (reportData) => {
    return apiRequest("/reports", {
      method: "POST",
      body: JSON.stringify(reportData),
    });
  },

  // Update report
  update: async (id, reportData) => {
    return apiRequest(`/reports/${id}`, {
      method: "PATCH",
      body: JSON.stringify(reportData),
    });
  },

  // Delete report
  delete: async (id) => {
    return apiRequest(`/reports/${id}`, {
      method: "DELETE",
    });
  },

  // Get user's reports
  getUserReports: async (userId) => {
    return apiRequest(`/reports?userId=${userId}`);
  },
};

// User API
export const userAPI = {
  // Get all users
  getAll: async () => {
    return apiRequest("/users");
  },

  // Get user by ID
  getById: async (id) => {
    return apiRequest(`/users/${id}`);
  },

  // Create new user
  create: async (userData) => {
    return apiRequest("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  // Update user
  update: async (id, userData) => {
    return apiRequest(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(userData),
    });
  },

  // Update sign-in info
  updateSignIn: async (signInData) => {
    return apiRequest("/users", {
      method: "PATCH",
      body: JSON.stringify(signInData),
    });
  },
};

// Analytics API
export const analyticsAPI = {
  // Get dashboard stats
  getDashboardStats: async () => {
    return apiRequest("/analytics/dashboard");
  },

  // Get reports by type
  getReportsByType: async () => {
    return apiRequest("/analytics/reports-by-type");
  },

  // Get monthly trends
  getMonthlyTrends: async () => {
    return apiRequest("/analytics/monthly-trends");
  },

  // Get department stats
  getDepartmentStats: async () => {
    return apiRequest("/analytics/departments");
  },
};

export default {
  reportAPI,
  userAPI,
  analyticsAPI,
};
