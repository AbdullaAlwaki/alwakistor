'use client'; // تحديد أن هذا المكون هو Client Component

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderIdFromUrl = searchParams.get('orderId');
  const [orderIdInput, setOrderIdInput] = useState('');
  const [orderStatus, setOrderStatus] = useState('قيد المعالجة'); // حالة الطلب الافتراضية
  const [note, setNote] = useState(''); // الملاحظة المرتبطة بالطلب
  const [loading, setLoading] = useState(false); // حالة التحميل

  // دالة للتعامل مع إرسال رقم الطلب
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderIdInput.trim()) {
      router.push(`/track-order?orderId=${orderIdInput}`);
    }
  };

  // إذا لم يكن هناك رقم طلب في URL، عرض حقل لإدخاله
  if (!orderIdFromUrl) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full space-y-6">
          <h1 className="text-2xl font-bold text-gray-800 text-center">تتبع الطلب</h1>

          {/* نموذج لإدخال رقم الطلب */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <label htmlFor="orderId" className="block text-gray-700 font-medium">
              أدخل رقم الطلب:
            </label>
            <input
              type="text"
              id="orderId"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              placeholder="رقم الطلب"
              className="w-full p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
            >
              تتبع الطلب
            </button>
          </form>
        </div>
      </div>
    );
  }

  // دالة لتحديث حالة الطلب يدويًا
  const handleUpdateStatus = () => {
    const newStatus =
      orderStatus === 'قيد المعالجة'
        ? 'قيد الشحن'
        : orderStatus === 'قيد الشحن'
        ? 'تم التسليم'
        : 'قيد المعالجة';
    setOrderStatus(newStatus);
  };

  // دالة لحفظ الملاحظة الجديدة
  const handleSaveNote = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/update-note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId: orderIdFromUrl, note }),
      });

      const data = await response.json();
      if (data.success) {
        alert('تم حفظ الملاحظة بنجاح.');
      } else {
        alert('حدث خطأ أثناء حفظ الملاحظة.');
      }
    } catch (error) {
      console.error('حدث خطأ أثناء حفظ الملاحظة:', error);
      alert('حدث خطأ أثناء حفظ الملاحظة.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center">تتبع الطلب</h1>

        {/* تفاصيل الطلب */}
        <div>
          <p className="text-gray-700 font-medium">رقم الطلب: {orderIdFromUrl}</p>
          <p className="text-gray-700 font-medium">حالة الطلب: {orderStatus}</p>
          <div>
            <label htmlFor="note" className="block text-gray-700 font-medium mt-4">
              الملاحظة:
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="اكتب ملاحظتك هنا..."
              className="w-full p-2 border rounded resize-none h-20"
            ></textarea>
            <button
              onClick={handleSaveNote}
              disabled={loading}
              className={`mt-2 w-full ${
                loading ? 'bg-gray-400' : 'bg-green-500'
              } text-white px-6 py-3 rounded hover:bg-green-600`}
            >
              {loading ? 'جارٍ الحفظ...' : 'حفظ الملاحظة'}
            </button>
          </div>
        </div>

        {/* زر لتحديث حالة الطلب */}
        <button
          onClick={handleUpdateStatus}
          className="w-full bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 mb-4"
        >
          تحديث حالة الطلب
        </button>

        {/* زر العودة إلى الصفحة الرئيسية */}
        <a href="/" className="block text-center bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
          العودة إلى الصفحة الرئيسية
        </a>
      </div>
    </div>
  );
}