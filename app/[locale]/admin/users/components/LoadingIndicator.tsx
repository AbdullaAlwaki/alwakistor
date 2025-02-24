"use client";

import React from "react";
import { motion } from "framer-motion";

const LoadingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-900/80"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner with mobile-optimized sizing */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
          className="h-12 w-12 rounded-full border-4 border-t-transparent border-current dark:border-gray-200"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        />
        
        {/* Animated text with subtle motion */}
        <motion.span
          initial={{ y: 5 }}
          animate={{ y: 0 }}
          transition={{ repeat: Infinity, duration: 0.8, repeatType: 'reverse' }}
          className="text-sm font-medium text-gray-600 dark:text-gray-300"
        >
          جارٍ التحميل...
        </motion.span>


         <div className="h-1 w-32 rounded-full bg-gray-200 dark:bg-gray-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-full rounded-full bg-blue-500"
          />
        </div> 
      </div>
    </motion.div>
  );
};

export default LoadingIndicator;