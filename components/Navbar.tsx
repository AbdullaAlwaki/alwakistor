"use client"; // إذا كان المكون يستخدم React Hooks

import Link from 'next/link';
import { ShoppingCart, CheckCircle, PackageSearch, User } from 'lucide-react';
import { useCart } from './CartContext';

// تعريف نوع الـ props
interface NavbarProps {
  locale: string;
  toggleTheme?: () => void; // دالة لتغيير الثيم (اختيارية)
  isDarkMode?: boolean; // حالة الثيم الحالي (اختيارية)
}

export default function Navbar({ locale, toggleTheme, isDarkMode }: NavbarProps) {
  const { cartItems } = useCart();

  return (
    <>
      {/* شريط التنقل العلوي */}
      <nav className="bg-background shadow-md p-4 lg:flex justify-between items-center hidden">
        <div>
          <Link href={`/${locale}`} className="text-xl font-bold text-foreground flex items-center gap-2">
            <PackageSearch size={24} /> {/* أيقونة الشعار */}
            Alwaki Store
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          <Link href={`/${locale}/cart`} className="text-foreground hover:text-accent flex items-center gap-1">
            <ShoppingCart size={20} /> {/* أيقونة السلة */}
            {cartItems.length > 0 && <span>({cartItems.length})</span>}
          </Link>
          <Link href={`/${locale}/checkout`} className="text-foreground hover:text-accent flex items-center gap-1">
            <CheckCircle size={20} /> {/* أيقونة إكمال الطلب */}
            إكمال الطلب
          </Link>
          <Link href={`/${locale}/track-order`} className="text-foreground hover:text-accent flex items-center gap-1">
            <PackageSearch size={20} /> {/* أيقونة تتبع الطلب */}
            تتبع الطلب
          </Link>
          <Link href={`/${locale}/profile`} className="text-foreground hover:text-accent flex items-center gap-1">
            <User size={20} /> {/* أيقونة البروفايل */}
            البروفايل
          </Link>
          {/* زر تبديل اللغة */}
          <Link href={`/${locale === 'ar' ? 'en' : 'ar'}`}>
            {locale === 'ar' ? 'English' : 'العربية'}
          </Link>
          {/* زر تبديل الثيم */}
          {toggleTheme && (
            <button onClick={toggleTheme} className="text-foreground hover:text-accent">
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          )}
        </div>
      </nav>

      {/* شريط التنقل السفلي للهواتف */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background shadow-md p-2 flex justify-around items-center">
        <Link href={`/${locale}`} className="text-foreground hover:text-accent flex flex-col items-center">
          <PackageSearch size={24} />
          <span className="text-xs">الرئيسية</span>
        </Link>
        <Link href={`/${locale}/cart`} className="text-foreground hover:text-accent flex flex-col items-center">
          <ShoppingCart size={24} />
          <span className="text-xs">السلة</span>
          {cartItems.length > 0 && <span>({cartItems.length})</span>}
        </Link>
        <Link href={`/${locale}/checkout`} className="text-foreground hover:text-accent flex flex-col items-center">
          <CheckCircle size={24} />
          <span className="text-xs">إكمال الطلب</span>
        </Link>
        <Link href={`/${locale}/track-order`} className="text-foreground hover:text-accent flex flex-col items-center">
          <PackageSearch size={24} />
          <span className="text-xs">تتبع الطلب</span>
        </Link>
        <Link href={`/${locale}/profile`} className="text-foreground hover:text-accent flex flex-col items-center">
          <User size={24} />
          <span className="text-xs">البروفايل</span>
        </Link>
        {/* زر تبديل اللغة */}
        <Link href={`/${locale === 'ar' ? 'en' : 'ar'}`} className="text-foreground hover:text-accent flex flex-col items-center">
          <span className="text-xs">{locale === 'ar' ? 'English' : 'العربية'}</span>
        </Link>
        {/* زر تبديل الثيم */}
        {toggleTheme && (
          <button onClick={toggleTheme} className="text-foreground hover:text-accent flex flex-col items-center">
            <span className="text-xs">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        )}
      </nav>
    </>
  );
}