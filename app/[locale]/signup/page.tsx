"use client"; // تحديد أن هذا المكون هو Client Component

import React, { useEffect } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '../../[locale]/useTranslation';

export default function SignupPage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState<string>('en');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation(locale);

  useEffect(() => {
    if (params) {
      params.then((unwrappedParams) => {
        setLocale(unwrappedParams.locale);
      });
    }
  }, [params]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      alert(t('signup.success'));
      window.location.href = `/${locale}/login`; // إعادة التوجيه إلى صفحة تسجيل الدخول
    } else {
      alert(data.error || t('signup.error'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('signup.title')}</h1>
        {/* حقل الاسم */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            {t('signup.name')}
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {/* حقل البريد الإلكتروني */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            {t('signup.email')}
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
        {/* حقل كلمة المرور */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            {t('signup.password')}
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {/* زر إنشاء الحساب */}
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
        >
          {t('signup.submit')}
        </button>
        {/* رابط تسجيل الدخول */}
        <div className="mt-4 text-center">
          <Link href={`/${locale}/login`} className="text-blue-500 hover:underline">
            {t('signup.loginLink')}
          </Link>
        </div>
      </form>
    </div>
  );
}