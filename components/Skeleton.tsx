"use client"; // تحديد أن هذا المكون هو Client Component

export default function Skeleton() {
  return (
    <div className="animate-pulse">
      {/* صورة المنتج */}
      <div className="aspect-w-16 aspect-h-9 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
      {/* تفاصيل المنتج */}
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div> {/* اسم المنتج */}
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div> {/* الوصف */}
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div> {/* السعر */}
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-full"></div> {/* زر الإضافة إلى السلة */}
      </div>
    </div>
  );
}