"use client"; // ✅ تحديد أن هذا المكون هو Client Component
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react"; // ✅ استيراد Swiper
import { Navigation, Pagination, Autoplay } from "swiper/modules"; // ✅ وظائف إضافية للمعرض
import "swiper/css"; // ✅ استيراد الأنماط الأساسية
import "swiper/css/navigation"; // ✅ استيراد أنماط التنقل
import "swiper/css/pagination"; // ✅ استيراد أنماط الترقيم
import { useTranslation } from "../..//useTranslation";
import { useRouter } from "next/navigation";
import ProductCard from "../../../../components/ProductCard"; // ✅ استيراد مكون ProductCard

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation("en"); // يمكنك تعديل اللغة حسب الحاجة
  const router = useRouter();

  useEffect(() => {
    // جلب تفاصيل المنتج من API باستخدام معرف المنتج
    fetch(`/api/products?id=${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProduct(data.data);
        } else {
          setError(data.message || t("products.error"));
        }
      })
      .catch(() => {
        setError(t("products.error"));
      });

    // جلب المنتجات المقترحة
    fetch("/api/products?limit=4") // ✅ جلب 4 منتجات مقترحة
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRelatedProducts(data.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.id]);

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

  // دالة لإضافة المنتج إلى السلة
  const handleAddToCart = () => {
    console.log("Product added to cart:", product);
    alert("تمت إضافة المنتج إلى السلة!"); // ✅ يمكنك استبدال هذا بمنطق إضافة إلى السلة الحقيقي
  };

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
          {/* القسم الأول: معرض الصور */}
          <div className="relative h-[500px] rounded-lg overflow-hidden shadow-lg">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={10}
              slidesPerView={1}
              navigation // ✅ أزرار التنقل
              pagination={{ clickable: true }} // ✅ ترقيم الصفحات
              autoplay={{ delay: 3000 }} // ✅ تشغيل تلقائي
              loop={true} // ✅ حلقة مستمرة
              className="h-full"
            >
              {product.images?.length > 0 ? (
                product.images.map((image: string, index: number) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <img
                    src={product.imageUrl || "/default-product-image.jpg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </SwiperSlide>
              )}
            </Swiper>
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

            {/* زر إضافة إلى السلة */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-primary-600 text-white py-3 rounded hover:bg-primary-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {t("products.addToCart")}
            </button>

            {/* زر الرجوع إلى القائمة */}
            <button
              onClick={() => router.back()}
              className="w-full bg-gray-200 text-gray-800 py-3 rounded hover:bg-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {t("products.goBack")}
            </button>
          </div>
        </div>

        {/* قسم المنتجات المقترحة */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
            {t("products.relatedProducts")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.length > 0 ? (
              relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  locale="en" // ✅ يمكنك تعديل اللغة حسب الحاجة
                  onAddToCart={(product: any) => {
                    console.log("Product added to cart:", product);
                  }}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">
                لا توجد منتجات مقترحة.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}