import React, { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  product?: any;
  isEditing: boolean;
  t: any;
}

export default function ProductFormModal({ isOpen, onClose, onSubmit, product, isEditing, t }: Props) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    imageUrl: product?.imageUrl || "",
    releaseDate: product?.releaseDate || "", // ✅ إضافة حقل تاريخ الإصدار
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.releaseDate) {
      alert(t('admin.futureProducts.validationError')); // ✅ رسالة خطأ عند عدم إدخال الحقول المطلوبة
      return;
    }
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? t('admin.products.editProduct') : t('admin.products.addProduct')}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* اسم المنتج */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">{t('admin.products.table.name')}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          {/* الوصف */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">{t('admin.products.table.description')}</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          {/* السعر */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">{t('admin.products.table.price')}</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          {/* رابط الصورة */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">{t('admin.products.table.imageUrl')}</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          {/* تاريخ الإصدار */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">{t('admin.futureProducts.table.releaseDate')}</label>
            <input
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          {/* زر الإرسال */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
            >
              {t('admin.products.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              {isEditing ? t('admin.products.update') : t('admin.products.add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}