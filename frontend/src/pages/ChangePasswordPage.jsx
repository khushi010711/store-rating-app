// frontend/src/pages/ChangePasswordPage.jsx
import React, { useState } from 'react';
import authService from '../api/authService';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import '../App.css';

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({ oldPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // State for password visibility
  const [isOldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setNewPasswordVisible] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const response = await authService.changePassword(formData.oldPassword, formData.newPassword);
      setMessage(response.data.message + '. You will be logged out.');
      // After a successful change, it's good practice to log the user out.
      // We will simulate this by redirecting to the login page.
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // We use the same wrappers as the AuthPage for consistent positioning
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <h2>Change Your Password</h2>
        <form onSubmit={handleSubmit}>
          {/* Current Password with eye icon */}
          <div className="password-input-wrapper">
            <input
              type={isOldPasswordVisible ? 'text' : 'password'}
              name="oldPassword"
              placeholder="Current Password"
              value={formData.oldPassword}
              onChange={handleInputChange}
              required
            />
            <span onClick={() => setOldPasswordVisible(!isOldPasswordVisible)} className="password-icon">
              {isOldPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          
          <div className="password-input-wrapper">
            <input
              type={isNewPasswordVisible ? 'text' : 'password'}
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleInputChange}
              required
            />
            <span onClick={() => setNewPasswordVisible(!isNewPasswordVisible)} className="password-icon">
              {isNewPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          
          <small>8-16 chars, 1 uppercase, 1 special character.</small>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
        {message && <p style={{ color: 'green', textAlign: 'center', marginTop: '1rem' }}>{message}</p>}
        {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}
      </div>
    </div>
  );
};

export default ChangePasswordPage;