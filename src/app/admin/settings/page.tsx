'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import withAdminAuth from '@/components/withAdminAuth';
import { SystemSettings, defaultSystemSettings } from '@/models/SystemSettingsModel';

function SettingsPage() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState<SystemSettings>(defaultSystemSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('site');
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/settings');
        
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        } else {
          console.error('Failed to fetch settings:', response.status);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

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
        setSuccessMessage(data.message || 'Cài đặt đã được lưu thành công!');
        setSettings(data.settings);
      } else {
        setErrors(data.details || [data.error || 'Đã xảy ra lỗi khi lưu cài đặt.']);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setErrors(['Đã xảy ra lỗi khi kết nối đến máy chủ.']);
    } finally {
      setIsSaving(false);
      
      // Tự động ẩn thông báo thành công sau 3 giây
      if (successMessage) {
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    }
  };

  const handleInputChange = (section: keyof SystemSettings, field: string, value: any) => {
    setSettings(prev => {
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
    setSettings(prev => {
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

  const handleToggleChange = (field: 'maintenanceMode' | 'disableRegistration' | 'disableCheckout', checked: boolean) => {
    setSettings(prev => {
      // Create a deep copy of the current settings
      const newSettings = JSON.parse(JSON.stringify(prev)) as SystemSettings;
      
      // Update the specific field
      newSettings[field] = checked;
      
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
        <h1 className="text-2xl font-bold">Cài đặt hệ thống</h1>
      </div>

      {/* Thông báo lỗi */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          <h3 className="font-medium mb-2">Đã xảy ra lỗi:</h3>
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
              Thông tin chung
            </button>
            <button
              onClick={() => setActiveTab('payment')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'payment' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Thanh toán
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'email' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'advanced' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Nâng cao
            </button>
          </nav>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* Thông tin chung */}
            {activeTab === 'site' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">Thông tin trang web</h2>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                      Tên trang web
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
                    <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-1">
                      Mô tả trang web
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
                    <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      Đường dẫn logo
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
                    <label htmlFor="faviconUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      Đường dẫn favicon
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
                
                <h3 className="text-md font-medium text-gray-800 mt-6">Thông tin liên hệ</h3>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Email liên hệ
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
                    <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại liên hệ
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
                      Địa chỉ
                    </label>
                    <textarea
                      id="address"
                      value={settings.site.address}
                      onChange={(e) => handleInputChange('site', 'address', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Cài đặt thanh toán */}
            {activeTab === 'payment' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">Phương thức thanh toán</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enableBankTransfer"
                      checked={settings.payment.enableBankTransfer}
                      onChange={(e) => handleCheckboxChange('payment', 'enableBankTransfer', e.target.checked)}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                    <label htmlFor="enableBankTransfer" className="ml-2 block text-sm text-gray-700">
                      Chuyển khoản ngân hàng
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
                    <label htmlFor="enableMomo" className="ml-2 block text-sm text-gray-700">
                      Ví MoMo
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
                    <label htmlFor="enableZalopay" className="ml-2 block text-sm text-gray-700">
                      ZaloPay
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enableCreditCard"
                      checked={settings.payment.enableCreditCard}
                      onChange={(e) => handleCheckboxChange('payment', 'enableCreditCard', e.target.checked)}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                    <label htmlFor="enableCreditCard" className="ml-2 block text-sm text-gray-700">
                      Thẻ tín dụng/ghi nợ
                    </label>
                  </div>
                </div>
                
                <h3 className="text-md font-medium text-gray-800 mt-6">Thông tin tài khoản ngân hàng</h3>
                
                {settings.payment.enableBankTransfer && (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-4">
                    <div>
                      <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
                        Tên ngân hàng
                      </label>
                      <input
                        type="text"
                        id="bankName"
                        value={settings.payment.bankName}
                        onChange={(e) => handleInputChange('payment', 'bankName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required={settings.payment.enableBankTransfer}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="bankAccountName" className="block text-sm font-medium text-gray-700 mb-1">
                        Tên chủ tài khoản
                      </label>
                      <input
                        type="text"
                        id="bankAccountName"
                        value={settings.payment.bankAccountName}
                        onChange={(e) => handleInputChange('payment', 'bankAccountName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required={settings.payment.enableBankTransfer}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="bankAccountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Số tài khoản
                      </label>
                      <input
                        type="text"
                        id="bankAccountNumber"
                        value={settings.payment.bankAccountNumber}
                        onChange={(e) => handleInputChange('payment', 'bankAccountNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required={settings.payment.enableBankTransfer}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="bankBranch" className="block text-sm font-medium text-gray-700 mb-1">
                        Chi nhánh
                      </label>
                      <input
                        type="text"
                        id="bankBranch"
                        value={settings.payment.bankBranch}
                        onChange={(e) => handleInputChange('payment', 'bankBranch', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Cài đặt email */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">Cài đặt email</h2>
                
                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="enableEmailNotification"
                    checked={settings.email.enableEmailNotification}
                    onChange={(e) => handleCheckboxChange('email', 'enableEmailNotification', e.target.checked)}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                  />
                  <label htmlFor="enableEmailNotification" className="ml-2 block text-sm text-gray-700">
                    Bật thông báo qua email
                  </label>
                </div>
                
                {settings.email.enableEmailNotification && (
                  <>
                    <h3 className="text-md font-medium text-gray-800">Cấu hình SMTP</h3>
                    
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="smtpServer" className="block text-sm font-medium text-gray-700 mb-1">
                          Máy chủ SMTP
                        </label>
                        <input
                          type="text"
                          id="smtpServer"
                          value={settings.email.smtpServer}
                          onChange={(e) => handleInputChange('email', 'smtpServer', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required={settings.email.enableEmailNotification}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700 mb-1">
                          Cổng SMTP
                        </label>
                        <input
                          type="number"
                          id="smtpPort"
                          value={settings.email.smtpPort}
                          onChange={(e) => handleInputChange('email', 'smtpPort', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required={settings.email.enableEmailNotification}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="smtpUsername" className="block text-sm font-medium text-gray-700 mb-1">
                          Tên đăng nhập SMTP
                        </label>
                        <input
                          type="text"
                          id="smtpUsername"
                          value={settings.email.smtpUsername}
                          onChange={(e) => handleInputChange('email', 'smtpUsername', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required={settings.email.enableEmailNotification}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Mật khẩu SMTP
                        </label>
                        <input
                          type="password"
                          id="smtpPassword"
                          value={settings.email.smtpPassword}
                          onChange={(e) => handleInputChange('email', 'smtpPassword', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required={settings.email.enableEmailNotification}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="senderEmail" className="block text-sm font-medium text-gray-700 mb-1">
                          Email người gửi
                        </label>
                        <input
                          type="email"
                          id="senderEmail"
                          value={settings.email.senderEmail}
                          onChange={(e) => handleInputChange('email', 'senderEmail', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required={settings.email.enableEmailNotification}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="senderName" className="block text-sm font-medium text-gray-700 mb-1">
                          Tên người gửi
                        </label>
                        <input
                          type="text"
                          id="senderName"
                          value={settings.email.senderName}
                          onChange={(e) => handleInputChange('email', 'senderName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required={settings.email.enableEmailNotification}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            
            {/* Cài đặt nâng cao */}
            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">Cài đặt nâng cao</h2>
                
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
                      Chế độ bảo trì
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
                    <label htmlFor="disableRegistration" className="ml-2 block text-sm text-gray-700">
                      Tạm ngừng đăng ký tài khoản mới
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
                      Tạm ngừng thanh toán
                    </label>
                  </div>
                </div>
                
                <div className="mt-6 bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
                  <h3 className="text-sm font-medium">Thông tin cập nhật</h3>
                  <p className="mt-1 text-sm">
                    Cập nhật lần cuối: {new Date(settings.lastUpdated).toLocaleString('vi-VN')}
                  </p>
                  <p className="text-sm">
                    Người cập nhật: {settings.updatedBy}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 px-6 py-4 flex justify-end">
            <button
              type="submit"
              className="bg-primary-600 text-white py-2 px-6 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400"
              disabled={isSaving}
            >
              {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withAdminAuth(SettingsPage); 