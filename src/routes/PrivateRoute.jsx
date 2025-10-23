import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate, useLocation } from "react-router";

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user || !user.email) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  // Check role-based access
  if (requiredRole) {
    const userRole = user.role || 'employee';
    
    if (requiredRole === 'Admin' && userRole !== 'admin') {
      // Non-admin trying to access admin routes
      return <Navigate to="/employee/home" replace />;
    }
    
    if (requiredRole === 'Employee' && userRole === 'admin') {
      // Admin trying to access employee routes
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return children;
};

export default PrivateRoute;
