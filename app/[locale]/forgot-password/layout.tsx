import React from 'react';

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {/* يمكنك إضافة أي مكونات مشتركة هنا */}
      <main className="w-full max-w-md">{children}</main>
    </div>
  );
}