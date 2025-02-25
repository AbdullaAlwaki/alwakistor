import React, { useState, useEffect } from "react";
import { Product, ModalMode } from "./types";

interface Props {
  isOpen: boolean;
  onClose: () => void; // دالة لإغلاق النافذة
  onSubmit: (formData: Product) => void;
  product?: Product; // المنتج المراد تعديله (اختياري)
  mode: ModalMode; // وضع النموذج (إنشاء أو تعديل)
  t?: (key: string) => string; // دالة الترجمة (اختياري)
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  product,
  mode,
  t,
}: Props) {
  const [formData, setFormData] = useState<Product>({
    _id: "",
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
  });

  // تحديث الحالة عند تغيير المنتج
  useEffect(() => {
    if (product) {
      setFormData({
        _id: product._id || "",
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        imageUrl: product.imageUrl || "",
      });
    } else {
      setFormData({
        _id: "",
        name: "",
        description: "",
        price: 0,
        imageUrl: "",
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose(); // إغلاق النافذة بعد الإرسال
  };

  // إغلاق النافذة عند الضغط على زر الإغلاق
  const handleCancel = () => {
    onClose(); // استدعاء دالة الإغلاق
  };

  // إغلاق النافذة عند الضغط خارج المحتوى
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose(); // إغلاق النافذة إذا تم الضغط على الطبقة الخارجية
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleOverlayClick} // إغلاق النافذة عند الضغط خارجها
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // منع الإغلاق عند الضغط داخل النافذة
      >
        <h2 className="text-xl font-bold mb-4">
          {mode === "create" ? (t ? t('admin.form.create') : "Create New Product") : (t ? t('admin.form.edit') : "Edit Product")}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t ? t('admin.form.name') : "Name"}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t ? t('admin.form.description') : "Description"}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              rows={3}
              required
            />
          </div>

          {/* Price Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t ? t('admin.form.price') : "Price"}
            </label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          {/* Image URL Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t ? t('admin.form.imageUrl') : "Image URL"}
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel} // إغلاق النافذة عند الضغط على "إلغاء"
              className="px-5 py-2.5 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors"
            >
              {t ? t('admin.form.cancel') : "Cancel"}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {mode === "create" ? (t ? t('admin.form.create') : "Create") : (t ? t('admin.form.edit') : "Save Changes")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}