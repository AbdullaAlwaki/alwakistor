// components/LoadingSpinner.tsx
import React from "react";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', text }) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className={`animate-spin rounded-full border-4 border-solid border-current border-r-transparent ${sizes[size]}`}>
        <span className="sr-only">Loading...</span>
      </div>
      {text && <p className="text-gray-600 dark:text-gray-400 text-sm">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;