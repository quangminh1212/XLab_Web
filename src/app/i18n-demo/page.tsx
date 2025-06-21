'use client';

import React from 'react';
import useI18n from '@/contexts/I18nContext';
import { LanguageSwitcher } from '@/components/common';

const I18nDemoPage = () => {
  const { t } = useI18n();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('common:general.welcome')}</h1>
        <LanguageSwitcher />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">{t('home:hero.title')}</h2>
          <p className="text-gray-700 mb-4">{t('home:hero.subtitle')}</p>
          <button className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors">
            {t('home:hero.cta')}
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">{t('products:title')}</h2>
          <p className="text-gray-700 mb-4">{t('products:description')}</p>
          
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>{t('products:sort.title')}:</span>
              <span>{t('products:sort.newest')}</span>
            </div>
            
            <div className="flex justify-between">
              <span>{t('products:product.add_to_cart')}:</span>
              <button className="bg-primary-500 text-white px-3 py-1 rounded-md text-sm hover:bg-primary-600 transition-colors">
                {t('products:product.add_to_cart')}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">{t('auth:login.title')}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('auth:login.email')}</label>
              <input
                type="email"
                className="w-full rounded-md border border-gray-300 p-2"
                placeholder={t('auth:login.email')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('auth:login.password')}</label>
              <input
                type="password"
                className="w-full rounded-md border border-gray-300 p-2"
                placeholder={t('auth:login.password')}
              />
            </div>
            <button className="w-full bg-primary-500 text-white py-2 rounded-md hover:bg-primary-600 transition-colors">
              {t('auth:login.submit')}
            </button>
            <p className="text-sm text-center">
              {t('auth:login.no_account')} <a href="#" className="text-primary-500">{t('auth:login.register')}</a>
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">{t('checkout:title')}</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">{t('checkout:cart.product')}</h3>
                <p>Product Name</p>
              </div>
              <div>
                <h3 className="font-medium">{t('checkout:cart.total')}</h3>
                <p>$99.99</p>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span>{t('checkout:cart.subtotal')}:</span>
                <span>$99.99</span>
              </div>
              <div className="flex justify-between">
                <span>{t('checkout:cart.shipping')}:</span>
                <span>$10.00</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>{t('checkout:cart.order_total')}:</span>
                <span>$109.99</span>
              </div>
            </div>
            <button className="w-full bg-primary-500 text-white py-2 rounded-md hover:bg-primary-600 transition-colors">
              {t('checkout:cart.proceed')}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">{t('errors:general.title')}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-red-50 p-4 rounded-md">
            <h3 className="font-medium text-red-700">{t('errors:http.404')}</h3>
            <p className="text-red-600 text-sm mt-1">{t('errors:general.try_again')}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-md">
            <h3 className="font-medium text-yellow-700">{t('errors:form.required')}</h3>
            <p className="text-yellow-600 text-sm mt-1">{t('errors:form.invalid_email')}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="font-medium text-blue-700">{t('errors:offline.title')}</h3>
            <p className="text-blue-600 text-sm mt-1">{t('errors:offline.message')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default I18nDemoPage; 