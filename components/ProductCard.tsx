"use client"; // تحديد أن هذا المكون هو Client Component

import Image from 'next/image'; 
import React from 'react';
import { toast } from 'react-toastify'; // ✅ إضافة التنبيهات
import 'react-toastify/dist/ReactToastify.css';

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
    toast.success(locale === 'ar' ? 'تمت إضافة المنتج إلى السلة' : 'Product added to cart');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      {/* صورة المنتج */}
      <div className="aspect-w-16 aspect-h-9 relative">
        <img
          src={product.imageUrl || "/default-product-image.jpg"}
          alt={product.name}
          className="object-cover"
        />
      </div>
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">{product.name}</h2>
        <p className="text-gray-600 dark:text-gray-400">{product.description}</p>
        <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">
          {locale === 'ar' ? 'السعر:' : 'Price:'} {product.price} ريال
        </p>
        <button
          onClick={handleAddToCart}
          className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 transition-colors"
        >
          {locale === 'ar' ? 'إضافة إلى السلة' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}