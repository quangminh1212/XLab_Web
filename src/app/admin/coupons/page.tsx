'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import withAdminAuth from '@/components/withAdminAuth';

interface Coupon {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  applicableProducts?: string[];
}

interface CouponForm {
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  maxDiscount: number;
  usageLimit: number;
  startDate: string;
  endDate: string;
  applicableProducts: string;
}

function CouponsPage() {
  const { data: session } = useSession();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'edit'>('list');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form state
  const [form, setForm] = useState<CouponForm>({
    code: '',
    name: '',
    description: '',
    type: 'percentage',
    value: 0,
    minOrder: 0,
    maxDiscount: 0,
    usageLimit: 0,
    startDate: '',
    endDate: '',
    applicableProducts: ''
  });

  // Reset form
  const resetForm = () => {
    setForm({
      code: '',
      name: '',
      description: '',
      type: 'percentage',
      value: 0,
      minOrder: 0,
      maxDiscount: 0,
      usageLimit: 0,
      startDate: '',
      endDate: '',
      applicableProducts: ''
    });
  };

  // Generate random coupon code
  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm(prev => ({ ...prev, code: result }));
  };

  // Fetch coupons
  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/coupons');
      if (response.ok) {
        const data = await response.json();
        setCoupons(data.coupons || []);
      } else {
        setErrorMessage('Không thể tải danh sách mã giảm giá');
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
      setErrorMessage('Đã xảy ra lỗi khi tải mã giảm giá');
    } finally {
      setIsLoading(false);
    }
  };

  // Create coupon
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const requestData = {
        ...form,
        applicableProducts: form.applicableProducts ? form.applicableProducts.split(',').map(id => id.trim()).filter(id => id) : []
      };

      const response = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Mã giảm giá đã được tạo thành công!');
        resetForm();
        fetchCoupons();
        setTimeout(() => setActiveTab('list'), 2000);
      } else {
        setErrorMessage(data.error || 'Đã xảy ra lỗi khi tạo mã giảm giá');
      }
    } catch (error) {
      console.error('Error creating coupon:', error);
      setErrorMessage('Đã xảy ra lỗi khi kết nối đến máy chủ');
    } finally {
      setIsCreating(false);
    }
  };

  // Update coupon
  const handleUpdateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) return;

    setIsCreating(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const requestData = {
        ...form,
        applicableProducts: form.applicableProducts ? form.applicableProducts.split(',').map(id => id.trim()).filter(id => id) : []
      };

      const response = await fetch(`/api/admin/coupons/${isEditing}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Mã giảm giá đã được cập nhật thành công!');
        resetForm();
        setIsEditing(null);
        fetchCoupons();
        setTimeout(() => setActiveTab('list'), 2000);
      } else {
        setErrorMessage(data.error || 'Đã xảy ra lỗi khi cập nhật mã giảm giá');
      }
    } catch (error) {
      console.error('Error updating coupon:', error);
      setErrorMessage('Đã xảy ra lỗi khi kết nối đến máy chủ');
    } finally {
      setIsCreating(false);
    }
  };

  // Delete coupon
  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa mã giảm giá này?')) return;

    try {
      const response = await fetch(`/api/admin/coupons/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccessMessage('Mã giảm giá đã được xóa thành công!');
        fetchCoupons();
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Đã xảy ra lỗi khi xóa mã giảm giá');
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      setErrorMessage('Đã xảy ra lỗi khi kết nối đến máy chủ');
    }
  };

  // Toggle coupon status
  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/coupons/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        setSuccessMessage(`Mã giảm giá đã được ${!isActive ? 'kích hoạt' : 'vô hiệu hóa'} thành công!`);
        fetchCoupons();
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Đã xảy ra lỗi khi cập nhật trạng thái');
      }
    } catch (error) {
      console.error('Error toggling coupon status:', error);
      setErrorMessage('Đã xảy ra lỗi khi kết nối đến máy chủ');
    }
  };

  // Edit coupon
  const handleEditCoupon = (coupon: Coupon) => {
    setForm({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description || '',
      type: coupon.type,
      value: coupon.value,
      minOrder: coupon.minOrder || 0,
      maxDiscount: coupon.maxDiscount || 0,
      usageLimit: coupon.usageLimit || 0,
      startDate: coupon.startDate.split('T')[0],
      endDate: coupon.endDate.split('T')[0],
      applicableProducts: coupon.applicableProducts?.join(', ') || ''
    });
    setIsEditing(coupon.id);
    setActiveTab('edit');
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Check if coupon is expired
  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  // Check if coupon is valid now
  const isValidNow = (startDate: string, endDate: string) => {
    const now = new Date();
    return new Date(startDate) <= now && new Date(endDate) >= now;
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Clear messages
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-xl shadow-xl p-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <span className="text-3xl">🏷️</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Quản lý mã giảm giá</h1>
          <p className="text-primary-100 mb-6">Tạo và quản lý các mã giảm giá cho khách hàng</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl font-bold text-white">{coupons.length}</div>
              <div className="text-sm text-primary-100">Tổng số mã</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl font-bold text-white">{coupons.filter(c => c.isActive).length}</div>
              <div className="text-sm text-primary-100">Đang hoạt động</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl font-bold text-white">{coupons.filter(c => isExpired(c.endDate)).length}</div>
              <div className="text-sm text-primary-100">Đã hết hạn</div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mt-6">
          <nav className="flex justify-center space-x-2">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${
                activeTab === 'list'
                  ? 'bg-white text-primary-600 shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/20'
              }`}
            >
              📋 Danh sách mã ({coupons.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('create');
                resetForm();
                setIsEditing(null);
              }}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${
                activeTab === 'create'
                  ? 'bg-white text-primary-600 shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/20'
              }`}
            >
              ➕ Tạo mã mới
            </button>
            {isEditing && (
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'edit'
                    ? 'bg-white text-primary-600 shadow-md'
                    : 'text-white/80 hover:text-white hover:bg-white/20'
                }`}
              >
                ✏️ Chỉnh sửa
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-400 text-green-700 p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <span className="text-green-400 mr-3">✅</span>
            <span>{successMessage}</span>
          </div>
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <span className="text-red-400 mr-3">❌</span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === 'list' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Danh sách mã giảm giá</h2>
            
            {coupons.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🏷️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có mã giảm giá nào</h3>
                <p className="text-gray-500 mb-8">Tạo mã giảm giá đầu tiên để bắt đầu chương trình khuyến mãi cho khách hàng</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  🚀 Tạo mã đầu tiên
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        🏷️ Mã / Tên
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        💰 Loại / Giá trị
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        📅 Thời gian
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        📊 Sử dụng
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        🎯 Trạng thái
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        ⚡ Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {coupons.map((coupon) => (
                      <tr key={coupon.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="relative inline-block">
                              <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white font-mono font-bold text-sm px-4 py-2 rounded-lg shadow-lg border-2 border-primary-300 transform rotate-1 hover:rotate-0 transition-transform duration-200">
                                {coupon.code}
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
                                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary-300 rounded-full"></div>
                              </div>
                            </div>
                            <div className="text-sm font-medium text-gray-700 mt-2">{coupon.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-2">
                            <div className={`inline-flex items-center px-3 py-2 rounded-lg shadow-sm border-2 ${
                              coupon.type === 'percentage' 
                                ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300 text-orange-800'
                                : 'bg-gradient-to-r from-green-50 to-green-100 border-green-300 text-green-800'
                            }`}>
                              <span className="text-lg font-bold">
                                {coupon.type === 'percentage' ? '📊' : '💰'}
                              </span>
                              <span className="ml-2 text-sm font-bold">
                                {coupon.type === 'percentage' ? `${coupon.value}%` : formatCurrency(coupon.value)}
                              </span>
                            </div>
                            {coupon.minOrder && (
                              <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded border">
                                📏 Tối thiểu: {formatCurrency(coupon.minOrder)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-2">
                            <div className="bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-300 rounded-lg p-2 text-center shadow-sm">
                              <div className="text-xs text-purple-600 font-bold uppercase">🚀 Bắt đầu</div>
                              <div className="text-sm font-bold text-purple-800">{formatDate(coupon.startDate)}</div>
                            </div>
                            <div className="bg-gradient-to-r from-pink-50 to-pink-100 border-2 border-pink-300 rounded-lg p-2 text-center shadow-sm">
                              <div className="text-xs text-pink-600 font-bold uppercase">🏁 Kết thúc</div>
                              <div className="text-sm font-bold text-pink-800">{formatDate(coupon.endDate)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-3 text-center shadow-sm">
                            <div className="text-2xl font-bold text-blue-800">{coupon.usedCount}</div>
                            <div className="text-xs text-blue-600 font-medium">
                              {coupon.usageLimit ? `/ ${coupon.usageLimit} lần` : '/ ∞ lần'}
                            </div>
                            <div className="mt-1">
                              <div className={`w-full bg-blue-200 rounded-full h-1.5 ${coupon.usageLimit ? 'block' : 'hidden'}`}>
                                <div 
                                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                                  style={{ 
                                    width: coupon.usageLimit ? `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%` : '0%' 
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-2">
                            {/* Trạng thái hoạt động */}
                            <div className={`relative inline-flex items-center px-3 py-2 rounded-lg border-2 shadow-sm ${
                              coupon.isActive 
                                ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-300 text-green-800' 
                                : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300 text-gray-700'
                            }`}>
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                coupon.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                              }`}></div>
                              <span className="text-xs font-bold uppercase tracking-wide">
                                {coupon.isActive ? '✅ Hoạt động' : '⏸️ Tạm dừng'}
                              </span>
                              {coupon.isActive && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                              )}
                            </div>
                            
                            {/* Trạng thái thời gian */}
                            {isExpired(coupon.endDate) && (
                              <div className="relative inline-flex items-center px-3 py-2 rounded-lg border-2 bg-gradient-to-r from-red-50 to-red-100 border-red-300 text-red-800 shadow-sm">
                                <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                                <span className="text-xs font-bold uppercase tracking-wide">❌ Đã hết hạn</span>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                              </div>
                            )}
                            
                            {!isValidNow(coupon.startDate, coupon.endDate) && !isExpired(coupon.endDate) && (
                              <div className="relative inline-flex items-center px-3 py-2 rounded-lg border-2 bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300 text-yellow-800 shadow-sm">
                                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2 animate-pulse"></div>
                                <span className="text-xs font-bold uppercase tracking-wide">⏳ Chưa bắt đầu</span>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                              </div>
                            )}
                            
                            {isValidNow(coupon.startDate, coupon.endDate) && coupon.isActive && (
                              <div className="relative inline-flex items-center px-3 py-2 rounded-lg border-2 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300 text-blue-800 shadow-sm">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></div>
                                <span className="text-xs font-bold uppercase tracking-wide">🟢 Đang áp dụng</span>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditCoupon(coupon)}
                              className="px-3 py-1.5 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors duration-150 text-xs font-medium"
                            >
                              ✏️ Sửa
                            </button>
                            <button
                              onClick={() => handleToggleStatus(coupon.id, coupon.isActive)}
                              className={`px-3 py-1.5 rounded-lg transition-colors duration-150 text-xs font-medium ${
                                coupon.isActive 
                                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {coupon.isActive ? '⏸️ Dừng' : '▶️ Hoạt động'}
                            </button>
                            <button
                              onClick={() => handleDeleteCoupon(coupon.id)}
                              className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-150 text-xs font-medium"
                            >
                              🗑️ Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {(activeTab === 'create' || activeTab === 'edit') && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {activeTab === 'create' ? 'Tạo mã giảm giá mới' : 'Chỉnh sửa mã giảm giá'}
            </h2>
            
            <form onSubmit={activeTab === 'create' ? handleCreateCoupon : handleUpdateCoupon} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mã giảm giá */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã giảm giá *
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={form.code}
                      onChange={(e) => setForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="VD: SUMMER2024"
                      required
                    />
                    <button
                      type="button"
                      onClick={generateCode}
                      className="px-4 py-2 bg-gray-100 text-gray-700 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200"
                    >
                      Tạo tự động
                    </button>
                  </div>
                </div>

                {/* Tên mã giảm giá */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên mã giảm giá *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="VD: Giảm giá mùa hè"
                    required
                  />
                </div>

                {/* Loại giảm giá */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại giảm giá *
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value as 'percentage' | 'fixed' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="percentage">Phần trăm (%)</option>
                    <option value="fixed">Số tiền cố định (VNĐ)</option>
                  </select>
                </div>

                {/* Giá trị giảm */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá trị giảm *
                  </label>
                  <input
                    type="number"
                    value={form.value}
                    onChange={(e) => setForm(prev => ({ ...prev, value: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={form.type === 'percentage' ? 'VD: 10' : 'VD: 50000'}
                    min="0"
                    max={form.type === 'percentage' ? 100 : undefined}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {form.type === 'percentage' ? 'Nhập số phần trăm (0-100)' : 'Nhập số tiền (VNĐ)'}
                  </p>
                </div>

                {/* Đơn hàng tối thiểu */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đơn hàng tối thiểu
                  </label>
                  <input
                    type="number"
                    value={form.minOrder}
                    onChange={(e) => setForm(prev => ({ ...prev, minOrder: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="VD: 100000"
                    min="0"
                  />
                  <p className="text-sm text-gray-500 mt-1">Để trống nếu không có yêu cầu tối thiểu</p>
                </div>

                {/* Giảm tối đa */}
                {form.type === 'percentage' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giảm tối đa
                    </label>
                    <input
                      type="number"
                      value={form.maxDiscount}
                      onChange={(e) => setForm(prev => ({ ...prev, maxDiscount: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="VD: 500000"
                      min="0"
                    />
                    <p className="text-sm text-gray-500 mt-1">Để trống nếu không giới hạn</p>
                  </div>
                )}

                {/* Giới hạn sử dụng */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giới hạn sử dụng
                  </label>
                  <input
                    type="number"
                    value={form.usageLimit}
                    onChange={(e) => setForm(prev => ({ ...prev, usageLimit: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="VD: 100"
                    min="0"
                  />
                  <p className="text-sm text-gray-500 mt-1">Để trống hoặc 0 nếu không giới hạn</p>
                </div>

                {/* Ngày bắt đầu */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày bắt đầu *
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Ngày kết thúc */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày kết thúc *
                  </label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mô tả chi tiết về mã giảm giá này..."
                />
              </div>

              {/* Sản phẩm áp dụng */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID sản phẩm áp dụng
                </label>
                <input
                  type="text"
                  value={form.applicableProducts}
                  onChange={(e) => setForm(prev => ({ ...prev, applicableProducts: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="VD: prod1, prod2, prod3 (phân cách bằng dấu phẩy)"
                />
                <p className="text-sm text-gray-500 mt-1">Để trống nếu áp dụng cho tất cả sản phẩm</p>
              </div>

              {/* Buttons */}
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
                                      className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-md hover:from-primary-700 hover:to-primary-800 disabled:opacity-50"
                >
                  {isCreating ? 'Đang xử lý...' : (activeTab === 'create' ? 'Tạo mã giảm giá' : 'Cập nhật')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAdminAuth(CouponsPage); 