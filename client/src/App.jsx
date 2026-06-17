import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import useAuth from './hooks/useAuth';

import Navbar from './components/shared/Navbar';
import AuthForm from './components/auth/AuthForm';
import HomePage from './components/home/HomePage';
import MyProfile from './components/profile/MyProfile'; 
import SubscriptionPage from './components/profile/SubscriptionPage';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ textAlignment: 'center', padding: '50px' }}>טוען נתונים...</div>;

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function MainLayout() {
  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <MyProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscription"
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <SubscriptionPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
