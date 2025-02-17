"use client";

import { useEffect, useState } from 'react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import Link from 'next/link';
import { useTranslation } from '../useTranslation';

export default function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState<string>('en');
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const [totalPrice, setTotalPrice] = useState(0);
  const { t, formatCurrency } = useTranslation(locale);

  useEffect(() => {
    if (params) {
      params.then((unwrappedParams) => {
        setLocale(unwrappedParams.locale);
      });
    }
  }, [params]);

  useEffect(() => {
    setTotalPrice(getTotalPrice());
  }, [cartItems]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">{t('cart.title')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('cart.description') || 'إدارة مشترياتك بسهولة'}</p>
      </header>
      <main className="grid grid-cols-1 gap-6">
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-700 dark:text-gray-400">
            <ShoppingCart size={40} className="mx-auto mb-4" />
            <p>{t('cart.emptyCart')}</p>
            <Link href={`/${locale}`} className="text-primary-600 dark:text-primary-400 hover:underline mt-4 inline-block">
              {t('cart.startShopping')}
            </Link>
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex items-center justify-between p-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image || "https://th.bing.com/th/id/OIP.th9PP5ztJug6QUp1lY0-BwHaEK?rs=1&pid=ImgDetMain"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">{item.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{t('home.price')}: {formatCurrency(item.price)}</p>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        -
                      </button>
                      <span className="text-gray-800 dark:text-white">{item.quantity || 1}</span>
                      <button
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                        className="text-green-500 hover:text-green-700 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('cart.totalPrice')}</h2>
              <p className="text-2xl text-primary-600 dark:text-primary-400">{formatCurrency(totalPrice)}</p>
            </div>
            <div className="mt-4 text-center">
              <Link
                href={`/${locale}/checkout`}
                className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition-colors"
              >
                {t('cart.checkout')}
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}