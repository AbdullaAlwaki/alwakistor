import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 p-4 shadow-md">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Admin Panel</h2>
        <nav className="flex flex-col gap-2">
          <a href="/admin/dashboard" className="text-blue-500 hover:underline">
            Dashboard
          </a>
          <a href="/admin/products" className="text-blue-500 hover:underline">
            Manage Products
          </a>
          <a href="/admin/orders" className="text-blue-500 hover:underline">
            Manage Orders
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}