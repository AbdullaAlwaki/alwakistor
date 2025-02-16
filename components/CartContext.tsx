"use client"; // تحديد أن هذا المكون هو Client Component

import { createContext, useContext, useState, ReactNode } from 'react';

// تعريف نوع المنتج
interface Product {
  id: string | number;
  name: string;
  price: number;
  image?: string; // صورة المنتج (اختيارية)
  quantity?: number; // الكمية (اختيارية)
}

// تعريف نوع السياق
interface CartContextType {
  cartItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  getTotalPrice: () => number;
}

// إنشاء السياق
const CartContext = createContext<CartContextType | null>(null);

// مزود السياق
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  // دالة لإضافة منتج إلى السلة
  const addToCart = (product: Product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        )
      );
    } else {
      setCartItems((prevItems) => [...prevItems, { ...product, quantity: 1 }]);
    }
  };

  // دالة لحذف منتج من السلة
  const removeFromCart = (productId: string | number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  // دالة لتحديث كمية المنتج في السلة
  const updateQuantity = (productId: string | number, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  // دالة لحساب إجمالي السعر
  const getTotalPrice = (): number => {
    return cartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, getTotalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook لاستخدام السياق
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};