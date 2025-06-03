"use client";

import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUserUsedCoupons } from '@/lib/userService';

interface Voucher {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: "percentage" | "fixed";
  value: number;
  startDate: string;
  endDate: string;
  minOrder?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  userLimit?: number;
  applicableProducts?: string[];
  userUsage?: {
    current: number;
    limit: number;
  };
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Không xác định";
    }
    return date.toLocaleDateString("vi-VN");
  } catch (error) {
    return "Không xác định";
  }
};

// Tính phần trăm sử dụng của voucher
const calculateUsagePercentage = (used: number, total: number) => {
  if (!total) return 0;
  return Math.min(100, Math.round((used / total) * 100));
};

// Kiểm tra xem voucher đã hết hạn chưa
const isExpired = (endDate: string) => {
  try {
    const end = new Date(endDate);
    const now = new Date();
    return end < now;
  } catch (error) {
    return false;
  }
};

// Kiểm tra xem voucher đã được người dùng sử dụng hết chưa
const isFullyUsedByUser = (voucher: Voucher) => {
  if (!voucher.userUsage) return false;
  return voucher.userUsage.current >= voucher.userUsage.limit;
};

export default function PublicVouchersPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [usedCoupons, setUsedCoupons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/coupons/public');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Lỗi khi tải mã giảm giá công khai');
        }
        
        setCoupons(data.coupons || []);
        
        // Nếu người dùng đã đăng nhập, lấy danh sách voucher đã sử dụng
        if (session?.user?.email) {
          try {
            const userCouponsResponse = await fetch('/api/user/vouchers');
            const userCouponsData = await userCouponsResponse.json();
            
            if (userCouponsResponse.ok && userCouponsData.vouchers) {
              // Lọc ra các mã đã sử dụng từ thông tin userUsage trong response
              const usedCouponCodes = userCouponsData.vouchers
                .filter((v: any) => v.userUsage?.current > 0)
                .map((v: any) => v.code);
              
              setUsedCoupons(usedCouponCodes);
            }
          } catch (userCouponError) {
            console.error('Error fetching user coupons:', userCouponError);
          }
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCoupons();
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Mã giảm giá</h1>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Mã giảm giá</h1>
          <div className="bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Đã xảy ra lỗi</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Mã giảm giá</h1>
        
        <div className="bg-white overflow-hidden shadow rounded-lg mb-8">
          <div className="p-5 bg-teal-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-teal-800">
              Các mã giảm giá hiện có và còn hiệu lực
            </h2>
          </div>
          <div className="p-5">
            <p className="text-gray-600 mb-4">
              Các mã giảm giá này có thể sử dụng khi thanh toán để được giảm giá theo điều kiện của từng mã.
            </p>
            
            {coupons.length === 0 ? (
              <div className="text-center py-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Không có mã giảm giá nào</h3>
                <p className="mt-1 text-sm text-gray-500">Hiện tại không có mã giảm giá công khai nào.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {coupons.map((coupon) => {
                  const isUsed = usedCoupons.includes(coupon.code);
                  
                  return (
                    <li key={coupon.id} className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center">
                            <div className="bg-teal-100 text-teal-800 py-1 px-3 rounded-full text-sm font-medium">
                              {coupon.code}
                            </div>
                            {isUsed && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Đã sử dụng
                              </span>
                            )}
                          </div>
                          <h3 className="mt-2 text-lg font-medium text-gray-900">{coupon.name}</h3>
                          <p className="mt-1 text-gray-500">{coupon.description}</p>
                          <div className="mt-2 text-sm text-gray-500">
                            <p>
                              {coupon.type === 'percentage'
                                ? `Giảm ${coupon.value}% cho đơn hàng`
                                : `Giảm ${coupon.value.toLocaleString()}đ cho đơn hàng`}
                              {coupon.minOrder
                                ? ` từ ${coupon.minOrder.toLocaleString()}đ`
                                : ''}
                            </p>
                            <p className="mt-1">
                              Hết hạn: {new Date(coupon.endDate).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>
                        <div>
                          <button
                            onClick={() => {
                              if (session) {
                                router.push('/cart');
                              } else {
                                router.push('/login?redirect=/cart');
                              }
                            }}
                            className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm ${
                              isUsed 
                                ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                                : 'text-white bg-teal-600 hover:bg-teal-700'
                            }`}
                            disabled={isUsed}
                          >
                            {isUsed ? 'Đã dùng' : 'Dùng ngay'}
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            
            <div className="mt-6 text-center">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Quay lại trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 