"use client"; // ✅ تحديد أنه مكون عميل

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // ✅ الحصول على المسار الحالي للصفحة

  return (
    <AnimatePresence mode="wait">
      {/* ✅ تطبيق تأثيرات الانتقال */}
      <motion.div
        key={pathname} // ✅ استخدام المسار كمفتاح فريد
        initial={{ opacity: 0, x: -20, scale: 0.95 }} // ✅ الحالة الأولية (شفافية، انزلاق، تصغير)
        animate={{ opacity: 1, x: 0, scale: 1 }} // ✅ الحالة عند العرض (ظهور كامل)
        exit={{ opacity: 0, x: 20, scale: 0.95 }} // ✅ الحالة عند الخروج (اختفاء)
        transition={{ duration: 0.4, ease: "easeInOut" }} // ✅ مدة التأثير ونوع الحركة
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}