// ✅ هذا الملف لا يحتوي على "use client"، وبالتالي يمكن تصدير metadata منه
import React from 'react';
import GeneralNavbar from '../../components/GeneralNavbar';
import { CartProvider } from '../../components/CartContext';
import PageTransition from '../../components/PageTransition';
import '../styles/globals.css';

export const metadata = {
  title: 'Alwaki Store',
  description: 'متجر Alwaki - تسوق أفضل المنتجات بأفضل الأسعار.',
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className="bg-background text-foreground min-h-screen">
        <CartProvider>
          {/* شريط التنقل */}
          <GeneralNavbarWrapper />
          {/* التفاف المحتوى بمكون PageTransition */}
          <PageTransition>
            <main className="container mx-auto p-4">{children}</main>
          </PageTransition>
        </CartProvider>
      </body>
    </html>
  );
}

// مكون Wrapper لشريط التنقل
function GeneralNavbarWrapper() {
  return <GeneralNavbar locale={''} />;
}