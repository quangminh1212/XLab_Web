'use client';

import React, { useState } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { useLanguage } from '@/contexts/LanguageContext';

const NotificationDemo = () => {
  const { addNotification } = useNotifications();
  const [demoType, setDemoType] = useState<'promotion' | 'update' | 'order' | 'system'>('system');
  const { t } = useLanguage();

  const createDemoNotification = () => {
    const demoNotifications = {
      promotion: {
        title: t('notifications.demo.promotionTitle'),
        content: t('notifications.demo.promotionContent'),
        type: 'promotion' as const,
        link: '/products',
      },
      update: {
        title: t('notifications.demo.updateTitle'),
        content: t('notifications.demo.updateContent'),
        type: 'update' as const,
        link: '/products/1',
      },
      order: {
        title: t('notifications.demo.orderTitle'),
        content: t('notifications.demo.orderContent'),
        type: 'order' as const,
        link: '/orders',
      },
      system: {
        title: t('notifications.demo.systemTitle'),
        content: t('notifications.demo.systemContent'),
        type: 'system' as const,
      },
    };

    addNotification(demoNotifications[demoType]);
  };

  return (
    <div className="mt-8 bg-white rounded-lg p-6 shadow">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{t('notifications.demo.title')}</h2>
      <p className="text-gray-600 mb-4">
        {t('notifications.demo.description')}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1">
          <label
            htmlFor="notification-type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t('notifications.demo.type')}
          </label>
          <select
            id="notification-type"
            value={demoType}
            onChange={(e) => setDemoType(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="promotion">{t('notifications.type.promotion')}</option>
            <option value="update">{t('notifications.type.update')}</option>
            <option value="order">{t('notifications.type.order')}</option>
            <option value="system">{t('notifications.type.system')}</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={createDemoNotification}
            className="w-full sm:w-auto px-6 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            {t('notifications.demo.create')}
          </button>
        </div>
      </div>

      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">{t('notifications.demo.note')}</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                {t('notifications.demo.noteText')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDemo;
