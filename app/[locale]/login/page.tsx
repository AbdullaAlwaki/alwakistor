"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTranslation } from '../useTranslation';

export default function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState<string>('en');
  const { t } = useTranslation(locale);

  useEffect(() => {
    if (params) {
      params.then((unwrappedParams) => {
        setLocale(unwrappedParams.locale);
      });
    }
  }, [params]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('login.title')}</h1>
        <form className="space-y-4">
          {/* حقل البريد الإلكتروني */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
              {t('login.email')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
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
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          {/* زر تسجيل الدخول */}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {t('login.submit')}
          </button>
        </form>
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