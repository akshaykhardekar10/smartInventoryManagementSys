import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import ComponentForm from './pages/ComponentForm';
import LogMovement from './pages/LogMovement';
import Navigation from './components/Navigation';
import Signup from './pages/Signup'; // <-- Add this import

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated && <Navigation />}
        <main className={isAuthenticated ? 'pt-0' : 'pt-0'}>
          <Routes>
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
            } />
            <Route path="/signup" element={<Signup />} /> {/* Signup route */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/inventory" element={
              <ProtectedRoute>
                <Inventory />
              </ProtectedRoute>
            } />
            <Route path="/components/add" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ComponentForm />
              </ProtectedRoute>
            } />
            <Route path="/components/:id/edit" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ComponentForm />
              </ProtectedRoute>
            } />
            <Route path="/movement" element={
              <ProtectedRoute>
                <LogMovement />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;