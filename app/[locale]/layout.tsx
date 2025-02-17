"use client"; // ✅ تحديد أن هذا المكون هو Client Component

import React from 'react';
import GeneralNavbar from '../../components/GeneralNavbar'; // استيراد شريط التنقل
import { CartProvider } from '../../components/CartContext'; // سياق السلة
import PageTransition from '../../components/PageTransition'; // تأثير الانتقال بين الصفحات
import '../styles/globals.css'; // استيراد الأنماط العامة
import { useDarkMode } from '../../hooks/useDarkMode'; // Hook لإدارة الوضع المظلم

export default function RootLayout({
  children,
  params, // تمرير الـ params مباشرة
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // تعريف النوع كـ Promise
}) {
  const [locale, setLocale] = React.useState<string>('en'); // حالة اللغة الافتراضية
  const { isDarkMode, toggleDarkMode } = useDarkMode(); // إدارة الوضع المظلم

  // انتظار الـ params وتحديث اللغة
  React.useEffect(() => {
    params.then((unwrappedParams) => {
      const currentLocale = unwrappedParams.locale || 'en'; // ضمان وجود قيمة افتراضية
      setLocale(currentLocale);

      // حفظ اللغة في localStorage لاستعادتها عند إعادة التحميل
      if (typeof window !== 'undefined') {
        localStorage.setItem('locale', currentLocale);
      }
    });
  }, [params]);

  // استرداد اللغة من localStorage عند تحميل الصفحة
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale');
      if (savedLocale) {
        setLocale(savedLocale);
      }
    }
  }, []);

  return (
    <html lang={locale} className={isDarkMode ? 'dark' : ''}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Alwaki Store</title>
        <meta name="description" content="متجر Alwaki - تسوق أفضل المنتجات بأفضل الأسعار." />
      </head>
      <body className="bg-background text-foreground min-h-screen">
        {/* توفير السياق الدولي */}
        <CartProvider>
          {/* شريط التنقل */}
          <GeneralNavbar locale={locale} toggleTheme={toggleDarkMode} isDarkMode={isDarkMode} />

          {/* التفاف المحتوى بمكون PageTransition */}
          <PageTransition>
            <main className="container mx-auto p-4">{children}</main>
          </PageTransition>
        </CartProvider>
      </body>
    </html>
  );
}