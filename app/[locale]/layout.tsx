"use client"; // ✅ تحديد أن هذا المكون هو Client Component

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar'; // استيراد شريط التنقل
import { CartProvider } from '../../components/CartContext'; // سياق السلة
import PageTransition from '../../components/PageTransition'; // تأثير الانتقال بين الصفحات
import '../styles/globals.css'; // استيراد الأنماط العامة

// Server Component
export default function RootLayout({
  children,
  params, // تمرير الـ params مباشرة
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // تعريف النوع كـ Promise
}) {
  const [locale, setLocale] = useState<string>('en'); // حالة اللغة الافتراضية

  // انتظار الـ params وتحديث اللغة
  useEffect(() => {
    params.then((unwrappedParams) => {
      setLocale(unwrappedParams.locale);
    });
  }, [params]);

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
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
          <Navbar locale={locale} />
          {/* التفاف المحتوى بمكون PageTransition */}
          <PageTransition>
            <main className="container mx-auto p-4">{children}</main>
          </PageTransition>
        </CartProvider>
      </body>
    </html>
  );
}