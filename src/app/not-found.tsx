'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NotFound() {
  const { t } = useLanguage();
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-4 text-center text-4xl font-bold text-red-600">404</h1>
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          {t('system.pageNotFound')}
        </h2>
        <p className="mb-8 text-center text-gray-600">
          {t('system.pageNotFoundMessage')}
        </p>
        <div className="flex justify-center">
          <Link
            href="/"
            className="rounded-md bg-primary-600 px-6 py-2 text-white transition-colors hover:bg-primary-700"
          >
            {t('system.returnToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
