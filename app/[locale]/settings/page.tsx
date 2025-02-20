"use client"; // ✅ تحديد أن هذا المكون هو Client Component

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ✅ استيراد useRouter
import { useTranslation } from "../../[locale]/useTranslation";
import { useContext } from "react";
import { DarkModeContext } from "../../../context/DarkModeContext"; // استيراد DarkModeContext

export default function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState<string>("en"); // ✅ حالة للغة
  const [t, setT] = useState<any>({}); // ✅ حالة مؤقتة للترجمة
  const router = useRouter(); // ✅ استخدام useRouter
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext); // استخدام DarkModeContext

  // فك تغليف الـ params واستخدام useTranslation
  useEffect(() => {
    if (params) {
      params
        .then((unwrappedParams) => {
          if (unwrappedParams && unwrappedParams.locale) {
            setLocale(unwrappedParams.locale); // تحديث الحالة
          }
        })
        .catch((error) => {
          console.error("Error resolving params:", error);
        });
    }
  }, [params]);

  // تحديث الترجمات عند تغيير locale
  useEffect(() => {
    const translations = useTranslation(locale);
    setT(translations);
  }, [locale]);

  // دالة لتغيير اللغة
  const handleLanguageChange = (newLocale: string) => {
    setLocale(newLocale); // تحديث الحالة
    localStorage.setItem("locale", newLocale); // تخزين اللغة الجديدة
    const translations = useTranslation(newLocale);
    setT(translations); // تحديث الترجمات
    router.push(`/${newLocale}/settings`); // إعادة التوجيه باستخدام useRouter
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} flex items-center justify-center p-4`}>
      <div
        className={`${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        } p-8 rounded-lg shadow-md w-full max-w-md space-y-6`}
      >
        {/* العنوان */}
        <h1 className="text-3xl font-bold">{t('settings.title') || "Settings"}</h1>

        {/* تبديل اللغة */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('settings.language') || "Language"}
          </label>
          <button
            onClick={() => handleLanguageChange(locale === "ar" ? "en" : "ar")}
            className={`w-full px-4 py-2 rounded ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-green-500`}
          >
            {locale === "ar" ? (
              <>
                <span>English</span>
              </>
            ) : (
              <>
                <span>العربية</span>
              </>
            )}
          </button>
        </div>

        {/* تبديل الوضع المظلم */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('settings.darkMode') || "Dark Mode"}
          </label>
          <button
            onClick={toggleDarkMode}
            className={`w-full px-4 py-2 rounded ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-green-500`}
          >
            {isDarkMode
              ? t('settings.light') || "Light Mode"
              : t('settings.dark') || "Dark Mode"}
          </button>
        </div>

        {/* تسجيل الدخول / الخروج */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('settings.account') || "Account"}
          </label>
          <Link
            href={`/${locale}/login`}
            className={`w-full px-4 py-2 rounded block text-center ${
              isDarkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'
            } text-white focus:outline-none focus:ring-2 focus:ring-green-500`}
          >
            {t('settings.login') || "Login"}
          </Link>
        </div>
      </div>
    </div>
  );
}