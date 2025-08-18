'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

import VoucherUsageList from '@/components/admin/VoucherUsageList';
import withAdminAuth from '@/components/withAdminAuth';
import { useLanguage } from '@/contexts/LanguageContext';

interface Coupon {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: 'percentage' | 'fixed' | 'cashback';
  value: number;
  minOrder?: number;
  maxDiscount?: number;
  usageLimit?: number;
  userLimit?: number;
  usedCount: number;
  userUsage?: { [email: string]: number };
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  applicableProducts?: string[];
  isPublic: boolean;
}

interface CouponForm {
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed' | 'cashback';
  value: number;
  minOrder: number;
  maxDiscount: number;
  usageLimit: number;
  userLimit: number;
  startDate: string;
  endDate: string;
  applicableProducts: string;
  isPublic: boolean;
}

function CouponsPage() {
  const { data: session } = useSession();
  const { t, language } = useLanguage();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'edit'>('list');
  const [filterTab, setFilterTab] = useState<'active' | 'expired'>('active');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [inlineEditing, setInlineEditing] = useState<{ [key: string]: boolean }>({});
  const [editValues, setEditValues] = useState<{ [key: string]: any }>({});

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
    userLimit: 1,
    startDate: '',
    endDate: '',
    applicableProducts: '',
    isPublic: true,
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
      userLimit: 1,
      startDate: '',
      endDate: '',
      applicableProducts: '',
      isPublic: true,
    });
  };

  // Generate random coupon code
  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm((prev) => ({ ...prev, code: result }));
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
        setErrorMessage(t('admin.coupons.fetchError'));
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
      setErrorMessage(t('admin.coupons.fetchError'));
    } finally {
      setIsLoading(false);
    }
  };

  // Thêm helper function để chuẩn hóa ngày tháng
  const formatDateForAPI = (dateString: string, isEndDate: boolean = false) => {
    // Nếu ngày đã có định dạng ISO, giữ nguyên
    if (dateString.includes('T')) return dateString;

    // Phân tách các phần của ngày
    const parts = dateString.split('-').map((v) => Number(v));
    const y = parts[0] ?? 1970;
    const m = (parts[1] ?? 1) - 1;
    const d = parts[2] ?? 1;
    const date = new Date(Date.UTC(y, m, d));

    // Đặt giờ cho ngày: 00:00:00 cho ngày bắt đầu và 23:59:59 cho ngày kết thúc
    if (isEndDate) {
      date.setUTCHours(23, 59, 59, 999);
    } else {
      date.setUTCHours(0, 0, 0, 0);
    }

    return date.toISOString();
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
        startDate: formatDateForAPI(form.startDate),
        endDate: formatDateForAPI(form.endDate, true),
        applicableProducts: form.applicableProducts
          ? form.applicableProducts
              .split(',')
              .map((id) => id.trim())
              .filter((id) => id)
          : [],
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
        setSuccessMessage(t('admin.coupons.createSuccess'));
        resetForm();
        fetchCoupons();
        setTimeout(() => setActiveTab('list'), 2000);
      } else {
        setErrorMessage(data.error || t('admin.coupons.createError'));
      }
    } catch (error) {
      console.error('Error creating coupon:', error);
      setErrorMessage(t('admin.coupons.createError'));
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
        startDate: formatDateForAPI(form.startDate),
        endDate: formatDateForAPI(form.endDate, true),
        applicableProducts: form.applicableProducts
          ? form.applicableProducts
              .split(',')
              .map((id) => id.trim())
              .filter((id) => id)
          : [],
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
        setSuccessMessage(t('admin.coupons.updateSuccess'));
        closeEditModal();
        fetchCoupons();
      } else {
        setErrorMessage(data.error || t('admin.coupons.updateError'));
      }
    } catch (error) {
      console.error('Error updating coupon:', error);
      setErrorMessage(t('admin.notifications.connectionError'));
    } finally {
      setIsCreating(false);
    }
  };

  // Delete coupon
  const handleDeleteCoupon = async (id: string) => {
    if (!confirm(t('admin.coupons.confirmDelete', { default: 'Bạn có chắc chắn muốn xóa mã giảm giá này?' }))) return;

    try {
      const response = await fetch(`/api/admin/coupons/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccessMessage(t('admin.coupons.deleteSuccess', { default: 'Mã giảm giá đã được xóa thành công!' }));
        fetchCoupons();
      } else {
        const data = await response.json();
        setErrorMessage(data.error || t('admin.coupons.deleteError', { default: 'Đã xảy ra lỗi khi xóa mã giảm giá' }));
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      setErrorMessage(t('admin.notifications.connectionError'));
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
        setSuccessMessage(
          !isActive ? t('admin.coupons.activateSuccess', { default: 'Mã giảm giá đã được kích hoạt thành công!' }) : 
                     t('admin.coupons.deactivateSuccess', { default: 'Mã giảm giá đã được vô hiệu hóa thành công!' })
        );
        fetchCoupons();
      } else {
        const data = await response.json();
        setErrorMessage(data.error || t('admin.coupons.toggleError'));
      }
    } catch (error) {
      console.error('Error toggling coupon status:', error);
      setErrorMessage(t('admin.notifications.connectionError'));
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
      userLimit: coupon.userLimit || 1,
      startDate: coupon.startDate?.split('T')[0] ?? '',
      endDate: coupon.endDate?.split('T')[0] ?? '',
      applicableProducts: coupon.applicableProducts?.join(', ') || '',
      isPublic: coupon.isPublic ?? true,
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
      currency: 'VND',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    // Tạo date object từ chuỗi ISO và xác định rõ là UTC
    const date = new Date(dateString);
    // Format date theo định dạng Việt Nam và đảm bảo sử dụng ngày tháng của múi giờ địa phương
    return new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
    ).toLocaleDateString((useLanguage().localCode === 'vi') ? 'vi-VN' : 'en-US');
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

  // Inline editing functions
  const startInlineEdit = (couponId: string, field: string, currentValue: any) => {
    setInlineEditing((prev) => ({ ...prev, [`${couponId}-${field}`]: true }));
    setEditValues((prev) => ({ ...prev, [`${couponId}-${field}`]: currentValue }));
  };

  const cancelInlineEdit = (couponId: string, field: string) => {
    setInlineEditing((prev) => {
      const newState = { ...prev };
      delete newState[`${couponId}-${field}`];
      return newState;
    });
    setEditValues((prev) => {
      const newState = { ...prev };
      delete newState[`${couponId}-${field}`];
      return newState;
    });
  };

  const saveInlineEdit = async (couponId: string, field: string) => {
    const editKey = `${couponId}-${field}`;
    const newValue = editValues[editKey];
    console.log(`Đang lưu chỉnh sửa cho mã ${couponId}, trường ${field}, giá trị:`, newValue);

    try {
      const coupon = coupons.find((c) => c.id === couponId);
      if (!coupon) {
        console.error('Không tìm thấy mã giảm giá với ID:', couponId);
        return;
      }
      console.log('Đã tìm thấy mã cần cập nhật:', coupon);

      // Tạo bản sao sâu của coupon để chỉnh sửa
      const updateData: Record<string, any> = { ...coupon };

      // Xử lý đặc biệt các trường ngày tháng
      if (field === 'startDate' || field === 'endDate') {
        // Giữ ngày và đặt giờ cụ thể để tránh vấn đề múi giờ
        const parts = newValue.split('-').map(Number);
        const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));

        // Đảm bảo rằng startDate là đầu ngày và endDate là cuối ngày trong UTC
        if (field === 'startDate') {
          date.setUTCHours(0, 0, 0, 0);
        } else {
          date.setUTCHours(23, 59, 59, 999);
        }

        updateData[field] = date.toISOString();
      }
      // Xử lý các trường số
      else if (
        field === 'usedCount' ||
        field === 'usageLimit' ||
        field === 'value' ||
        field === 'minOrder' ||
        field === 'maxDiscount' ||
        field === 'userLimit'
      ) {
        updateData[field] = Number(newValue);
      } else {
        updateData[field] = newValue;
      }

      console.log(
        `Gửi yêu cầu cập nhật đến /api/admin/coupons/${couponId} với dữ liệu:`,
        updateData,
      );
      console.log('API URL:', `/api/admin/coupons/${couponId}`);

      const response = await fetch(`/api/admin/coupons/${couponId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const responseData = await response.json();
      console.log('Phản hồi API:', responseData, 'Trạng thái:', response.status);

      if (response.ok) {
        setCoupons((prev) =>
          prev.map((c) => {
            if (c.id === couponId) {
              const updatedCoupon = { ...c };
              (updatedCoupon as Record<string, any>)[field] = updateData[field];
              return updatedCoupon;
            }
            return c;
          }),
        );
        setSuccessMessage('Cập nhật thành công!');
        setTimeout(() => setSuccessMessage(''), 3000);

        // Làm mới dữ liệu sau khi cập nhật
        fetchCoupons();
      } else {
        setErrorMessage(
          `Có lỗi xảy ra khi cập nhật: ${responseData.error || 'Lỗi không xác định'}`,
        );
        setTimeout(() => setErrorMessage(''), 3000);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật mã giảm giá:', error);
      setErrorMessage('Có lỗi xảy ra khi cập nhật');
      setTimeout(() => setErrorMessage(''), 3000);
    }

    cancelInlineEdit(couponId, field);
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
    return undefined;
  }, [successMessage, errorMessage]);

  // Phân chia mã giảm giá thành nhóm còn hạn và hết hạn
  const nonExpiredCoupons = coupons.filter((coupon) => !isExpired(coupon.endDate));
  const expiredCoupons = coupons.filter((coupon) => isExpired(coupon.endDate));

  // Các mã đang hoạt động thực sự (active và chưa hết hạn)
  const actuallyActiveCoupons = coupons.filter(
    (coupon) => coupon.isActive && !isExpired(coupon.endDate),
  );

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
              <h1 className="text-xl font-bold text-white text-balance break-words">{t('admin.coupons.title')}</h1>
              <p className="text-primary-100 text-sm">
                {t('admin.coupons.subtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-lg font-bold text-white">{coupons.length}</div>
              <div className="text-xs text-primary-100">{t('admin.coupons.totalCount')}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">{actuallyActiveCoupons.length}</div>
              <div className="text-xs text-primary-100">{t('admin.coupons.activeCount')}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">
                {coupons.filter((c) => isExpired(c.endDate)).length}
              </div>
              <div className="text-xs text-primary-100">{t('admin.coupons.expiredCount')}</div>
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
              📋 {t('admin.coupons.listTab')} ({coupons.length})
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
              ➕ {t('admin.coupons.createTab')}
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
            <h2 className="text-base font-medium text-gray-900 mb-3 text-balance">{t('admin.coupons.listTitle')}</h2>

            {/* Sub-tabs for active vs expired */}
            <div className="mb-4">
              <nav className="flex space-x-2">
                <button
                  onClick={() => setFilterTab('active')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${filterTab === 'active' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {t('admin.coupons.activeTab')} ({actuallyActiveCoupons.length})
                </button>
                <button
                  onClick={() => setFilterTab('expired')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${filterTab === 'expired' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {t('admin.coupons.expiredTab')} ({expiredCoupons.length})
                </button>
              </nav>
            </div>

            {/* Empty state */}
            {coupons.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center p-4 bg-primary-50 rounded-full mb-4">
                  <span className="text-4xl">🏷️</span>
                </div>
                <p className="text-gray-500 mb-8">
                  {t('admin.coupons.noCoUponsMessage')}
                </p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg"
                >
                  🚀 {t('admin.coupons.createFirstButton')}
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto bg-white rounded-lg border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        {t('admin.coupons.codeColumn')}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        {t('admin.coupons.typeColumn')}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        {t('admin.coupons.timeColumn')}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        {t('admin.coupons.usageColumn')}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        {t('admin.coupons.statusColumn')}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        {t('admin.coupons.actionsColumn')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(filterTab === 'active' ? actuallyActiveCoupons : expiredCoupons).map(
                      (coupon) => (
                        <tr
                          key={coupon.id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div>
                              <div className="bg-primary-500 text-white font-mono font-bold text-sm px-3 py-1.5 rounded border border-primary-300">
                                {coupon.code}
                              </div>
                              <div className="text-sm font-medium text-gray-700 mt-1.5">
                                {inlineEditing[`${coupon.id}-name`] ? (
                                  <div className="flex items-center space-x-1">
                                    <input
                                      type="text"
                                      value={editValues[`${coupon.id}-name`] || ''}
                                      onChange={(e) =>
                                        setEditValues((prev) => ({
                                          ...prev,
                                          [`${coupon.id}-name`]: e.target.value,
                                        }))
                                      }
                                      className="border border-gray-300 rounded px-2 py-1 text-sm w-32"
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          saveInlineEdit(coupon.id, 'name');
                                        } else if (e.key === 'Escape') {
                                          cancelInlineEdit(coupon.id, 'name');
                                        }
                                      }}
                                      autoFocus
                                    />
                                    <button
                                      onClick={() => saveInlineEdit(coupon.id, 'name')}
                                      className="text-green-600 hover:text-green-800 text-xs"
                                    >
                                      ✓
                                    </button>
                                    <button
                                      onClick={() => cancelInlineEdit(coupon.id, 'name')}
                                      className="text-red-600 hover:text-red-800 text-xs"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ) : (
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      startInlineEdit(coupon.id, 'name', coupon.name);
                                    }}
                                    className="cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded"
                                    title={t('admin.coupons.clickToEdit', { default: 'Click để chỉnh sửa' })}
                                  >
                                    {coupon.name}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="space-y-1.5">
                              <div className="inline-flex items-center px-3 py-1.5 rounded bg-gray-50 border border-gray-200 text-gray-700">
                                {inlineEditing[`${coupon.id}-type`] ? (
                                  <div className="flex items-center space-x-1">
                                    <select
                                      value={editValues[`${coupon.id}-type`] || coupon.type}
                                      onChange={(e) =>
                                        setEditValues((prev) => ({
                                          ...prev,
                                          [`${coupon.id}-type`]: e.target.value,
                                        }))
                                      }
                                      className="border border-gray-300 rounded px-2 py-1 text-sm w-28"
                                      autoFocus
                                    >
                                      <option value="percentage">{t('admin.coupons.percentageType')} (%)</option>
                                      <option value="fixed">{t('admin.coupons.fixedType')} (VNĐ)</option>
                                      <option value="cashback">{t('admin.coupons.cashbackType')}</option>
                                    </select>
                                    <button
                                      onClick={() => saveInlineEdit(coupon.id, 'type')}
                                      className="text-green-600 hover:text-green-800 text-xs"
                                    >
                                      ✓
                                    </button>
                                    <button
                                      onClick={() => cancelInlineEdit(coupon.id, 'type')}
                                      className="text-red-600 hover:text-red-800 text-xs"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ) : (
                                  <span
                                    onClick={() => startInlineEdit(coupon.id, 'type', coupon.type)}
                                    title={t('admin.coupons.clickToEditType', { default: 'Click để chỉnh sửa loại giảm giá' })}
                                    className="text-sm font-medium mr-2 cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded"
                                  >
                                    {coupon.type === 'percentage' 
                                      ? t('admin.coupons.percentageType') 
                                      : coupon.type === 'cashback' 
                                        ? t('admin.coupons.cashbackType')
                                        : t('admin.coupons.fixedType')
                                    }
                                  </span>
                                )}
                                {inlineEditing[`${coupon.id}-value`] ? (
                                  <div className="flex items-center space-x-1">
                                    <input
                                      type="number"
                                      value={editValues[`${coupon.id}-value`] || ''}
                                      onChange={(e) =>
                                        setEditValues((prev) => ({
                                          ...prev,
                                          [`${coupon.id}-value`]: e.target.value,
                                        }))
                                      }
                                      className="border border-gray-300 rounded px-2 py-1 text-sm w-16"
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') saveInlineEdit(coupon.id, 'value');
                                        else if (e.key === 'Escape')
                                          cancelInlineEdit(coupon.id, 'value');
                                      }}
                                      autoFocus
                                    />
                                    <span className="text-sm font-bold">
                                      {coupon.type === 'percentage' || coupon.type === 'cashback' ? '%' : 'đ'}
                                    </span>
                                    <button
                                      onClick={() => saveInlineEdit(coupon.id, 'value')}
                                      className="text-green-600 hover:text-green-800 text-xs"
                                    >
                                      ✓
                                    </button>
                                    <button
                                      onClick={() => cancelInlineEdit(coupon.id, 'value')}
                                      className="text-red-600 hover:text-red-800 text-xs"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ) : (
                                  <span
                                    onClick={() =>
                                      startInlineEdit(coupon.id, 'value', coupon.value)
                                    }
                                    className="text-sm font-bold cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded"
                                    title={t('admin.coupons.clickToEdit', { default: 'Click để chỉnh sửa' })}
                                  >
                                    {coupon.type === 'percentage' || coupon.type === 'cashback'
                                      ? `${coupon.value}%`
                                      : formatCurrency(coupon.value)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {inlineEditing[`${coupon.id}-startDate`] ? (
                              <div className="flex items-center space-x-1">
                                <input
                                  type="date"
                                  value={
                                    editValues[`${coupon.id}-startDate`] ||
                                    coupon.startDate.split('T')[0]
                                  }
                                  onChange={(e) =>
                                    setEditValues((prev) => ({
                                      ...prev,
                                      [`${coupon.id}-startDate`]: e.target.value,
                                    }))
                                  }
                                  className="border border-gray-300 rounded px-2 py-1 text-sm w-32"
                                  autoFocus
                                />
                                <button
                                  onClick={() => saveInlineEdit(coupon.id, 'startDate')}
                                  className="text-green-600 hover:text-green-800 text-xs px-2 py-1 bg-green-50 border border-green-200 rounded"
                                >
                                  ✓ {t('admin.coupons.save', { default: 'Lưu' })}
                                </button>
                                <button
                                  onClick={() => cancelInlineEdit(coupon.id, 'startDate')}
                                  className="text-red-600 hover:text-red-800 text-xs px-2 py-1 bg-red-50 border border-red-200 rounded"
                                >
                                  ✕ {t('admin.coupons.cancel', { default: 'Hủy' })}
                                </button>
                              </div>
                            ) : (
                              <span
                                className="text-sm text-gray-700 font-medium cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded"
                                onClick={() =>
                                  startInlineEdit(
                                    coupon.id,
                                    'startDate',
                                    coupon.startDate.split('T')[0],
                                  )
                                }
                              >
                                {formatDate(coupon.startDate)}
                              </span>
                            )}
                            <span className="mx-1">-</span>
                            {inlineEditing[`${coupon.id}-endDate`] ? (
                              <div className="flex items-center space-x-1">
                                <input
                                  type="date"
                                  value={
                                    editValues[`${coupon.id}-endDate`] ||
                                    coupon.endDate.split('T')[0]
                                  }
                                  onChange={(e) =>
                                    setEditValues((prev) => ({
                                      ...prev,
                                      [`${coupon.id}-endDate`]: e.target.value,
                                    }))
                                  }
                                  className="border border-gray-300 rounded px-2 py-1 text-sm w-32"
                                  autoFocus
                                />
                                <button
                                  onClick={() => saveInlineEdit(coupon.id, 'endDate')}
                                  className="text-green-600 hover:text-green-800 text-xs px-2 py-1 bg-green-50 border border-green-200 rounded"
                                >
                                  ✓ {t('admin.coupons.save', { default: 'Lưu' })}
                                </button>
                                <button
                                  onClick={() => cancelInlineEdit(coupon.id, 'endDate')}
                                  className="text-red-600 hover:text-red-800 text-xs px-2 py-1 bg-red-50 border border-red-200 rounded"
                                >
                                  ✕ {t('admin.coupons.cancel', { default: 'Hủy' })}
                                </button>
                              </div>
                            ) : (
                              <span
                                className="text-sm text-gray-700 font-medium cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded"
                                onClick={() =>
                                  startInlineEdit(
                                    coupon.id,
                                    'endDate',
                                    coupon.endDate.split('T')[0],
                                  )
                                }
                              >
                                {formatDate(coupon.endDate)}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div>
                              {inlineEditing[`${coupon.id}-usedCount`] ? (
                                <div className="flex items-center space-x-1">
                                  <input
                                    type="number"
                                    value={editValues[`${coupon.id}-usedCount`] || coupon.usedCount}
                                    onChange={(e) =>
                                      setEditValues((prev) => ({
                                        ...prev,
                                        [`${coupon.id}-usedCount`]: e.target.value,
                                      }))
                                    }
                                    onBlur={() => saveInlineEdit(coupon.id, 'usedCount')}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') saveInlineEdit(coupon.id, 'usedCount');
                                      if (e.key === 'Escape')
                                        cancelInlineEdit(coupon.id, 'usedCount');
                                    }}
                                    className="border border-gray-300 rounded px-1 py-0.5 text-xs w-16 text-center"
                                    min="0"
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => saveInlineEdit(coupon.id, 'usedCount')}
                                    className="text-green-600 hover:text-green-800 text-xs px-1 py-0.5 bg-green-50 border border-green-200 rounded"
                                  >
                                    ✓
                                  </button>
                                  <button
                                    onClick={() => cancelInlineEdit(coupon.id, 'usedCount')}
                                    className="text-red-600 hover:text-red-800 text-xs px-1 py-0.5 bg-red-50 border border-red-200 rounded"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <span
                                  onClick={() =>
                                    startInlineEdit(coupon.id, 'usedCount', coupon.usedCount)
                                  }
                                  title={t('admin.coupons.clickToEditUsage', { default: 'Click để chỉnh sửa số lượt đã sử dụng' })}
                                  className="text-lg font-bold text-gray-700 cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded"
                                >
                                  {coupon.usedCount}
                                </span>
                              )}
                              <span className="text-sm text-gray-500 font-medium ml-1">
                                /
                                {inlineEditing[`${coupon.id}-usageLimit`] ? (
                                  <input
                                    type="number"
                                    value={
                                      editValues[`${coupon.id}-usageLimit`] ||
                                      coupon.usageLimit ||
                                      0
                                    }
                                    onChange={(e) =>
                                      setEditValues((prev) => ({
                                        ...prev,
                                        [`${coupon.id}-usageLimit`]: e.target.value,
                                      }))
                                    }
                                    onBlur={() => saveInlineEdit(coupon.id, 'usageLimit')}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter')
                                        saveInlineEdit(coupon.id, 'usageLimit');
                                      if (e.key === 'Escape')
                                        cancelInlineEdit(coupon.id, 'usageLimit');
                                    }}
                                    className="border border-gray-300 rounded px-1 py-0.5 text-xs w-12 text-center ml-1"
                                    min="0"
                                    autoFocus
                                  />
                                ) : (
                                  <span
                                    onClick={() =>
                                      startInlineEdit(
                                        coupon.id,
                                        'usageLimit',
                                        coupon.usageLimit || 0,
                                      )
                                    }
                                  >
                                    {coupon.usageLimit ? coupon.usageLimit : '∞'}
                                  </span>
                                )}{' '}
                                {t('admin.coupons.usageCount', { default: 'lần' })}
                              </span>

                              {coupon.userUsage && Object.keys(coupon.userUsage).length > 0 && (
                                <VoucherUsageList userUsage={coupon.userUsage} />
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex flex-row gap-2 items-center">
                              {inlineEditing[`${coupon.id}-isPublic`] ? (
                                <select
                                  value={
                                    editValues[`${coupon.id}-isPublic`] !== undefined
                                      ? editValues[`${coupon.id}-isPublic`]
                                        ? 'public'
                                        : 'private'
                                      : coupon.isPublic
                                        ? 'public'
                                        : 'private'
                                  }
                                  onChange={(e) =>
                                    setEditValues((prev) => ({
                                      ...prev,
                                      [`${coupon.id}-isPublic`]: e.target.value === 'public',
                                    }))
                                  }
                                  className="border border-gray-300 rounded px-2 py-1 text-xs"
                                  autoFocus
                                >
                                  <option value="public">{t('admin.coupons.public')}</option>
                                  <option value="private">{t('admin.coupons.private')}</option>
                                </select>
                              ) : (
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium cursor-pointer hover:bg-gray-100 ${coupon.isPublic ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-yellow-50 border border-yellow-200 text-yellow-700'}`}
                                  onClick={() =>
                                    startInlineEdit(coupon.id, 'isPublic', coupon.isPublic)
                                  }
                                >
                                  {coupon.isPublic ? t('admin.coupons.public') : t('admin.coupons.private')}
                                </span>
                              )}
                              {isExpired(coupon.endDate) ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                                  {t('admin.coupons.expired', { default: 'Đã hết hạn' })}
                                </span>
                              ) : coupon.isActive ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded bg-primary-50 border border-primary-200 text-primary-700 text-xs font-medium">
                                  {t('admin.coupons.active', { default: 'Đang hoạt động' })}
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-50 border border-gray-200 text-gray-600 text-xs font-medium">
                                  {t('admin.coupons.inactive', { default: 'Tạm dừng' })}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditCoupon(coupon)}
                                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors duration-150 text-sm font-medium border border-gray-200"
                              >
                                {t('admin.coupons.edit')}
                              </button>
                              <button
                                onClick={() => handleToggleStatus(coupon.id, coupon.isActive)}
                                className={`px-3 py-1.5 rounded transition-colors duration-150 text-sm font-medium border ${
                                  coupon.isActive
                                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200'
                                    : 'bg-primary-100 text-primary-600 hover:bg-primary-200 border-primary-200'
                                }`}
                              >
                                {coupon.isActive ? t('admin.coupons.stop') : t('admin.coupons.activate', { default: 'Hoạt động' })}
                              </button>
                              <button
                                onClick={() => handleDeleteCoupon(coupon.id)}
                                className="px-3 py-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors duration-150 text-sm font-medium border border-red-200"
                              >
                                {t('admin.coupons.delete')}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="bg-white rounded-lg shadow border border-gray-100">
          <div className="p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center border-b border-gray-100 pb-3 text-balance">
              <span className="bg-primary-100 text-primary-700 p-1 rounded-md mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </span>
              {t('admin.coupons.createTitle')}
            </h2>

            <form onSubmit={handleCreateCoupon} className="space-y-6">
              {/* Thông tin cơ bản */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <span className="bg-blue-100 text-blue-700 p-1 rounded mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </span>
                  {t('admin.coupons.basicInfo', { default: 'Thông tin cơ bản' })}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Mã giảm giá */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {t('admin.coupons.code', { default: 'Mã giảm giá' })} *
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={form.code}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))
                        }
                        className="flex-1 px-2 py-1.5 border border-gray-300 rounded-l-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                        placeholder={t('admin.coupons.codePlaceholder', { default: 'VD: SUMMER2024' })}
                        required
                      />
                      <button
                        type="button"
                        onClick={generateCode}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 text-sm"
                      >
                        {t('admin.coupons.generateAuto', { default: 'Tạo tự động' })}
                      </button>
                    </div>
                  </div>

                  {/* Tên mã giảm giá */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {t('admin.coupons.name', { default: 'Tên mã giảm giá' })} *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                      placeholder={t('admin.coupons.namePlaceholder', { default: 'VD: Giảm giá mùa hè' })}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Loại giảm giá và giá trị */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <span className="bg-green-100 text-green-700 p-1 rounded mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-14a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V4z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {t('admin.coupons.typeAndValue')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Loại giảm giá */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {t('admin.coupons.type', { default: 'Loại giảm giá' })} *
                    </label>
                    <select
                      value={form.type}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          type: e.target.value as 'percentage' | 'fixed' | 'cashback',
                        }))
                      }
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                    >
                      <option value="percentage">{t('admin.coupons.percentageType')} (%)</option>
                      <option value="fixed">{t('admin.coupons.fixedType')} (VNĐ)</option>
                      <option value="cashback">{t('admin.coupons.cashbackType')}</option>
                    </select>
                  </div>

                  {/* Giá trị giảm */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {t('admin.coupons.value', { default: 'Giá trị giảm' })} *
                    </label>
                    <input
                      type="number"
                      value={form.value}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, value: Number(e.target.value) }))
                      }
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                      placeholder={form.type === 'percentage' || form.type === 'cashback' ? 'VD: 10' : 'VD: 50000'}
                      min="0"
                      max={form.type === 'percentage' || form.type === 'cashback' ? 100 : undefined}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {form.type === 'percentage'
                        ? 'Nhập số phần trăm (0-100)'
                        : form.type === 'cashback'
                        ? 'Nhập số phần trăm sẽ được hoàn vào tài khoản (0-100)'
                        : 'Nhập số tiền (VNĐ)'}
                    </p>
                  </div>

                  {/* Giá trị giảm tối đa - chỉ hiển thị khi chọn phần trăm hoặc hoàn tiền */}
                  {(form.type === 'percentage' || form.type === 'cashback') && (
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {form.type === 'cashback' ? 'Giá trị hoàn tiền tối đa' : 'Giá trị giảm tối đa'}
                      </label>
                      <input
                        type="number"
                        value={form.maxDiscount}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, maxDiscount: Number(e.target.value) }))
                        }
                        className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                        placeholder="VD: 100000"
                        min="0"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {form.type === 'cashback'
                          ? 'Giới hạn số tiền tối đa được hoàn theo % (0 = không giới hạn)'
                          : 'Giới hạn số tiền tối đa được giảm (0 = không giới hạn)'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Thời gian và điều kiện */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <span className="bg-purple-100 text-purple-700 p-1 rounded mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {t('admin.coupons.timeAndConditions')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Thời gian hiệu lực */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {t('admin.coupons.validityPeriod', { default: 'Thời gian hiệu lực' })} *
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="date"
                        value={form.startDate}
                        onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                        className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                        required
                      />
                      <span className="self-center text-sm text-gray-500">đến</span>
                      <input
                        type="date"
                        value={form.endDate}
                        onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
                        className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Đơn hàng tối thiểu có thể sử dụng */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {t('admin.coupons.minOrder', { default: 'Đơn hàng tối thiểu' })}
                    </label>
                    <input
                      type="number"
                      value={form.minOrder}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, minOrder: Number(e.target.value) }))
                      }
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                      placeholder="Ví dụ: 200000"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {t('admin.coupons.minOrderDesc', { default: 'Giá trị đơn hàng tối thiểu để áp dụng mã giảm giá.' })}
                    </p>
                  </div>

                  {/* Trạng thái */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {t('admin.coupons.status', { default: 'Trạng thái' })} *
                    </label>
                    <select
                      value={form.isPublic ? 'public' : 'private'}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, isPublic: e.target.value === 'public' }))
                      }
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                      required
                    >
                      <option value="public">{t('admin.coupons.public')}</option>
                      <option value="private">{t('admin.coupons.private')}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Giới hạn sử dụng */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <span className="bg-yellow-100 text-yellow-700 p-1 rounded mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {t('admin.coupons.usageLimits')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Số lần sử dụng tối đa */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {t('admin.coupons.totalUsageLimit', { default: 'Số lần sử dụng tối đa' })}
                    </label>
                    <input
                      type="number"
                      value={form.usageLimit}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, usageLimit: Number(e.target.value) }))
                      }
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                      placeholder="Ví dụ: 100"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {t('admin.coupons.totalUsageDesc', { default: 'Số lần mã giảm giá có thể được sử dụng' })}
                    </p>
                  </div>

                  {/* Số lần mỗi người dùng */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {t('admin.coupons.perUserLimit', { default: 'Số lần mỗi người dùng' })}
                    </label>
                    <input
                      type="number"
                      value={form.userLimit}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, userLimit: Number(e.target.value) }))
                      }
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                      placeholder="Ví dụ: 1"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {t('admin.coupons.perUserLimitDesc', { default: 'Số lần mã giảm giá có thể được sử dụng bởi mỗi người' })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-between pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setActiveTab('list');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  {t('admin.notifications.cancelBtn')}
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-md hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 text-sm flex items-center"
                >
                  {isCreating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('admin.coupons.processing', { default: 'Đang xử lý...' })}
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586V4z" clipRule="evenodd" />
                      </svg>
                      {t('admin.coupons.createButton')}
                    </>
                  )}
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
                  {t('admin.coupons.editTitle', { default: 'Chỉnh sửa mã giảm giá:' })} {editingCoupon.code}
                </h3>
                <button
                  onClick={closeEditModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
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
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))
                      }
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
                      onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
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
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          type: e.target.value as 'percentage' | 'fixed' | 'cashback',
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                    >
                      <option value="percentage">{t('admin.coupons.percentageType')} (%)</option>
                      <option value="fixed">{t('admin.coupons.fixedType')} (VNĐ)</option>
                      <option value="cashback">{t('admin.coupons.cashbackType')}</option>
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
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, value: Number(e.target.value) }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                      placeholder={form.type === 'percentage' || form.type === 'cashback' ? 'VD: 10' : 'VD: 50000'}
                      min="0"
                      max={form.type === 'percentage' || form.type === 'cashback' ? 100 : undefined}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {form.type === 'percentage'
                        ? 'Nhập số phần trăm (0-100)'
                        : form.type === 'cashback'
                        ? 'Nhập số phần trăm sẽ được hoàn vào tài khoản (0-100)'
                        : 'Nhập số tiền (VNĐ)'}
                    </p>
                  </div>
                  {/* Giá trị giảm tối đa - chỉ hiển thị khi chọn phần trăm hoặc hoàn tiền */}
                  {(form.type === 'percentage' || form.type === 'cashback') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {form.type === 'cashback' ? 'Giá trị hoàn tiền tối đa' : 'Giá trị giảm tối đa'}
                      </label>
                      <input
                        type="number"
                        value={form.maxDiscount}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, maxDiscount: Number(e.target.value) }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                        placeholder="VD: 100000"
                        min="0"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {form.type === 'cashback'
                          ? 'Giới hạn số tiền tối đa được hoàn theo % (0 = không giới hạn)'
                          : 'Giới hạn số tiền tối đa được giảm (0 = không giới hạn)'}
                      </p>
                    </div>
                  )}
                  {/* Thời gian hiệu lực */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thời gian hiệu lực *
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="date"
                        value={form.startDate}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                        className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                        required
                      />
                      <span className="self-center text-sm text-gray-500">đến</span>
                      <input
                        type="date"
                        value={form.endDate}
                        onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
                        className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                        required
                      />
                    </div>
                  </div>
                  {/* Trạng thái công khai/riêng tư */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái *
                    </label>
                    <select
                      value={form.isPublic ? 'public' : 'private'}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, isPublic: e.target.value === 'public' }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                      required
                    >
                      <option value="public">{t('admin.coupons.public')}</option>
                      <option value="private">{t('admin.coupons.private')}</option>
                    </select>
                  </div>
                </div>
                {/* Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    disabled={isCreating}
                  >
                    {t('admin.notifications.cancelBtn')}
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-md hover:from-primary-700 hover:to-primary-800 disabled:opacity-50"
                  >
                    {isCreating ? t('admin.coupons.updating', { default: 'Đang cập nhật...' }) : t('admin.coupons.updateButton', { default: 'Cập nhật' })}
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
