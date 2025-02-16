"use client";

import { useState, useEffect } from 'react';

export default function CircularProgressBar({ isLoading }: { isLoading: boolean }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      let interval: NodeJS.Timeout;

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
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
    }
  }, [isLoading]);

  return (
    <div className="fixed top-4 right-4 z-50">
      <svg className="w-16 h-16 text-primary-600" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="10"
        ></circle>
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeDasharray="283"
          strokeDashoffset={283 - (283 * progress) / 100}
          strokeLinecap="round"
          className="transition-all duration-300"
        ></circle>
      </svg>
    </div>
  );
}