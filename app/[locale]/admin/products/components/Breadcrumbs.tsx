"use client";
import React from 'react';
import Link from 'next/link';
import { useTranslation } from '../../../useTranslation';

export default function Breadcrumbs() {
  const { t } = useTranslation('ar');

  return (
    <nav className="flex mb-5 text-sm text-slate-600 dark:text-slate-400" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            href="/admin"
            className="inline-flex items-center text-sm font-medium hover:text-blue-600 dark:hover:text-blue-500"
          >
            {t('admin.dashboard')}
          </Link>
        </li>
        <li>
          <div className="flex items-center">
            <svg
              className="w-3 h-3 text-slate-400 mx-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
            <span className="ml-1 text-sm font-medium md:ml-2">
              {t('admin.products.title')}
            </span>
          </div>
        </li>
      </ol>
    </nav>
  );
}