import React, { useState } from 'react';
import { useAuth } from './AuthContext';

function UserProfile() {
  const { currentUser, error: authError, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    companyName: currentUser?.companyName || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'security'
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const validateProfileForm = () => {
    const newErrors = {};
    
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateSecurityForm = () => {
    const newErrors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) return;
    
    setSuccess('');
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          companyName: formData.companyName
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Profile updated successfully');
      } else {
        setErrors({ form: data.message || 'Error updating profile' });
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setErrors({ form: 'Error updating profile. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    
    if (!validateSecurityForm()) return;
    
    setSuccess('');
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Password updated successfully');
        // Clear password fields
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
      } else {
        setErrors({ form: data.message || 'Error updating password' });
      }
    } catch (err) {
      console.error('Password update error:', err);
      setErrors({ form: 'Error updating password. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (authLoading) {
    return <div className="loading">Loading user profile...</div>;
  }
  
  if (!currentUser) {
    return <div className="error">Please log in to view your profile</div>;
  }
  
  return (
    <div className="user-profile">
      <div className="profile-header">
        <h2>Your Profile</h2>
      </div>
      
      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile Information
        </button>
        <button 
          className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          Security
        </button>
      </div>
      
      {success && <div className="success-message">{success}</div>}
      {errors.form && <div className="error-message">{errors.form}</div>}
      {authError && <div className="error-message">{authError}</div>}
      
      {activeTab === 'profile' && (
        <form className="profile-form" onSubmit={handleProfileSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                value={formData.firstName}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.firstName && <div className="error-message">{errors.firstName}</div>}
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                value={formData.lastName}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.lastName && <div className="error-message">{errors.lastName}</div>}
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="companyName">Company Name</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              className="form-control"
              value={formData.companyName}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-group">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
      
      {activeTab === 'security' && (
        <form className="security-form" onSubmit={handleSecuritySubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
              value={formData.currentPassword}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.currentPassword && <div className="error-message">{errors.currentPassword}</div>}
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
              value={formData.newPassword}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.newPassword && <div className="error-message">{errors.newPassword}</div>}
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="confirmNewPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              className={`form-control ${errors.confirmNewPassword ? 'is-invalid' : ''}`}
              value={formData.confirmNewPassword}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.confirmNewPassword && <div className="error-message">{errors.confirmNewPassword}</div>}
          </div>
          
          <div className="form-group">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default UserProfile; 