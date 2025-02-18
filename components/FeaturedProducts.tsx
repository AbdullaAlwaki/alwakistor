"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useTranslation } from "../app/[locale]/useTranslation";

export default function FeaturedProducts({ locale }: { locale: string }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation(locale);

  useEffect(() => {
    // Fetch featured products from the API
    async function fetchFeaturedProducts() {
      try {
        const response = await fetch("/api/future-products"); // API endpoint for featured products
        // Check if the response is successful
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch featured products.");
        }
        const data = await response.json();

        // Ensure the data is an array and add unique keys if necessary
        if (!Array.isArray(data.data)) {
          throw new Error("Unexpected data format.");
        }

        // Format products to ensure each has a unique key
        const formattedProducts = data.data.map((product: { id: any; }, index: any) => ({
          ...product,
          id: product.id || `product-${index}`, // ✅ Add a unique key if `id` is missing
        }));

        setProducts(formattedProducts); // Update the products state
      } catch (e) {
        setError(e instanceof Error ? e.message : t("products.error"));
      } finally {
        setLoading(false);
      }
    }
    fetchFeaturedProducts();
  }, [locale]);

  return (
    <section className="py-16">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">{t("home.featuredProducts")}</h2>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-gray-500">Loading...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {/* No Products State */}
        {!loading && !error && products.length === 0 && (
          <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-gray-500">{t("products.noProductsAvailable")}</p>
          </div>
        )}

        {/* Display Products */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id} // ✅ Use the unique `id` as the key
                product={product}
                locale={locale}
                onAddToCart={(product) => {
                  console.log("Product added to cart:", product);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}