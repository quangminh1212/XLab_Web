'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useNotifications, type Notification } from '@/contexts/NotificationContext';
import { useLanguage } from '@/contexts/LanguageContext';

const NotificationsPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const { t } = useLanguage();

  // Sử dụng NotificationContext
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  // Kiểm tra nếu người dùng chưa đăng nhập thì chuyển hướng về trang đăng nhập
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Lọc thông báo dựa trên tab đang chọn
  const filteredNotifications =
    activeTab === 'all'
      ? notifications
      : notifications.filter((notification) => !notification.isRead);

  // Hàm xử lý khi click vào thông báo
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      router.push(notification.link);
    }
  };

  // Hiển thị icon dựa vào loại thông báo
  const getTypeIcon = (type?: 'promotion' | 'update' | 'order' | 'system') => {
    switch (type) {
      case 'promotion':
        return (
          <div className="p-2 bg-red-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case 'update':
        return (
          <div className="p-2 bg-blue-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case 'order':
        return (
          <div className="p-2 bg-green-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
              <path
                fillRule="evenodd"
                d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case 'system':
        return (
          <div className="p-2 bg-yellow-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-2 bg-gray-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
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
        );
    }
  };

  // Hiển thị loading nếu đang kiểm tra trạng thái đăng nhập
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-primary-600 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('notifications.loading')}</p>
        </div>
      </div>
    );
  }

  // Hiển thị trang nếu người dùng đã đăng nhập
  if (session) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{t('notifications.title')}</h1>
                {notifications.some((n) => !n.isRead) && (
                  <button
                    onClick={markAllAsRead}
                    className="px-4 py-2 bg-primary-50 text-primary-600 text-sm font-medium rounded-md hover:bg-primary-100 transition-colors"
                  >
                    {t('notifications.markAllRead')}
                  </button>
                )}
              </div>

              <div className="flex space-x-2 mb-6">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t('notifications.all')} ({notifications.length})
                </button>
                <button
                  onClick={() => setActiveTab('unread')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'unread'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t('notifications.unread')} ({notifications.filter((n) => !n.isRead).length})
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-6 flex space-x-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      !notification.isRead ? 'bg-primary-50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex-shrink-0">{getTypeIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3
                          className={`text-base font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}
                        >
                          {notification.title}
                        </h3>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{notification.content}</p>
                      {notification.link && (
                        <div className="mt-2">
                          <span className="text-sm text-primary-600 hover:text-primary-800">
                            {notification.isRead ? t('notifications.viewDetailsLink') : t('notifications.viewNow')}
                          </span>
                        </div>
                      )}
                    </div>
                    {!notification.isRead && (
                      <div className="flex-shrink-0 self-center">
                        <div className="h-2 w-2 bg-primary-600 rounded-full"></div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{t('notifications.empty')}</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    {activeTab === 'unread'
                      ? t('notifications.allRead')
                      : t('notifications.noNotifications')}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-primary-600 hover:text-primary-800">
              {t('notifications.backToHome')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Mặc định sẽ không trả về gì cả vì đã chuyển hướng trong useEffect
  return null;
};

export default NotificationsPage;
