"use client"; // ✅ تحديد أن هذا المكون هو Client Component
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "../../[locale]/useTranslation";

export default function VerifyEmailPage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState<string>("en");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation(locale);
  const router = useRouter();

  useEffect(() => {
    if (params) {
      params.then((unwrappedParams) => {
        setLocale(unwrappedParams.locale);
      });
    }

    // استخراج token و email من عنوان URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token")?.trim(); // ✅ إزالة المسافات الزائدة
    const email = urlParams.get("email")?.trim(); // ✅ إزالة المسافات الزائدة

    console.log("Extracted Token:", token); // ✅ تسجيل الـ token للتحقق منه
    console.log("Extracted Email:", email); // ✅ تسجيل البريد الإلكتروني للتحقق منه

    if (!token || !email) {
      setError(t("verify.invalidLink")); // ✅ عرض رسالة الخطأ إذا كان الرابط غير صالح
      return;
    }

    // التحقق من صلاحية الرابط باستخدام نقطة النهاية
    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data); // ✅ تسجيل استجابة API للتحقق منها
        if (data.error) {
          setError(data.error); // ✅ عرض رسالة الخطأ إذا كانت هناك مشكلة
        } else {
          setMessage(data.message); // ✅ عرض رسالة النجاح
          setTimeout(() => {
            router.push(`/${locale}/login`); // ✅ إعادة التوجيه إلى تسجيل الدخول بعد التأكيد
          }, 3000); // انتظار 3 ثوانٍ قبل إعادة التوجيه
        }
      })
      .catch((err) => {
        console.error("Fetch Error:", err); // ✅ تسجيل خطأ الطلب
        setError(t("verify.error")); // ✅ عرض رسالة الخطأ العامة
      });
  }, [params]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md space-y-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          {t("verify.title")}
        </h1>
        {message && <p className="text-green-500 text-sm">{message}</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
}