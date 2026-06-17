import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const savedUser = localStorage.getItem('pool_user');
    const savedToken = localStorage.getItem('pool_token');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setLoading(false); 
  }, []);

  const loginSuccess = (newToken, userData) => {
    localStorage.setItem('pool_token', newToken);
    localStorage.setItem('pool_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('pool_token');
    localStorage.removeItem('pool_user');
    setToken(null);
    setUser(null);
  };

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