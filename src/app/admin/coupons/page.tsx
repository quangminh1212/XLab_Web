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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

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
    if (!editingCoupon) return;

    setIsCreating(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const requestData = {
        ...form,
        applicableProducts: form.applicableProducts ? form.applicableProducts.split(',').map(id => id.trim()).filter(id => id) : []
      };

      const response = await fetch(`/api/admin/coupons/${editingCoupon.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Mã giảm giá đã được cập nhật thành công!');
        closeEditModal();
        fetchCoupons();
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
    setEditingCoupon(coupon);
    setShowEditModal(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingCoupon(null);
    resetForm();
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
    <div className="space-y-4">
            {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-md border border-primary-300 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="inline-flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg border border-white/30">
              <span className="text-lg">🏷️</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Quản lý mã giảm giá</h1>
              <p className="text-primary-100 text-sm">Tạo và quản lý các mã giảm giá cho khách hàng</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-lg font-bold text-white">{coupons.length}</div>
              <div className="text-xs text-primary-100">Tổng số mã</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">{coupons.filter(c => c.isActive).length}</div>
              <div className="text-xs text-primary-100">Đang hoạt động</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">{coupons.filter(c => isExpired(c.endDate)).length}</div>
              <div className="text-xs text-primary-100">Đã hết hạn</div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mt-4 border-t border-white/20 pt-4">
          <nav className="flex justify-center space-x-2">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1.5 rounded-md font-medium text-sm transition-colors duration-200 ${
                activeTab === 'list'
                  ? 'bg-white text-primary-600 shadow-sm'
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
              className={`px-3 py-1.5 rounded-md font-medium text-sm transition-colors duration-200 ${
                activeTab === 'create'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/20'
              }`}
            >
              ➕ Tạo mã mới
            </button>

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
        <div className="bg-white rounded-lg shadow border border-gray-100">
          <div className="p-4">
            <h2 className="text-base font-medium text-gray-900 mb-3">Danh sách mã giảm giá</h2>
            
            {coupons.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🏷️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có mã giảm giá nào</h3>
                <p className="text-gray-500 mb-8">Tạo mã giảm giá đầu tiên để bắt đầu chương trình khuyến mãi cho khách hàng</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg"
                >
                  🚀 Tạo mã đầu tiên
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto bg-white rounded-lg border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        Mã / Tên
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        Loại / Giá trị
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        Thời gian
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        Sử dụng
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {coupons.map((coupon) => (
                      <tr key={coupon.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div>
                            <div className="bg-primary-500 text-white font-mono font-bold text-sm px-3 py-1.5 rounded border border-primary-300">
                              {coupon.code}
                            </div>
                            <div className="text-sm font-medium text-gray-700 mt-1.5">{coupon.name}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="space-y-1.5">
                            <div className="inline-flex items-center px-3 py-1.5 rounded bg-gray-50 border border-gray-200 text-gray-700">
                              <span className="text-sm font-medium mr-2">
                                {coupon.type === 'percentage' ? 'Phần trăm' : 'Cố định'}
                              </span>
                              <span className="text-sm font-bold">
                                {coupon.type === 'percentage' ? `${coupon.value}%` : formatCurrency(coupon.value)}
                              </span>
                            </div>
                            {coupon.minOrder && (
                              <div className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                Tối thiểu: {formatCurrency(coupon.minOrder)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="space-y-1.5">
                            <div className="bg-gray-50 border border-gray-200 rounded p-2 text-center">
                              <div className="text-xs text-gray-500 font-medium uppercase">Bắt đầu</div>
                              <div className="text-sm font-medium text-gray-700">{formatDate(coupon.startDate)}</div>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded p-2 text-center">
                              <div className="text-xs text-gray-500 font-medium uppercase">Kết thúc</div>
                              <div className="text-sm font-medium text-gray-700">{formatDate(coupon.endDate)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="bg-gray-50 border border-gray-200 rounded p-3 text-center">
                            <div className="text-xl font-bold text-gray-700">{coupon.usedCount}</div>
                            <div className="text-sm text-gray-500 font-medium">
                              {coupon.usageLimit ? `/ ${coupon.usageLimit} lần` : '/ ∞ lần'}
                            </div>
                            <div className="mt-1.5">
                              <div className={`w-full bg-gray-200 rounded-full h-1.5 ${coupon.usageLimit ? 'block' : 'hidden'}`}>
                                <div 
                                  className="bg-primary-500 h-1.5 rounded-full transition-all duration-300" 
                                  style={{ 
                                    width: coupon.usageLimit ? `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%` : '0%' 
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {isExpired(coupon.endDate) ? (
                            <div className="inline-flex items-center px-3 py-1.5 rounded border bg-red-50 border-red-200 text-red-700">
                              <div className="w-2 h-2 rounded-full bg-red-400 mr-2"></div>
                              <span className="text-sm font-medium uppercase tracking-wide">Đã hết hạn</span>
                            </div>
                          ) : coupon.isActive ? (
                            <div className="inline-flex items-center px-3 py-1.5 rounded border bg-primary-50 border-primary-200 text-primary-700">
                              <div className="w-2 h-2 rounded-full bg-primary-500 mr-2"></div>
                              <span className="text-sm font-medium uppercase tracking-wide">Đang hoạt động</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center px-3 py-1.5 rounded border bg-gray-50 border-gray-200 text-gray-600">
                              <div className="w-2 h-2 rounded-full bg-gray-400 mr-2"></div>
                              <span className="text-sm font-medium uppercase tracking-wide">Tạm dừng</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditCoupon(coupon)}
                              className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors duration-150 text-sm font-medium border border-gray-200"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => handleToggleStatus(coupon.id, coupon.isActive)}
                              className={`px-3 py-1.5 rounded transition-colors duration-150 text-sm font-medium border ${
                                coupon.isActive 
                                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200' 
                                  : 'bg-primary-100 text-primary-600 hover:bg-primary-200 border-primary-200'
                              }`}
                            >
                              {coupon.isActive ? 'Dừng' : 'Hoạt động'}
                            </button>
                            <button
                              onClick={() => handleDeleteCoupon(coupon.id)}
                              className="px-3 py-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors duration-150 text-sm font-medium border border-red-200"
                            >
                              Xóa
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

      {activeTab === 'create' && (
        <div className="bg-white rounded-lg shadow border border-gray-100 max-w-4xl mx-auto">
          <div className="p-3">
            <h2 className="text-base font-medium text-gray-900 mb-2">
              Tạo mã giảm giá mới
            </h2>
            
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mã giảm giá */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Mã giảm giá *
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={form.code}
                      onChange={(e) => setForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      className="flex-1 px-2 py-1.5 border border-gray-300 rounded-l-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                      placeholder="VD: SUMMER2024"
                      required
                    />
                    <button
                      type="button"
                      onClick={generateCode}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 text-sm"
                    >
                      Tạo tự động
                    </button>
                  </div>
                </div>

                {/* Tên mã giảm giá */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Tên mã giảm giá *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                    placeholder="VD: Giảm giá mùa hè"
                    required
                  />
                </div>

                {/* Loại giảm giá */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Loại giảm giá *
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value as 'percentage' | 'fixed' }))}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                  >
                    <option value="percentage">Phần trăm (%)</option>
                    <option value="fixed">Số tiền cố định (VNĐ)</option>
                  </select>
                </div>

                {/* Giá trị giảm */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Giá trị giảm *
                  </label>
                  <input
                    type="number"
                    value={form.value}
                    onChange={(e) => setForm(prev => ({ ...prev, value: Number(e.target.value) }))}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                    placeholder={form.type === 'percentage' ? 'VD: 10' : 'VD: 50000'}
                    min="0"
                    max={form.type === 'percentage' ? 100 : undefined}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {form.type === 'percentage' ? 'Nhập số phần trăm (0-100)' : 'Nhập số tiền (VNĐ)'}
                  </p>
                </div>

                {/* Đơn hàng tối thiểu */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Đơn hàng tối thiểu
                  </label>
                  <input
                    type="number"
                    value={form.minOrder}
                    onChange={(e) => setForm(prev => ({ ...prev, minOrder: Number(e.target.value) }))}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                    placeholder="VD: 100000"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Để trống nếu không có yêu cầu tối thiểu</p>
                </div>

                {/* Giảm tối đa */}
                {form.type === 'percentage' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Giảm tối đa
                    </label>
                    <input
                      type="number"
                      value={form.maxDiscount}
                      onChange={(e) => setForm(prev => ({ ...prev, maxDiscount: Number(e.target.value) }))}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                      placeholder="VD: 500000"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Để trống nếu không giới hạn</p>
                  </div>
                )}

                {/* Giới hạn sử dụng */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Giới hạn sử dụng
                  </label>
                  <input
                    type="number"
                    value={form.usageLimit}
                    onChange={(e) => setForm(prev => ({ ...prev, usageLimit: Number(e.target.value) }))}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                    placeholder="VD: 100"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Để trống hoặc 0 nếu không giới hạn</p>
                </div>

                {/* Ngày bắt đầu */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Ngày bắt đầu *
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                    required
                  />
                </div>

                {/* Ngày kết thúc */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Ngày kết thúc *
                  </label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                  placeholder="Mô tả chi tiết về mã giảm giá này..."
                />
              </div>

              {/* Sản phẩm áp dụng */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  ID sản phẩm áp dụng
                </label>
                <input
                  type="text"
                  value={form.applicableProducts}
                  onChange={(e) => setForm(prev => ({ ...prev, applicableProducts: e.target.value }))}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                  placeholder="VD: prod1, prod2, prod3 (phân cách bằng dấu phẩy)"
                />
                <p className="text-xs text-gray-500 mt-1">Để trống nếu áp dụng cho tất cả sản phẩm</p>
              </div>

              {/* Buttons */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setActiveTab('list');
                  }}
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-3 py-1.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-md hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 text-sm"
                >
                  {isCreating ? 'Đang xử lý...' : 'Tạo mã giảm giá'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingCoupon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Chỉnh sửa mã giảm giá: {editingCoupon.code}
                </h3>
                <button
                  onClick={closeEditModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <form onSubmit={handleUpdateCoupon} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Mã giảm giá */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mã giảm giá *
                    </label>
                    <input
                      type="text"
                      value={form.code}
                      onChange={(e) => setForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="VD: SUMMER2024"
                      required
                    />
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder={form.type === 'percentage' ? 'VD: 10' : 'VD: 50000'}
                      min="0"
                      max={form.type === 'percentage' ? 100 : undefined}
                      required
                    />
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="VD: 100000"
                      min="0"
                    />
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="VD: 500000"
                        min="0"
                      />
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="VD: 100"
                      min="0"
                    />
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="VD: prod1, prod2, prod3 (phân cách bằng dấu phẩy)"
                  />
                  <p className="text-sm text-gray-500 mt-1">Để trống nếu áp dụng cho tất cả sản phẩm</p>
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    disabled={isCreating}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-md hover:from-primary-700 hover:to-primary-800 disabled:opacity-50"
                  >
                    {isCreating ? 'Đang cập nhật...' : 'Cập nhật'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAdminAuth(CouponsPage); 