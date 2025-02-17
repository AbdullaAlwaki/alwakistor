"use client"; // ✅ تحديد أن هذا المكون هو Client Component

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTranslation } from '../useTranslation';

export default function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState<string>('en');
  const { t } = useTranslation(locale);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (params) {
      params.then((unwrappedParams) => {
        setLocale(unwrappedParams.locale);
      });
    }
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // مسح أي أخطاء سابقة
    setIsLoading(true); // تعطيل الزر أثناء الإرسال

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || t('login.error'));
        return;
      }

      // إعادة توجيه المستخدم إلى الصفحة الرئيسية بعد تسجيل الدخول
      window.location.href = '/';
    } catch (err) {
      setError(t('login.error'));
    } finally {
      setIsLoading(false); // تمكين الزر مرة أخرى
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('login.title')}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* حقل البريد الإلكتروني */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
              {t('login.email')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          {/* حقل كلمة المرور */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
              {t('login.password')}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          {/* زر تسجيل الدخول */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
          >
            {isLoading ? t('login.loading') : t('login.submit')}
          </button>
        </form>
        {/* عرض رسالة الخطأ */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {/* رابط استعادة كلمة المرور */}
        <div className="text-center">
          <Link href={`/${locale}/forgot-password`} className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
            {t('login.forgotPassword')}
          </Link>
        </div>
      </div>
    </div>
  );
}