import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

function UserSettings() {
  const { currentUser, loading } = useAuth();
  
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      shareData: false,
      showActivity: true
    },
    appearance: {
      theme: 'light',
      fontSize: 'medium',
      compactView: false
    },
    language: 'en'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Simulate loading settings from API
  useEffect(() => {
    if (currentUser) {
      // This would be a real API call in production
      // fetchUserSettings(currentUser.id)
      //   .then(settings => setSettings(settings))
      //   .catch(err => setError('Error loading settings'));
      
      // For now we'll use mock data
      setTimeout(() => {
        setSettings({
          notifications: {
            email: currentUser.settings?.notifications?.email ?? true,
            push: currentUser.settings?.notifications?.push ?? true,
            sms: currentUser.settings?.notifications?.sms ?? false
          },
          privacy: {
            shareData: currentUser.settings?.privacy?.shareData ?? false,
            showActivity: currentUser.settings?.privacy?.showActivity ?? true
          },
          appearance: {
            theme: currentUser.settings?.appearance?.theme ?? 'light',
            fontSize: currentUser.settings?.appearance?.fontSize ?? 'medium',
            compactView: currentUser.settings?.appearance?.compactView ?? false
          },
          language: currentUser.settings?.language ?? 'en'
        });
      }, 500);
    }
  }, [currentUser]);
  
  const handleToggleChange = (section, setting) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [setting]: !prev[section][setting]
      }
    }));
  };
  
  const handleSelectChange = (section, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [setting]: value
      }
    }));
  };
  
  const handleLanguageChange = (value) => {
    setSettings(prev => ({
      ...prev,
      language: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      // This would be a real API call in production
      // await updateUserSettings(currentUser.id, settings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Settings updated successfully');
    } catch (err) {
      setError('Failed to update settings. Please try again.');
      console.error('Settings update error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return <div className="loading">Loading settings...</div>;
  }
  
  if (!currentUser) {
    return <div className="error">Please log in to manage your settings</div>;
  }
  
  return (
    <div className="user-settings">
      <div className="settings-header">
        <h2>User Settings</h2>
        <p>Manage your preferences and account settings</p>
      </div>
      
      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="settings-section">
          <h3>Notifications</h3>
          <div className="setting-item">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={() => handleToggleChange('notifications', 'email')}
                disabled={isSubmitting}
              />
              <span className="toggle-text">Email Notifications</span>
            </label>
            <p className="setting-description">Receive email notifications about account activity</p>
          </div>
          
          <div className="setting-item">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.notifications.push}
                onChange={() => handleToggleChange('notifications', 'push')}
                disabled={isSubmitting}
              />
              <span className="toggle-text">Push Notifications</span>
            </label>
            <p className="setting-description">Receive push notifications in your browser</p>
          </div>
          
          <div className="setting-item">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.notifications.sms}
                onChange={() => handleToggleChange('notifications', 'sms')}
                disabled={isSubmitting}
              />
              <span className="toggle-text">SMS Notifications</span>
            </label>
            <p className="setting-description">Receive text message alerts for important updates</p>
          </div>
        </div>
        
        <div className="settings-section">
          <h3>Privacy</h3>
          <div className="setting-item">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.privacy.shareData}
                onChange={() => handleToggleChange('privacy', 'shareData')}
                disabled={isSubmitting}
              />
              <span className="toggle-text">Data Sharing</span>
            </label>
            <p className="setting-description">Allow anonymous usage data to be shared for product improvement</p>
          </div>
          
          <div className="setting-item">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.privacy.showActivity}
                onChange={() => handleToggleChange('privacy', 'showActivity')}
                disabled={isSubmitting}
              />
              <span className="toggle-text">Activity Status</span>
            </label>
            <p className="setting-description">Show your online status to other users</p>
          </div>
        </div>
        
        <div className="settings-section">
          <h3>Appearance</h3>
          <div className="setting-item">
            <label className="select-label">
              <span className="select-text">Theme</span>
              <select
                value={settings.appearance.theme}
                onChange={(e) => handleSelectChange('appearance', 'theme', e.target.value)}
                disabled={isSubmitting}
                className="form-select"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </label>
            <p className="setting-description">Choose the application's visual theme</p>
          </div>
          
          <div className="setting-item">
            <label className="select-label">
              <span className="select-text">Font Size</span>
              <select
                value={settings.appearance.fontSize}
                onChange={(e) => handleSelectChange('appearance', 'fontSize', e.target.value)}
                disabled={isSubmitting}
                className="form-select"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </label>
            <p className="setting-description">Adjust the text size throughout the application</p>
          </div>
          
          <div className="setting-item">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.appearance.compactView}
                onChange={() => handleToggleChange('appearance', 'compactView')}
                disabled={isSubmitting}
              />
              <span className="toggle-text">Compact View</span>
            </label>
            <p className="setting-description">Display more information with less spacing</p>
          </div>
        </div>
        
        <div className="settings-section">
          <h3>Language</h3>
          <div className="setting-item">
            <label className="select-label">
              <span className="select-text">Display Language</span>
              <select
                value={settings.language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                disabled={isSubmitting}
                className="form-select"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="zh">中文</option>
              </select>
            </label>
            <p className="setting-description">Choose your preferred language for the interface</p>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserSettings; 