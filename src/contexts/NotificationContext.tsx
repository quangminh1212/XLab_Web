'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

import { useLanguage } from '@/contexts/LanguageContext';
import { useLangFetch } from '@/lib/langFetch';

export interface Notification {
  id: number | string;
  title: string;
  content: string;
  time: string;
  isRead: boolean;
  type?: 'promotion' | 'update' | 'order' | 'system';
  link?: string;
  priority?: 'low' | 'medium' | 'high';
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number | string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'time'>) => void;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();
  const lfetch = useLangFetch(language);

  // Tính toán số thông báo chưa đọc
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Tải thông báo từ API
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await lfetch('/api/notifications', {
        headers: { 'x-user-language': language }
      });
      // lfetch throws on non-ok; if success, notifications array may be under .notifications or .data
      const data = (res && typeof res === 'object' && 'notifications' in res) ? res : res?.data;
      setNotifications((data?.notifications as any[]) || []);
    } catch (error: any) {
      if (error?.message?.includes('Unauthorized') || error?.message?.includes('401')) {
        setNotifications([]);
      } else {
        console.error('Failed to fetch notifications:', error);
      }
    } finally {
        // User chưa đăng nhập, không hiển thị thông báo
        setNotifications([]);
      } else {
        console.error('Failed to fetch notifications:', response.status);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [language]);

  // Hàm đánh dấu một thông báo đã đọc
  const markAsRead = async (id: number | string) => {
    try {
      const response = await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId: id.toString() }),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === id.toString() ? { ...notification, isRead: true } : notification,
          ),
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Hàm đánh dấu tất cả thông báo đã đọc
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ markAll: true }),
      });

      if (response.ok) {
        setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Hàm thêm thông báo mới (chỉ để demo)
  const addNotification = (notification: Omit<Notification, 'id' | 'isRead' | 'time'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      isRead: false,
      time: t('notifications.justNow') || 'Vừa xong',
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  // Tải thông báo khi component mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    loading,
    fetchNotifications,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export default NotificationContext;
