// frontend/src/components/Layout.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      <header className="main-header">
        <div className="logo"><Link to="/">RateMyStore</Link></div>
        <nav className="main-nav">
          {user ? (
            
            <>
              {user.role === 'Normal User' && <Link to="/stores">Stores</Link>}
              {user.role === 'System Administrator' && <Link to="/admin/dashboard">Dashboard</Link>}
              {user.role === 'Store Owner' && <Link to="/owner/dashboard">My Store</Link>}
              <Link to="/change-password">Settings</Link>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            
            <>
              
              {!isAuthPage && (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/signup">Signup</Link>
                </>
              )}
            </>
          )}
        </nav>
      </header>

      
      <main className="main-content">
        {children}
      </main>
      <footer className="main-footer">
        <p>&copy; 2025 RateMyStore. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Layout;