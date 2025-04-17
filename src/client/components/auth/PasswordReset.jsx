import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function PasswordReset() {
  const [step, setStep] = useState(1); // 1: Request, 2: Enter Code, 3: New Password, 4: Success
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // In a real app, you would call an API endpoint to send reset email
      // For demo purposes, we'll simulate a successful request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Reset code has been sent to your email. Please check your inbox.');
      setStep(2);
    } catch (err) {
      setError('Error sending reset code. Please try again.');
      console.error('Request reset error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // In a real app, you would verify the reset code with an API call
      // For demo purposes, we'll accept any 6-digit code
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (resetCode.length !== 6) {
        throw new Error('Invalid reset code format');
      }
      
      setSuccess('Code verified successfully.');
      setStep(3);
    } catch (err) {
      setError(err.message || 'Error verifying code. Please try again.');
      console.error('Verify code error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate password
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    // Confirm passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, you would call an API endpoint to reset the password
      // For demo purposes, we'll simulate a successful password reset
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Password has been reset successfully!');
      setStep(4);
    } catch (err) {
      setError('Error resetting password. Please try again.');
      console.error('Reset password error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleRequestReset}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Request Reset Code'}
              </button>
            </div>
          </form>
        );
        
      case 2:
        return (
          <form onSubmit={handleVerifyCode}>
            <div className="form-group">
              <label className="form-label" htmlFor="resetCode">Enter Reset Code</label>
              <input
                type="text"
                id="resetCode"
                className="form-control code-input"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength="6"
                placeholder="6-digit code"
                required
                disabled={loading}
              />
              <p className="form-hint">Enter the 6-digit code sent to your email</p>
            </div>
            
            <div className="form-group">
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading || resetCode.length !== 6}
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </div>
            
            <div className="form-group">
              <button
                type="button"
                className="btn btn-link btn-block"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Try with a different email
              </button>
            </div>
          </form>
        );
        
      case 3:
        return (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label className="form-label" htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength="6"
                required
                disabled={loading}
              />
              <p className="form-hint">Password must be at least 6 characters</p>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>
        );
        
      case 4:
        return (
          <div className="reset-success">
            <div className="success-icon">✓</div>
            <h3>Password Reset Complete</h3>
            <p>Your password has been reset successfully.</p>
            <Link to="/login" className="btn btn-primary">
              Sign In with New Password
            </Link>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-brand">
          <h1>FiscalFusion</h1>
          <p>Reset your password to regain access to your account</p>
        </div>
        
        <div className="auth-content">
          <div className="auth-form">
            <h2>Reset Password</h2>
            
            {error && <div className="error-message auth-error">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            {renderStep()}
            
            {step < 4 && (
              <div className="auth-links">
                <Link to="/login" className="btn-link">
                  Back to Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordReset; 