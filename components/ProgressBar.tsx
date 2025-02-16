"use client"; // تحديد أن هذا المكون هو Client Component

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ProgressBar({ isLoading }: { isLoading: boolean }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      let interval: NodeJS.Timeout;

      // زيادة مؤشر التقدم بشكل تدريجي
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);

      return () => clearInterval(interval);
    } else {
      // إعادة ضبط المؤشر عند انتهاء التحميل
      setProgress(100);
      setTimeout(() => setProgress(0), 500); // إخفاء المؤشر بعد انتهاء التحميل
    }
  }, [isLoading]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <motion.div
        initial={{ width: '0%' }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3 }}
        className="h-1 bg-primary-600"
      ></motion.div>
    </div>
  );
}