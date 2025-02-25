"use client";
import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";

const LoadingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-900/80"
    >
      <LoadingSpinner 
        size="lg" 
        text="جاري التحميل..." 
        withProgress 
      />
    </motion.div>
  );
};

export default LoadingIndicator;