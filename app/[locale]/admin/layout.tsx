import React from 'react';
import Sidebar from '../../../components-Admin/Sidebar';

export default function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // تحديد النوع كـ Promise
}) {
  return (
    <div className="max-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar params={params} /> {/* تمرير params كـ Promise */}
      <main className="flex-1 lg:w-4/5">
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
}
