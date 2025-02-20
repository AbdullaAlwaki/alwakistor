"use client";
import { useRouter } from "next/navigation";
import React, { useState, useContext } from "react";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { DarkModeContext } from "../../../context/DarkModeContext";
import { LogIn, LogOut, Moon, Sun } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "../../[locale]/useTranslation";

export default function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState<string>("en");
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { t } = useTranslation(locale);

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
      router.push(`/${locale}/login`);
    }
  };

  const handleLanguageChange = (newLocale: string) => {
    setLocale(newLocale);
    localStorage.setItem("locale", newLocale);
    router.push(`/${newLocale}/settings`);
    window.location.reload();
  };

  return (
    <div className={`max-w-lg mx-auto p-6 rounded-lg shadow-md mt-10 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    }`}>
      <h1 className="text-2xl font-bold text-center mb-6">
        {t('settings.title')}
      </h1>

      {/* Language Settings */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <span>{t('settings.language')}</span>
        <button
          onClick={() => handleLanguageChange(locale === "ar" ? "en" : "ar")}
          className="flex items-center gap-2 hover:underline"
        >
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

      {/* Dark Mode Settings */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <span>{t('settings.darkMode')}</span>
        <button
          onClick={toggleDarkMode}
          className={`flex items-center gap-2 p-2 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}
        >
          {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
          {isDarkMode ? t('settings.dark') : t('settings.light')}
        </button>
      </div>

      {/* Account Settings */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <span>{t('settings.account')}</span>
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:underline"
          >
            <LogOut size={20} />
            {t('settings.logout')}
          </button>
        ) : (
          <Link
            href={`/${locale}/login`}
            className="flex items-center gap-2 text-green-500 hover:underline"
          >
            <LogIn size={20} />
            {t('settings.login')}
          </Link>
        )}
      </div>

      {/* Additional Settings Link (Example) */}
      <div className="mt-6 text-center">
        <Link 
          href={`/${locale}/profile`} 
          className={`hover:underline ${
            isDarkMode ? 'text-blue-300' : 'text-blue-500'
          }`}
        >
          {t('settings.editProfile')}
        </Link>
      </div>
    </div>
  );
}