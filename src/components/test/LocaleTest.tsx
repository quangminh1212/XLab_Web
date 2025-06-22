'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';

export default function LocaleTest() {
  const { t, language, setLanguage } = useLanguage();
  const [testKey, setTestKey] = useState('home.slogan');
  const [showDebug, setShowDebug] = useState(true);

  const testKeys = [
    'home.slogan',
    'home.search',
    'home.aboutTitle',
    'home.aboutDesc1',
    'home.aboutDesc2',
    'home.learnMore',
    'nav.home',
    'nav.products',
    'nav.about',
    'nav.contact',
    'nav.warranty',
    'product.addToCart',
    'product.buyNow',
    'product.purchasesPerWeek',
    'footer.copyright',
    'footer.aboutLink',
    'footer.products',
    'footer.services'
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'eng' ? 'vie' : 'eng');
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg max-w-4xl mx-auto my-8">
      <h1 className="text-2xl font-bold mb-4">Translation Testing Tool</h1>
      
      <div className="flex items-center mb-6 space-x-3">
        <span className="font-medium">Current Language:</span>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{language}</span>
        <button 
          onClick={toggleLanguage}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Switch to {language === 'eng' ? 'Vietnamese' : 'English'}
        </button>
      </div>
      
      <div className="mb-6">
        <label htmlFor="testKey" className="block font-medium mb-1">Test a translation key:</label>
        <div className="flex space-x-2">
          <input
            id="testKey"
            type="text"
            value={testKey}
            onChange={(e) => setTestKey(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 flex-grow"
            placeholder="Enter a translation key (e.g. 'home.slogan')"
          />
          <button 
            onClick={() => setTestKey('')}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Clear
          </button>
        </div>
      </div>
      
      {testKey && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="font-medium">Translation Result:</div>
          <div className="mt-2 p-3 bg-white border border-gray-200 rounded whitespace-pre-wrap">
            {testKey === t(testKey) 
              ? <span className="text-red-500">⚠️ Key not translated: {testKey}</span> 
              : <span className="text-green-600">{t(testKey)}</span>
            }
          </div>
        </div>
      )}
      
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">Quick Translation Tests</h2>
          <button 
            onClick={() => setShowDebug(!showDebug)}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            {showDebug ? 'Hide' : 'Show'} Debug Info
          </button>
        </div>
        {showDebug && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {testKeys.map((key) => (
              <div key={key} className="p-3 border border-gray-200 rounded bg-gray-50">
                <div className="text-sm font-medium text-gray-500">{key}</div>
                <div className="mt-1 font-medium">
                  {key === t(key) 
                    ? <span className="text-red-500">⚠️ Not translated!</span>
                    : <span className="text-green-600">{t(key)}</span>
                  }
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-medium mb-2">Sample Translations Display:</h2>
        <p>{t('nav.home')} | {t('nav.products')} | {t('nav.about')}</p>
        <p className="mt-2 font-bold">{t('home.aboutTitle')}</p>
        <p className="mt-1">{t('home.aboutDesc1')}</p>
      </div>
    </div>
  );
} 