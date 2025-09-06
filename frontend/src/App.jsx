// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import StoreListPage from './pages/StoreListPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import StoreOwnerDashboardPage from './pages/StoreOwnerDashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import ChangePasswordPage from './pages/ChangePasswordPage';
import Layout from './components/Layout';
import StoreDetailPage from './pages/StoreDetailPage';
import './App.css';


function AppContent() {
  const location = useLocation();

  const authRoutes = ['/login', '/signup', '/change-password'];
  const showAuthBackground = authRoutes.includes(location.pathname);


  return (
    <div className={showAuthBackground ? 'app-container auth-background' : 'app-container'}>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />

          {/* Protected Routes */}
          <Route path="/stores" element={<ProtectedRoute><StoreListPage /></ProtectedRoute>} />
          <Route path="/stores/:storeId" element={<ProtectedRoute><StoreDetailPage /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/owner/dashboard" element={<ProtectedRoute><StoreOwnerDashboardPage /></ProtectedRoute>} />
          <Route path="/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </div>
  );
}


function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;