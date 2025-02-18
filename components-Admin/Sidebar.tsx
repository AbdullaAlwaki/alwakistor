import React from 'react';
import Link from 'next/link';
import { HomeIcon, CubeIcon, ShoppingCartIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'; // ✅ إضافة أيقونات

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 p-4 shadow-md h-screen sticky top-0">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">لوحة التحكم</h2>
      <nav className="flex flex-col gap-2">
        {/* لوحة التحكم */}
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors"
        >
          <HomeIcon className="w-5 h-5" /> {/* ✅ أيقونة لوحة التحكم */}
          لوحة التحكم
        </Link>

        {/* إدارة المنتجات الحالية */}
        <Link
          href="/admin/products"
          className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors"
        >
          <CubeIcon className="w-5 h-5" /> {/* ✅ أيقونة المنتجات */}
          إدارة المنتجات الحالية
        </Link>

        {/* إدارة المنتجات المستقبلية */}
        <Link
          href="/admin/future-products"
          className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors"
        >
          <CalendarDaysIcon className="w-5 h-5" /> {/* ✅ أيقونة المنتجات المستقبلية */}
          إدارة المنتجات المستقبلية
        </Link>

        {/* إدارة الطلبات */}
        <Link
          href="/admin/orders"
          className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors"
        >
          <ShoppingCartIcon className="w-5 h-5" /> {/* ✅ أيقونة الطلبات */}
          إدارة الطلبات
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;