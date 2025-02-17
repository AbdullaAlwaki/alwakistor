"use client"; // ✅ تحديد أن هذا المكون هو Client Component

import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function AddToCartButton() {
  const handleClick = () => {
    toast.success('تمت إضافة المنتج إلى السلة!');
  };

  return (
    <>
      <button onClick={handleClick} className="bg-accent text-white px-4 py-2 rounded">
        إضافة إلى السلة
      </button>
      <Toaster />
    </>
  );
}