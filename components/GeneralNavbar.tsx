import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useCart } from "../context/CartContext";
import { useTranslation } from "../app/[locale]/useTranslation";

// تحميل الأيقونات بشكل ديناميكي
const ShoppingCart = dynamic(() => import("lucide-react").then((mod) => mod.ShoppingCart), { ssr: false });
const SearchIcon = dynamic(() => import("lucide-react").then((mod) => mod.Search), { ssr: false }); // ✅ أيقونة البحث (مكبرة)
const Settings = dynamic(() => import("lucide-react").then((mod) => mod.Settings), { ssr: false });
const HomeIcon = dynamic(() => import("lucide-react").then((mod) => mod.Home), { ssr: false }); // ✅ أيقونة المنزل
const BoxIcon = dynamic(() => import("lucide-react").then((mod) => mod.Box), { ssr: false }); // ✅ أيقونة المنتجات

interface NavbarProps {
  locale: string;
}

export default function GeneralNavbar({ locale }: NavbarProps) {
  const { cartItems } = useCart();
  const { t } = useTranslation(locale);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // ✅ حالة لعرض/إخفاء شريط البحث

  // استرداد البيانات من قاعدة البيانات بناءً على نص البحث
  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`/api/search-suggestions?query=${encodeURIComponent(query)}&locale=${locale}`);
      if (!response.ok) {
        throw new Error("Failed to fetch suggestions");
      }
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // معالجة البحث
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/${locale}/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  // تحديث الاقتراحات عند كتابة نص البحث
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchSuggestions(searchQuery);
    }, 300); // ✅ تأخير بسيط لتجنب الطلبات المتكررة
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setSuggestions([]); // مسح الاقتراحات بعد الاختيار
    window.location.href = `/${locale}/products?search=${encodeURIComponent(suggestion)}`; // إعادة توجيه المستخدم لصفحة النتائج
  };

  return (
    <>
      {/* شريط التنقل العلوي (للشاشات الكبيرة) */}
      <nav className="bg-background shadow-md p-4 lg:flex justify-between items-center hidden transition-all duration-500 ease-in-out">
        <div>
          <Link href={`/${locale}`} className="text-xl font-bold text-foreground flex items-center gap-2">
            <BoxIcon size={24} /> {/* ✅ أيقونة المنتجات */}
            Alwaki Store
          </Link>
        </div>
        <div className="flex gap-6 items-center">
          {/* شريط البحث المتقدم */}
          <form onSubmit={handleSearch} className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder={t("navbar.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full p-2 border rounded ${
                "bg-white border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent"
              }`}
            />
            {/* اقتراحات البحث */}
            {searchQuery && (
              <ul className="absolute top-full left-0 right-0 bg-background border border-gray-300 rounded mt-1 max-h-48 overflow-y-auto z-10">
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="p-2 cursor-pointer hover:bg-gray-200 transition-colors"
                    >
                      {suggestion}
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500 text-center">
                    {t("navbar.noResults")} {/* ✅ رسالة "لا توجد منتجات متطابقة" */}
                  </li>
                )}
              </ul>
            )}
            {/* مؤشر التحميل */}
            {isLoading && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-accent"></div>
            )}
            {!isLoading && (
              <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <SearchIcon size={20} /> {/* ✅ أيقونة البحث (مكبرة) */}
              </button>
            )}
          </form>
          {/* الروابط الأخرى */}
          <Link href={`/${locale}/products`} className="text-foreground hover:text-accent flex items-center gap-1">
            <BoxIcon size={20} /> {/* ✅ أيقونة المنتجات */}
            <span>{t("navbar.products")}</span>
          </Link>
          <Link href={`/${locale}/cart`} className="text-foreground hover:text-accent flex items-center gap-1">
            <ShoppingCart size={20} />
            <span>{t("navbar.cart")} {cartItems.length > 0 && `(${cartItems.length})`}</span>
          </Link>
          {/* رابط الإعدادات */}
          <Link href={`/${locale}/settings`} className="text-foreground hover:text-accent flex items-center gap-1">
            <Settings size={20} />
            <span>{t("navbar.settings")}</span>
          </Link>
        </div>
      </nav>

      {/* شريط التنقل السفلي (للهواتف) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background shadow-md p-2 flex justify-around items-center h-20 transition-all duration-500 ease-in-out">
        <Link href={`/${locale}`} className="text-foreground hover:text-accent flex flex-col items-center">
          <HomeIcon size={24} /> {/* ✅ أيقونة المنزل */}
          <span className="text-xs">{t("navbar.home")}</span> {/* ✅ نص تحت الأيقونة */}
        </Link>
        <Link href={`/${locale}/products`} className="text-foreground hover:text-accent flex flex-col items-center">
          <BoxIcon size={24} /> {/* ✅ أيقونة المنتجات */}
          <span className="text-xs">{t("navbar.products")}</span> {/* ✅ نص تحت الأيقونة */}
        </Link>
        <Link href={`/${locale}/cart`} className="text-foreground hover:text-accent flex flex-col items-center">
          <ShoppingCart size={24} />
          <span className="text-xs">{t("navbar.cart")} {cartItems.length > 0 && `(${cartItems.length})`}</span> {/* ✅ نص تحت الأيقونة */}
        </Link>
        {/* زر البحث */}
        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)} // ✅ فتح/إغلاق شريط البحث
          className="text-foreground hover:text-accent flex flex-col items-center"
        >
          <SearchIcon size={24} /> {/* ✅ أيقونة البحث (مكبرة) */}
          <span className="text-xs">{t("navbar.search")}</span> {/* ✅ نص تحت الأيقونة */}
        </button>
        {/* رابط الإعدادات */}
        <Link href={`/${locale}/settings`} className="text-foreground hover:text-accent flex flex-col items-center">
          <Settings size={24} />
          <span className="text-xs">{t("navbar.settings")}</span> {/* ✅ نص تحت الأيقونة */}
        </Link>
      </nav>

      {/* شريط البحث الكامل للهواتف */}
      {isSearchOpen && (
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-background shadow-md p-4 z-50">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              placeholder={t("navbar.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full p-2 border rounded ${
                "bg-white border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent"
              }`}
            />
            {/* اقتراحات البحث */}
            {searchQuery && (
              <ul className="absolute top-full left-0 right-0 bg-background border border-gray-300 rounded mt-1 max-h-48 overflow-y-auto z-10">
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="p-2 cursor-pointer hover:bg-gray-200 transition-colors"
                    >
                      {suggestion}
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500 text-center">
                    {t("navbar.noResults")} {/* ✅ رسالة "لا توجد منتجات متطابقة" */}
                  </li>
                )}
              </ul>
            )}
            {/* مؤشر التحميل */}
            {isLoading && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-accent"></div>
            )}
            {!isLoading && (
              <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <SearchIcon size={20} /> {/* ✅ أيقونة البحث (مكبرة) */}
              </button>
            )}
          </form>
        </div>
      )}
    </>
  );
}