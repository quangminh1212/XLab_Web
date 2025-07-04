import Link from 'next/link';

import { siteConfig } from '@/config/siteConfig';
import { useLanguage } from '@/contexts/LanguageContext';

'use client';



export default function TermsPage() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-8 sm:p-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('terms.title')}</h1>

          <div className="prose prose-teal max-w-none">
            <p className="text-gray-600 mb-6">
              {t('terms.lastUpdated')}: {siteConfig.legal.termsLastUpdated}
            </p>

            <h2>1. {t('terms.section1.title')}</h2>
            <p>
              {t('terms.section1.content', { siteName: siteConfig.name })}
            </p>

            <h2>2. {t('terms.section2.title')}</h2>
            <p>
              {t('terms.section2.content')}
            </p>

            <h2>3. {t('terms.section3.title')}</h2>
            <p>
              {t('terms.section3.content', { companyName: siteConfig.legal.companyName })}
            </p>

            <h2>4. {t('terms.section4.title')}</h2>
            <p>
              {t('terms.section4.content', { companyName: siteConfig.legal.companyName })}
            </p>

            <h2>5. {t('terms.section5.title')}</h2>
            <p>
              {t('terms.section5.content')}
            </p>

            <h2>6. {t('terms.section6.title')}</h2>
            <p>
              {t('terms.section6.content')}{' '}
              <Link href="/privacy" className="text-primary-600 hover:underline">
                {t('terms.section6.privacyPolicy')}
              </Link>{' '}
              {t('terms.section6.content2')}
            </p>

            <h2>7. {t('terms.section7.title')}</h2>
            <p>
              {t('terms.section7.content', { companyName: siteConfig.legal.companyName })}
            </p>

            <h2>8. {t('terms.section8.title')}</h2>
            <p>
              {t('terms.section8.content', { companyName: siteConfig.legal.companyName })}
            </p>

            <h2>9. {t('terms.section9.title')}</h2>
            <p>
              {t('terms.section9.content', { companyName: siteConfig.legal.companyName })}
            </p>

            <h2>10. {t('terms.section10.title')}</h2>
            <p>
              {t('terms.section10.content')}
            </p>

            <h2>11. {t('terms.section11.title')}</h2>
            <p>
              {t('terms.section11.content')}
            </p>

            <h2>12. {t('terms.section12.title')}</h2>
            <p>
              {t('terms.section12.content')}{' '}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-primary-600 hover:underline"
              >
                {siteConfig.contact.email}
              </a>{' '}
              {t('terms.section12.content2')}{' '}
              <Link href="/contact" className="text-primary-600 hover:underline">
                {t('terms.section12.contactPage')}
              </Link>{' '}
              {t('terms.section12.content3')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
