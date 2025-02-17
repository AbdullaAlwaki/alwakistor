"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTranslation } from '../useTranslation';
import React from 'react';

export default function PaymentPage({ params }: { params: Promise<{ locale: string }> }) {
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
      <h1 className="text-4xl font-bold text-green-600 mb-4">{t('payment.title')}</h1>
      <p className="text-gray-600 dark:text-gray-400">{t('payment.description')}</p>
      <Link href={`/${locale}`} className="text-primary-600 dark:text-primary-400 hover:underline mt-4 inline-block">
        {t('payment.goBack')}
      </Link>
    </div>
  );
}