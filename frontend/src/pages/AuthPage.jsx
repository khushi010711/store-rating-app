// frontend/src/pages/AuthPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import authService from '../api/authService';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import '../App.css';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const { login } = useAuth();
  const navigate = useNavigate();

  // --- ADDED: State for password visibility ---
  const [isLoginPasswordVisible, setLoginPasswordVisible] = useState(false);
  const [isSignupPasswordVisible, setSignupPasswordVisible] = useState(false);

  // State for Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // State for Signup form
  const [signupData, setSignupData] = useState({
    name: '', email: '', address: '', password: '',
  });

  // State for messages and loading
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.body.classList.add('auth-background');
    return () => {
      document.body.classList.remove('auth-background');
    };
  }, []);
 
  // --- ADDED: Toggle functions ---
  const toggleLoginPasswordVisibility = () => {
    setLoginPasswordVisible(!isLoginPasswordVisible);
  };
  const toggleSignupPasswordVisibility = () => {
    setSignupPasswordVisible(!isSignupPasswordVisible);
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setError('');
    setMessage('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userData = await login(loginEmail, loginPassword);
      switch (userData.role) {
        case 'System Administrator': navigate('/admin/dashboard'); break;
        case 'Store Owner': navigate('/owner/dashboard'); break;
        default: navigate('/stores');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await authService.signup(
        signupData.name, signupData.email, signupData.password, signupData.address
      );
      setMessage(response.data.message + ' Please log in.');
      setActiveTab('login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <h2>{activeTab === 'login' ? 'Login Form' : 'Signup Form'}</h2>
      
        <div className="tab-container">
          <button
            className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('login')}
          >
            Login
          </button>
          <button
            className={`tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('signup')}
          >
            Signup
          </button>
        </div>

        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit}>
            <input type="email" placeholder="Email Address" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
            
            
            <div className="password-input-wrapper">
              <input 
                type={isLoginPasswordVisible ? 'text' : 'password'} 
                placeholder="Password" 
                value={loginPassword} 
                onChange={(e) => setLoginPassword(e.target.value)} 
                required 
              />
              <span onClick={toggleLoginPasswordVisibility} className="password-icon">
                {isLoginPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            
            
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Logging In...' : 'Login'}
            </button>
            <p className="switch-link">
              Not a member? <span onClick={() => handleTabSwitch('signup')}>Signup now</span>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit}>
            <input type="text" name="name" placeholder="Full Name (min 20 chars)" value={signupData.name} onChange={handleSignupChange} required minLength="20" />
            <input type="email" name="email" placeholder="Email Address" value={signupData.email} onChange={handleSignupChange} required />
            
            
            <div className="password-input-wrapper">
              <input 
                type={isSignupPasswordVisible ? 'text' : 'password'} 
                name="password"
                placeholder="Password" 
                value={signupData.password} 
                onChange={handleSignupChange} 
                required 
              />
              <span onClick={toggleSignupPasswordVisibility} className="password-icon">
                {isSignupPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <textarea name="address" placeholder="Address" value={signupData.address} onChange={handleSignupChange} required />
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Signing Up...' : 'Signup'}
            </button>
            <p className="switch-link">
              Already a member? <span onClick={() => handleTabSwitch('login')}>Login now</span>
            </p>
          </form>
        )}
        {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}
        {message && <p style={{ color: 'green', textAlign: 'center', marginTop: '1rem' }}>{message}</p>}
      </div>
    </div>
  );
};

export default AuthPage;