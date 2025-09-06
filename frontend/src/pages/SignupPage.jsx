// frontend/src/pages/SignupPage.jsx
import React, { useState } from 'react';
import authService from '../api/authService'; 
import { useNavigate } from 'react-router-dom'; 

const SignupPage = () => {
  const navigate = useNavigate();

  // State to hold the form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
  });

  // State for loading and error messages
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Handle input changes and update state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSignup = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    setMessage('');
    setError('');

    try {
      // Call the signup function from our authService
      const response = await authService.signup(
        formData.name,
        formData.email,
        formData.password,
        formData.address
      );

      // Handle success
      setMessage(response.data.message);
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000); 

    } catch (err) {
      // Handle error
      // The backend sends error messages in err.response.data.message
      const errorMessage = err.response?.data?.message || 'Signup failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="auth-container">
      <h2>Signup Page</h2>
      <form onSubmit={handleSignup}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            minLength="20"
            maxLength="60"
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Address:</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            maxLength="400"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            minLength="8"
            maxLength="16"
          />
          <small>8-16 chars, 1 uppercase, 1 special character.</small>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SignupPage;