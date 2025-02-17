"use client"; // ✅ تحديد أن هذا المكون هو Client Component

import React, { createContext, useContext, useState } from 'react';

// تعريف نوع السياق
interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

// إنشاء السياق
const AuthContext = createContext<AuthContextType | null>(null);

// مزود السياق
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // دالة تسجيل الدخول
  const login = () => {
    setIsAuthenticated(true);
  };

  // دالة تسجيل الخروج
  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook لاستخدام السياق
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};