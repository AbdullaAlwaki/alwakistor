"use client";
import React from "react";
import { useTranslation } from "../../useTranslation"; // تأكد من المسار الصحيح
import Breadcrumbs from "./components/Breadcrumbs"; // إضافة مسار التنقل (اختياري)

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation(""); // استخدام الترجمة

  return (
    <div className="min-h-screen m-0"> 
      <div className="max-w-7xl mx-auto">

        <header className="mb-8">
          <Breadcrumbs /> 
        </header>

        <main> 
          {children}
        </main>
      </div>
    </div>
  );
}