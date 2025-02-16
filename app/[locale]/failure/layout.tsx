import React from 'react';

export default function FailureLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <main className="p-8">{children}</main>
    </div>
  );
}