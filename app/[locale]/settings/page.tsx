"use client";
import { useRouter } from "next/navigation";
import { useContext, useEffect, memo, useReducer } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import { DarkModeContext } from "../../../context/DarkModeContext";
import { LogIn, LogOut, Moon, Sun } from "lucide-react";
import { useTranslation } from "..//useTranslation";
import React from "react";

// Dynamic Imports for better performance
const ReactCountryFlag = dynamic(() => import("react-country-flag"), { ssr: false });

// Spinner Component
const Spinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
);

// Initial State and Reducer for State Management
interface State {
  locale: string;
  isChangingLang: boolean;
  isLoggingOut: boolean;
  emailNotif: boolean;
  pushNotif: boolean;
}

type Action =
  | { type: "SET_LOCALE"; payload: string }
  | { type: "TOGGLE_LANG_LOADING"; payload: boolean }
  | { type: "TOGGLE_LOGOUT_LOADING"; payload: boolean }
  | { type: "TOGGLE_EMAIL_NOTIF" }
  | { type: "TOGGLE_PUSH_NOTIF" };

const initialState: State = {
  locale: "en",
  isChangingLang: false,
  isLoggingOut: false,
  emailNotif: true,
  pushNotif: true,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_LOCALE":
      return { ...state, locale: action.payload };
    case "TOGGLE_LANG_LOADING":
      return { ...state, isChangingLang: action.payload };
    case "TOGGLE_LOGOUT_LOADING":
      return { ...state, isLoggingOut: action.payload };
    case "TOGGLE_EMAIL_NOTIF":
      return { ...state, emailNotif: !state.emailNotif };
    case "TOGGLE_PUSH_NOTIF":
      return { ...state, pushNotif: !state.pushNotif };
    default:
      throw new Error("Unknown action type");
  }
}

const SettingsPage = ({ params }: { params: Promise<{ locale: string }> }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { t } = useTranslation(state.locale);
  const router = useRouter();

  useEffect(() => {
    params.then(({ locale: l }) => {
      const newLocale = l || localStorage.getItem("locale") || "en";
      dispatch({ type: "SET_LOCALE", payload: newLocale });
      localStorage.setItem("locale", newLocale);
    });
  }, [params]);

  // Handle Logout
  const handleLogout = async () => {
    if (!confirm(t("settings.logoutConfirmation"))) return;
    dispatch({ type: "TOGGLE_LOGOUT_LOADING", payload: true });
    try {
      await logout();
      router.push(`/${state.locale}/login`);
    } catch (error) {
      alert(t("settings.logoutError"));
    } finally {
      dispatch({ type: "TOGGLE_LOGOUT_LOADING", payload: false });
    }
  };

  // Handle Language Change
  const handleLanguageChange = async (newLocale: string) => {
    dispatch({ type: "TOGGLE_LANG_LOADING", payload: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      dispatch({ type: "SET_LOCALE", payload: newLocale });
      localStorage.setItem("locale", newLocale);
      router.push(`/${newLocale}/settings`);
    } catch (error) {
      alert(t("settings.languageChangeError"));
    } finally {
      dispatch({ type: "TOGGLE_LANG_LOADING", payload: false });
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <Header title={t("settings.title")} />

      {/* Language Section */}
      <SectionWrapper title={t("settings.language")}>
        <LanguageButton
          locale={state.locale}
          t={t}
          isChangingLang={state.isChangingLang}
          onChange={(newLocale: string) => handleLanguageChange(newLocale)}
        />
      </SectionWrapper>

      {/* Dark Mode Section */}
      <SectionWrapper title={t("settings.darkMode")}>
        <DarkModeToggle isDarkMode={isDarkMode} toggle={toggleDarkMode} t={t} />
      </SectionWrapper>

      {/* Notifications Section */}
      <SectionWrapper title={t("settings.notifications")}>
        <ToggleItem
          label={t("settings.emailNotifications")}
          checked={state.emailNotif}
          onChange={() => dispatch({ type: "TOGGLE_EMAIL_NOTIF" })}
          locale={state.locale}
        />
        <ToggleItem
          label={t("settings.pushNotifications")}
          checked={state.pushNotif}
          onChange={() => dispatch({ type: "TOGGLE_PUSH_NOTIF" })}
          locale={state.locale}
        />
      </SectionWrapper>

      {/* Account Section */}
      <SectionWrapper title={t("settings.account")}>
        {isAuthenticated ? (
          <LogoutButton
            isLoggingOut={state.isLoggingOut}
            handleLogout={handleLogout}
            t={t}
          />
        ) : (
          <LoginButton locale={state.locale} t={t} />
        )}
      </SectionWrapper>
    </div>
  );
};

// Subcomponents
const Header = memo(({ title }: { title: string }) => (
  <h1 className="text-2xl font-bold mb-6">{title}</h1>
));

const AccountStatus = memo(({ t, locale }: { t: any; locale: string }) => (
  <div className="flex items-center gap-2 text-sm">
    <span>{t("settings.accountStatus")}</span> ●{" "}
    <span className="text-green-500">{t("settings.verified")}</span>
    <button
      onClick={() => (window.location.href = `/${locale}/verify`)}
      className="text-blue-500 hover:underline"
    >
      {t("settings.verify")}
    </button>
  </div>
));

const LogoutButton = memo(
  ({
    isLoggingOut,
    handleLogout,
    t,
  }: {
    isLoggingOut: boolean;
    handleLogout: () => void;
    t: any;
  }) => (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all disabled:opacity-50"
    >
      {isLoggingOut ? (
        <>
          <Spinner />
          {t("settings.loggingOut")}
        </>
      ) : (
        <>
          <LogOut size={20} />
          {t("settings.logout")}
        </>
      )}
    </button>
  )
);

const LoginButton = memo(({ locale, t }: { locale: string; t: any }) => (
  <Link
    href={`/${locale}/login`}
    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
  >
    <LogIn size={20} />
    {t("settings.login")}
  </Link>
));

const LanguageButton = memo(
  ({
    locale,
    t,
    isChangingLang,
    onChange,
  }: {
    locale: string;
    t: any;
    isChangingLang: boolean;
    onChange: (newLocale: string) => void;
  }) => (
    <button
      onClick={() => onChange(locale === "ar" ? "en" : "ar")}
      disabled={isChangingLang}
      className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all disabled:opacity-50"
    >
      {isChangingLang ? (
        <>
          <Spinner />
          {t("settings.changing")}
        </>
      ) : (
        <>
          <ReactCountryFlag countryCode={locale === "ar" ? "US" : "SA"} svg />
          {locale === "ar" ? t("settings.english") : t("settings.arabic")}
        </>
      )}
    </button>
  )
);

const DarkModeToggle = memo(
  ({ isDarkMode, toggle, t }: { isDarkMode: boolean; toggle: () => void; t: any }) => (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
    >
      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      {isDarkMode ? t("settings.light") : t("settings.dark")}
    </button>
  )
);

const ToggleItem = memo(
  ({ label, checked, onChange, locale }: { label: string; checked: boolean; onChange: () => void; locale: string }) => {
    const isRTL = locale === "ar";
    return (
      <div className="flex justify-between items-center mb-4">
        {/* النص */}
        <span className={`text-sm ${isRTL ? "ml-4" : "mr-4"}`}>{label}</span>
        {/* الزر */}
        <button
          onClick={onChange}
          className={`w-12 h-6 rounded-full p-1 transition-colors ${
            checked ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
          }`}
        >
          {/* الدائرة المتحركة */}
          <motion.span
            layout
            className="block w-4 h-4 bg-white rounded-full shadow-md"
            transition={{ type: "spring", stiffness: 700, damping: 30 }}
          />
        </button>
      </div>
    );
  }
);

const SectionWrapper = memo(({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {children}
  </div>
));

export default SettingsPage;