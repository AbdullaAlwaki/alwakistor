"use client"; // تحديد أن هذا المكون هو Client Component

import React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from '../useTranslation';

export default function ForgotPasswordPage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState<string>('en');
  const [email, setEmail] = useState('');
  const { t } = useTranslation(locale);

  React.useEffect(() => {
    if (params) {
      params.then((unwrappedParams) => {
        setLocale(unwrappedParams.locale);
      });
    }
  }, [params]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (res.ok) {
      alert(t('forgotPassword.success'));
    } else {
      alert(data.error || t('forgotPassword.error'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('forgotPassword.title')}</h1>
        {/* حقل البريد الإلكتروني */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            {t('forgotPassword.email')}
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {/* زر استعادة كلمة المرور */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          {t('forgotPassword.submit')}
        </button>
        {/* رابط تسجيل الدخول */}
        <div className="mt-4 text-center">
          <Link href={`/${locale}/login`} className="text-blue-500 hover:underline">
            {t('forgotPassword.loginLink')}
          </Link>
        </div>
      </form>
    </div>
  );
}