"use client"; // ✅ تحديد أن هذا المكون هو Client Component
import React from "react";
import Link from "next/link"; // ✅ استيراد Link لتحويل المستخدم إلى صفحة المنتج
import Image from "next/image"; // ✅ استيراد مكون Image لتحسين تحميل الصور

// تعريف واجهة الـ Props
interface ProductCardProps {
  product: any;
  locale: string;
  onAddToCart?: (product: any) => void; // ✅ إضافة الخاصية بشكل اختياري
}

export default function ProductCard({ product, locale, onAddToCart }: ProductCardProps) {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product); // ✅ استدعاء الدالة عند النقر على زر الإضافة
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg cursor-pointer">
      {/* صورة المنتج */}
      <Link href={`/products/${product._id}`} passHref>
        <div className="w-full h-48 relative">
          <img
            src={product.imageUrl || "/default-product-image.jpg"}
            alt={product.name}
            
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover rounded-t-lg"
            
          />
        </div>
      </Link>

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
        {onAddToCart && (
          <button
            onClick={handleAddToCart}
            className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {locale === "ar" ? "إضافة إلى السلة" : "Add to Cart"}
          </button>
        )}
      </div>
    </div>
  );
}