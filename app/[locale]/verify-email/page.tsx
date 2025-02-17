"use client"; // ✅ تحديد أن هذا المكون هو Client Component

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true); // ✅ إضافة حالة التحميل
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const email = urlParams.get('email');

    // التحقق من وجود الرمز والبريد الإلكتروني
    if (!token || !email) {
      setMessage('رابط التأكيد غير صالح.');
      setIsLoading(false); // ✅ تحديث حالة التحميل
      return;
    }

    // التحقق من صحة الرمز
    fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessage('تم تأكيد بريدك الإلكتروني بنجاح.');
          setTimeout(() => {
            router.push('/login'); // إعادة التوجيه إلى صفحة تسجيل الدخول
          }, 2000); // انتظار 2 ثانية قبل إعادة التوجيه
        } else {
          setMessage(data.message || 'حدث خطأ أثناء تأكيد البريد الإلكتروني.');
        }
      })
      .catch(() => {
        setMessage('حدث خطأ أثناء تأكيد البريد الإلكتروني.');
      })
      .finally(() => {
        setIsLoading(false); // ✅ تحديث حالة التحميل بعد انتهاء العملية
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">تأكيد البريد الإلكتروني</h1>
        {isLoading ? (
          <p className="text-primary-500">جارٍ التحقق من رابط التأكيد...</p> // ✅ عرض رسالة التحميل
        ) : (
          <p className={message.includes('نجاح') ? 'text-green-500' : 'text-red-500'}>{message}</p>
        )}
      </div>
    </div>
  );
}