'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import withAdminAuth from '@/components/withAdminAuth';
import { useLanguage } from '@/contexts/LanguageContext';

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
  metadata?: {
    es?: {
      title?: string;
      content?: string;
    };
    en?: {
      title?: string;
      content?: string;
    };
    chi?: {
      title?: string;
      content?: string;
    };
    readCount?: number;
  };
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
  const { t, locale } = useLanguage();
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
    expiresAt: '',
  });

  // Form tạo thông báo
  const [formMetadata, setFormMetadata] = useState({
    en: { title: '', content: '' },
    es: { title: '', content: '' },
    chi: { title: '', content: '' }
  });

  // Settings state
  const [notificationSettings, setNotificationSettings] = useState({
    autoSendOrderNotifications: true,
    autoSendPromotions: true,
    autoSendUpdates: true,
    emailNotifications: true,
    retentionDays: 30,
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
        setErrorMessage(t('admin.notifications.error'));
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setErrorMessage(t('admin.notifications.connectionError'));
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
      expiresAt: '',
    });
    setFormMetadata({
      en: { title: '', content: '' },
      es: { title: '', content: '' },
      chi: { title: '', content: '' }
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
        priority: form.priority as 'low' | 'medium' | 'high',
        expiresAt: form.expiresAt || undefined,
        targetUsers: form.targetUsers ? form.targetUsers.split(',').map(u => u.trim()) : [],
        metadata: {
          en: {
            title: formMetadata.en.title || undefined,
            content: formMetadata.en.content || undefined
          },
          es: {
            title: formMetadata.es.title || undefined,
            content: formMetadata.es.content || undefined
          },
          chi: {
            title: formMetadata.chi.title || undefined,
            content: formMetadata.chi.content || undefined
          }
        }
      };

      // Xóa các thuộc tính metadata nếu không có nội dung
      if (!formMetadata.en.title && !formMetadata.en.content) {
        delete requestData.metadata.en;
      }
      if (!formMetadata.es.title && !formMetadata.es.content) {
        delete requestData.metadata.es;
      }
      if (!formMetadata.chi.title && !formMetadata.chi.content) {
        delete requestData.metadata.chi;
      }
      if (Object.keys(requestData.metadata).length === 0) {
        delete requestData.metadata;
      }

      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(t('admin.notifications.success'));
        resetForm();
        fetchNotifications(); // Refresh list
        setActiveTab('list'); // Quay về danh sách ngay lập tức
      } else {
        setErrorMessage(data.error || t('admin.notifications.error'));
      }
    } catch (error) {
      console.error('Error creating notification:', error);
      setErrorMessage(t('admin.notifications.connectionError'));
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
        priority: form.priority as 'low' | 'medium' | 'high',
        expiresAt: form.expiresAt || undefined,
        targetUsers: form.targetUsers ? form.targetUsers.split(',').map(u => u.trim()) : [],
        metadata: {
          en: {
            title: formMetadata.en.title || undefined,
            content: formMetadata.en.content || undefined
          },
          es: {
            title: formMetadata.es.title || undefined,
            content: formMetadata.es.content || undefined
          },
          chi: {
            title: formMetadata.chi.title || undefined,
            content: formMetadata.chi.content || undefined
          }
        }
      };

      // Xóa các thuộc tính metadata nếu không có nội dung
      if (!formMetadata.en.title && !formMetadata.en.content) {
        delete requestData.metadata.en;
      }
      if (!formMetadata.es.title && !formMetadata.es.content) {
        delete requestData.metadata.es;
      }
      if (!formMetadata.chi.title && !formMetadata.chi.content) {
        delete requestData.metadata.chi;
      }
      if (Object.keys(requestData.metadata).length === 0) {
        delete requestData.metadata;
      }

      const response = await fetch(`/api/admin/notifications/${isEditing}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(t('admin.notifications.updateSuccess'));
        resetForm();
        setIsEditing(null);
        fetchNotifications();
        setActiveTab('list'); // Quay về danh sách ngay lập tức
      } else {
        setErrorMessage(data.error || t('admin.notifications.updateError'));
      }
    } catch (error) {
      console.error('Error updating notification:', error);
      setErrorMessage(t('admin.notifications.connectionError'));
    } finally {
      setIsCreating(false);
    }
  };

  // Xóa thông báo
  const handleDeleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/notifications/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccessMessage(t('admin.notifications.deleteSuccess'));
        fetchNotifications();
      } else {
        const data = await response.json();
        setErrorMessage(data.error || t('admin.notifications.deleteError'));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      setErrorMessage(t('admin.notifications.connectionError'));
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
      priority: notification.priority || 'medium',
      expiresAt: notification.expiresAt || '',
    });

    // Thiết lập dữ liệu đa ngôn ngữ nếu có
    setFormMetadata({
      en: {
        title: notification.metadata?.en?.title || '',
        content: notification.metadata?.en?.content || ''
      },
      es: {
        title: notification.metadata?.es?.title || '',
        content: notification.metadata?.es?.content || ''
      },
      chi: {
        title: notification.metadata?.chi?.title || '',
        content: notification.metadata?.chi?.content || ''
      }
    });

    setIsEditing(notification.id);
    setActiveTab('edit');
  };

  // Format thời gian
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(locale);
  };

  // Đếm số người đã đọc
  const getReadCount = (notification: Notification) => {
    // Use metadata.readCount if available
    if (notification.metadata?.readCount !== undefined) {
      return notification.metadata.readCount;
    }
    // Fallback to counting the isRead entries
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
    setSuccessMessage(t('admin.notifications.settingsSaved'));
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
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.notifications.title')}</h1>
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
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('admin.notifications.list')} ({notifications.length})
            </button>
            {isEditing && (
              <button
                onClick={() => setActiveTab('edit')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'edit'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('admin.notifications.edit')}
              </button>
            )}
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('admin.notifications.settings')}
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Danh sách thông báo */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              {/* Nút tạo thông báo mới */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-primary-400 transition-colors">
                <button
                  onClick={() => {
                    setActiveTab('create');
                    resetForm();
                    setIsEditing(null);
                  }}
                  className="w-full flex items-center justify-center space-x-3 text-gray-500 hover:text-primary-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span className="text-lg font-medium">{t('admin.notifications.createNotification')}</span>
                </button>
              </div>

              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{getTypeIcon(notification.type)}</span>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{
                              locale === 'es-ES' && notification.metadata?.es?.title ? 
                                notification.metadata.es.title :
                              locale === 'en-US' && notification.metadata?.en?.title ?
                                notification.metadata.en.title : 
                              locale === 'zh-CN' && notification.metadata?.chi?.title ?
                                notification.metadata.chi.title :
                                notification.title
                            }</h3>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(notification.priority)}`}
                            >
                              {notification.priority === 'high'
                                ? t('admin.notifications.priority.high')
                                : notification.priority === 'medium'
                                  ? t('admin.notifications.priority.medium')
                                  : t('admin.notifications.priority.low')}
                            </span>
                            <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-600 rounded-full">
                              {notification.type === 'promotion'
                                ? t('admin.notifications.type.promotion')
                                : notification.type === 'update'
                                  ? t('admin.notifications.type.update')
                                  : notification.type === 'order'
                                    ? t('admin.notifications.type.order')
                                    : t('admin.notifications.type.system')}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{
                            locale === 'es-ES' && notification.metadata?.es?.content ? 
                              notification.metadata.es.content :
                            locale === 'en-US' && notification.metadata?.en?.content ?
                              notification.metadata.en.content : 
                            locale === 'zh-CN' && notification.metadata?.chi?.content ?
                              notification.metadata.chi.content :
                              notification.content
                          }</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{t('admin.notifications.created')}: {formatDate(notification.createdAt)}</span>
                            <span>{t('admin.notifications.readCount')}: {getReadCount(notification)} {t('admin.notifications.people')}</span>
                            {notification.targetUsers && notification.targetUsers.length > 0 && (
                              <span>{t('admin.notifications.sentTo')}: {notification.targetUsers.length} {t('admin.notifications.people')}</span>
                            )}
                            {notification.expiresAt && (
                              <span>{t('admin.notifications.expires')}: {formatDate(notification.expiresAt)}</span>
                            )}
                          </div>
                          {notification.link && (
                            <div className="mt-2">
                              <a
                                href={notification.link}
                                className="text-primary-600 hover:text-primary-700 text-sm"
                              >
                                {t('admin.notifications.viewDetails')} →
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => handleEditNotification(notification)}
                          className="px-3 py-1.5 text-sm bg-[#00A19A] text-white rounded hover:bg-[#008B85] transition-colors"
                        >
                          {t('admin.notifications.editBtn')}
                        </button>
                        <button
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                          {t('admin.notifications.deleteBtn')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📢</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t('admin.notifications.noNotifications')}</h3>
                  <p className="text-gray-500">{t('admin.notifications.noNotificationsDesc')}</p>
                </div>
              )}
            </div>
          )}

          {/* Form tạo thông báo */}
          {activeTab === 'create' && (
            <div className="max-w-2xl">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('admin.notifications.create')}</h2>

              <form onSubmit={handleCreateNotification} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.notifications.form.title')}
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder={t('admin.notifications.form.titlePlaceholder')}
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.notifications.form.content')}
                  </label>
                  <textarea
                    id="content"
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder={t('admin.notifications.form.contentPlaceholder')}
                  />
                </div>

                {/* Thêm form cho tiếng Anh */}
                <div className="border border-gray-200 rounded-md p-4 mt-6 bg-gray-50">
                  <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs mr-2">EN</span>
                    {t('admin.notifications.form.englishVersion')}
                  </h3>
                  
                  <div className="mb-4">
                    <label htmlFor="en-title" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('admin.notifications.form.title')}
                    </label>
                    <input
                      type="text"
                      id="en-title"
                      value={formMetadata.en.title}
                      onChange={(e) => setFormMetadata({
                        ...formMetadata,
                        en: { ...formMetadata.en, title: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t('admin.notifications.form.englishTitlePlaceholder')}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="en-content" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('admin.notifications.form.content')}
                    </label>
                    <textarea
                      id="en-content"
                      value={formMetadata.en.content}
                      onChange={(e) => setFormMetadata({
                        ...formMetadata,
                        en: { ...formMetadata.en, content: e.target.value }
                      })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t('admin.notifications.form.englishContentPlaceholder')}
                    />
                  </div>
                </div>

                {/* Thêm form cho tiếng Tây Ban Nha */}
                <div className="border border-gray-200 rounded-md p-4 mt-6 bg-gray-50">
                  <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-xs mr-2">ES</span>
                    {t('admin.notifications.form.spanishVersion')}
                  </h3>
                  
                  <div className="mb-4">
                    <label htmlFor="es-title" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('admin.notifications.form.title')}
                    </label>
                    <input
                      type="text"
                      id="es-title"
                      value={formMetadata.es.title}
                      onChange={(e) => setFormMetadata({
                        ...formMetadata,
                        es: { ...formMetadata.es, title: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t('admin.notifications.form.spanishTitlePlaceholder')}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="es-content" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('admin.notifications.form.content')}
                    </label>
                    <textarea
                      id="es-content"
                      value={formMetadata.es.content}
                      onChange={(e) => setFormMetadata({
                        ...formMetadata,
                        es: { ...formMetadata.es, content: e.target.value }
                      })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t('admin.notifications.form.spanishContentPlaceholder')}
                    />
                  </div>
                </div>

                {/* Thêm form cho tiếng Trung */}
                <div className="border border-gray-200 rounded-md p-4 mt-6 bg-gray-50">
                  <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                    <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs mr-2">ZH</span>
                    {t('admin.notifications.form.chineseVersion')}
                  </h3>
                  
                  <div className="mb-4">
                    <label htmlFor="chi-title" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('admin.notifications.form.title')}
                    </label>
                    <input
                      type="text"
                      id="chi-title"
                      value={formMetadata.chi.title}
                      onChange={(e) => setFormMetadata({
                        ...formMetadata,
                        chi: { ...formMetadata.chi, title: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t('admin.notifications.form.chineseTitlePlaceholder')}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="chi-content" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('admin.notifications.form.content')}
                    </label>
                    <textarea
                      id="chi-content"
                      value={formMetadata.chi.content}
                      onChange={(e) => setFormMetadata({
                        ...formMetadata,
                        chi: { ...formMetadata.chi, content: e.target.value }
                      })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t('admin.notifications.form.chineseContentPlaceholder')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.notifications.form.type')}
                  </label>
                  <select
                    id="type"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="system">{t('admin.notifications.type.system')}</option>
                    <option value="promotion">{t('admin.notifications.type.promotion')}</option>
                    <option value="update">{t('admin.notifications.type.update')}</option>
                    <option value="order">{t('admin.notifications.type.order')}</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('list')}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    {t('admin.notifications.cancelBtn')}
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="px-4 py-2 bg-[#00A19A] text-white rounded-md hover:bg-[#008B85] disabled:bg-gray-400"
                  >
                    {isCreating ? t('admin.notifications.creatingBtn') : t('admin.notifications.createBtn')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Form chỉnh sửa thông báo */}
          {activeTab === 'edit' && (
            <div className="max-w-2xl">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('admin.notifications.edit')}</h2>

              <form onSubmit={handleUpdateNotification} className="space-y-6">
                <div>
                  <label
                    htmlFor="edit-title"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t('admin.notifications.form.title')}
                  </label>
                  <input
                    type="text"
                    id="edit-title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder={t('admin.notifications.form.titlePlaceholder')}
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-content"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t('admin.notifications.form.content')}
                  </label>
                  <textarea
                    id="edit-content"
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder={t('admin.notifications.form.contentPlaceholder')}
                  />
                </div>

                {/* Thêm form cho tiếng Anh */}
                <div className="border border-gray-200 rounded-md p-4 mt-6 bg-gray-50">
                  <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs mr-2">EN</span>
                    {t('admin.notifications.form.englishVersion')}
                  </h3>
                  
                  <div className="mb-4">
                    <label htmlFor="edit-en-title" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('admin.notifications.form.title')}
                    </label>
                    <input
                      type="text"
                      id="edit-en-title"
                      value={formMetadata.en.title}
                      onChange={(e) => setFormMetadata({
                        ...formMetadata,
                        en: { ...formMetadata.en, title: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t('admin.notifications.form.englishTitlePlaceholder')}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-en-content" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('admin.notifications.form.content')}
                    </label>
                    <textarea
                      id="edit-en-content"
                      value={formMetadata.en.content}
                      onChange={(e) => setFormMetadata({
                        ...formMetadata,
                        en: { ...formMetadata.en, content: e.target.value }
                      })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t('admin.notifications.form.englishContentPlaceholder')}
                    />
                  </div>
                </div>

                {/* Thêm form cho tiếng Tây Ban Nha */}
                <div className="border border-gray-200 rounded-md p-4 mt-6 bg-gray-50">
                  <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-xs mr-2">ES</span>
                    {t('admin.notifications.form.spanishVersion')}
                  </h3>
                  
                  <div className="mb-4">
                    <label htmlFor="edit-es-title" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('admin.notifications.form.title')}
                    </label>
                    <input
                      type="text"
                      id="edit-es-title"
                      value={formMetadata.es.title}
                      onChange={(e) => setFormMetadata({
                        ...formMetadata,
                        es: { ...formMetadata.es, title: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t('admin.notifications.form.spanishTitlePlaceholder')}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-es-content" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('admin.notifications.form.content')}
                    </label>
                    <textarea
                      id="edit-es-content"
                      value={formMetadata.es.content}
                      onChange={(e) => setFormMetadata({
                        ...formMetadata,
                        es: { ...formMetadata.es, content: e.target.value }
                      })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t('admin.notifications.form.spanishContentPlaceholder')}
                    />
                  </div>
                </div>

                {/* Thêm form cho tiếng Trung */}
                <div className="border border-gray-200 rounded-md p-4 mt-6 bg-gray-50">
                  <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                    <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs mr-2">ZH</span>
                    {t('admin.notifications.form.chineseVersion')}
                  </h3>
                  
                  <div className="mb-4">
                    <label htmlFor="edit-chi-title" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('admin.notifications.form.title')}
                    </label>
                    <input
                      type="text"
                      id="edit-chi-title"
                      value={formMetadata.chi.title}
                      onChange={(e) => setFormMetadata({
                        ...formMetadata,
                        chi: { ...formMetadata.chi, title: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t('admin.notifications.form.chineseTitlePlaceholder')}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-chi-content" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('admin.notifications.form.content')}
                    </label>
                    <textarea
                      id="edit-chi-content"
                      value={formMetadata.chi.content}
                      onChange={(e) => setFormMetadata({
                        ...formMetadata,
                        chi: { ...formMetadata.chi, content: e.target.value }
                      })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t('admin.notifications.form.chineseContentPlaceholder')}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="edit-type"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t('admin.notifications.form.type')}
                  </label>
                  <select
                    id="edit-type"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="system">{t('admin.notifications.type.system')}</option>
                    <option value="promotion">{t('admin.notifications.type.promotion')}</option>
                    <option value="update">{t('admin.notifications.type.update')}</option>
                    <option value="order">{t('admin.notifications.type.order')}</option>
                  </select>
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
                    {t('admin.notifications.cancelBtn')}
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="px-4 py-2 bg-[#00A19A] text-white rounded-md hover:bg-[#008B85] disabled:bg-gray-400"
                  >
                    {isCreating ? t('admin.notifications.updatingBtn') : t('admin.notifications.updateBtn')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Cài đặt */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('admin.notifications.settings.title')}</h2>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-900">{t('admin.notifications.settings.automatic')}</h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">{t('admin.notifications.settings.autoOrder')}</span>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationSettings.autoSendOrderNotifications}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              autoSendOrderNotifications: e.target.checked,
                            })
                          }
                          className="rounded text-[#00A19A] focus:ring-[#00A19A] h-4 w-4"
                        />
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">{t('admin.notifications.settings.autoPromotion')}</span>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationSettings.autoSendPromotions}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              autoSendPromotions: e.target.checked,
                            })
                          }
                          className="rounded text-[#00A19A] focus:ring-[#00A19A] h-4 w-4"
                        />
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">{t('admin.notifications.settings.autoUpdate')}</span>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationSettings.autoSendUpdates}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              autoSendUpdates: e.target.checked,
                            })
                          }
                          className="rounded text-[#00A19A] focus:ring-[#00A19A] h-4 w-4"
                        />
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">{t('admin.notifications.settings.email')}</span>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationSettings.emailNotifications}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              emailNotifications: e.target.checked,
                            })
                          }
                          className="rounded text-[#00A19A] focus:ring-[#00A19A] h-4 w-4"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="retentionDays"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t('admin.notifications.settings.retention')}
                  </label>
                  <input
                    type="number"
                    id="retentionDays"
                    value={notificationSettings.retentionDays}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        retentionDays: parseInt(e.target.value) || 30,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A19A]"
                    min="1"
                    max="365"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {t('admin.notifications.settings.retentionDesc')}
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSaveSettings}
                    className="px-4 py-2 bg-[#00A19A] text-white rounded-md hover:bg-[#008B85]"
                  >
                    {t('admin.notifications.settings.saveBtn')}
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
