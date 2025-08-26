'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

import withAdminAuth from '@/components/withAdminAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { SystemSettings, defaultSystemSettings } from '@/models/SystemSettingsModel';

function SettingsPage() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState<SystemSettings>(defaultSystemSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('site');
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const { t, localCode } = useLanguage();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/settings');

        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        } else if (response.status === 401) {
          // Session expired or invalid, redirect to login
          window.location.href = '/login?redirect=/admin/settings';
          return;
        } else {
          setErrors([t('admin.settings.loadError', { status: response.status })]);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        setErrors([t('admin.settings.connectionError')]);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if we have a session
    if (session) {
      fetchSettings();
    } else if (session === null) {
      // No session, redirect to login
      window.location.href = '/login?redirect=/admin/settings';
    }
  }, [session, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSuccessMessage('');
    setIsSaving(true);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message || (localCode === 'vi' ? 'Cài đặt đã được lưu thành công!' : 'Settings saved successfully!'));
        setSettings(data.settings);
      } else {
        setErrors(data.details || [data.error || (localCode === 'vi' ? 'Đã xảy ra lỗi khi lưu cài đặt' : 'An error occurred while saving settings')]);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setErrors([(localCode === 'vi' ? 'Không thể kết nối đến máy chủ' : 'Cannot connect to server')]);
    } finally {
      setIsSaving(false);

      // Tự động ẩn thông báo thành công sau 3 giây
      if (successMessage) {
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    }
  };

  const handleInputChange = (section: keyof SystemSettings, field: string, value: any) => {
    setSettings((prev) => {
      // Create a deep copy of the current settings
      const newSettings = JSON.parse(JSON.stringify(prev)) as SystemSettings;

      // Update the specific field
      if (section === 'site') {
        (newSettings.site as any)[field] = value;
      } else if (section === 'payment') {
        (newSettings.payment as any)[field] = value;
      } else if (section === 'email') {
        (newSettings.email as any)[field] = value;
      }

      return newSettings;
    });
  };

  const handleCheckboxChange = (section: keyof SystemSettings, field: string, checked: boolean) => {
    setSettings((prev) => {
      // Create a deep copy of the current settings
      const newSettings = JSON.parse(JSON.stringify(prev)) as SystemSettings;

      // Update the specific field
      if (section === 'site') {
        (newSettings.site as any)[field] = checked;
      } else if (section === 'payment') {
        (newSettings.payment as any)[field] = checked;
      } else if (section === 'email') {
        (newSettings.email as any)[field] = checked;
      }

      return newSettings;
    });
  };

  const handleToggleChange = (
    field: 'maintenanceMode' | 'disableRegistration' | 'disableCheckout',
    checked: boolean,
  ) => {
    setSettings((prev) => {
      // Create a deep copy of the current settings
      const newSettings = JSON.parse(JSON.stringify(prev)) as SystemSettings;

      // Update the specific field
      if (field === 'maintenanceMode') {
        newSettings.maintenanceMode = checked;
      } else if (field === 'disableRegistration') {
        newSettings.disableRegistration = checked;
      } else if (field === 'disableCheckout') {
        newSettings.disableCheckout = checked;
      }

      return newSettings;
    });
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
        <h1 className="text-2xl font-bold text-balance break-words">
          {localCode === 'vi' ? 'Cài đặt hệ thống' : 'System Settings'}
        </h1>
      </div>

      {/* Thông báo lỗi */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          <h3 className="font-medium mb-2">{localCode === 'vi' ? 'Đã xảy ra lỗi' : 'Errors occurred'}:</h3>
          <ul className="list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Thông báo thành công */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6">
          <p>{successMessage}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('site')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'site'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {localCode === 'vi' ? 'Thông tin chung' : 'General'}
            </button>
            <button
              onClick={() => setActiveTab('payment')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'payment'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {localCode === 'vi' ? 'Thanh toán' : 'Payment'}
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'email'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {localCode === 'vi' ? 'Email' : 'Email'}
            </button>

            <button
              onClick={() => setActiveTab('advanced')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'advanced'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {localCode === 'vi' ? 'Nâng cao' : 'Advanced'}
            </button>
          </nav>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* Thông tin chung */}
            {activeTab === 'site' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900 text-balance">
                  {localCode === 'vi' ? 'Thông tin trang web' : 'Website Information'}
                </h2>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="siteName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {localCode === 'vi' ? 'Tên trang web' : 'Site Name'}
                    </label>
                    <input
                      type="text"
                      id="siteName"
                      value={settings.site.siteName}
                      onChange={(e) => handleInputChange('site', 'siteName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="siteDescription"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {localCode === 'vi' ? 'Mô tả trang web' : 'Site Description'}
                    </label>
                    <input
                      type="text"
                      id="siteDescription"
                      value={settings.site.siteDescription}
                      onChange={(e) => handleInputChange('site', 'siteDescription', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="logoUrl"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {localCode === 'vi' ? 'Đường dẫn logo' : 'Logo URL'}
                    </label>
                    <input
                      type="text"
                      id="logoUrl"
                      value={settings.site.logoUrl}
                      onChange={(e) => handleInputChange('site', 'logoUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="faviconUrl"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {localCode === 'vi' ? 'Đường dẫn favicon' : 'Favicon URL'}
                    </label>
                    <input
                      type="text"
                      id="faviconUrl"
                      value={settings.site.faviconUrl}
                      onChange={(e) => handleInputChange('site', 'faviconUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <h3 className="text-md font-medium text-gray-800 mt-6">
                  {localCode === 'vi' ? 'Thông tin liên hệ' : 'Contact Information'}
                </h3>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contactEmail"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {localCode === 'vi' ? 'Email liên hệ' : 'Contact Email'}
                    </label>
                    <input
                      type="email"
                      id="contactEmail"
                      value={settings.site.contactEmail}
                      onChange={(e) => handleInputChange('site', 'contactEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contactPhone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {localCode === 'vi' ? 'Số điện thoại liên hệ' : 'Contact Phone'}
                    </label>
                    <input
                      type="text"
                      id="contactPhone"
                      value={settings.site.contactPhone}
                      onChange={(e) => handleInputChange('site', 'contactPhone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      {localCode === 'vi' ? 'Địa chỉ' : 'Address'}
                    </label>
                    <textarea
                      id="address"
                      value={settings.site.address}
                      onChange={(e) => handleInputChange('site', 'address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={3}
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* Thanh toán */}
            {activeTab === 'payment' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900 text-balance">
                  {localCode === 'vi' ? 'Cài đặt thanh toán' : 'Payment Settings'}
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enableBankTransfer"
                      checked={settings.payment.enableBankTransfer}
                      onChange={(e) =>
                        handleCheckboxChange('payment', 'enableBankTransfer', e.target.checked)
                      }
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="enableBankTransfer"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {localCode === 'vi' ? 'Cho phép thanh toán chuyển khoản ngân hàng' : 'Enable Bank Transfer Payment'}
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enableCreditCard"
                      checked={settings.payment.enableCreditCard}
                      onChange={(e) =>
                        handleCheckboxChange('payment', 'enableCreditCard', e.target.checked)
                      }
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="enableCreditCard"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {localCode === 'vi' ? 'Cho phép thanh toán thẻ tín dụng' : 'Enable Credit Card Payment'}
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enableMomo"
                      checked={settings.payment.enableMomo}
                      onChange={(e) => handleCheckboxChange('payment', 'enableMomo', e.target.checked)}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="enableMomo"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {localCode === 'vi' ? 'Cho phép thanh toán MoMo' : 'Enable MoMo Payment'}
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enableZalopay"
                      checked={settings.payment.enableZalopay}
                      onChange={(e) => handleCheckboxChange('payment', 'enableZalopay', e.target.checked)}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="enableZalopay"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {localCode === 'vi' ? 'Cho phép thanh toán ZaloPay' : 'Enable ZaloPay Payment'}
                    </label>
                  </div>
                </div>

                <h3 className="text-md font-medium text-gray-800 mt-6">
                  {localCode === 'vi' ? 'Thông tin tài khoản ngân hàng' : 'Bank Account Information'}
                </h3>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="bankName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {localCode === 'vi' ? 'Tên ngân hàng' : 'Bank Name'}
                    </label>
                    <input
                      type="text"
                      id="bankName"
                      value={settings.payment.bankName}
                      onChange={(e) => handleInputChange('payment', 'bankName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="bankBranch"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {localCode === 'vi' ? 'Chi nhánh' : 'Branch'}
                    </label>
                    <input
                      type="text"
                      id="bankBranch"
                      value={settings.payment.bankBranch}
                      onChange={(e) => handleInputChange('payment', 'bankBranch', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="bankAccountName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {localCode === 'vi' ? 'Tên chủ tài khoản' : 'Account Name'}
                    </label>
                    <input
                      type="text"
                      id="bankAccountName"
                      value={settings.payment.bankAccountName}
                      onChange={(e) => handleInputChange('payment', 'bankAccountName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="bankAccountNumber"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {localCode === 'vi' ? 'Số tài khoản' : 'Account Number'}
                    </label>
                    <input
                      type="text"
                      id="bankAccountNumber"
                      value={settings.payment.bankAccountNumber}
                      onChange={(e) =>
                        handleInputChange('payment', 'bankAccountNumber', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Email */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900 text-balance">
                  {localCode === 'vi' ? 'Cài đặt email' : 'Email Settings'}
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enableEmailNotification"
                      checked={settings.email.enableEmailNotification}
                      onChange={(e) =>
                        handleCheckboxChange('email', 'enableEmailNotification', e.target.checked)
                      }
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="enableEmailNotification"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {localCode === 'vi' ? 'Bật thông báo qua email' : 'Enable Email Notifications'}
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="smtpServer"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {localCode === 'vi' ? 'Máy chủ SMTP' : 'SMTP Server'}
                    </label>
                    <input
                      type="text"
                      id="smtpServer"
                      value={settings.email.smtpServer}
                      onChange={(e) => handleInputChange('email', 'smtpServer', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="smtpPort"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {localCode === 'vi' ? 'Cổng SMTP' : 'SMTP Port'}
                    </label>
                    <input
                      type="number"
                      id="smtpPort"
                      value={settings.email.smtpPort}
                      onChange={(e) =>
                        handleInputChange('email', 'smtpPort', parseInt(e.target.value) || 587)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="smtpUsername"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {localCode === 'vi' ? 'Tên đăng nhập SMTP' : 'SMTP Username'}
                    </label>
                    <input
                      type="text"
                      id="smtpUsername"
                      value={settings.email.smtpUsername}
                      onChange={(e) => handleInputChange('email', 'smtpUsername', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="smtpPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {localCode === 'vi' ? 'Mật khẩu SMTP' : 'SMTP Password'}
                    </label>
                    <input
                      type="password"
                      id="smtpPassword"
                      value={settings.email.smtpPassword}
                      onChange={(e) => handleInputChange('email', 'smtpPassword', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="senderEmail"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {localCode === 'vi' ? 'Email người gửi' : 'Sender Email'}
                    </label>
                    <input
                      type="email"
                      id="senderEmail"
                      value={settings.email.senderEmail}
                      onChange={(e) => handleInputChange('email', 'senderEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="senderName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {localCode === 'vi' ? 'Tên người gửi' : 'Sender Name'}
                    </label>
                    <input
                      type="text"
                      id="senderName"
                      value={settings.email.senderName}
                      onChange={(e) => handleInputChange('email', 'senderName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900 text-balance">
                  {localCode === 'vi' ? 'Cài đặt nâng cao' : 'Advanced Settings'}
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="maintenanceMode"
                      checked={settings.maintenanceMode}
                      onChange={(e) => handleToggleChange('maintenanceMode', e.target.checked)}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                    <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-700">
                      {localCode === 'vi' ? 'Chế độ bảo trì' : 'Maintenance Mode'}
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="disableRegistration"
                      checked={settings.disableRegistration}
                      onChange={(e) => handleToggleChange('disableRegistration', e.target.checked)}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="disableRegistration"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {localCode === 'vi' ? 'Tạm ngừng đăng ký tài khoản mới' : 'Disable New User Registration'}
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="disableCheckout"
                      checked={settings.disableCheckout}
                      onChange={(e) => handleToggleChange('disableCheckout', e.target.checked)}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                    <label htmlFor="disableCheckout" className="ml-2 block text-sm text-gray-700">
                      {localCode === 'vi' ? 'Tạm ngừng thanh toán' : 'Disable Checkout'}
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={isSaving}
            >
              {isSaving ? (localCode === 'vi' ? 'Đang lưu...' : 'Saving...') : (localCode === 'vi' ? 'Lưu cài đặt' : 'Save Settings')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withAdminAuth(SettingsPage);
