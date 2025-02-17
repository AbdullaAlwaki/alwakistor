"use client"; // ✅ تحديد أن هذا المكون هو Client Component

import React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // ✅ استيراد useRouter
import { useTranslation } from '../../[locale]/useTranslation';
import { useContext } from 'react';
import { DarkModeContext } from '../../../context/DarkModeContext'; // استيراد DarkModeContext

export default function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState<string>('en');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // ✅ إضافة رسالة نجاح
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation(locale);
  const { isDarkMode } = useContext(DarkModeContext); // استخدام DarkModeContext
  const router = useRouter(); // ✅ استخدام useRouter

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
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t('login.error'));
        return;
      }

      setSuccessMessage(t('login.success')); // ✅ عرض رسالة النجاح
      setTimeout(() => {
        router.push('/'); // ✅ إعادة التوجيه إلى الصفحة الرئيسية
      }, 2000); // انتظار 2 ثانية قبل إعادة التوجيه
    } catch (err) {
      setError(t('login.error'));
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
        <h1 className="text-3xl font-bold">{t('login.title')}</h1>
        {/* حقل البريد الإلكتروني */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            {t('login.email')}
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
            {t('login.password')}
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
        {/* زر تسجيل الدخول */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full px-4 py-2 rounded text-white ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isLoading ? t('login.loading') : t('login.submit')}
        </button>
        {/* عرض رسالة الخطأ */}
        {error && <p className={`text-red-500 text-sm text-center`}>{error}</p>}
        {/* عرض رسالة النجاح */}
        {successMessage && <p className={`text-green-500 text-sm text-center`}>{successMessage}</p>}
        {/* رابط استعادة كلمة المرور */}
        <div className="mt-4 text-center">
          <Link href={`/${locale}/forgot-password`} className={`hover:underline ${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`}>
            {t('login.forgotPassword')}
          </Link>
        </div>
        {/* زر إعادة إرسال رمز التأكيد إذا كان البريد غير مؤكد */}
        {error === 'يرجى تأكيد بريدك الإلكتروني أولاً' && (
          <div className="mt-4 text-center">
            <button
              onClick={() => resendVerificationEmail(email)}
              className={`hover:underline ${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`}
            >
              إعادة إرسال رابط التأكيد
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

// دالة لإعادة إرسال رمز التأكيد
async function resendVerificationEmail(email: string) {
  try {
    const response = await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message);
    } else {
      alert(data.error || 'حدث خطأ أثناء إعادة إرسال رابط التأكيد.');
    }
  } catch (error) {
    alert('حدث خطأ أثناء إعادة إرسال رابط التأكيد.');
  }
}