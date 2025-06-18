'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NotFound() {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">{t('system.serviceNotFound')}</h1>
        <p className="mb-6 text-gray-600">
          {t('system.pageNotFoundMessage')}
        </p>
        <Link
          href="/services"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center justify-center"
        >
          {t('common.back')}
        </Link>
      </div>
    </div>
  );
}
