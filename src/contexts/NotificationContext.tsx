'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface Notification {
  id: number;
  title: string;
  content: string;
  time: string;
  isRead: boolean;
  type?: 'promotion' | 'update' | 'order' | 'system';
  link?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'time'>) => void;
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
  // Mẫu thông báo ban đầu
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'Khuyến mãi đặc biệt',
      content: 'Giảm 50% tất cả sản phẩm phần mềm trong tuần này!',
      time: '1 giờ trước',
      isRead: false,
      type: 'promotion',
      link: '/products'
    },
    {
      id: 2,
      title: 'Cập nhật mới',
      content: 'Phiên bản 2.0 đã ra mắt với nhiều tính năng mới',
      time: '1 ngày trước',
      isRead: false,
      type: 'update',
      link: '/products/1'
    },
    {
      id: 3,
      title: 'Đơn hàng đã xác nhận',
      content: 'Đơn hàng #12345 của bạn đã được xác nhận',
      time: '3 ngày trước',
      isRead: true,
      type: 'order',
      link: '/orders/12345'
    },
  ]);

  // Tính toán số thông báo chưa đọc - memoize để tránh tính toán lại
  const unreadCount = React.useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  // Hàm đánh dấu một thông báo đã đọc - sử dụng useCallback để tránh tạo lại hàm
  const markAsRead = useCallback((id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  }, []);

  // Hàm đánh dấu tất cả thông báo đã đọc - sử dụng useCallback để tránh tạo lại hàm
  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  }, []);

  // Hàm thêm thông báo mới - sử dụng useCallback để tránh tạo lại hàm
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'isRead' | 'time'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      isRead: false,
      time: 'Vừa xong'
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  // Lưu thông báo vào localStorage khi có thay đổi - nhưng chỉ làm khi thực sự thay đổi
  // Sử dụng useEffect với debounce để giảm tần suất ghi localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const timeoutId = setTimeout(() => {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }, 500); // Debounce 500ms
    
    return () => clearTimeout(timeoutId);
  }, [notifications]);

  // Khôi phục thông báo từ localStorage khi khởi tạo
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const savedNotifications = localStorage.getItem('notifications');
      if (savedNotifications) {
        const parsedNotifications = JSON.parse(savedNotifications);
        if (Array.isArray(parsedNotifications) && parsedNotifications.length > 0) {
          setNotifications(parsedNotifications);
        }
      }
    } catch (error) {
      console.error('Failed to parse notifications from localStorage:', error);
    }
  }, []);

  // Tạo và memoize giá trị context để tránh tạo lại object mới mỗi lần render
  const value = React.useMemo(() => ({
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification
  }), [notifications, unreadCount, markAsRead, markAllAsRead, addNotification]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext; 