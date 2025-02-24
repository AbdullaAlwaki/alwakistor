import React from 'react';
import Sidebar from '../../../components-Admin/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar />
      
      {/* المحتوى الرئيسي (80% للديسكتوب) */}
      <main className="flex-1 lg:w-4/5 p-4 lg:p-6">
        <div className="max-w-full mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}