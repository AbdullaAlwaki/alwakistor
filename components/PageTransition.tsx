"use client"; // ✅ تحديد أن هذا المكون هو Client Component
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation"; // ✅ استخدام usePathname لتحديد المسار الحالي

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // ✅ الحصول على المسار الحالي باستخدام usePathname

  return (
    <AnimatePresence mode="wait">
      {/* ✅ استخدام المسار الحالي كمفتاح */}
      <motion.div
        key={pathname}
        initial={{ opacity: 0, x: -20 }} // ✅ الحالة الأولية (دخول الصفحة)
        animate={{ opacity: 1, x: 0 }} // ✅ الحالة النهائية (بعد الدخول)
        exit={{ opacity: 0, x: 20 }} // ✅ الحالة عند الخروج
        transition={{ duration: 0.3, ease: "easeInOut" }} // ✅ تحسين الانتقال
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}