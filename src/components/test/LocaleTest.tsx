'use client';

import { useLanguage } from '@/contexts/LanguageContext';

const LocaleTest = () => {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {t('common.success')} - {t('common.loading')}
      </h2>
      
      <div className="mb-4">
        <button
          onClick={() => setLanguage('vie')}
          className={`mr-2 px-4 py-2 rounded ${language === 'vie' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Tiếng Việt
        </button>
        <button
          onClick={() => setLanguage('eng')}
          className={`px-4 py-2 rounded ${language === 'eng' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          English
        </button>
      </div>
      
      <div className="space-y-4">
        <section className="border-b pb-2">
          <h3 className="font-bold">Common</h3>
          <p>{t('common.save')} | {t('common.cancel')} | {t('common.search')}</p>
        </section>
        
        <section className="border-b pb-2">
          <h3 className="font-bold">Navigation</h3>
          <p>{t('nav.home')} | {t('nav.products')} | {t('nav.about')}</p>
        </section>
        
        <section className="border-b pb-2">
          <h3 className="font-bold">Home</h3>
          <p>{t('home.slogan')}</p>
        </section>
        
        <section className="border-b pb-2">
          <h3 className="font-bold">Products</h3>
          <p>{t('product.addToCart')} | {t('product.buyNow')}</p>
        </section>
        
        <section className="border-b pb-2">
          <h3 className="font-bold">Auth</h3>
          <p>{t('auth.login.welcome')}</p>
        </section>
        
        <section className="border-b pb-2">
          <h3 className="font-bold">Admin</h3>
          <p>{t('admin.notifications.title')}</p>
        </section>
        
        <section className="border-b pb-2">
          <h3 className="font-bold">Parameter Test</h3>
          <p>{t('terms.section1.content', { siteName: 'XLab' })}</p>
        </section>
      </div>
    </div>
  );
};

export default LocaleTest; 