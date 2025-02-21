"use client"; // ✅ تحديد أن هذا المكون هو Client Component
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ✅ استيراد useRouter
import { useTranslation } from "../../[locale]/useTranslation";
import { useContext } from "react";
import { DarkModeContext } from "../../../context/DarkModeContext"; // استيراد DarkModeContext
import { useAuth } from "../../../context/AuthContext"; // ✅ استيراد السياق للمصادقة

export default function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState<string>("en");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // ✅ إضافة رسالة نجاح
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation(locale);
  const { isDarkMode } = useContext(DarkModeContext); // استخدام DarkModeContext
  const { login } = useAuth(); // ✅ استخدام السياق للمصادقة
  const router = useRouter(); // ✅ استخدام useRouter

  useEffect(() => {
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
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.redirect) {
          // إذا كان هناك توجيه إلى صفحة التسجيل
          router.push(`/${locale}${data.redirect}`);
          return;
        }
        setError(data.error || t("login.error"));
        return;
      }

      // تسجيل الدخول باستخدام السياق
      login(data.token, data.user); // ✅ تخزين JWT وبيانات المستخدم في السياق

      setSuccessMessage(t("login.success")); // ✅ عرض رسالة النجاح
      setTimeout(() => {
        router.push("/"); // ✅ إعادة التوجيه إلى الصفحة الرئيسية
      }, 2000); // انتظار 2 ثانية قبل إعادة التوجيه
    } catch (err) {
      setError(t("login.error"));
    } finally {
      setIsLoading(false); // تمكين الزر مرة أخرى
    }
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-100"} flex items-center justify-center p-4`}
    >
      <form
        onSubmit={handleSubmit}
        className={`${
          isDarkMode ? "bg-gray-800 text-white shadow-lg" : "bg-white text-gray-800 shadow-md"
        } p-8 rounded-lg w-full max-w-md space-y-6`}
      >
        {/* عنوان الصفحة */}
        <h1 className="text-3xl font-bold text-center">{t("login.title")}</h1>

        {/* حقل البريد الإلكتروني */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            {t("login.email")}
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 pl-10 border rounded ${
                isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder={t("login.emailPlaceholder")}
              required
            />
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </span>
          </div>
        </div>

        {/* حقل كلمة المرور */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            {t("login.password")}
          </label>
          <div className="relative">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 pl-10 border rounded ${
                isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder={t("login.passwordPlaceholder")}
              required
            />
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </span>
          </div>
        </div>

        {/* زر تسجيل الدخول */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full px-4 py-3 rounded text-white ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          } transition duration-300 ease-in-out`}
        >
          {isLoading ? t("login.loading") : t("login.submit")}
        </button>

        {/* عرض رسالة الخطأ */}
        {error && (
          <p className="text-red-500 text-sm text-center bg-red-100 dark:bg-red-900 p-3 rounded">
            {error}
          </p>
        )}

        {/* عرض رسالة النجاح */}
        {successMessage && (
          <p className="text-green-500 text-sm text-center bg-green-100 dark:bg-green-900 p-3 rounded">
            {successMessage}
          </p>
        )}

        {/* رابط التسجيل */}
        <div className="mt-4 text-center">
          <Link
            href={`/${locale}/signup`}
            className={`hover:underline ${isDarkMode ? "text-blue-300" : "text-blue-500"}`}
          >
            {t("login.signUp")}
          </Link>
        </div>
      </form>
    </div>
  );
}