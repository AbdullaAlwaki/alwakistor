"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { DarkModeContext } from "../../../context/DarkModeContext";
import { LogIn, LogOut, Moon, Sun } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "../../[locale]/useTranslation"; // تأكد من المسار

export default function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState<string>("en");
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = React.useContext(DarkModeContext);
  const { t } = useTranslation(locale); // الترجمة المباشرة

  React.useEffect(() => {
    if (params) {
      params.then((unwrappedParams) => {
        const selectedLocale = unwrappedParams?.locale || localStorage.getItem("locale") || "en";
        setLocale(selectedLocale);
        localStorage.setItem("locale", selectedLocale);
      });
    }
  }, [params]);

  const handleLogout = () => {
    if (confirm(t('settings.logoutConfirmation'))) {
      logout();
    }
  };

  const handleLanguageChange = (newLocale: string) => {
    setLocale(newLocale);
    localStorage.setItem("locale", newLocale);
    router.push(`/${newLocale}/settings`);
    window.location.reload(); // إعادة تحميل للتأكد من التحديث
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        {t('settings.title')}
      </h1>

      {/* باقي العناصر مع تعديل طريقة العرض */}
      <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
        <span className="text-gray-800 dark:text-gray-200">
          {t('settings.language')}
        </span>
        <button onClick={() => handleLanguageChange(locale === "ar" ? "en" : "ar")}
          className="flex items-center gap-2 text-primary-600 hover:underline">
          {locale === "ar" ? (
            <>
              <ReactCountryFlag countryCode="US" svg style={{ width: "1.5em", height: "1.5em" }} />
              {t('settings.english')}
            </>
          ) : (
            <>
              <ReactCountryFlag countryCode="SA" svg style={{ width: "1.5em", height: "1.5em" }} />
              {t('settings.arabic')}
            </>
          )}
        </button>
      </div>

      {/* ... باقي العناصر بنفس النمط ... */}
    </div>
  );
}