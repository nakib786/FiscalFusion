import React, { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import { useAuth } from './AuthContext';
import useUnsplashImage from '../../hooks/useUnsplashImage';

function AuthContainer() {
  const [isLoginView, setIsLoginView] = useState(true);
  const { currentUser, loading } = useAuth();
  const backgroundImage = useUnsplashImage('finance,business', 'Xznc-wLm_xI');

  const toggleView = () => {
    setIsLoginView(!isLoginView);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (currentUser) {
    return null; // User is already logged in
  }

  return (
    <div 
      className="auth-container" 
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none'
      }}
    >
      <div className="auth-overlay">
        <div className="auth-box">
          <div className="auth-brand">
            <h1>FiscalFusion</h1>
            <p>Your complete financial management solution</p>
          </div>
          
          <div className="auth-content">
            {isLoginView ? (
              <Login 
                onRegisterClick={toggleView} 
                onLoginSuccess={() => {
                  // Will be handled by AuthContext redirect
                }}
              />
            ) : (
              <Register 
                onLoginClick={toggleView}
                onRegisterSuccess={() => {
                  setIsLoginView(true);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthContainer; 