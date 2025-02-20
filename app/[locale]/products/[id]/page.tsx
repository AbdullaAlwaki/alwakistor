"use client"; // ✅ تحديد أن هذا المكون هو Client Component
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "../../useTranslation";

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>; // ✅ تعريف الـ params كـ Promise
}) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locale, setLocale] = useState<string>("en"); // ✅ حالة للغة
  const router = useRouter();

  useEffect(() => {
    // فك تغليف الـ params باستخدام then
    params.then((unwrappedParams) => {
      setLocale(unwrappedParams.locale); // ✅ تحديث اللغة

      // جلب تفاصيل المنتج من API باستخدام معرف المنتج
      fetch(`/api/products?id=${unwrappedParams.id}`) // ✅ استخدام unwrappedParams.id هنا
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setProduct(data.data);
          } else {
            setError(data.message || "Failed to fetch product details.");
          }
        })
        .catch(() => {
          setError("An error occurred while fetching the product.");
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }, [params]); // ✅ تتبع الـ params

  const { t } = useTranslation(locale); // ✅ استخدام اللغة من الحالة

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <p className="text-center text-gray-500">جارٍ التحميل...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <p className="text-center text-gray-500">لم يتم العثور على المنتج.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      {/* الصفحة الرئيسية */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* العنوان الرئيسي */}
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">
          {product.name}
        </h1>

        {/* المحتوى الرئيسي */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* القسم الأول: صورة المنتج */}
          <div className="relative h-[500px] rounded-lg overflow-hidden shadow-lg">
            <img
              src={product.imageUrl || "/default-product-image.jpg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* القسم الثاني: تفاصيل المنتج */}
          <div className="space-y-6">
            {/* اسم المنتج */}
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
              {product.name}
            </h2>

            {/* السعر */}
            <p className="text-2xl text-primary-600 dark:text-primary-400 font-bold">
              {t("products.price")}: {product.price} {t("products.currency")}
            </p>

            {/* الوصف */}
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {product.description}
            </p>

            {/* زر الرجوع إلى القائمة */}
            <button
              onClick={() => router.back()}
              className="w-full bg-gray-200 text-gray-800 py-3 rounded hover:bg-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {t("products.goBack")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
