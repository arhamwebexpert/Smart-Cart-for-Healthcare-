// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import useAuthStore from './stores/authStore';
import ProductDetail from './pages/ProductDetail';
import Analysis from './pages/Analysis';
import AnalysisALL from './pages/AnalysisALL';

function App() {
  const { isAuthenticated, login, logout } = useAuthStore();

  useEffect(() => {
    // Check if user is authenticated (e.g., token in localStorage)
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
      try {
        login(JSON.parse(userData), token);
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
  }, [login]);

  const handleLogin = (userData, token) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    login(userData, token);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    logout();
  };

  return (
    <Router>
      <Routes>

        {/* Public routes */}
        <Route
          path="/signin"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <SignIn onLogin={handleLogin} />
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <SignUp onLogin={handleLogin} />
          }
        />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected routes (with Layout) */}
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Layout onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/Analysis" element={<AnalysisALL />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="analysis/:folderId" element={<Analysis />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
