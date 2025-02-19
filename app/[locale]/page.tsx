"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslation } from "../[locale]/useTranslation";
import Footer from "../../components/Footer";
import PageTransition from "../../components/PageTransition";
import HeroSection from "../../components/HeroSection";

// Lazy Load FeaturedProducts
const LazyFeaturedProducts = dynamic(() => import("../../components/FeaturedProducts"), {
  ssr: false,
  loading: () => (
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
  ),
});

export default function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState<string>("en");
  const { t } = useTranslation(locale);

  useEffect(() => {
    params.then((unwrappedParams) => {
      setLocale(unwrappedParams.locale);
    });
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
          <LazyFeaturedProducts locale={locale} />
        </PageTransition>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}