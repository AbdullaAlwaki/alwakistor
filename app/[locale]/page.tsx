"use client"; // تحديد أن هذا المكون هو Client Component

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../components/CartContext';
import SearchBar from '../../components/SearchBar';
import Filters from '../../components/Filters';
import Skeleton from '../../components/Skeleton';
import ProgressBar from '../../components/ProgressBar';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from './useTranslation';

export default function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState<string>('en'); // الافتراضي هو اللغة الإنجليزية
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useRef<HTMLDivElement | null>(null);

  // استخدام الترجمة والعملة
  const { t, formatCurrency } = useTranslation(locale);

  // فك تغليف params باستخدام React.use()
  useEffect(() => {
    if (params) {
      params.then((unwrappedParams) => {
        setLocale(unwrappedParams.locale); // تحديث اللغة الحالية
      });
    }
  }, [params]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/get-products'); // نقطة نهاية API لجلب المنتجات
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'استجابة خاطئة من الخادم.');
      }
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
        setFilteredProducts(data.products);
        setVisibleProducts(data.products.slice(0, 6)); // عرض أول 6 منتجات فقط
      } else {
        setError(data.message || 'حدث خطأ أثناء جلب المنتجات.');
      }
    } catch (error) {
      console.error('حدث خطأ أثناء جلب المنتجات:', error);
      setError('حدث خطأ أثناء جلب المنتجات.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && visibleProducts.length < filteredProducts.length) {
        setVisibleProducts((prev) => [
          ...prev,
          ...filteredProducts.slice(prev.length, prev.length + 6),
        ]);
      }
    });
    if (lastProductRef.current) observer.current.observe(lastProductRef.current);
  }, [loading, visibleProducts, filteredProducts]);

  const handleSearch = (query: string) => {
    const filtered = products.filter((product: any) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
    setVisibleProducts(filtered.slice(0, 6)); // إعادة ضبط المنتجات المرئية
  };

  const handleFilterChange = ({ category, minPrice, maxPrice }: { category?: string; minPrice?: number; maxPrice?: number }) => {
    let filtered = products;
    if (category) filtered = filtered.filter((product: any) => product.category === category);
    if (minPrice !== undefined) filtered = filtered.filter((product: any) => product.price >= minPrice);
    if (maxPrice !== undefined) filtered = filtered.filter((product: any) => product.price <= maxPrice);
    setFilteredProducts(filtered);
    setVisibleProducts(filtered.slice(0, 6)); // إعادة ضبط المنتجات المرئية
  };

  const suggestions = products.map((product: any) => ({
    id: product.id,
    name: product.name,
    image: product.image,
  }));

  const categories = Array.from(new Set(products.map((product: any) => product.category)));

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 relative">
      {/* مؤشر التقدم */}
      <ProgressBar isLoading={loading} />

      {/* القسم العلوي - الشعار والعنوان */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">{t('home.welcome')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('home.description')}</p>
      </header>

      {/* شريط البحث مع الاقتراحات */}
      <SearchBar onSearch={handleSearch} suggestions={suggestions} placeholder={t('home.searchPlaceholder')} />

      {/* الفلاتر */}
      <Filters categories={categories} onFilterChange={handleFilterChange} />

      {/* عرض المنتجات */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // عرض Skeleton Loading أثناء التحميل
          Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} />)
        ) : error ? (
          <p className="text-center text-red-500 col-span-full">{error}</p>
        ) : visibleProducts.length === 0 ? (
          <p className="text-center text-gray-700 dark:text-gray-400 col-span-full">{t('home.noProducts')}</p>
        ) : (
          <AnimatePresence>
            {visibleProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                ref={index === visibleProducts.length - 1 ? lastProductRef : null} // مراقبة آخر عنصر
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
              >
                {/* صورة المنتج */}
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={product.image || "https://th.bing.com/th/id/OIP.th9PP5ztJug6QUp1lY0-BwHaEK?rs=1&pid=ImgDetMain"} // صورة افتراضية إذا لم تكن هناك صورة
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 space-y-4">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">{product.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{product.description}</p>
                  <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                    {t('home.price')}: {formatCurrency(product.price)}
                  </p>
                  {/* زر "إضافة إلى السلة" */}
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors"
                  >
                    <ShoppingCart size={20} className="inline-block mr-2" /> {t('cart.checkout')}
                  </button>
                </div>
              </motion.div>
            ))}
            {/* تحميل المزيد من المنتجات */}
            {visibleProducts.length < filteredProducts.length && (
              <div className="col-span-full text-center py-4">
                <p className="text-gray-700 dark:text-gray-400">جارٍ تحميل المزيد...</p>
              </div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}