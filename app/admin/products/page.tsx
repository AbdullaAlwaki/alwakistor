"use client"; // تحديد أن هذا المكون هو Client Component

import { useEffect, useState } from 'react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]); // لتخزين قائمة المنتجات
  const [loading, setLoading] = useState(true); // حالة التحميل

  // دالة لجلب جميع المنتجات من قاعدة البيانات
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/get-products'); // نقطة نهاية API لجلب المنتجات
      if (!response.ok) {
        throw new Error('استجابة خاطئة من الخادم.');
      }
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      } else {
        alert(data.message || 'حدث خطأ أثناء جلب المنتجات.');
      }
    } catch (error) {
      console.error('حدث خطأ أثناء جلب المنتجات:', error);
      alert('حدث خطأ أثناء جلب المنتجات.');
    } finally {
      setLoading(false);
    }
  };

  // جلب المنتجات عند تحميل الصفحة
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">إدارة المنتجات</h1>

      {/* حالة التحميل */}
      {loading ? (
        <p className="text-center text-gray-700">جارٍ تحميل المنتجات...</p>
      ) : (
        <div className="space-y-4">
          {products.length === 0 ? (
            <p className="text-center text-gray-700">لا توجد منتجات متاحة.</p>
          ) : (
            products.map((product: any) => (
              <div key={product.id} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <p className="text-gray-700 font-medium">اسم المنتج: {product.name}</p>
                <p className="text-gray-700 font-medium">السعر: {product.price} ريال</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}