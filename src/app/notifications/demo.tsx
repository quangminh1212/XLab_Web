'use client';

import React, { useState } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';

const NotificationDemo = () => {
  const { addNotification } = useNotifications();
  const [demoType, setDemoType] = useState<'promotion' | 'update' | 'order' | 'system'>('system');

  const createDemoNotification = () => {
    const demoNotifications = {
      promotion: {
        title: 'Khuyến mãi mới',
        content: 'Khuyến mãi đặc biệt dành riêng cho bạn! Giảm 30% cho tất cả sản phẩm.',
        type: 'promotion' as const,
        link: '/products',
      },
      update: {
        title: 'Phiên bản mới',
        content: 'Chúng tôi vừa cập nhật phiên bản mới với nhiều tính năng hấp dẫn.',
        type: 'update' as const,
        link: '/products/1',
      },
      order: {
        title: 'Đơn hàng mới',
        content: 'Đơn hàng của bạn đã được xử lý và đang trong quá trình vận chuyển.',
        type: 'order' as const,
        link: '/orders',
      },
      system: {
        title: 'Thông báo hệ thống',
        content: 'Hệ thống sẽ bảo trì vào lúc 22:00 tối nay. Xin lỗi vì sự bất tiện này.',
        type: 'system' as const,
      },
    };

    addNotification(demoNotifications[demoType]);
  };

  return (
    <div className="mt-8 bg-white rounded-lg p-6 shadow">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Demo thông báo</h2>
      <p className="text-gray-600 mb-4">
        Sử dụng công cụ này để tạo thông báo mới để test hệ thống thông báo của ứng dụng.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1">
          <label
            htmlFor="notification-type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Loại thông báo
          </label>
          <select
            id="notification-type"
            value={demoType}
            onChange={(e) => setDemoType(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="promotion">Khuyến mãi</option>
            <option value="update">Cập nhật</option>
            <option value="order">Đơn hàng</option>
            <option value="system">Hệ thống</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={createDemoNotification}
            className="w-full sm:w-auto px-6 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            Tạo thông báo
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
            <h3 className="text-sm font-medium text-yellow-800">Chú ý</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Thông báo demo sẽ được thêm vào danh sách thông báo của bạn và sẽ được hiển thị ở
                Header. Trong môi trường thực tế, thông báo sẽ được tạo bởi hệ thống hoặc từ các
                hoạt động của người dùng.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDemo;
