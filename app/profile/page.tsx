"use client"; // تحديد أن هذا المكون هو Client Component

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react'; // أيقونات من مكتبة Lucide React

export default function ProfilePage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // تحميل الثيم عند بدء التطبيق
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme as 'light' | 'dark');
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  // دالة لتبديل الثيم
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme); // حفظ الثيم في localStorage
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark'); // تطبيق الثيم على الصفحة
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">البروفايل</h1>

      {/* إعدادات المستخدم */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
        <p className="text-gray-700 dark:text-gray-300 font-medium">الاسم: أحمد محمد</p>
        <p className="text-gray-700 dark:text-gray-300 font-medium">البريد الإلكتروني: ahmed@example.com</p>
        <p className="text-gray-700 dark:text-gray-300 font-medium">رقم الهاتف: +966123456789</p>
      </div>

      {/* إعدادات الثيم */}
      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">إعدادات الثيم</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <span className="text-gray-700 dark:text-gray-300">
            الوضع الحالي: {theme === 'light' ? 'فاتح' : 'داكن'}
          </span>
        </div>
      </div>
    </div>
  );
}