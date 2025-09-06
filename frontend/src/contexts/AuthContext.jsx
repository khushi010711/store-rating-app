// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../api/authService'; // We will add the login function here soon

// Create the context
const AuthContext = createContext(null);

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To check initial auth status

  // Check if a user is already logged in (from localStorage) when the app loads
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      // The backend response should contain the user object and the token
      const userData = { ...response.data.user, token: response.data.token };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData; 
    } catch (error) {
      
      logout();
      throw error; 
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // The value provided to the context consumers
  const value = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the auth context easily
export const useAuth = () => {
  return useContext(AuthContext);
};