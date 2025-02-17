import React from 'react';

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* يمكنك إضافة أي مكونات مشتركة هنا، مثل Navbar أو Footer */}
      <main className="p-8">{children}</main>
    </div>
  );
}