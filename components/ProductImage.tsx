"use client"; // ✅ تحديد أن هذا المكون هو Client Component

import Image from 'next/image';
import React from 'react';

export default function ProductImage() {
  return (
    <div className="relative w-full h-64 rounded-lg overflow-hidden">
      <Image
        src="/product.jpg" // استبدل بالمسار الصحيح للصورة
        alt="Product Image"
        fill // يجعل الصورة تملأ الحاوية
        style={{ objectFit: 'cover' }} // ضبط الصورة لتغطي المساحة
        priority // لتحميل الصورة بشكل أولوي
        className="rounded-lg" // إضافة الأنماط
      />
    </div>
  );
}