import React, { createContext, useState, useEffect } from 'react';

// 1. יצירת ה-Context עצמו (צינור העברת הנתונים הריק)
export const AuthContext = createContext(null);

// 2. יצירת רכיב ה-Provider (המעטפת שמחזיקה את הלוגיקה והנתונים)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // משתנה חיוני לבדיקה שהטעינה מהדפדפן הסתיימה

  // useEffect שמופעל פעם אחת בטעינת האתר - בודק אם המשתמש כבר מחובר בזיכרון של הדפדפן
  useEffect(() => {
    const savedUser = localStorage.getItem('pool_user');
    const savedToken = localStorage.getItem('pool_token');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setLoading(false); // הטעינה הראשונית מהזיכרון הסתיימה
  }, []);

  // פונקציית עזר לעדכון הנתונים בזמן התחברות מוצלחת
  const loginSuccess = (newToken, userData) => {
    localStorage.setItem('pool_token', newToken);
    localStorage.setItem('pool_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  // פונקציית עזר להתנתקות מהמערכת ומחיקת הזיכרון
  const logout = () => {
    localStorage.removeItem('pool_token');
    localStorage.removeItem('pool_user');
    setToken(null);
    setUser(null);
  };

  // הנתונים והפונקציות שאנחנו חושפים לכל מי שמחובר לענן הגלובלי
  const contextValue = {
    user,
    token,
    loading,
    loginSuccess,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}