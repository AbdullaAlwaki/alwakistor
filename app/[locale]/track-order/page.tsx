"use client"; // تحديد أن هذا المكون هو Client Component

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTranslation } from '../useTranslation';

export default function TrackOrderPage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState<string>('en');
  const { t } = useTranslation(locale);

  useEffect(() => {
    if (params) {
      params.then((unwrappedParams) => {
        setLocale(unwrappedParams.locale);
      });
    }
  }, [params]);

  return (
    <div className="text-center p-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">{t('trackOrder.title')}</h1>
      <p className="text-gray-600 dark:text-gray-400">{t('trackOrder.description')}</p>
      <Link href={`/${locale}`} className="text-primary-600 dark:text-primary-400 hover:underline mt-4 inline-block">
        {t('trackOrder.goBack')}
      </Link>
    </div>
  );
}