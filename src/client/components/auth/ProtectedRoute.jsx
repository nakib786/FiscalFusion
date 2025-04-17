import React from 'react';
import { useAuth } from './AuthContext';
import AuthContainer from './AuthContainer';

/**
 * ProtectedRoute component for role-based access control
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string[]} [props.roles] - Roles required to access this route
 * @param {string[]} [props.permissions] - Permissions required to access this route
 * @param {React.ReactNode} [props.fallback] - Component to render if unauthorized
 * @returns {React.ReactNode} Either the children or login/fallback component
 */
function ProtectedRoute({ children, roles, permissions, fallback }) {
  const { currentUser, loading, hasRole, hasPermission } = useAuth();
  
  // Show loading state while checking authentication
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  // If user is not logged in, show login screen
  if (!currentUser) {
    return <AuthContainer />;
  }
  
  // Check if user has required roles (if specified)
  if (roles && roles.length > 0) {
    const hasRequiredRole = roles.some(role => hasRole(role));
    if (!hasRequiredRole) {
      return fallback || <div className="error">You don't have permission to access this page</div>;
    }
  }
  
  // Check if user has required permissions (if specified)
  if (permissions && permissions.length > 0) {
    const hasRequiredPermission = permissions.some(permission => hasPermission(permission));
    if (!hasRequiredPermission) {
      return fallback || <div className="error">You don't have permission to access this page</div>;
    }
  }
  
  // User is authenticated and authorized
  return children;
}

export default ProtectedRoute; 