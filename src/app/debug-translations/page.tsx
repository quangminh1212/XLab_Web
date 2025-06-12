'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { logAllAvailableTranslations } from '@/shared/utils/translation-debug';

export default function DebugTranslationsPage() {
  const { t, language, setLanguage } = useLanguage();
  const [debugKey, setDebugKey] = useState('products.title');
  const [translatedValue, setTranslatedValue] = useState('');
  const [allTranslations, setAllTranslations] = useState<any>(null);

  useEffect(() => {
    // Lấy bản dịch của khóa
    setTranslatedValue(t(debugKey));
    
    // Nạp toàn bộ bản dịch từ context
    try {
      const context = require('@/contexts/LanguageContext');
      setAllTranslations(context.translations);
    } catch (error) {
      console.error('Failed to load translations:', error);
    }
  }, [t, debugKey]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Debug Translations</h1>
      
      <div className="mb-4">
        <div className="flex items-center space-x-4 mb-2">
          <button 
            onClick={() => setLanguage('vi')} 
            className={`px-3 py-1 border rounded ${language === 'vi' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          >
            Tiếng Việt (vi)
          </button>
          <button 
            onClick={() => setLanguage('en')} 
            className={`px-3 py-1 border rounded ${language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          >
            English (en)
          </button>
          <button 
            onClick={() => setLanguage('es')} 
            className={`px-3 py-1 border rounded ${language === 'es' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          >
            Español (es)
          </button>
        </div>
        <p className="text-sm text-gray-600">Current language: <strong>{language}</strong></p>
      </div>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Test Translation Key</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            value={debugKey}
            onChange={(e) => setDebugKey(e.target.value)}
            className="flex-grow border rounded px-3 py-2"
            placeholder="Enter translation key (e.g. products.title)"
          />
          <button 
            onClick={() => setTranslatedValue(t(debugKey))}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Test
          </button>
        </div>
        
        <div className="mt-2 p-3 bg-gray-100 rounded">
          <p className="text-sm font-semibold">Key: <span className="font-mono">{debugKey}</span></p>
          <p className="text-sm font-semibold">Translated value: <span className="font-mono">{translatedValue}</span></p>
        </div>
      </div>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Common Translation Keys</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="p-2 border rounded">
            <p className="text-sm font-mono">products.title</p>
            <p className="text-sm">→ {t('products.title')}</p>
          </div>
          <div className="p-2 border rounded">
            <p className="text-sm font-mono">products.subtitle</p>
            <p className="text-sm">→ {t('products.subtitle')}</p>
          </div>
          <div className="p-2 border rounded">
            <p className="text-sm font-mono">products.all</p>
            <p className="text-sm">→ {t('products.all')}</p>
          </div>
          <div className="p-2 border rounded">
            <p className="text-sm font-mono">products.software</p>
            <p className="text-sm">→ {t('products.software')}</p>
          </div>
          <div className="p-2 border rounded">
            <p className="text-sm font-mono">products.service</p>
            <p className="text-sm">→ {t('products.service')}</p>
          </div>
          <div className="p-2 border rounded">
            <p className="text-sm font-mono">products.sortBy</p>
            <p className="text-sm">→ {t('products.sortBy')}</p>
          </div>
          <div className="p-2 border rounded">
            <p className="text-sm font-mono">product.addToCart</p>
            <p className="text-sm">→ {t('product.addToCart')}</p>
          </div>
          <div className="p-2 border rounded">
            <p className="text-sm font-mono">product.buyNow</p>
            <p className="text-sm">→ {t('product.buyNow')}</p>
          </div>
        </div>
      </div>
      
      {allTranslations && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Available Translations</h2>
          <details>
            <summary className="cursor-pointer p-2 bg-gray-100 rounded">Show all translations for {language}</summary>
            <div className="mt-2 p-3 bg-gray-50 rounded max-h-96 overflow-auto">
              {allTranslations[language] ? (
                <pre className="text-xs">
                  {Object.keys(allTranslations[language]).map(key => (
                    <div key={key} className="mb-1">
                      <strong>{key}</strong>: {String(allTranslations[language][key]).substring(0, 80)}
                      {String(allTranslations[language][key]).length > 80 ? '...' : ''}
                    </div>
                  ))}
                </pre>
              ) : (
                <p>No translations found for {language}</p>
              )}
            </div>
          </details>
        </div>
      )}
    </div>
  );
} 