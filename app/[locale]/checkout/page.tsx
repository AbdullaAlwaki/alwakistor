"use client"; // تحديد أن هذا المكون هو Client Component

import { useEffect, useState } from 'react';

type Product = {
  id: string | number;
  name: string;
  price: number;
  quantity?: number;
};
import { useCart } from '../../../context/CartContext';
import { useTranslation } from '../useTranslation';

export default function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState<string>('en');
  const { cartItems, removeFromCart } = useCart(); // استخدام سياق السلة
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t, formatCurrency } = useTranslation(locale);

  useEffect(() => {
    if (params) {
      params.then((unwrappedParams) => {
        setLocale(unwrappedParams.locale);
      });
    }
  }, [params]);

  // حساب السعر الإجمالي
  const totalPrice = cartItems.reduce((total: number, item: Product) => total + item.price * (item.quantity || 1), 0);

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
      alert(t('checkout.successMessage'));
      // إعادة تعيين السلة
      cartItems.forEach((item) => removeFromCart(item.id));
    } catch (error) {
      console.error('حدث خطأ أثناء إكمال الطلب:', error);
      alert(t('checkout.errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">{t('checkout.title')}</h1>

      {/* قائمة عناصر السلة */}
      <ul className="space-y-4">
        {cartItems.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">{t('cart.emptyCart')}</p>
        ) : (
          cartItems.map((item) => (
            <li key={item.id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden flex justify-between items-center p-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{item.name}</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {t('home.price')}: {formatCurrency(item.price)}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('cart.quantity')}: {item.quantity || 1}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                {t('cart.remove')}
              </button>
            </li>
          ))
        )}
      </ul>

      {/* السعر الإجمالي */}
      <div className="mt-6 bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          {t('cart.totalPrice')}: {formatCurrency(totalPrice)}
        </h2>
      </div>

      {/* نموذج بيانات الشحن */}
      <form onSubmit={handleSubmit} className="mt-6 bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 space-y-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{t('checkout.shippingDetails')}</h2>

        {/* الاسم الكامل */}
        <div>
          <label htmlFor="name" className="block text-gray-700 dark:text-gray-400 font-medium mb-2">
            {t('checkout.fullName')}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* العنوان */}
        <div>
          <label htmlFor="address" className="block text-gray-700 dark:text-gray-400 font-medium mb-2">
            {t('checkout.address')}
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* البريد الإلكتروني */}
        <div>
          <label htmlFor="email" className="block text-gray-700 dark:text-gray-400 font-medium mb-2">
            {t('checkout.email')}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* زر تأكيد الطلب */}
        <button
          type="submit"
          disabled={isSubmitting || cartItems.length === 0}
          className="bg-green-500 text-white px-6 py-3 rounded mt-4 hover:bg-green-600 w-full transition-colors"
        >
          {isSubmitting ? t('checkout.confirming') : t('checkout.confirmOrder')}
        </button>
      </form>
    </div>
  );
}