"use client"; // ✅ تحديد أن هذا المكون هو Client Component
import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie"; // ✅ استيراد مكتبة Cookies لإدارة JWT

// تعريف نوع السياق
interface AuthContextType {
  isAuthenticated: boolean;
  user: { id: string; name: string; email: string; role: string } | null; // ✅ إضافة بيانات المستخدم
  login: (token: string, userData: { id: string; name: string; email: string; role: string }) => void; // ✅ دالة تسجيل الدخول
  logout: () => void; // ✅ دالة تسجيل الخروج
}

// إنشاء السياق
const AuthContext = createContext<AuthContextType | null>(null);

// مزود السياق
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);

  // التحقق من وجود JWT عند تحميل الصفحة
  useEffect(() => {
    const token = Cookies.get("token"); // ✅ استرداد JWT من ملفات تعريف الارتباط
    if (token) {
      try {
        // فك تشفير JWT واستخراج بيانات المستخدم
        const decodedToken = JSON.parse(atob(token.split(".")[1])); // ✅ فك تشفير JWT
        setUser({
          id: decodedToken.id,
          name: decodedToken.name,
          email: decodedToken.email,
          role: decodedToken.role,
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error("خطأ في فك تشفير JWT:", error);
        logout(); // ✅ تسجيل الخروج إذا كان JWT غير صالح
      }
    }
  }, []);

  // دالة تسجيل الدخول
  const login = (token: string, userData: { id: string; name: string; email: string; role: string }) => {
    Cookies.set("token", token, { expires: 1 }); // ✅ تخزين JWT في ملفات تعريف الارتباط لمدة يوم واحد
    setUser(userData); // ✅ تحديث بيانات المستخدم
    setIsAuthenticated(true); // ✅ تحديث حالة المصادقة
  };

  // دالة تسجيل الخروج
  const logout = () => {
    Cookies.remove("token"); // ✅ إزالة JWT من ملفات تعريف الارتباط
    setUser(null); // ✅ إعادة تعيين بيانات المستخدم
    setIsAuthenticated(false); // ✅ تحديث حالة المصادقة
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook لاستخدام السياق
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};