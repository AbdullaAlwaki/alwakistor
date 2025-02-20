"use client";
import { useRouter } from "next/navigation";
import { useState, useContext, useEffect, memo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import { DarkModeContext } from "../../../context/DarkModeContext";
import { LogIn, LogOut, Moon, Sun, Settings, Shield } from "lucide-react";
import { useTranslation } from "../../[locale]/useTranslation";

// Dynamic Imports for better performance
const ReactCountryFlag = dynamic(
  () => import("react-country-flag"),
  { ssr: false }
);

const Spinner = () => (
  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
);

const SettingsPage = ({ params }: { params: Promise<{ locale: string }> }) => {
  const [locale, setLocale] = useState("en");
  const [isChangingLang, setIsChangingLang] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { t } = useTranslation(locale);
  const router = useRouter();

  useEffect(() => {
    params.then(({ locale: l }) => {
      const newLocale = l || localStorage.getItem("locale") || "en";
      setLocale(newLocale);
      localStorage.setItem("locale", newLocale);
    });
  }, [params]);

  const handleLogout = async () => {
    if (!confirm(t('settings.logoutConfirmation'))) return;
    
    setIsLoggingOut(true);
    try {
      await logout();
      router.push(`/${locale}/login`);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLanguageChange = async (newLocale: string) => {
    setIsChangingLang(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setLocale(newLocale);
      localStorage.setItem("locale", newLocale);
      router.push(`/${newLocale}/settings`);
    } finally {
      setIsChangingLang(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`min-h-screen bg-gradient-to-br ${
        isDarkMode 
          ? "from-gray-900 to-gray-800" 
          : "from-white to-gray-50"
      } flex items-center justify-center p-4 transition-colors duration-300`}
    >
      <div className={`w-full max-w-2xl rounded-2xl shadow-2xl ${
        isDarkMode ? "bg-gray-800/90" : "bg-white/90"
      } backdrop-blur-lg`}>
        <motion.div
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          className="p-8 space-y-6"
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              {t('settings.title')}
            </h1>
            <Settings size={28} className="text-gray-500" />
          </div>

          {/* Language Section */}
          <SectionWrapper title={t('settings.language')}>
            <LanguageButton
              locale={locale}
              t={t}
              isChangingLang={isChangingLang}
              onChange={handleLanguageChange}
            />
          </SectionWrapper>

          {/* Dark Mode Section */}
          <SectionWrapper title={t('settings.darkMode')}>
            <DarkModeToggle
              isDarkMode={isDarkMode}
              toggle={toggleDarkMode}
              t={t}
            />
          </SectionWrapper>

          {/* Notifications Section */}
          <SectionWrapper title={t('settings.notifications')}>
            <ToggleItem
              label={t('settings.emailNotifications')}
              checked={emailNotif}
              onChange={setEmailNotif}
            />
            <ToggleItem
              label={t('settings.pushNotifications')}
              checked={pushNotif}
              onChange={setPushNotif}
            />
          </SectionWrapper>

          {/* Account Section */}
          <SectionWrapper title={t('settings.account')}>
            {isAuthenticated ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm">{t('settings.accountStatus')}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">● {t('settings.verified')}</span>
                    <button 
                      className="text-sm text-blue-500 hover:underline"
                      onClick={() => router.push(`/${locale}/verify`)}
                    >
                      {t('settings.verify')}
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex justify-center items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all disabled:opacity-50"
                >
                  {isLoggingOut ? (
                    <>
                      <Spinner />
                      {t('settings.loggingOut')}
                    </>
                  ) : (
                    <>
                      <LogOut size={20} />
                      {t('settings.logout')}
                    </>
                  )}
                </button>
              </>
            ) : (
              <Link
                href={`/${locale}/login`}
                className="flex items-center gap-2 justify-center px-4 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-500 transition-all"
              >
                <LogIn size={20} />
                {t('settings.login')}
              </Link>
            )}
          </SectionWrapper>

          {/* Admin Section */}
          {user?.role === 'admin' && (
            <SectionWrapper title={
              <div className="flex items-center gap-2 text-red-500">
                <Shield size={18} />
                {t('settings.adminSettings')}
              </div>
            }>
              <button
                onClick={() => router.push(`/${locale}/admin`)}
                className="w-full px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all"
              >
                {t('settings.adminPanel')}
              </button>
            </SectionWrapper>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Memoized Components
const LanguageButton = memo(({ locale, t, isChangingLang, onChange }: any) => (
  <button
    onClick={() => onChange(locale === "ar" ? "en" : "ar")}
    disabled={isChangingLang}
    className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all disabled:opacity-50"
  >
    {isChangingLang ? (
      <div className="flex items-center gap-2">
        <Spinner />
        {t('settings.changing')}
      </div>
    ) : (
      <>
        <ReactCountryFlag
          countryCode={locale === "ar" ? "SA" : "US"}
          svg
          style={{ width: "1.5em", height: "1.5em" }}
        />
        <span className="font-medium">
          {locale === "ar" ? t('settings.english') : t('settings.arabic')}
        </span>
      </>
    )}
  </button>
));

const DarkModeToggle = memo(({ isDarkMode, toggle, t }: any) => (
  <button
    onClick={toggle}
    className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
  >
    {isDarkMode ? (
      <Moon size={20} className="text-purple-400" />
    ) : (
      <Sun size={20} className="text-yellow-500" />
    )}
    <span className="font-medium">
      {isDarkMode ? t('settings.dark') : t('settings.light')}
    </span>
  </button>
));

const ToggleItem = ({ label, checked, onChange }: any) => (
  <div className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
    <span>{label}</span>
    <button
      onClick={() => onChange(!checked)}
      className={`w-12 h-6 rounded-full p-1 transition-colors ${
        checked 
          ? "bg-green-500" 
          : "bg-gray-300 dark:bg-gray-600"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
          checked ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  </div>
);

const SectionWrapper = ({ title, children }: any) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="p-6 bg-white dark:bg-gray-700/20 rounded-xl shadow-sm"
  >
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="space-y-4">{children}</div>
  </motion.div>
);

export default SettingsPage;