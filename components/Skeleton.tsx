import React from "react";

interface SkeletonProps {
  className?: string; // ✅ إضافة خاصية لتطبيق الأنماط المخصصة
}

const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
    ></div>
  );
};

export default Skeleton;