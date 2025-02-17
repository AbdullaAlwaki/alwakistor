"use client"; // Mark this as a Client Component

import React from 'react';
import { useTranslation } from '../../../[locale]/useTranslation';

export default function ManageProducts({ params }: { params: Promise<{ locale: string }> }) {
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
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{t('products.title')}</h1>
      <p>{t('products.description')}</p>
      {/* Add your product management UI here */}
    </div>
  );
}