import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the auth context
export const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Check if user is already logged in (token exists)
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Verify the token with the server
        const response = await fetch('http://localhost:8080/api/auth/verify', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData.user);
        } else {
          // Token is invalid
          localStorage.removeItem('token');
          setToken(null);
          setCurrentUser(null);
        }
      } catch (err) {
        console.error('Token verification error:', err);
        setError('Authentication error. Please try logging in again.');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  // User login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setCurrentUser(data.user);
        return { success: true };
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again later.');
      return { success: false, message: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  // User registration function
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true };
      } else {
        setError(data.message || 'Registration failed.');
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again later.');
      return { success: false, message: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  // User logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    if (!currentUser) return false;
    return currentUser.roles && currentUser.roles.includes(role);
  };

  // Check if user has permission to access a feature
  const hasPermission = (permission) => {
    if (!currentUser) return false;
    return currentUser.permissions && currentUser.permissions.includes(permission);
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    hasRole,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 