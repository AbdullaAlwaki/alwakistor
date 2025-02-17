"use client"; // ✅ تحديد أن هذا المكون هو Client Component

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const [pathname, setPathname] = useState('/'); // ✅ إنشاء حالة لتخزين المسار الحالي

  useEffect(() => {
    // تحديث المسار عند تغيير الصفحة
    setPathname(window.location.pathname);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname} // ✅ استخدام المسار الحالي كمفتاح
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={{
          hidden: { opacity: 0, x: -20 },
          enter: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 20 },
        }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}