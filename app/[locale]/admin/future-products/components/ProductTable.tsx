import React from "react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface Props {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  t: any;
}

export default function ProductTable({ products, onEdit, onDelete, t }: Props) {
  if (!products || products.length === 0) {
    return (
      <div className="flex justify-center items-center h-48 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <p className="text-gray-600 dark:text-gray-400">{t('admin.products.noProducts')}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
          <tr>
            <th className="py-3 px-6 text-left font-medium">الصورة</th>
            <th className="py-3 px-6 text-left font-medium">الاسم</th>
            <th className="py-3 px-6 text-left font-medium">الوصف</th>
            <th className="py-3 px-6 text-left font-medium">السعر</th>
            <th className="py-3 px-6 text-center font-medium">الإجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {products.map((product) => (
            <tr key={product._id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              {/* الصورة */}
              <td className="py-4 px-6">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-full"
                />
              </td>
              {/* الاسم */}
              <td className="py-4 px-6 font-medium text-gray-900 dark:text-gray-200">{product.name}</td>
              {/* الوصف */}
              <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{product.description}</td>
              {/* السعر */}
              <td className="py-4 px-6 text-green-600 font-semibold">${product.price.toFixed(2)}</td>
              {/* الإجراءات */}
              <td className="py-4 px-6 flex justify-center space-x-4">
                {/* زر التعديل */}
                <button
                  onClick={() => onEdit(product)}
                  className="text-blue-500 hover:text-blue-700 font-medium"
                >
                  {t('admin.products.edit')}
                </button>
                {/* زر الحذف */}
                <button
                  onClick={() => onDelete(product._id)}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  {t('admin.products.delete')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}