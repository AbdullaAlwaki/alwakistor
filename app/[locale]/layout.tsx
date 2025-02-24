"use client"; // ✅ تحديد أن هذا المكون هو Client Component
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

import "../styles/globals.css";
import { CombinedProvider } from "../../context/CombinedProvider";
import { LocaleProvider } from "../../context/LocaleContext";
import { AuthProvider } from "../../context/AuthContext"; // ✅ استيراد مزود السياق للمصادقة
import { useTranslation } from "../[locale]/useTranslation";

// تحميل المكونات بشكل ديناميكي
const GeneralNavbar = dynamic(() => import("../../components/GeneralNavbar"), {
  ssr: false,
  loading: () => <p>Loading Navbar...</p>,
});
const PageTransition = dynamic(() => import("../../components/PageTransition"), {
  ssr: false,
  loading: () => <p>Loading Transition...</p>,
});

export default function RootLayout({
  children,
  params, // ✅ لا تقوم بفك الـ Destructuring هنا
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }> | { locale: string }; // ✅ إضافة نوع Promise
}) {
  const [locale, setLocale] = useState<string>("en"); // ✅ إنشاء حالة لتخزين اللغة
  const { t } = useTranslation(locale);

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
        <title>{t("home.meta.title")}</title>
        <meta name="description" content={t("home.meta.description")} />
        <meta property="og:title" content={t("home.meta.title")} />
        <meta property="og:description" content={t("home.meta.description")} />
        <meta
          property="og:image"
          content="https://cdn.qwenlm.ai/output/e54871a8-b030-4f12-a895-c8d7c978d24d/t2i/30a8c698-9735-4199-b1bb-72c20b300490/36900098-a1b1-4e4e-9b55-79265e65a87b.png"
        />
        <meta property="og:url" content="https://alwakistor.vercel.app" />
        <meta property="og:type" content="website" />
      </head>
      <body data-theme="light" className="bg-background text-foreground min-h-screen">
        {/* تغليف التطبيق بالمزود المشترك */}
        <LocaleProvider>
          <CombinedProvider>
            <AuthProvider> {/* ✅ إضافة مزود السياق للمصادقة */}
              <GeneralNavbar locale={locale} />
              <PageTransition>
                <motion.main
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="container mx-auto p-4"
                >
                  {children}
                </motion.main>
              </PageTransition>
            </AuthProvider> {/* ✅ نهاية مزود السياق للمصادقة */}
          </CombinedProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}