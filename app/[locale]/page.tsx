"use client";

import React, { useEffect, useState } from 'react';
import { useTranslation } from './useTranslation';

export default function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState<string>('en');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation(locale);

  useEffect(() => {
    if (params) {
      params.then((unwrappedParams) => {
        setLocale(unwrappedParams.locale);
      });
    }

    // جلب المنتجات من API
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products'); // API endpoint to fetch products

        // التحقق مما إذا كانت الاستجابة ناجحة
        if (!response.ok) {
          const errorData = await response.json(); // ✅ قراءة البيانات مرة واحدة
          throw new Error(errorData.message || 'Invalid server response.');
        }

        const data = await response.json(); // ✅ إعادة استخدام البيانات
        setProducts(data.data); // تحديث قائمة المنتجات
      } catch (e) {
        setError(e instanceof Error ? e.message : t('products.error'));
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <h1 className="text-3xl font-bold text-center mb-8">{t('products.title')}</h1>
      {loading ? (
        <p className="text-center text-gray-500">جارٍ التحميل...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500">لا توجد منتجات متاحة.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {product.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {product.description || t('products.noDescription')}
                </p>
                <p className="text-green-500 font-bold mt-4">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}