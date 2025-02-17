import React from 'react';

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Manage Orders</h1>
      <main>{children}</main>
    </div>
  );
}