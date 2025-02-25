"use client";
import { motion } from "framer-motion";

const SkeletonLoader = ({ count = 1, className }: { 
  count?: number; 
  className?: string 
}) => {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className={`bg-gray-200 dark:bg-gray-700 rounded-xl ${className || 'h-20'}`}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;