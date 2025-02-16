'use client'; // تحديد أن هذا المكون هو Client Component

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from 'react';
import { useCart } from '../../components/CartContext';

export default function CheckoutPage() {
  const { cartItems, removeFromCart } = useCart(); // استخدام سياق السلة
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // حساب السعر الإجمالي
  const totalPrice = cartItems.reduce((total: any, item: { price: any; }) => total + item.price, 0);

  // تحديث بيانات النموذج
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // إكمال الطلب
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // محاكاة طلب API لإكمال الطلب
      await new Promise((resolve) => setTimeout(resolve, 2000)); // انتظار 2 ثانية
      alert('تم تأكيد الطلب بنجاح!');
      // إعادة تعيين السلة
      cartItems.forEach((_: any, index: any) => removeFromCart(index));
    } catch (error) {
      console.error('حدث خطأ أثناء إكمال الطلب:', error);
      alert('حدث خطأ أثناء إكمال الطلب.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">إكمال الطلب</h1>

      {/* قائمة عناصر السلة */}
      <ul className="space-y-4">
        {cartItems.length === 0 ? (
          <p className="text-gray-600">السلة فارغة.</p>
        ) : (
          cartItems.map((item: { name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; price: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, index: number) => (
                      <li key={index} className="bg-white shadow-md rounded-lg overflow-hidden flex justify-between items-center p-4">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                          <p className="text-lg text-gray-600">${item.price}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                          إزالة
                        </button>
                      </li>
                    ))
        )}
      </ul>

      {/* السعر الإجمالي */}
      <div className="mt-6 bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-bold text-gray-800">السعر الإجمالي: ${totalPrice.toFixed(2)}</h2>
      </div>

      {/* نموذج بيانات الشحن */}
      <form onSubmit={handleSubmit} className="mt-6 bg-white shadow-md rounded-lg p-4 space-y-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">بيانات الشحن</h2>

        <div>
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            الاسم الكامل
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
            العنوان
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* زر تأكيد الطلب */}
        <button
          type="submit"
          disabled={isSubmitting || cartItems.length === 0}
          className="bg-green-500 text-white px-6 py-3 rounded mt-4 hover:bg-green-600 w-full"
        >
          {isSubmitting ? 'جارٍ التأكيد...' : 'تأكيد الطلب'}
        </button>
      </form>
    </div>
  );
}