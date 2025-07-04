import React, { useEffect, useState } from 'react';

'use client';
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
  isPublic: boolean;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

const isExpired = (endDate: string) => {
  return new Date(endDate) < new Date();
};

const isValidNow = (startDate: string, endDate: string) => {
  const now = new Date();
  return new Date(startDate) <= now && new Date(endDate) >= now;
};

export default function PublicCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/coupons');
        const data = await response.json();
        // Lọc chỉ lấy mã công khai, đang hoạt động, chưa hết hạn
        const now = new Date();
        const publicCoupons = (data.coupons || []).filter(
          (c: Coupon) =>
            c.isPublic && c.isActive && new Date(c.startDate) <= now && new Date(c.endDate) >= now,
        );
        setCoupons(publicCoupons);
      } catch (error) {
        setCoupons([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setShowNotification(true);
        setNotificationMessage(`Đã sao chép mã: ${code}`);

        setTimeout(() => {
          setShowNotification(false);
        }, 2000);
      })
      .catch((err) => {
        console.error('Copy failed:', err);
        setShowNotification(true);
        setNotificationMessage('Không thể sao chép mã. Vui lòng thử lại.');

        setTimeout(() => {
          setShowNotification(false);
        }, 2000);
      });
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-2 min-h-screen">
      <h1 className="text-2xl font-bold text-primary-700 mb-6 text-center">Mã giảm giá</h1>

      <div className="mb-4 flex justify-end">
        <a
          href="/vouchers/used"
          className="text-primary-600 hover:text-primary-800 transition-colors text-sm"
        >
          Xem voucher đã sử dụng &rarr;
        </a>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : coupons.length === 0 ? (
        <div className="text-center text-gray-500 py-12">Hiện chưa có mã giảm giá nào.</div>
      ) : (
        <div className="space-y-4">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="bg-white border border-primary-100 rounded-lg shadow-sm p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 hover:shadow-md transition-all"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center">
                    <span
                      onClick={() => handleCopy(coupon.code)}
                      className="bg-primary-500 text-white font-mono font-bold px-3 py-1.5 rounded select-all text-lg cursor-pointer hover:bg-primary-600 transition-colors flex items-center"
                      title="Nhấn để sao chép mã"
                    >
                      {coupon.code}
                    </span>
                  </div>
                  <span className="text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2 py-0.5">
                    {coupon.type === 'percentage'
                      ? `${coupon.value}%`
                      : formatCurrency(coupon.value)}
                  </span>
                </div>
                <div className="font-semibold text-gray-800 mb-1">{coupon.name}</div>
                {coupon.description && (
                  <div className="text-gray-600 text-sm mb-1">{coupon.description}</div>
                )}
                <div className="text-xs text-gray-500">
                  Hiệu lực: {formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}
                </div>

                {coupon.usageLimit ? (
                  <div className="mt-2">
                    <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
                      <span>
                        Đã dùng: {coupon.usedCount}/{coupon.usageLimit}
                      </span>
                      <span
                        className={
                          coupon.usageLimit - coupon.usedCount < 5 ? 'text-red-600 font-medium' : ''
                        }
                      >
                        Còn {coupon.usageLimit - coupon.usedCount} lượt
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                      <div
                        className={`h-full rounded-full ${
                          coupon.usageLimit - coupon.usedCount < 5
                            ? 'bg-gradient-to-r from-red-500 to-red-600'
                            : 'bg-gradient-to-r from-teal-500 to-emerald-500'
                        }`}
                        style={{
                          width: `${Math.min(100, (coupon.usedCount / coupon.usageLimit) * 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-green-600 font-medium mt-2">
                    Không giới hạn số lượt sử dụng
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add notification toast */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-teal-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center">
          <span>{notificationMessage}</span>
          <button
            onClick={() => setShowNotification(false)}
            className="ml-3 text-white hover:text-teal-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
