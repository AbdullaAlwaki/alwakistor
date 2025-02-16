'use client'; // تحديد أن هذا المكون هو Client Component

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react'; // أيقونات من مكتبة Lucide React

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  // تحميل الثيم عند بدء التطبيق
  useEffect(() => {
    // التحقق من تفضيلات النظام
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDarkMode);
    document.documentElement.classList.toggle('dark', prefersDarkMode);

    // التحقق من localStorage للحصول على الثيم المحفوظ
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // دالة لتبديل الثيم
  const toggleTheme = () => {
    const newTheme = darkMode ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme); // حفظ الثيم في localStorage
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark'); // تطبيق الثيم على الصفحة
  };

  return (
    <button
      onClick={toggleTheme}
      className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white p-2 rounded-full"
    >
      {/* عرض أيقونة الشمس أو القمر بناءً على الثيم الحالي */}
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}