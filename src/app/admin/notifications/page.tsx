'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import withAdminAuth from '@/components/withAdminAuth';

interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'promotion' | 'update' | 'order' | 'system';
  targetUsers?: string[];
  isRead: { [userId: string]: boolean };
  createdAt: string;
  link?: string;
  priority: 'low' | 'medium' | 'high';
  expiresAt?: string;
}

interface NotificationForm {
  title: string;
  content: string;
  type: 'promotion' | 'update' | 'order' | 'system';
  targetUsers: string;
  link: string;
  priority: 'low' | 'medium' | 'high';
  expiresAt: string;
}

function NotificationsPage() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'edit' | 'settings'>('list');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form state cho tạo thông báo
  const [form, setForm] = useState<NotificationForm>({
    title: '',
    content: '',
    type: 'system',
    targetUsers: '',
    link: '',
    priority: 'medium',
    expiresAt: ''
  });

  // Settings state
  const [notificationSettings, setNotificationSettings] = useState({
    autoSendOrderNotifications: true,
    autoSendPromotions: true,
    autoSendUpdates: true,
    emailNotifications: true,
    retentionDays: 30
  });

  // Fetch thông báo từ API
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      } else {
        setErrorMessage('Không thể tải danh sách thông báo');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setErrorMessage('Đã xảy ra lỗi khi tải thông báo');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setForm({
      title: '',
      content: '',
      type: 'system',
      targetUsers: '',
      link: '',
      priority: 'medium',
      expiresAt: ''
    });
  };

  // Tạo thông báo mới
  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const requestData = {
        title: form.title,
        content: form.content,
        type: form.type,
        link: form.link || undefined,
        priority: form.priority,
        expiresAt: form.expiresAt || undefined,
        targetUsers: form.targetUsers ? form.targetUsers.split(',').map(email => email.trim()).filter(email => email) : []
      };

      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Thông báo đã được tạo thành công!');
        resetForm();
        fetchNotifications(); // Refresh list
        setTimeout(() => setActiveTab('list'), 2000);
      } else {
        setErrorMessage(data.error || 'Đã xảy ra lỗi khi tạo thông báo');
      }
    } catch (error) {
      console.error('Error creating notification:', error);
      setErrorMessage('Đã xảy ra lỗi khi kết nối đến máy chủ');
    } finally {
      setIsCreating(false);
    }
  };

  // Cập nhật thông báo
  const handleUpdateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) return;

    setIsCreating(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const requestData = {
        title: form.title,
        content: form.content,
        type: form.type,
        link: form.link || undefined,
        priority: form.priority,
        expiresAt: form.expiresAt || undefined,
        targetUsers: form.targetUsers ? form.targetUsers.split(',').map(email => email.trim()).filter(email => email) : []
      };

      const response = await fetch(`/api/admin/notifications/${isEditing}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Thông báo đã được cập nhật thành công!');
        resetForm();
        setIsEditing(null);
        fetchNotifications();
        setTimeout(() => setActiveTab('list'), 2000);
      } else {
        setErrorMessage(data.error || 'Đã xảy ra lỗi khi cập nhật thông báo');
      }
    } catch (error) {
      console.error('Error updating notification:', error);
      setErrorMessage('Đã xảy ra lỗi khi kết nối đến máy chủ');
    } finally {
      setIsCreating(false);
    }
  };

  // Xóa thông báo
  const handleDeleteNotification = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa thông báo này?')) return;

    try {
      const response = await fetch(`/api/admin/notifications/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccessMessage('Thông báo đã được xóa thành công!');
        fetchNotifications();
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Đã xảy ra lỗi khi xóa thông báo');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      setErrorMessage('Đã xảy ra lỗi khi kết nối đến máy chủ');
    }
  };

  // Chỉnh sửa thông báo
  const handleEditNotification = (notification: Notification) => {
    setForm({
      title: notification.title,
      content: notification.content,
      type: notification.type,
      targetUsers: notification.targetUsers?.join(', ') || '',
      link: notification.link || '',
      priority: notification.priority,
      expiresAt: notification.expiresAt ? notification.expiresAt.split('T')[0] : ''
    });
    setIsEditing(notification.id);
    setActiveTab('edit');
  };

  // Format thời gian
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  // Đếm số người đã đọc
  const getReadCount = (notification: Notification) => {
    return Object.values(notification.isRead).filter(Boolean).length;
  };

  // Icon cho loại thông báo
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'promotion':
        return '🎉';
      case 'update':
        return '🔄';
      case 'order':
        return '📦';
      case 'system':
        return '⚙️';
      default:
        return '📢';
    }
  };

  // Màu cho độ ưu tiên
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Load notification settings từ localStorage
    const savedSettings = localStorage.getItem('admin_notification_settings');
    if (savedSettings) {
      try {
        setNotificationSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error parsing notification settings:', error);
      }
    }
  }, []);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  // Save settings
  const handleSaveSettings = () => {
    localStorage.setItem('admin_notification_settings', JSON.stringify(notificationSettings));
    setSuccessMessage('Cài đặt thông báo đã được lưu!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý thông báo</h1>
        <button
          onClick={() => setActiveTab('create')}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
        >
          Tạo thông báo mới
        </button>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4">
          <p>{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('list')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'list'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Danh sách thông báo ({notifications.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('create');
                resetForm();
                setIsEditing(null);
              }}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tạo thông báo
            </button>
            {isEditing && (
              <button
                onClick={() => setActiveTab('edit')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'edit'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Chỉnh sửa
              </button>
            )}
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Cài đặt
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Danh sách thông báo */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div key={notification.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{getTypeIcon(notification.type)}</span>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(notification.priority)}`}>
                              {notification.priority === 'high' ? 'Cao' : notification.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                            </span>
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              {notification.type === 'promotion' ? 'Khuyến mãi' : 
                               notification.type === 'update' ? 'Cập nhật' :
                               notification.type === 'order' ? 'Đơn hàng' : 'Hệ thống'}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{notification.content}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Tạo: {formatDate(notification.createdAt)}</span>
                            <span>Đã đọc: {getReadCount(notification)} người</span>
                            {notification.targetUsers && notification.targetUsers.length > 0 && (
                              <span>Gửi tới: {notification.targetUsers.length} người</span>
                            )}
                            {notification.expiresAt && (
                              <span>Hết hạn: {formatDate(notification.expiresAt)}</span>
                            )}
                          </div>
                          {notification.link && (
                            <div className="mt-2">
                              <a href={notification.link} className="text-primary-600 hover:text-primary-800 text-sm">
                                Xem chi tiết →
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => handleEditNotification(notification)}
                          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Chỉnh sửa
                        </button>
                        <button
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📢</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có thông báo nào</h3>
                  <p className="text-gray-500">Tạo thông báo đầu tiên để gửi tới người dùng</p>
                </div>
              )}
            </div>
          )}

          {/* Form tạo thông báo */}
          {activeTab === 'create' && (
            <div className="max-w-2xl">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Tạo thông báo mới</h2>
              
              <form onSubmit={handleCreateNotification} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề thông báo *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                    placeholder="Nhập tiêu đề thông báo"
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung thông báo *
                  </label>
                  <textarea
                    id="content"
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                    placeholder="Nhập nội dung thông báo"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                      Loại thông báo *
                    </label>
                    <select
                      id="type"
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="system">Hệ thống</option>
                      <option value="promotion">Khuyến mãi</option>
                      <option value="update">Cập nhật</option>
                      <option value="order">Đơn hàng</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                      Độ ưu tiên
                    </label>
                    <select
                      id="priority"
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="low">Thấp</option>
                      <option value="medium">Trung bình</option>
                      <option value="high">Cao</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
                    Liên kết (tùy chọn)
                  </label>
                  <input
                    type="url"
                    id="link"
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="/products hoặc https://example.com"
                  />
                </div>

                <div>
                  <label htmlFor="targetUsers" className="block text-sm font-medium text-gray-700 mb-2">
                    Gửi tới (tùy chọn)
                  </label>
                  <input
                    type="text"
                    id="targetUsers"
                    value={form.targetUsers}
                    onChange={(e) => setForm({ ...form, targetUsers: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="email1@example.com, email2@example.com (để trống để gửi cho tất cả)"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Nhập email người dùng, cách nhau bằng dấu phẩy. Để trống để gửi cho tất cả người dùng.
                  </p>
                </div>

                <div>
                  <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày hết hạn (tùy chọn)
                  </label>
                  <input
                    type="datetime-local"
                    id="expiresAt"
                    value={form.expiresAt}
                    onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('list')}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-400"
                  >
                    {isCreating ? 'Đang tạo...' : 'Tạo thông báo'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Form chỉnh sửa thông báo */}
          {activeTab === 'edit' && (
            <div className="max-w-2xl">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Chỉnh sửa thông báo</h2>
              
              <form onSubmit={handleUpdateNotification} className="space-y-6">
                <div>
                  <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề thông báo *
                  </label>
                  <input
                    type="text"
                    id="edit-title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                    placeholder="Nhập tiêu đề thông báo"
                  />
                </div>

                <div>
                  <label htmlFor="edit-content" className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung thông báo *
                  </label>
                  <textarea
                    id="edit-content"
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                    placeholder="Nhập nội dung thông báo"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-type" className="block text-sm font-medium text-gray-700 mb-2">
                      Loại thông báo *
                    </label>
                    <select
                      id="edit-type"
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="system">Hệ thống</option>
                      <option value="promotion">Khuyến mãi</option>
                      <option value="update">Cập nhật</option>
                      <option value="order">Đơn hàng</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="edit-priority" className="block text-sm font-medium text-gray-700 mb-2">
                      Độ ưu tiên
                    </label>
                    <select
                      id="edit-priority"
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="low">Thấp</option>
                      <option value="medium">Trung bình</option>
                      <option value="high">Cao</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="edit-link" className="block text-sm font-medium text-gray-700 mb-2">
                    Liên kết (tùy chọn)
                  </label>
                  <input
                    type="url"
                    id="edit-link"
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="/products hoặc https://example.com"
                  />
                </div>

                <div>
                  <label htmlFor="edit-targetUsers" className="block text-sm font-medium text-gray-700 mb-2">
                    Gửi tới (tùy chọn)
                  </label>
                  <input
                    type="text"
                    id="edit-targetUsers"
                    value={form.targetUsers}
                    onChange={(e) => setForm({ ...form, targetUsers: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="email1@example.com, email2@example.com (để trống để gửi cho tất cả)"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Nhập email người dùng, cách nhau bằng dấu phẩy. Để trống để gửi cho tất cả người dùng.
                  </p>
                </div>

                <div>
                  <label htmlFor="edit-expiresAt" className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày hết hạn (tùy chọn)
                  </label>
                  <input
                    type="datetime-local"
                    id="edit-expiresAt"
                    value={form.expiresAt}
                    onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setIsEditing(null);
                      setActiveTab('list');
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-400"
                  >
                    {isCreating ? 'Đang cập nhật...' : 'Cập nhật thông báo'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Cài đặt */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Cài đặt thông báo</h2>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-900">Thông báo tự động</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Thông báo đơn hàng tự động</span>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationSettings.autoSendOrderNotifications}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            autoSendOrderNotifications: e.target.checked
                          })}
                          className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
                        />
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Thông báo khuyến mãi tự động</span>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationSettings.autoSendPromotions}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            autoSendPromotions: e.target.checked
                          })}
                          className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
                        />
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Thông báo cập nhật tự động</span>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationSettings.autoSendUpdates}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            autoSendUpdates: e.target.checked
                          })}
                          className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
                        />
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Thông báo qua email</span>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationSettings.emailNotifications}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            emailNotifications: e.target.checked
                          })}
                          className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="retentionDays" className="block text-sm font-medium text-gray-700 mb-2">
                    Số ngày lưu trữ thông báo
                  </label>
                  <input
                    type="number"
                    id="retentionDays"
                    value={notificationSettings.retentionDays}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      retentionDays: parseInt(e.target.value) || 30
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min="1"
                    max="365"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Thông báo sẽ tự động bị xóa sau số ngày này
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSaveSettings}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    Lưu cài đặt
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withAdminAuth(NotificationsPage); 