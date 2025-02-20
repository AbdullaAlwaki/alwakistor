"use client"; // تحديد أن هذا المكون هو Client Component

import { useRouter } from "next/navigation"; // استخدام next/navigation
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { DarkModeContext } from "../../../context/DarkModeContext";
import { LogIn, LogOut, Moon, Sun, Settings } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "../useTranslation";

export default function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState<string>("en"); // حالة للغة
  const [t, setT] = useState<any>({}); // حالة مؤقتة للترجمة
  const router = useRouter(); // استخدام useRouter من next/navigation

  const { isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = React.useContext(DarkModeContext);

  // فك تغليف الـ params واستخدام useTranslation
  useEffect(() => {
    params
      .then((unwrappedParams) => {
        if (unwrappedParams && unwrappedParams.locale) {
          const selectedLocale = unwrappedParams.locale;
          setLocale(selectedLocale); // تحديث الحالة
          localStorage.setItem("locale", selectedLocale); // تخزين اللغة في localStorage
          const translations = useTranslation(selectedLocale);
          setT(translations);
        } else {
          // إذا لم يكن هناك locale في params، استخدم القيمة المخزنة في localStorage
          const storedLocale = localStorage.getItem("locale") || "en";
          setLocale(storedLocale);
          const translations = useTranslation(storedLocale);
          setT(translations);
        }
      })
      .catch((error) => {
        console.error("Error resolving params:", error);
        // إذا حدث خطأ، استخدم القيمة المخزنة في localStorage أو الافتراضية
        const storedLocale = localStorage.getItem("locale") || "en";
        setLocale(storedLocale);
        const translations = useTranslation(storedLocale);
        setT(translations);
      });
  }, [params]);

  // دالة لتأكيد تسجيل الخروج
  const handleLogout = () => {
    if (confirm(t["settings.logoutConfirmation"] || "Are you sure?")) {
      logout();
    }
  };

  // دالة لتغيير اللغة
  const handleLanguageChange = (newLocale: string) => {
    setLocale(newLocale); // تحديث الحالة
    localStorage.setItem("locale", newLocale); // تخزين اللغة الجديدة
    const translations = useTranslation(newLocale);
    setT(translations); // تحديث الترجمات
    router.push(`/${newLocale}/settings`); // إعادة التوجيه باستخدام next/navigation
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md mt-10">
      {/* العنوان */}
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        {t["settings.title"] || "Settings"}
      </h1>

      {/* تبديل اللغة */}
      <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
        <span className="text-gray-800 dark:text-gray-200">
          {t["settings.language"] || "Language"}
        </span>
        <button
          onClick={() => handleLanguageChange(locale === "ar" ? "en" : "ar")}
          className="flex items-center gap-2 text-primary-600 hover:underline"
        >
          {locale === "ar" ? (
            <>
              <ReactCountryFlag
                countryCode="US"
                svg
                style={{ width: "1.5em", height: "1.5em" }}
              />
              English
            </>
          ) : (
            <>
              <ReactCountryFlag
                countryCode="SA"
                svg
                style={{ width: "1.5em", height: "1.5em" }}
              />
              العربية
            </>
          )}
        </button>
      </div>

      {/* تبديل الوضع المظلم */}
      <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
        <span className="text-gray-800 dark:text-gray-200">
          {t["settings.darkMode"] || "Dark Mode"}
        </span>
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 p-2 rounded-lg"
        >
          {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
          {isDarkMode
            ? t["settings.dark"] || "Dark"
            : t["settings.light"] || "Light"}
        </button>
      </div>

      {/* تسجيل الدخول / الخروج */}
      <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
        <span className="text-gray-800 dark:text-gray-200">
          {t["settings.account"] || "Account"}
        </span>
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:underline"
          >
            <LogOut size={20} />
            {t["settings.logout"] || "Logout"}
          </button>
        ) : (
          <Link
            href={`/${locale}/login`}
            className="flex items-center gap-2 text-primary-600 hover:underline"
          >
            <LogIn size={20} />
            {t["settings.login"] || "Login"}
          </Link>
        )}
      </div>
    </div>
  );
}