import Navbar from '../../components/Navbar'; // ✅ تحديث المسار
import { CartProvider } from '../../components/CartContext';
import PageTransition from '../../components/PageTransition'; // ✅ استيراد المكون الجديد
import '../styles/globals.css'; // ✅ تحديث المسار إلى ../styles/globals.css

// Server Component
export default async function RootLayout({
  children,
  params, // ✅ تمرير الـ params مباشرة
}: {
  children: React.ReactNode;
  params: { locale: string }; // ✅ تعريف النوع
}) {
  return (
    <html lang={params.locale} dir={params.locale === 'ar' ? 'rtl' : 'ltr'}>
      <head>
        <title>Alwaki Store</title>
        <meta name="description" content="متجر Alwaki - تسوق أفضل المنتجات بأفضل الأسعار." />
      </head>
      <body className="bg-background text-foreground min-h-screen">
        {/* ✅ توفير السياق الدولي */}
        <CartProvider>
          <Navbar locale={params.locale} />
          {/* ✅ التفاف المحتوى بمكون PageTransition */}
          <PageTransition>
            <main className="container mx-auto p-4">{children}</main>
          </PageTransition>
        </CartProvider>
      </body>
    </html>
  );
}