"use client"; // ✅ تحديد أن هذا المكون هو Client Component
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { DarkModeContext } from "../../../context/DarkModeContext";
import { useTranslation } from "../useTranslation";
import { LogIn, LogOut, Moon, Sun, Settings } from "lucide-react";
import ReactCountryFlag from "react-country-flag";

export default function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>; // ✅ تعريف الـ params كـ Promise
}) {
  const [locale, setLocale] = useState<string>("en"); // ✅ حالة للغة
  const { isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = React.useContext(DarkModeContext);
  const [t, setT] = useState<any>((key: string) => key); // ✅ حالة مؤقتة للترجمة

  useEffect(() => {
    // فك تغليف الـ params باستخدام then
    params.then((unwrappedParams) => {
      setLocale(unwrappedParams.locale); // ✅ تحديث اللغة
      // تحديث الترجمة بناءً على اللغة الجديدة
      import(`../../../[locale]/translations/${unwrappedParams.locale}.json`).then(
        (translations) => {
          setT((key: string) => translations[key] || key);
        }
      );
    });
  }, [params]);

  // دالة لتأكيد تسجيل الخروج
  const handleLogout = () => {
    if (confirm(t("settings.logoutConfirmation"))) {
      logout();
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md mt-10">
      {/* العنوان */}
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        {t("settings.title")}
      </h1>

      {/* تبديل اللغة */}
      <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
        <span className="text-gray-800 dark:text-gray-200">{t("settings.language")}</span>
        <Link
          href={`/${locale === "ar" ? "en" : "ar"}`}
          className="flex items-center gap-2 text-primary-600 hover:underline"
        >
          {locale === "ar" ? (
            <>
              <ReactCountryFlag countryCode="US" svg style={{ width: "1.5em", height: "1.5em" }} />
              English
            </>
          ) : (
            <>
              <ReactCountryFlag countryCode="SA" svg style={{ width: "1.5em", height: "1.5em" }} />
              العربية
            </>
          )}
        </Link>
      </div>

      {/* تبديل الوضع المظلم */}
      <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
        <span className="text-gray-800 dark:text-gray-200">{t("settings.darkMode")}</span>
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 p-2 rounded-lg"
        >
          {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
          {isDarkMode ? t("settings.dark") : t("settings.light")}
        </button>
      </div>

      {/* تسجيل الدخول / الخروج */}
      <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
        <span className="text-gray-800 dark:text-gray-200">{t("settings.account")}</span>
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:underline"
          >
            <LogOut size={20} />
            {t("settings.logout")}
          </button>
        ) : (
          <Link
            href={`/${locale}/login`}
            className="flex items-center gap-2 text-primary-600 hover:underline"
          >
            <LogIn size={20} />
            {t("settings.login")}
          </Link>
        )}
      </div>
    </div>
  );
}
