"use client"; // ✅ تحديد أن هذا المكون هو Client Component

import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setIsDarkMode(localStorage.getItem('darkMode') === 'true');
    };

    // تحديث الوضع المظلم بناءً على localStorage
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }

    // استماع لتغيرات localStorage
    window.addEventListener('storage', handleStorageChange);

    // تنظيف الحدث عند إلغاء المكون
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev); // تحديث الحالة مباشرة
  };

  return { isDarkMode, toggleDarkMode };
}