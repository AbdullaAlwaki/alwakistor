"use client";
import { use } from 'react';
import { useRouter } from "next/navigation";
import { useState, useContext, useReducer, useCallback, memo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import { DarkModeContext } from "../../../context/DarkModeContext";
import { LogIn, LogOut, Moon, Sun, Settings } from "lucide-react";
import { useTranslation } from "../../[locale]/useTranslation";

type Locale = 'en' | 'ar';
type NotificationType = 'email' | 'push';

interface ReducerState {
  notifications: Record<NotificationType, boolean>;
}

type ReducerAction = { type: 'TOGGLE_NOTIFICATION'; payload: NotificationType };

const ReactCountryFlag = dynamic(() => import("react-country-flag"), {
  ssr: false,
  loading: () => <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
});

const Section = memo(({ title, children }: { title: string; children: React.ReactNode }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  return (
    <motion.section
      initial={{ y: 20 }}
      animate={{ y: 0 }}
      className={`rounded-xl p-6 mb-6 ${
        isDarkMode ? 'bg-gray-700/20' : 'bg-gray-50'
      }`}
    >
      <h2 className="text-xl font-semibold mb-6">{title}</h2>
      {children}
    </motion.section>
  );
});

const LocaleSelector = memo(({ locale, t, onChange }: { 
  locale: Locale;
  t: (key: string) => string;
  onChange: () => void;
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onChange}
    className="w-full flex items-center justify-between p-4 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
  >
    <span className="font-medium">{t('settings.language')}</span>
    <div className="flex items-center gap-2">
      <ReactCountryFlag
        countryCode={locale === 'ar' ? 'US' : 'SA'}
        svg
        className="text-2xl"
      />
      <span className="font-medium">
        {locale === 'ar' ? t('settings.english') : t('settings.arabic')}
      </span>
    </div>
  </motion.button>
));

const NotificationToggle = memo(({ type, checked, onToggle, t, locale }: { 
  type: NotificationType;
  checked: boolean;
  onToggle: () => void;
  t: (key: string) => string;
  locale: Locale;
}) => (
  <div className="flex items-center justify-between p-3">
    <span className={locale === 'ar' ? 'text-right' : 'text-left'}>
      {t(`settings.${type}Notifications`)}
    </span>
    <button
      onClick={onToggle}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        checked ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <div
        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
          checked 
            ? (locale === 'ar' ? 'left-1' : 'right-1') 
            : (locale === 'ar' ? 'right-1' : 'left-1')
        }`}
      />
    </button>
  </div>
));

const LogoutButton = memo(({ onLogout, t }: { 
  onLogout: () => void;
  t: (key: string) => string;
}) => (
  <button
    onClick={onLogout}
    className="w-full text-left p-3 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-500 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
  >
    {t('settings.logout')}
  </button>
));

const LoginLink = memo(({ locale, t }: { 
  locale: Locale;
  t: (key: string) => string;
}) => (
  <Link
    href={`/${locale}/login`}
    className="block p-3 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-500 hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
  >
    {t('settings.login')}
  </Link>
));

const DarkModeToggle = memo(({ isDark, onToggle, t }: { 
  isDark: boolean;
  onToggle: () => void;
  t: (key: string) => string;
}) => (
  <button
    onClick={onToggle}
    className="flex items-center justify-between w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
  >
    <span>{t(`settings.${isDark ? 'dark' : 'light'}`)}</span>
    {isDark ? <Moon size={20} /> : <Sun size={20} />}
  </button>
));

const VerificationStatus = memo(({ t }: { 
  t: (key: string) => string;
}) => (
  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-500">
    {t('settings.verifiedAccount')}
  </div>
));

const SettingsPage = ({ params }: { params: Promise<{ locale: Locale }> }) => {
  const { locale: initialLocale } = use(params);
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [state, dispatch] = useReducer((state: ReducerState, action: ReducerAction) => {
    if (action.type === 'TOGGLE_NOTIFICATION') {
      return {
        ...state,
        notifications: {
          ...state.notifications,
          [action.payload]: !state.notifications[action.payload]
        }
      };
    }
    return state;
  }, { notifications: { email: true, push: true } });

  const { isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { t } = useTranslation(locale);
  const router = useRouter();

  const handleLanguageChange = useCallback(() => {
    const newLocale = locale === 'ar' ? 'en' : 'ar';
    setLocale(newLocale);
    router.push(`/${newLocale}/settings`);
  }, [locale, router]);

  const handleLogout = useCallback(async () => {
    if (!confirm(t('settings.logoutConfirmation'))) return;
    
    try {
      await logout();
      router.push(`/${locale}/login`);
    } catch (error) {
      alert(t('settings.logoutError'));
    }
  }, [logout, router, locale, t]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-2xl mx-auto"
        >
          <Section title={t('settings.title')}>
            <div className="space-y-6">
              <LocaleSelector 
                locale={locale}
                t={t}
                onChange={handleLanguageChange}
              />
              
              <DarkModeToggle
                isDark={isDarkMode}
                onToggle={toggleDarkMode}
                t={t}
              />

              <div className="space-y-4">
                {(['email', 'push'] as NotificationType[]).map(type => (
                  <NotificationToggle
                    key={type}
                    type={type}
                    checked={state.notifications[type]}
                    onToggle={() => dispatch({ type: 'TOGGLE_NOTIFICATION', payload: type })}
                    t={t}
                    locale={locale}
                  />
                ))}
              </div>

              {isAuthenticated ? (
                <>
                  <VerificationStatus t={t} />
                  <LogoutButton onLogout={handleLogout} t={t} />
                </>
              ) : (
                <LoginLink locale={locale} t={t} />
              )}
            </div>
          </Section>
        </motion.div>
      </main>
    </div>
  );
};

export default SettingsPage;