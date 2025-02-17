"use client"; // ✅ تحديد أن هذا المكون هو Client Component

import Link from 'next/link';
import { ShoppingCart, CheckCircle, PackageSearch, User, LogIn } from 'lucide-react';
import { useCart } from '../context/CartContext'; // ✅ استيراد Hook بشكل صحيح
import { useTranslation } from '../app/[locale]/useTranslation';
import { useContext } from 'react';
import { DarkModeContext } from '../context/DarkModeContext';
import { useAuth } from '../context/AuthContext'; // ✅ استيراد useAuth

interface NavbarProps {
  locale: string; // ✅ إضافة locale كخاصية
}

export default function GeneralNavbar({ locale }: NavbarProps) {
  const { cartItems } = useCart(); // ✅ استخدام useCart للحصول على عناصر السلة
  const { t } = useTranslation(locale);
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { isAuthenticated } = useAuth(); // ✅ استخدام useAuth للحصول على حالة تسجيل الدخول

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
          {/* الروابط الأخرى */}
          <Link href={`/${locale}/cart`} className="text-foreground hover:text-accent flex items-center gap-1">
            <ShoppingCart size={20} />
            <span>{t('navbar.cart')}</span>
            {cartItems.length > 0 && <span>({cartItems.length})</span>}
          </Link>
          {/* رابط Profile أو Login بناءً على حالة تسجيل الدخول */}
          {isAuthenticated ? (
            <Link href={`/${locale}/profile`} className="text-foreground hover:text-accent flex items-center gap-1">
              <User size={20} />
              <span>{t('navbar.profile')}</span>
            </Link>
          ) : (
            <Link href={`/${locale}/login`} className="text-foreground hover:text-accent flex items-center gap-1">
              <LogIn size={20} />
              <span>{t('navbar.login')}</span>
            </Link>
          )}
          {/* باقي الروابط... */}
        </div>
      </nav>

      {/* شريط التنقل السفلي (للهواتف) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background shadow-md p-2 flex justify-around items-center h-20">
        <Link href={`/${locale}`} className="text-foreground hover:text-accent flex flex-col items-center">
          <PackageSearch size={24} />
          <span className="text-xs">{t('navbar.home')}</span>
        </Link>
        <Link href={`/${locale}/cart`} className="text-foreground hover:text-accent flex flex-col items-center">
          <ShoppingCart size={24} />
          <span className="text-xs">{t('navbar.cart')}</span>
          {cartItems.length > 0 && <span>({cartItems.length})</span>}
        </Link>
        {/* رابط Profile أو Login بناءً على حالة تسجيل الدخول */}
        {isAuthenticated ? (
          <Link href={`/${locale}/profile`} className="text-foreground hover:text-accent flex flex-col items-center">
            <User size={24} />
            <span className="text-xs">{t('navbar.profile')}</span>
          </Link>
        ) : (
          <Link href={`/${locale}/login`} className="text-foreground hover:text-accent flex flex-col items-center">
            <LogIn size={24} />
            <span className="text-xs">{t('navbar.login')}</span>
          </Link>
        )}
        {/* باقي الروابط... */}
      </nav>
    </>
  );
}