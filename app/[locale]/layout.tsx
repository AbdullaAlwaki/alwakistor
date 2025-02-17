"use client"; // ✅ تحديد أن هذا المكون هو Client Component

import React from 'react';
import GeneralNavbar from '../../components/GeneralNavbar';
import PageTransition from '../../components/PageTransition';
import '../styles/globals.css';
import { DarkModeProvider } from '../../context/DarkModeContext'; // استيراد DarkModeProvider
import { CartProvider } from '../../context/CartContext'; // استيراد CartProvider

export default function RootLayout({
  children,
  params, // ✅ استقبال params كـ Promise
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const [locale, setLocale] = React.useState<string>('en'); // ✅ إنشاء حالة لتخزين اللغة

  React.useEffect(() => {
    // فك الـ Promise والحصول على قيمة locale
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
        {/* تغليف التطبيق بـ DarkModeProvider و CartProvider */}
        <DarkModeProvider>
          <CartProvider>
            <GeneralNavbar locale={locale} />
            <PageTransition>
              <main className="container mx-auto p-4">{children}</main>
            </PageTransition>
          </CartProvider>
        </DarkModeProvider>
      </body>
    </html>
  );
}