'use client'; // تحديد أن هذا المكون هو Client Component

import { useEffect, useState } from 'react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]); // لتخزين قائمة الطلبات
  const [loading, setLoading] = useState(true); // حالة التحميل

  // دالة لجلب جميع الطلبات من قاعدة البيانات
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/get-orders'); // نقطة نهاية API لجلب الطلبات
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        alert('حدث خطأ أثناء جلب الطلبات.');
      }
    } catch (error) {
      console.error('حدث خطأ أثناء جلب الطلبات:', error);
      alert('حدث خطأ أثناء جلب الطلبات.');
    } finally {
      setLoading(false);
    }
  };

  // تحديث حالة الطلب باستخدام API
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/update-order-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        alert('تم تحديث حالة الطلب بنجاح.');
        fetchOrders(); // تحديث القائمة بعد التعديل
      } else {
        alert('حدث خطأ أثناء تحديث حالة الطلب.');
      }
    } catch (error) {
      console.error('حدث خطأ أثناء تحديث حالة الطلب:', error);
      alert('حدث خطأ أثناء تحديث حالة الطلب.');
    }
  };

  // جلب الطلبات عند تحميل الصفحة
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">إدارة الطلبات</h1>

      {/* حالة التحميل */}
      {loading ? (
        <p className="text-center text-gray-700">جارٍ تحميل الطلبات...</p>
      ) : (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-center text-gray-700">لا توجد طلبات متاحة.</p>
          ) : (
            orders.map((order: any) => (
              <div
                key={order.orderId}
                className="bg-white p-6 rounded-lg shadow-md space-y-4"
              >
                <p className="text-gray-700 font-medium">رقم الطلب: {order.orderId}</p>
                <p className="text-gray-700 font-medium">حالة الطلب: {order.status}</p>
                {order.note && (
                  <p className="text-gray-700 font-medium">
                    الملاحظة: <span className="italic">{order.note}</span>
                  </p>
                )}

                {/* زر لتحديث حالة الطلب */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleUpdateStatus(order.orderId, 'قيد الشحن')}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    قيد الشحن
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(order.orderId, 'تم التسليم')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    تم التسليم
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}