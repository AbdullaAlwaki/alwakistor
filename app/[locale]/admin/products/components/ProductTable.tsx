"use client";

import React from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  t: any; // ترجمة
}

export default function ProductTable({ products, onEdit, onDelete, t }: ProductTableProps) {
  return (
    <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <thead>
        <tr className="bg-gray-200 dark:bg-gray-700">
          <th className="border border-gray-300 dark:border-gray-700 p-2 text-gray-800 dark:text-gray-200">
            {t('admin.products.table.name')}
          </th>
          <th className="border border-gray-300 dark:border-gray-700 p-2 text-gray-800 dark:text-gray-200">
            {t('admin.products.table.description')}
          </th>
          <th className="border border-gray-300 dark:border-gray-700 p-2 text-gray-800 dark:text-gray-200">
            {t('admin.products.table.price')}
          </th>
          <th className="border border-gray-300 dark:border-gray-700 p-2 text-gray-800 dark:text-gray-200">
            {t('admin.products.table.image')}
          </th>
          <th className="border border-gray-300 dark:border-gray-700 p-2 text-gray-800 dark:text-gray-200">
            {t('admin.products.table.actions')}
          </th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id} className="hover:bg-gray-100 dark:hover:bg-gray-600">
            <td className="border border-gray-300 dark:border-gray-700 p-2 text-gray-800 dark:text-gray-200">
              {product.name}
            </td>
            <td className="border border-gray-300 dark:border-gray-700 p-2 text-gray-800 dark:text-gray-200">
              {product.description || "-"}
            </td>
            <td className="border border-gray-300 dark:border-gray-700 p-2 text-gray-800 dark:text-gray-200">
              ${product.price}
            </td>
            <td className="border border-gray-300 dark:border-gray-700 p-2 text-gray-800 dark:text-gray-200">
              {product.imageUrl && (
                <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover" />
              )}
            </td>
            <td className="border border-gray-300 dark:border-gray-700 p-2 space-x-2">
              <button
                onClick={() => onEdit(product)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
              >
                {t('admin.products.actions.edit')}
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
              >
                {t('admin.products.actions.delete')}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}