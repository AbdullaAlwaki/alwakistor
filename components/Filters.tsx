"use client"; // تحديد أن هذا المكون هو Client Component

import { useState } from 'react';

interface FiltersProps {
  categories: string[]; // قائمة التصنيفات
  onFilterChange: (filters: { category?: string; minPrice?: number; maxPrice?: number }) => void; // دالة لتحديث الفلاتر
}

export default function Filters({ categories, onFilterChange }: FiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(''); // التصنيف المحدد
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined); // الحد الأدنى للسعر
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined); // الحد الأقصى للسعر

  // تحديث الفلاتر عند التغيير
  const applyFilters = () => {
    onFilterChange({
      category: selectedCategory || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
    });
  };

  return (
    <div className="mb-8">
      {/* التصنيف */}
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">التصنيف</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600"
        >
          <option value="">جميع التصنيفات</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* النطاق السعري */}
      <div className="flex gap-4 mb-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">الحد الأدنى للسعر</label>
          <input
            type="number"
            placeholder="الحد الأدنى"
            value={minPrice || ''}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">الحد الأقصى للسعر</label>
          <input
            type="number"
            placeholder="الحد الأقصى"
            value={maxPrice || ''}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600"
          />
        </div>
      </div>

      {/* زر تطبيق الفلاتر */}
      <button
        onClick={applyFilters}
        className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 transition-colors"
      >
        تطبيق الفلاتر
      </button>
    </div>
  );
}