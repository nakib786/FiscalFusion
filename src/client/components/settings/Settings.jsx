import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import UserProfile from '../auth/UserProfile';
import UserSettings from '../auth/UserSettings';
import AdminPanel from '../admin/AdminPanel';

function Settings() {
  const { currentUser, hasRole } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');

  if (!currentUser) {
    return <div className="error">Please log in to access settings</div>;
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <UserProfile />;
      case 'settings':
        return <UserSettings />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <UserProfile />;
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-sidebar">
        <div className="settings-user-info">
          <div className="settings-user-avatar">
            {currentUser.firstName?.charAt(0)}{currentUser.lastName?.charAt(0)}
          </div>
          <div className="settings-user-details">
            <h3>{currentUser.firstName} {currentUser.lastName}</h3>
            <p className="settings-user-email">{currentUser.email}</p>
          </div>
        </div>
        
        <nav className="settings-navigation">
          <ul>
            <li 
              className={activeSection === 'profile' ? 'active' : ''}
              onClick={() => setActiveSection('profile')}
            >
              <i className="icon-user"></i>
              Profile
            </li>
            
            <li 
              className={activeSection === 'settings' ? 'active' : ''}
              onClick={() => setActiveSection('settings')}
            >
              <i className="icon-settings"></i>
              Preferences
            </li>
            
            {hasRole('admin') && (
              <li 
                className={activeSection === 'admin' ? 'active' : ''}
                onClick={() => setActiveSection('admin')}
              >
                <i className="icon-admin"></i>
                Admin Panel
              </li>
            )}
          </ul>
        </nav>
      </div>
      
      <div className="settings-content">
        {renderSection()}
      </div>
    </div>
  );
}

export default Settings; 