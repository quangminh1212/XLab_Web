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
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Quản lý mã giảm giá</h1>
        
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('list')}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'list'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Danh sách mã ({coupons.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('create');
                resetForm();
                setIsEditing(null);
              }}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tạo mã mới
            </button>
            {isEditing && (
              <button
                onClick={() => setActiveTab('edit')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'edit'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Chỉnh sửa
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}

      {/* Content */}
      {activeTab === 'list' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Danh sách mã giảm giá</h2>
            
            {coupons.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Chưa có mã giảm giá nào được tạo.</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                >
                  Tạo mã đầu tiên
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã / Tên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loại / Giá trị
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thời gian
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sử dụng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {coupons.map((coupon) => (
                      <tr key={coupon.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{coupon.code}</div>
                            <div className="text-sm text-gray-500">{coupon.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm text-gray-900">
                              {coupon.type === 'percentage' ? `${coupon.value}%` : formatCurrency(coupon.value)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {coupon.minOrder ? `Tối thiểu: ${formatCurrency(coupon.minOrder)}` : ''}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <div>Từ: {formatDate(coupon.startDate)}</div>
                            <div>Đến: {formatDate(coupon.endDate)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <div>{coupon.usedCount}</div>
                            <div className="text-xs">
                              {coupon.usageLimit ? `/ ${coupon.usageLimit}` : '/ ∞'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {coupon.isActive ? 'Hoạt động' : 'Tạm dừng'}
                            </span>
                            {isExpired(coupon.endDate) && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                Đã hết hạn
                              </span>
                            )}
                            {!isValidNow(coupon.startDate, coupon.endDate) && !isExpired(coupon.endDate) && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Chưa bắt đầu
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditCoupon(coupon)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => handleToggleStatus(coupon.id, coupon.isActive)}
                              className={`${
                                coupon.isActive ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'
                              }`}
                            >
                              {coupon.isActive ? 'Tạm dừng' : 'Kích hoạt'}
                            </button>
                            <button
                              onClick={() => handleDeleteCoupon(coupon.id)}
                              className="text-red-600 hover:text-red-900"
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
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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
                  rows={3}
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
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
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