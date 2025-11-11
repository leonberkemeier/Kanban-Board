import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, error, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    console.log('Login component - isAuthenticated changed:', isAuthenticated);
    if (isAuthenticated && !isSubmitting) {
      console.log('Navigating to dashboard...');
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 50);
    }
  }, [isAuthenticated, navigate, isSubmitting]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear errors when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Attempting login...');
      const result = await login(formData.username, formData.password);
      console.log('Login result:', result);
      if (result.success) {
        console.log('Login successful, waiting for isAuthenticated to update...');
        // Don't navigate here - let the useEffect handle it when isAuthenticated changes
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.username.trim() && formData.password.trim();

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Kanban Board</h1>
          <p>Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {typeof error === 'string' ? error : 'Login failed. Please try again.'}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              autoComplete="username"
              placeholder="Enter your username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              autoComplete="current-password"
              placeholder="Enter your password"
            />
          </div>
          
          <button
            type="submit"
            className="login-button"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Contact your administrator to get access to the system.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;