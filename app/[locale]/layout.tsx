"use client"; // ✅ تحديد أن هذا المكون هو Client Component

import React from 'react';
import GeneralNavbar from '../../components/GeneralNavbar';
import PageTransition from '../../components/PageTransition';
import '../styles/globals.css';
import { DarkModeProvider } from '../../context/DarkModeContext'; // استيراد DarkModeProvider
import { CartProvider } from '../../context/CartContext'; // استيراد CartProvider
import { AuthProvider } from '../../context/AuthContext'; // استيراد AuthProvider

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Alwaki Store</title>
        <meta name="description" content="متجر Alwaki - تسوق أفضل المنتجات بأفضل الأسعار." />
      </head>
      <body className="bg-background text-foreground min-h-screen">
        {/* تغليف التطبيق بـ DarkModeProvider و CartProvider و AuthProvider */}
        <DarkModeProvider>
          <CartProvider>
            <AuthProvider>
              <GeneralNavbar locale={locale} />
              <PageTransition>
                <main className="container mx-auto p-4">{children}</main>
              </PageTransition>
            </AuthProvider>
          </CartProvider>
        </DarkModeProvider>
      </body>
    </html>
  );
}