"use client"; // تحديد أن هذا المكون هو Client Component

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react'; // أيقونات من مكتبة Lucide React
import { useTranslation } from '../../[locale]/useTranslation';
import React from 'react';

export default function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [locale, setLocale] = useState<string>('en');
  const { t } = useTranslation(locale);

  // تحميل الثيم عند بدء التطبيق
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme as 'light' | 'dark');
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  // تحميل اللغة عند بدء التطبيق
  useEffect(() => {
    if (params) {
      params.then((unwrappedParams) => {
        setLocale(unwrappedParams.locale);
      });
    }
  }, [params]);

  // دالة لتبديل الثيم
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme); // حفظ الثيم في localStorage
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark'); // تطبيق الثيم على الصفحة
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      {/* العنوان */}
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{t('profile.title')}</h1>

      {/* إعدادات المستخدم */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
        <p className="text-gray-700 dark:text-gray-300 font-medium">
          {t('profile.name')}: أحمد محمد
        </p>
        <p className="text-gray-700 dark:text-gray-300 font-medium">
          {t('profile.email')}: ahmed@example.com
        </p>
        <p className="text-gray-700 dark:text-gray-300 font-medium">
          {t('profile.phone')}: +966123456789
        </p>
      </div>

      {/* إعدادات الثيم */}
      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          {t('profile.themeSettings')}
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <span className="text-gray-700 dark:text-gray-300">
            {t('profile.currentMode')}: {theme === 'light' ? t('profile.lightMode') : t('profile.darkMode')}
          </span>
        </div>
      </div>
    </div>
  );
}