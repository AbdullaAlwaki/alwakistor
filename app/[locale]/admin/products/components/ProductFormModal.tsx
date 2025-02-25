import React, { useState, useEffect } from "react";
import { Product, ModalMode } from "./types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Product) => void;
  product?: Product;
  mode: ModalMode;
  t?: (key: string) => string;
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  product,
  mode,
  t,
}: Props) {
  // حالة النموذج مع القيم الافتراضية
  const [formData, setFormData] = useState<Product>({
    _id: "",
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
        createdAt: product.createdAt || new Date().toISOString(),
        updatedAt: product.updatedAt || new Date().toISOString(),
      });
    } else {
      // إعادة التعيين لحالة الإنشاء
      setFormData({
        _id: "",
        name: "",
        description: "",
        price: 0,
        imageUrl: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">
          {mode === "create"
            ? t?.("admin.form.create") ?? "Create New Product"
            : t?.("admin.form.edit") ?? "Edit Product"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* حقل الاسم */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t?.("admin.form.name") ?? "Name"}
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

          {/* حقل الوصف */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t?.("admin.form.description") ?? "Description"}
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

          {/* حقل السعر */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t?.("admin.form.price") ?? "Price"}
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

          {/* حقل صورة المنتج */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t?.("admin.form.imageUrl") ?? "Image URL"}
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

          {/* أزرار التحكم */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2.5 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors"
            >
              {t?.("admin.form.cancel") ?? "Cancel"}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {mode === "create"
                ? t?.("admin.form.create") ?? "Create"
                : t?.("admin.form.edit") ?? "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}