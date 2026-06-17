import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import useAuth from './hooks/useAuth';

// ייבוא הרכיבים והעמודים שלכן
import Navbar from './components/shared/Navbar';
import AuthForm from './components/auth/AuthForm';
import HomePage from './components/home/HomePage'; // חיבור דף הבית החדש והמעוצב
import MyProfile from './components/profile/MyProfile'; // ייבוא עמוד האזור האישי החדש
import SubscriptionPage from './components/profile/SubscriptionPage'; // 1. ייבוא
// רכיב שומר סף (ProtectedRoute) - מונע כניסה לעמודים מוגנים ללא התחברות
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

// רכיב המעטפת המרכזי של האתר
function MainLayout() {
  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      {/* ה-Navbar יושב כאן בבטחה בתוך המעטפת של ה-Provider */}
      <Navbar />

      <Routes>
        {/* עמוד הבית הראשי של האתר - כולל את הפרסומות, המדיה ותצוגת הלוח החודשי */}
        <Route path="/" element={<HomePage />} />

        {/* עמוד טופס האימות (התחברות והרשמה) */}
        <Route path="/auth" element={<AuthForm />} />

        {/* האזור האישי החדש של הלקוח - מוגן ברישום */}
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
        {/* תיקון נתיב ברירת המחדל למקרה של כתובת שגויה */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

// פונקציית האפ הראשית משמשת אך ורק כמעטפת התשתית הגלובלית
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
