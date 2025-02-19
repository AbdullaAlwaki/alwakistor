"use client"; // ✅ تحديد أن هذا المكون هو Client Component
import React from "react";
import { toast } from "react-toastify"; // ✅ إضافة التنبيهات
import "react-toastify/dist/ReactToastify.css";

export default function ProductCard({
  product,
  locale,
  onAddToCart,
}: {
  product: any;
  locale: string;
  onAddToCart: (product: any) => void;
}) {
  const handleAddToCart = () => {
    onAddToCart(product); // ✅ إضافة المنتج إلى السلة
    toast.success(
      locale === "ar"
        ? "تمت إضافة المنتج إلى السلة"
        : "Product added to cart",
      {
        position: "bottom-right", // ✅ موقع التنبيه
        autoClose: 3000, // ✅ إغلاق تلقائي بعد 3 ثوانٍ
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg">
      {/* صورة المنتج */}
      <div className="aspect-w-16 aspect-h-9 relative">
        <img
          src={product.imageUrl || "/default-product-image.jpg"}
          alt={product.name}
          className="w-full h-full object-cover rounded-t-lg"
          loading="lazy" // ✅ تحميل الصور بشكل كسول
        />
      </div>

      {/* تفاصيل المنتج */}
      <div className="p-4 space-y-4">
        {/* اسم المنتج */}
        <h2 className="text-xl font-bold text-gray-800 dark:text-white line-clamp-2">
          {product.name}
        </h2>

        {/* وصف المنتج */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
          {product.description}
        </p>

        {/* السعر */}
        <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">
          {locale === "ar" ? "السعر:" : "Price:"} {product.price}{" "}
          {locale === "ar" ? "ريال" : "SAR"}
        </p>

        {/* زر إضافة إلى السلة */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          {locale === "ar" ? "إضافة إلى السلة" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}