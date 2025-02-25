import React from "react";
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  withProgress?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text,
  withProgress = false 
}) => {
  const sizes = {
    sm: 'h-6 w-6 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4'
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        className={`rounded-full border-solid border-current border-r-transparent ${sizes[size]}`}
      >
        <span className="sr-only">Loading...</span>
      </motion.div>
      
      {text && <p className="text-gray-600 dark:text-gray-400 text-sm">{text}</p>}
      
      {withProgress && (
        <div className="h-1 w-32 rounded-full bg-gray-200 dark:bg-gray-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-full rounded-full bg-blue-500"
          />
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;