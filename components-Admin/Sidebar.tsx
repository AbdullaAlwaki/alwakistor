import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 p-4 shadow-md">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Admin Panel</h2>
      <nav className="flex flex-col gap-2">
        <Link href="/admin/dashboard" className="text-blue-500 hover:underline">
          Dashboard
        </Link>
        <Link href="/admin/products" className="text-blue-500 hover:underline">
          Manage Products
        </Link>
        <Link href="/admin/orders" className="text-blue-500 hover:underline">
          Manage Orders
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;