"use client";
import { use } from "react";
import { useState, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import { DarkModeContext } from "../../../context/DarkModeContext";
import { LogOut, Moon, Sun } from "lucide-react";
import { useTranslation } from "../../[locale]/useTranslation";

type Locale = "en" | "ar";
type NotificationType = "email" | "push";

const ReactCountryFlag = dynamic(() => import("react-country-flag"), {
  ssr: false,
  loading: () => <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />,
});

const SettingsPage = ({ params }: { params: Promise<{ locale: Locale }> }) => {
  // تفكيك الـ Promise باستخدام use()
  const resolvedParams = use(params);
  const { locale } = resolvedParams;

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
  });

  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { t } = useTranslation(locale);
  const router = useRouter();

  const handleToggleNotification = useCallback((type: NotificationType) => {
    setNotifications(prev => ({ ...prev, [type]: !prev[type] }));
  }, []);

  const handleLanguageChange = useCallback(() => {
    const newLocale = locale === "ar" ? "en" : "ar";
    router.push(`/${newLocale}/settings`);
  }, [locale, router]);

  const handleLogout = useCallback(async () => {
    if (!confirm(t("settings.logoutConfirmation"))) return;
    
    try {
      await logout();
      router.push(`/${locale}/login`);
    } catch (error) {
      alert(t("settings.logoutError"));
    }
  }, [logout, router, locale, t]);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <motion.section
      initial={{ y: 20 }}
      animate={{ y: 0 }}
      className={`rounded-xl p-6 mb-6 ${isDarkMode ? "bg-gray-700/20" : "bg-gray-50"}`}
    >
      <h2 className="text-xl font-semibold mb-6">{title}</h2>
      {children}
    </motion.section>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-2xl mx-auto"
        >
          {/* Profile Section */}
          {isAuthenticated && user && (
            <Section title={t("settings.profile")}>
              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-2">{t("settings.name")}</p>
                  <p className="p-3 bg-gray-100 dark:bg-gray-700 rounded">{user.name}</p>
                </div>
                <div>
                  <p className="font-medium mb-2">{t("settings.email")}</p>
                  <p className="p-3 bg-gray-100 dark:bg-gray-700 rounded">{user.email}</p>
                </div>
                <Link 
                  href={`/${locale}/profile/edit`}
                  className="block px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-center"
                >
                  {t("settings.editProfile")}
                </Link>
              </div>
            </Section>
          )}

          {/* Preferences Section */}
          <Section title={t("settings.preferences")}>
            <div className="space-y-6">
              {/* Language Selector */}
              <button
                onClick={handleLanguageChange}
                className="w-full flex items-center justify-between p-4 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="font-medium">{t("settings.language")}</span>
                <div className="flex items-center gap-2">
                  <ReactCountryFlag
                    countryCode={locale === "ar" ? "SA" : "US"}
                    svg
                    className="text-2xl"
                  />
                  <span className="font-medium">
                    {locale === "ar" ? t("settings.arabic") : t("settings.english")}
                  </span>
                </div>
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="w-full flex items-center justify-between p-4 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <span>{t(`settings.${isDarkMode ? "dark" : "light"}`)}</span>
                {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              {/* Notifications */}
              <div className="space-y-4">
                {Object.entries(notifications).map(([type, status]) => (
                  <div key={type} className="flex items-center justify-between p-3">
                    <span>{t(`settings.${type}Notifications`)}</span>
                    <button
                      onClick={() => handleToggleNotification(type as NotificationType)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        status ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                          status 
                            ? locale === "ar" ? "left-1" : "right-1" 
                            : locale === "ar" ? "right-1" : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* Actions Section */}
          <Section title={t("settings.actions")}>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-500 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
              >
                <LogOut size={18} />
                <span>{t("settings.logout")}</span>
              </button>
            ) : (
              <Link
                href={`/${locale}/login`}
                className="block p-3 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-500 hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors text-center"
              >
                {t("settings.login")}
              </Link>
            )}
          </Section>
        </motion.div>
      </main>
    </div>
  );
};

export default SettingsPage;
