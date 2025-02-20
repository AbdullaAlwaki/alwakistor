"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx"; // 📌 لتحسين التعامل مع classNames

// 🎯 تحديد واجهة المنتج لتحسين TypeScript
interface Product {
  _id: string;
  name: string;
  description: string;
  imageUrl?: string;
  price: number;
  currency?: string;
}

interface ProductCardProps {
  product: Product;
  locale: string;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, locale, onAddToCart }: ProductCardProps) {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform
        hover:scale-[1.03] hover:shadow-xl cursor-pointer duration-300"
    >
      {/* صورة المنتج */}
      <Link href={`/products/${product._id}`} passHref>
        <div className="relative w-full h-48">
          <Image
            src={product.imageUrl || "/default-product-image.jpg"}
            alt={product.name}
            fill
            className="object-cover rounded-t-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      {/* تفاصيل المنتج */}
      <div className="p-4 space-y-3">
        {/* اسم المنتج */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
          {product.name}
        </h2>

        {/* وصف المنتج */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
          {product.description}
        </p>

        {/* السعر */}
        <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">
          {locale === "ar" ? "السعر:" : "Price:"} {product.price}{" "}
          {product.currency || (locale === "ar" ? "ريال" : "SAR")}
        </p>

        {/* زر إضافة إلى السلة */}
        {onAddToCart && (
          <button
            onClick={handleAddToCart}
            className={clsx(
              "w-full py-2 rounded-md transition-all duration-300 focus:outline-none focus:ring-2",
              "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-600 focus:ring-offset-2",
              "dark:focus:ring-offset-gray-800"
            )}
            aria-label={locale === "ar" ? "إضافة المنتج إلى السلة" : "Add product to cart"}
          >
            {locale === "ar" ? "إضافة إلى السلة" : "Add to Cart"}
          </button>
        )}
      </div>
    </div>
  );
}
