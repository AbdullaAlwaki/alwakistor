"use client"; // ✅ تحديد أن هذا المكون هو Client Component

import React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from '../../[locale]/useTranslation';
import { useContext } from 'react';
import { DarkModeContext } from '../../../context/DarkModeContext'; // استيراد DarkModeContext

export default function SignupPage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState<string>('en');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation(locale);
  const { isDarkMode } = useContext(DarkModeContext); // استخدام DarkModeContext

  React.useEffect(() => {
    if (params) {
      params.then((unwrappedParams) => {
        setLocale(unwrappedParams.locale);
      });
    }
  }, [params]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // مسح أي أخطاء سابقة
    setIsLoading(true); // تعطيل الزر أثناء الإرسال

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t('signup.error'));
        return;
      }

      alert(t('signup.success'));
      window.location.href = `/${locale}/login`; // إعادة التوجيه إلى صفحة تسجيل الدخول
    } catch (err) {
      setError(t('signup.error'));
    } finally {
      setIsLoading(false); // تمكين الزر مرة أخرى
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} flex items-center justify-center p-4`}>
      <form
        onSubmit={handleSubmit}
        className={`${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        } p-8 rounded-lg shadow-md w-full max-w-md space-y-6`}
      >
        <h1 className="text-3xl font-bold">{t('signup.title')}</h1>
        {/* حقل الاسم */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            {t('signup.name')}
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-2 border rounded ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-green-500`}
            required
          />
        </div>
        {/* حقل البريد الإلكتروني */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            {t('signup.email')}
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-2 border rounded ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-green-500`}
            required
          />
        </div>
        {/* حقل كلمة المرور */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            {t('signup.password')}
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-2 border rounded ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-green-500`}
            required
          />
        </div>
        {/* زر إنشاء الحساب */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full px-4 py-2 rounded text-white ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isLoading ? t('signup.loading') : t('signup.submit')}
        </button>
        {/* عرض رسالة الخطأ */}
        {error && <p className={`text-red-500 text-sm text-center`}>{error}</p>}
        {/* رابط تسجيل الدخول */}
        <div className="mt-4 text-center">
          <Link href={`/${locale}/login`} className={`hover:underline ${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`}>
            {t('signup.loginLink')}
          </Link>
        </div>
      </form>
    </div>
  );
}