import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart, PackageSearch, User, LogIn } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useTranslation } from "../app/[locale]/useTranslation";
import { useContext } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  locale: string;
}

export default function GeneralNavbar({ locale }: NavbarProps) {
  const { cartItems } = useCart();
  const { t } = useTranslation(locale);
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/${locale}/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      {/* شريط التنقل العلوي (للشاشات الكبيرة) */}
      <nav className="bg-background shadow-md p-4 lg:flex justify-between items-center hidden">
        <div>
          <Link href={`/${locale}`} className="text-xl font-bold text-foreground flex items-center gap-2">
            <PackageSearch size={24} />
            Alwaki Store
          </Link>
        </div>
        <div className="flex gap-6 items-center">
          {/* شريط البحث */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder={t("navbar.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-64 p-2 border rounded ${
                isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"
              } focus:outline-none focus:ring-2 focus:ring-accent`}
            />
            <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-foreground"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.2-5.2m-2.8-2.8a7 7 0 11-9.9 9.9 7 7 0 019.9-9.9z" />
              </svg>
            </button>
          </form>
          {/* الروابط الأخرى */}
          <Link href={`/${locale}/products`} className="text-foreground hover:text-accent flex items-center gap-1">
            <PackageSearch size={20} />
            <span>{t("navbar.products")}</span>
          </Link>
          <Link href={`/${locale}/cart`} className="text-foreground hover:text-accent flex items-center gap-1">
            <ShoppingCart size={20} />
            <span>{t("navbar.cart")}</span>
            {cartItems.length > 0 && <span>({cartItems.length})</span>}
          </Link>
          {/* رابط Profile أو Sign In بناءً على حالة تسجيل الدخول */}
          {isAuthenticated ? (
            <Link href={`/${locale}/profile`} className="text-foreground hover:text-accent flex items-center gap-1">
              <User size={20} />
              <span>{t("navbar.profile")}</span>
            </Link>
          ) : (
            <Link href={`/${locale}/login`} className="text-foreground hover:text-accent flex items-center gap-1">
              <LogIn size={20} />
              <span>{t("navbar.signIn")}</span>
            </Link>
          )}
          {/* تبديل اللغة */}
          <Link href={`/${locale === "ar" ? "en" : "ar"}`} className="text-foreground hover:text-accent">
            {locale === "ar" ? "English" : "العربية"}
          </Link>
          {/* زر تبديل الوضع المظلم */}
          <button onClick={toggleDarkMode} className="text-foreground hover:text-accent">
            {isDarkMode ? t("navbar.lightMode") : t("navbar.darkMode")}
          </button>
        </div>
      </nav>

      {/* شريط التنقل السفلي (للهواتف) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background shadow-md p-2 flex justify-around items-center h-20">
        <Link href={`/${locale}`} className="text-foreground hover:text-accent flex flex-col items-center">
          <PackageSearch size={24} />
          <span className="text-xs">{t("navbar.home")}</span>
        </Link>
        <Link href={`/${locale}/products`} className="text-foreground hover:text-accent flex flex-col items-center">
          <PackageSearch size={24} />
          <span className="text-xs">{t("navbar.products")}</span>
        </Link>
        <Link href={`/${locale}/cart`} className="text-foreground hover:text-accent flex flex-col items-center">
          <ShoppingCart size={24} />
          <span className="text-xs">{t("navbar.cart")}</span>
          {cartItems.length > 0 && <span>({cartItems.length})</span>}
        </Link>
        {/* رابط Profile أو Sign In بناءً على حالة تسجيل الدخول */}
        {isAuthenticated ? (
          <Link href={`/${locale}/profile`} className="text-foreground hover:text-accent flex flex-col items-center">
            <User size={24} />
            <span className="text-xs">{t("navbar.profile")}</span>
          </Link>
        ) : (
          <Link href={`/${locale}/login`} className="text-foreground hover:text-accent flex flex-col items-center">
            <LogIn size={24} />
            <span className="text-xs">{t("navbar.signIn")}</span>
          </Link>
        )}
        {/* زر تبديل الوضع المظلم للهواتف */}
        <button onClick={toggleDarkMode} className="text-foreground hover:text-accent flex flex-col items-center">
          <span className="text-xs">{isDarkMode ? t("navbar.lightMode") : t("navbar.darkMode")}</span>
        </button>
      </nav>
    </>
  );
}