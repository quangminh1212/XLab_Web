'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Tính toán số thông báo chưa đọc
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Hàm đánh dấu một thông báo đã đọc
  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  // Hàm đánh dấu tất cả thông báo đã đọc
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  // Hàm thêm thông báo mới
  const addNotification = (notification: Omit<Notification, 'id' | 'isRead' | 'time'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      isRead: false,
      time: 'Vừa xong'
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Lưu thông báo vào localStorage khi có thay đổi
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  // Khôi phục thông báo từ localStorage khi khởi tạo
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedNotifications = localStorage.getItem('notifications');
      if (savedNotifications) {
        try {
          setNotifications(JSON.parse(savedNotifications));
        } catch (error) {
          console.error('Failed to parse notifications from localStorage:', error);
        }
      }
    }
  }, []);

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext; 