// components/SkeletonLoader.tsx
import React from 'react';

interface SkeletonLoaderProps {
  count?: number;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count = 1, className }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-gray-100 dark:bg-gray-800 rounded-none ${className || 'h-20'}`}
        />
      ))}
    </>
  );
};

export default SkeletonLoader;