"use client"; // ✅ تحديد أن هذا المكون هو Client Component
import React, { useState, useEffect } from "react";
import GeneralNavbar from "../../components/GeneralNavbar";
import PageTransition from "../../components/PageTransition";
import "../styles/globals.css";
import { DarkModeProvider } from "../../context/DarkModeContext"; // استيراد DarkModeProvider
import { CartProvider } from "../../context/CartContext"; // استيراد CartProvider
import { AuthProvider } from "../../context/AuthContext"; // استيراد AuthProvider

export default function RootLayout({
  children,
  params, // ✅ لا تقوم بفك الـ Destructuring هنا
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }> | { locale: string }; // ✅ إضافة نوع Promise
}) {
  const [locale, setLocale] = useState<string>("en"); // ✅ إنشاء حالة لتخزين اللغة

  useEffect(() => {
    if (params instanceof Promise) {
      params.then((unwrappedParams) => {
        setLocale(unwrappedParams.locale); // ✅ تحديث اللغة الحالية
      });
    } else {
      setLocale(params.locale); // ✅ إذا لم يكن Promise، قم بتعيين اللغة مباشرة
    }
  }, [params]);

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
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