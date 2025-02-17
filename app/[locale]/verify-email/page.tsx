"use client"; // ✅ تحديد أن هذا المكون هو Client Component

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const email = urlParams.get('email');

    if (!token || !email) {
      setMessage('رابط التأكيد غير صالح.');
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
          }, 2000);
        } else {
          setMessage(data.message || 'حدث خطأ أثناء تأكيد البريد الإلكتروني.');
        }
      })
      .catch(() => {
        setMessage('حدث خطأ أثناء تأكيد البريد الإلكتروني.');
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">تأكيد البريد الإلكتروني</h1>
        <p>{message}</p>
      </div>
    </div>
  );
}