import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">لوحة تحكم المسؤول</h1>

      <nav className="flex flex-col gap-4">
        <Link href="/admin/products" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          إدارة المنتجات
        </Link>
        <Link href="/admin/orders" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          إدارة الطلبات
        </Link>
        <Link href="/" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          العودة إلى الصفحة الرئيسية
        </Link>
      </nav>
    </div>
  );
}