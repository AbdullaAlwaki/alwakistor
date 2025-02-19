"use client";
import React, { useEffect, useState } from "react";
import { useTranslation } from "../../[locale]/useTranslation";
import { useSearchParams } from "next/navigation";
import ProductCard from "../../../components/ProductCard";

export default function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState<string>("en");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // استخدام useSearchParams للوصول إلى معلمات البحث
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || ""; // ✅ جلب نص البحث من URL
  const { t } = useTranslation(locale);

  useEffect(() => {
    if (params) {
      params.then((unwrappedParams) => {
        setLocale(unwrappedParams.locale);
      });
    }

    // دالة لجلب المنتجات بناءً على الاستعلام
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();

        if (data.success) {
          setProducts(data.data);
        } else {
          setError(data.message || t("products.error"));
        }
      } catch (err) {
        setError(t("products.error"));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [params, searchQuery]); // ✅ إعادة الجلب عند تغيير searchQuery

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      {/* عنوان الصفحة */}
      <h1 className="text-3xl font-bold text-center mb-8">{t("products.title")}</h1>

      {/* حالة التحميل */}
      {loading && (
        <p className="text-center text-gray-500">جارٍ التحميل...</p>
      )}

      {/* حالة الخطأ */}
      {error && !loading && (
        <p className="text-center text-red-500">{error}</p>
      )}

      {/* حالة عدم وجود منتجات */}
      {!loading && !error && products.length === 0 && (
        <p className="text-center text-gray-500">لا توجد منتجات متاحة.</p>
      )}

      {/* عرض المنتجات باستخدام ProductCard */}
      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={product.id || `product-${index}`} // ✅ إضافة مفتاح فريد لكل منتج
              product={product}
              locale={locale}
              onAddToCart={(product) => {
                console.log("Product added to cart:", product);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}