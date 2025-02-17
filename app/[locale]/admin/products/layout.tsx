import React from 'react';

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Manage Products</h1>
      <main>{children}</main>
    </div>
  );
}