"use client"; // Specify that this is a Client Component

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import SearchBar from '../../components/SearchBar';
import Filters from '../../components/Filters';
import Skeleton from '../../components/Skeleton';
import ProgressBar from '../../components/ProgressBar';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from './useTranslation';

export default function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState<string>('en'); // Default language is English
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useRef<HTMLDivElement | null>(null);

  // Translation and currency formatting
  const { t, formatCurrency } = useTranslation(locale);

  // Unwrap params using React.use()
  useEffect(() => {
    if (params) {
      params.then((unwrappedParams) => {
        setLocale(unwrappedParams.locale); // Update the current language
      });
    }
  }, [params]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/get-products'); // API endpoint to fetch products
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Invalid server response.');
      }
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
        setFilteredProducts(data.products);
        setVisibleProducts(data.products.slice(0, 6)); // Display the first 6 products
      } else {
        setError(data.message || 'An error occurred while fetching products.');
      }
    } catch (error) {
      console.error('An error occurred while fetching products:', error);
      setError('An error occurred while fetching products.');
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
    setVisibleProducts(filtered.slice(0, 6)); // Reset visible products
  };

  const handleFilterChange = ({ category, minPrice, maxPrice }: { category?: string; minPrice?: number; maxPrice?: number }) => {
    let filtered = products;
    if (category) filtered = filtered.filter((product: any) => product.category === category);
    if (minPrice !== undefined) filtered = filtered.filter((product: any) => product.price >= minPrice);
    if (maxPrice !== undefined) filtered = filtered.filter((product: any) => product.price <= maxPrice);
    setFilteredProducts(filtered);
    setVisibleProducts(filtered.slice(0, 6)); // Reset visible products
  };

  const suggestions = products.map((product: any) => ({
    id: product.id,
    name: product.name,
    image: product.image,
  }));

  const categories = Array.from(new Set(products.map((product: any) => product.category)));

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 relative pb-20"> {/* ✅ Add pb-20 */}
      {/* Progress Bar */}
      <ProgressBar isLoading={loading} />
      {/* Header Section */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">{t('home.welcome')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('home.description')}</p>
      </header>
      {/* Search Bar with Suggestions */}
      <SearchBar onSearch={handleSearch} suggestions={suggestions} placeholder={t('home.searchPlaceholder')} />
      {/* Filters */}
      <Filters categories={categories} onFilterChange={handleFilterChange} />
      {/* Product Grid */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Show Skeleton Loading while loading
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
                ref={index === visibleProducts.length - 1 ? lastProductRef : null} // Observe the last element
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
              >
                {/* Product Image */}
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={product.image || "https://th.bing.com/th/id/OIP.th9PP5ztJug6QUp1lY0-BwHaEK?rs=1&pid=ImgDetMain"} // Default image if no image is available
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
                  {/* "Add to Cart" Button */}
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors"
                  >
                    <ShoppingCart size={20} className="inline-block mr-2" /> {t('cart.checkout')}
                  </button>
                </div>
              </motion.div>
            ))}
            {/* Load More Products */}
            {visibleProducts.length < filteredProducts.length && (
              <div className="col-span-full text-center py-4">
                <p className="text-gray-700 dark:text-gray-400">Loading more...</p>
              </div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}