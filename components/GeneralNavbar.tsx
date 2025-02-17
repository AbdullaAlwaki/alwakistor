"use client"; // ✅ هذا المكون هو Client Component

import Link from 'next/link';
import { ShoppingCart, CheckCircle, PackageSearch, User, Search } from 'lucide-react';
import { useCart } from './CartContext';
import { useTranslation } from '../app/[locale]/useTranslation';
import { useDarkMode } from '../hooks/useDarkMode'; // ✅ استيراد Hook بشكل صحيح
import React, { useState } from 'react';

interface NavbarProps {
  locale: string;
}

export default function GeneralNavbar({ locale }: NavbarProps) {
  const { cartItems } = useCart();
  const { t } = useTranslation(locale);
  const { isDarkMode, toggleDarkMode } = useDarkMode(); // ✅ استخدام Hook
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <>
      {/* شريط التنقل العلوي */}
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('navbar.searchPlaceholder')}
              className="bg-gray-100 dark:bg-gray-700 text-foreground px-4 py-2 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Search size={20} className="text-foreground" />
            </button>
          </form>
          {/* الروابط الأخرى */}
          <Link href={`/${locale}/cart`} className="text-foreground hover:text-accent flex items-center gap-1">
            <ShoppingCart size={20} />
            <span>{t('navbar.cart')}</span>
            {cartItems.length > 0 && <span>({cartItems.length})</span>}
          </Link>
          <Link href={`/${locale}/checkout`} className="text-foreground hover:text-accent flex items-center gap-1">
            <CheckCircle size={20} />
            <span>{t('navbar.checkout')}</span>
          </Link>
          <Link href={`/${locale}/track-order`} className="text-foreground hover:text-accent flex items-center gap-1">
            <PackageSearch size={20} />
            <span>{t('navbar.trackOrder')}</span>
          </Link>
          <Link href={`/${locale}/profile`} className="text-foreground hover:text-accent flex items-center gap-1">
            <User size={20} />
            <span>{t('navbar.profile')}</span>
          </Link>
          <Link href={`/${locale === 'ar' ? 'en' : 'ar'}`} className="text-foreground hover:text-accent">
            {locale === 'ar' ? 'English' : 'العربية'}
          </Link>
          <button onClick={toggleDarkMode} className="text-foreground hover:text-accent">
            {isDarkMode ? t('navbar.lightMode') : t('navbar.darkMode')}
          </button>
        </div>
      </nav>

      {/* شريط التنقل السفلي للهواتف */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background shadow-md p-2 flex justify-around items-center">
        <Link href={`/${locale}`} className="text-foreground hover:text-accent flex flex-col items-center">
          <PackageSearch size={24} />
          <span className="text-xs">{t('navbar.home')}</span>
        </Link>
        <Link href={`/${locale}/cart`} className="text-foreground hover:text-accent flex flex-col items-center">
          <ShoppingCart size={24} />
          <span className="text-xs">{t('navbar.cart')}</span>
          {cartItems.length > 0 && <span>({cartItems.length})</span>}
        </Link>
        <Link href={`/${locale}/checkout`} className="text-foreground hover:text-accent flex flex-col items-center">
          <CheckCircle size={24} />
          <span className="text-xs">{t('navbar.checkout')}</span>
        </Link>
        <Link href={`/${locale}/track-order`} className="text-foreground hover:text-accent flex flex-col items-center">
          <PackageSearch size={24} />
          <span className="text-xs">{t('navbar.trackOrder')}</span>
        </Link>
        <Link href={`/${locale}/profile`} className="text-foreground hover:text-accent flex flex-col items-center">
          <User size={24} />
          <span className="text-xs">{t('navbar.profile')}</span>
        </Link>
        <Link href={`/${locale === 'ar' ? 'en' : 'ar'}`} className="text-foreground hover:text-accent flex flex-col items-center">
          <span className="text-xs">{locale === 'ar' ? 'English' : 'العربية'}</span>
        </Link>
        <button onClick={toggleDarkMode} className="text-foreground hover:text-accent flex flex-col items-center">
          <span className="text-xs">{isDarkMode ? t('navbar.lightMode') : t('navbar.darkMode')}</span>
        </button>
      </nav>
    </>
  );
}