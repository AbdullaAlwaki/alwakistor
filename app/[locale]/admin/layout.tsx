import React from 'react';
import Sidebar from '../../../components-Admin/Sidebar';

export default function AdminLayout({
  children,
  params, // إضافة params كـ prop
}: {
  children: React.ReactNode;
  params: { locale: string }; // تعريف نوع params
}) {
  return (
    <div className="max-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar params={params} /> {/* تمرير params إلى Sidebar */}
      <main className="flex-1 lg:w-4/5">
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
}
