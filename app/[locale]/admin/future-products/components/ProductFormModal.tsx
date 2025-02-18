"use client";
import React, { useState } from "react";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void; // استقبال دالة الإرسال مع بيانات النموذج
  product: any; // المنتج المراد تعديله أو إضافته
  isEditing: boolean;
  t: any; // ترجمة
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  product: initialProduct,
  isEditing,
  t,
}: ProductFormModalProps) {
  if (!isOpen) return null;

  // إدارة حالة النموذج باستخدام React State
  const [formData, setFormData] = useState({
    name: initialProduct?.name || "",
    description: initialProduct?.description || "",
    price: initialProduct?.price || 0,
    imageUrl: initialProduct?.imageUrl || "",
  });

  // تحديث الحقول عند تغيير القيم
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  // إرسال النموذج
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData); // إرسال البيانات إلى الوالد
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          {isEditing ? t('admin.products.editProduct') : t('admin.products.addProduct')}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* حقل الاسم */}
          <input
            type="text"
            name="name"
            placeholder={t('admin.products.form.name')}
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
            required
          />
          {/* حقل الوصف */}
          <input
            type="text"
            name="description"
            placeholder={t('admin.products.form.description')}
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
          />
          {/* حقل السعر */}
          <input
            type="number"
            name="price"
            placeholder={t('admin.products.form.price')}
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
            required
          />
          {/* حقل رابط الصورة */}
          <input
            type="text"
            name="imageUrl"
            placeholder={t('admin.products.form.imageUrl')}
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
          />
          {/* أزرار الإرسال والإلغاء */}
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              {isEditing ? t('admin.products.form.update') : t('admin.products.form.submit')}
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              {t('admin.products.form.cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}