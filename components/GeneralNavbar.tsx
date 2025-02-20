import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useCart } from "../context/CartContext";
import { useTranslation } from "../app/[locale]/useTranslation";

const ShoppingCart = dynamic(() => import("lucide-react").then((mod) => mod.ShoppingCart), { ssr: false });
const PackageSearch = dynamic(() => import("lucide-react").then((mod) => mod.PackageSearch), { ssr: false });
const Settings = dynamic(() => import("lucide-react").then((mod) => mod.Settings), { ssr: false });
const Search = dynamic(() => import("lucide-react").then((mod) => mod.Search), { ssr: false });
const X = dynamic(() => import("lucide-react").then((mod) => mod.X), { ssr: false });

interface NavbarProps {
  locale: string;
}

export default function GeneralNavbar({ locale }: NavbarProps) {
  const { cartItems } = useCart();
  const { t } = useTranslation(locale);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // دالة البحث
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/${locale}/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  // إغلاق البحث عند النقر خارج النافذة
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  return (
    <>
      {/* شريط التنقل العلوي - للشاشات الكبيرة */}
      <nav className="bg-background shadow-md p-4 lg:flex justify-between items-center hidden">
        <div>
          <Link href={`/${locale}`} className="text-xl font-bold text-foreground flex items-center gap-2">
            <PackageSearch size={24} />
            Alwaki Store
          </Link>
        </div>
        <div className="flex gap-6 items-center">
          <form onSubmit={handleSearch} className="relative hidden lg:block">
            <input
              type="text"
              placeholder={t("navbar.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border rounded bg-white border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <PackageSearch size={20} />
            </button>
          </form>
          <Link href={`/${locale}/products`} className="text-foreground hover:text-accent flex items-center gap-1">
            <PackageSearch size={20} />
            <span>{t("navbar.products")}</span>
          </Link>
          <Link href={`/${locale}/cart`} className="text-foreground hover:text-accent flex items-center gap-1">
            <ShoppingCart size={20} />
            <span>{t("navbar.cart")} {cartItems.length > 0 && `(${cartItems.length})`}</span>
          </Link>
          <Link href={`/${locale}/settings`} className="text-foreground hover:text-accent flex items-center gap-1">
            <Settings size={20} />
            <span>{t("navbar.settings")}</span>
          </Link>
        </div>
      </nav>

      {/* شريط التنقل السفلي - للهواتف */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background shadow-md p-2 flex justify-around items-center h-16">
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
          <span className="text-xs">{t("navbar.cart")} {cartItems.length > 0 && `(${cartItems.length})`}</span>
        </Link>
        <Link href={`/${locale}/settings`} className="text-foreground hover:text-accent flex flex-col items-center">
          <Settings size={24} />
          <span className="text-xs">{t("navbar.settings")}</span>
        </Link>
      </nav>

      {/* شريط البحث في الهاتف */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-background shadow-md p-3 flex items-center justify-between">
        <Link href={`/${locale}`} className="text-xl font-bold text-foreground flex items-center gap-2">
          <PackageSearch size={24} />
          Alwaki
        </Link>
        <button onClick={() => setIsSearchOpen(true)} className="text-foreground">
          <Search size={24} />
        </button>
      </div>

      {/* نافذة البحث المنبثقة */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div ref={searchRef} className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X size={24} />
            </button>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder={t("navbar.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 border rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <PackageSearch size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
