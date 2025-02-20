"use client";
import React, { useEffect, useState } from "react";
import { useTranslation } from "../[locale]/useTranslation";
import Footer from "../../components/Footer";
import PageTransition from "../../components/PageTransition";
import HeroSection from "../../components/HeroSection";
import ProductCard from "../../components/ProductCard"; // ✅ استيراد ProductCard

export default function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState<string>("en");
  const { t } = useTranslation(locale);
  const [products, setProducts] = useState<any[]>([]); // ✅ تخزين المنتجات
  const [loading, setLoading] = useState<boolean>(true); // ✅ حالة التحميل

  useEffect(() => {
    params.then((unwrappedParams) => {
      setLocale(unwrappedParams.locale);
    });

    // ✅ جلب المنتجات من API
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data);
        }
      })
      .catch((error) => console.error("Error fetching products:", error))
      .finally(() => setLoading(false)); // ✅ إيقاف حالة التحميل
  }, [params]);

  return (
    <>
      {/* Main Content */}
      <main className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Hero Section */}
        <HeroSection
          title={t("home.hero.title")}
          subtitle={t("home.hero.subtitle")}
          buttonText={t("home.hero.buttonText")}
        />

        {/* Featured Products with Page Transition */}
        <PageTransition>
          {loading ? (
            // ✅ عرض سكليتون أثناء التحميل
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="border p-4 rounded shadow-md bg-gray-100 dark:bg-gray-800">
                  <div className="w-full h-48 bg-gray-200 animate-pulse rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2 mb-4"></div>
                  <div className="h-6 bg-gray-200 animate-pulse rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : (
            // ✅ عرض المنتجات الفعلية عند تحميلها
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
              {products.length > 0 ? (
                products.map((product, index) => (
                  <ProductCard
                    key={product.id || `product-${index}`} // ✅ مفتاح فريد لكل منتج
                    product={product}
                    locale={locale}
                  />
                ))
              ) : (
                <p className="text-center text-gray-600 dark:text-gray-400">No products available.</p>
              )}
            </div>
          )}
        </PageTransition>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
