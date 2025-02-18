"use client";
import React, { useEffect, useState } from "react";
import { useTranslation } from "../[locale]/useTranslation";
import Footer from "../../components/Footer";
import PageTransition from "../../components/PageTransition";
import HeroSection from "../../components/HeroSection";
import FeaturedProducts from "../../components/FeaturedProducts";

export default function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState<string>("en");
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation(locale);

  useEffect(() => {
    if (params) {
      params.then((unwrappedParams) => {
        setLocale(unwrappedParams.locale);
      });
    }
    setLoading(false);
  }, [params]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">

        {/* Main Content */}
        <main className="flex-grow">
          {/* Hero Section */}
          <HeroSection
            title={t("home.hero.title")}
            subtitle={t("home.hero.subtitle")}
            buttonText={t("home.hero.buttonText")}
          />

          {/* Featured Products */}
          <FeaturedProducts locale={locale} />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </PageTransition>
  );
}