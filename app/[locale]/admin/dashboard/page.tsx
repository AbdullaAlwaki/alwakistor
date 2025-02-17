"use client"; // Mark this as a Client Component

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '../../../[locale]/useTranslation';

export default function AdminDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = React.useState<string>('en');
  const { t } = useTranslation(locale);

  React.useEffect(() => {
    if (params) {
      params.then((unwrappedParams) => {
        setLocale(unwrappedParams.locale);
      });
    }
  }, [params]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{t('dashboard.title')}</h1>
      <nav className="flex flex-col gap-4">
        <Link href={`/${locale}/admin/products`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {t('dashboard.manageProducts')}
        </Link>
        <Link href={`/${locale}/admin/orders`} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          {t('dashboard.manageOrders')}
        </Link>
        <Link href={`/${locale}`} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          {t('dashboard.goBack')}
        </Link>
      </nav>
    </div>
  );
}