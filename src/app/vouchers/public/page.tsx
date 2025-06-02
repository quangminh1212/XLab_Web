"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState<{[key: string]: boolean}>({});
  const [activeTab, setActiveTab] = useState<"available" | "used" | "expired">("available");

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/coupons/public");
        const data = await response.json();
        
        if (data.success && data.coupons) {
          setVouchers(data.coupons);
          console.log("Loaded vouchers:", data.coupons);
        } else {
          console.error("Failed to load vouchers:", data);
        }
      } catch (error) {
        console.error("Error fetching vouchers:", error);
        setVouchers([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVouchers();
  }, []);

  const handleCopyVoucher = (code: string) => {
    navigator.clipboard.writeText(code);
    setIsCopied({...isCopied, [code]: true});
    
    setTimeout(() => {
      setIsCopied({...isCopied, [code]: false});
    }, 2000);
  };

  // Lọc voucher theo tab đang active
  const filteredVouchers = vouchers.filter(voucher => {
    if (activeTab === "expired") {
      return isExpired(voucher.endDate);
    } else if (activeTab === "used") {
      return !isExpired(voucher.endDate) && isFullyUsedByUser(voucher);
    } else { // available
      return !isExpired(voucher.endDate) && !isFullyUsedByUser(voucher);
    }
  });

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 mb-3">Mã giảm giá</h1>
        <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 mx-auto rounded-full mb-4"></div>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Các mã giảm giá hiện có và còn hiệu lực mà bạn có thể sử dụng khi thanh toán
        </p>

        {/* Tab navigation */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-md shadow-sm bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab("available")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === "available" 
                  ? 'bg-white text-teal-700 shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Có thể dùng
            </button>
            <button
              onClick={() => setActiveTab("used")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === "used" 
                  ? 'bg-white text-teal-700 shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Đã dùng
            </button>
            <button
              onClick={() => setActiveTab("expired")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === "expired" 
                  ? 'bg-white text-teal-700 shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Đã hết hạn
            </button>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <div className="relative">
            <div className="animate-spin rounded-full h-14 w-14 border-t-3 border-b-3 border-teal-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-7 w-7 bg-white rounded-full"></div>
            </div>
          </div>
          <p className="ml-4 text-gray-600 font-medium">Đang tải mã giảm giá...</p>
        </div>
      ) : filteredVouchers.length === 0 ? (
        <div className="text-center max-w-lg mx-auto">
          <div className="bg-gradient-to-br from-white to-teal-50 rounded-xl p-8 shadow-sm border border-teal-100">
            <div className="w-16 h-16 mx-auto bg-teal-50 rounded-full flex items-center justify-center mb-4">
              <svg 
                className="h-8 w-8 text-teal-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {activeTab === "available" && "Không có mã giảm giá nào có thể sử dụng"}
              {activeTab === "used" && "Bạn chưa sử dụng mã giảm giá nào"}
              {activeTab === "expired" && "Không có mã giảm giá nào đã hết hạn"}
            </h3>
            <p className="text-gray-600 mb-5">
              {activeTab === "available" && "Hiện chưa có mã giảm giá nào có thể sử dụng. Vui lòng quay lại sau."}
              {activeTab === "used" && "Bạn chưa sử dụng mã giảm giá nào hoặc bạn chưa đăng nhập."}
              {activeTab === "expired" && "Không có mã giảm giá nào đã hết hạn. Các mã hiện tại vẫn còn hiệu lực."}
            </p>
            <Link 
              href="/" 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredVouchers.map((voucher) => (
            <div 
              key={voucher.id} 
              className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all ${
                activeTab === "expired" ? "border-gray-300 opacity-80" : 
                activeTab === "used" ? "border-orange-200" : "border-gray-200"
              }`}
            >
              {/* Coupon header with color based on type and status */}
              <div className={`px-5 py-3 flex justify-between items-center border-b ${
                activeTab === "expired" 
                  ? 'bg-gradient-to-r from-gray-400 to-gray-500' : 
                activeTab === "used" 
                  ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                voucher.type === "percentage" 
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600' 
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
              }`}>
                <div className="flex items-center">
                  <span className="text-white font-mono font-bold text-lg select-all">
                    {voucher.code}
                  </span>
                  {activeTab === "available" && (
                    <button
                      onClick={() => handleCopyVoucher(voucher.code)}
                      className="ml-2 text-white bg-white/25 hover:bg-white/40 p-1.5 rounded-md flex items-center justify-center transition-all"
                      title="Sao chép mã"
                    >
                      {isCopied[voucher.code] ? (
                        <span className="text-xs font-medium">✓</span>
                      ) : (
                        <span className="text-xs font-medium">Sao chép</span>
                      )}
                    </button>
                  )}
                </div>
                <div className={`rounded-full text-sm font-medium px-3 py-1 shadow-sm ${
                  activeTab === "expired" ? "bg-gray-100 text-gray-700" : 
                  activeTab === "used" ? "bg-orange-50 text-orange-700" : "bg-white"
                }`}>
                  {voucher.type === "percentage" 
                    ? `Giảm ${voucher.value}%` 
                    : `Giảm ${formatCurrency(voucher.value)}`
                  }
                  {activeTab === "expired" && " (Hết hạn)"}
                  {activeTab === "used" && " (Đã dùng)"}
                </div>
              </div>
              
              {/* Coupon body */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-lg mb-1">{voucher.name}</h3>
                {voucher.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{voucher.description}</p>
                )}
                
                {/* Key info section */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center text-xs text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>HSD: {formatDate(voucher.endDate)}</span>
                  </div>
                  
                  {voucher.minOrder && (
                    <div className="flex items-center text-xs text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Đơn ≥ {formatCurrency(voucher.minOrder)}</span>
                    </div>
                  )}
                  
                  {voucher.maxDiscount && (
                    <div className="flex items-center text-xs text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Tối đa: {formatCurrency(voucher.maxDiscount)}</span>
                    </div>
                  )}
                  
                  {voucher.userLimit ? (
                    <div className="flex items-center text-xs text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{voucher.userLimit} lần/người</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-xs text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Vô hạn lần/người</span>
                    </div>
                  )}
                </div>
                
                {/* Usage bar if applicable */}
                {voucher.usageLimit ? (
                  <div className="mb-3">
                    <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
                      <span className="font-medium">Còn lại: {voucher.usageLimit - voucher.usedCount}/{voucher.usageLimit} ({voucher.usedCount} đã dùng)</span>
                      <span className={`${voucher.usageLimit - voucher.usedCount < 10 ? 'text-red-600 font-medium' : ''}`}>
                        {calculateUsagePercentage(voucher.usedCount, voucher.usageLimit)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          activeTab === "expired" ? "bg-gray-400" :
                          activeTab === "used" ? "bg-orange-400" :
                          voucher.usageLimit - voucher.usedCount < 10
                            ? 'bg-red-500' 
                            : 'bg-teal-500'
                        }`}
                        style={{ width: `${calculateUsagePercentage(voucher.usedCount, voucher.usageLimit)}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-3 text-xs text-gray-600">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                      <span>Số lượng: Vô hạn ({voucher.usedCount} đã dùng)</span>
                    </div>
                  </div>
                )}
                
                {/* Applicable products if any */}
                {voucher.applicableProducts && voucher.applicableProducts.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    <span className="font-medium">Áp dụng cho: </span>
                    {voucher.applicableProducts.join(', ')}
                  </div>
                )}

                {/* User usage if available */}
                {voucher.userUsage && (
                  <div className="mt-3 text-xs px-3 py-2 bg-gray-50 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">Bạn đã dùng:</span>
                      <span className={`font-medium ${voucher.userUsage.current >= voucher.userUsage.limit ? 'text-red-600' : 'text-teal-600'}`}>
                        {voucher.userUsage.current}/{voucher.userUsage.limit}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Button */}
              {activeTab === "available" && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                  <button
                    className={`w-full py-2 px-4 rounded-md font-medium text-sm text-white transition-all ${
                      isCopied[voucher.code]
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700'
                    }`}
                    onClick={() => handleCopyVoucher(voucher.code)}
                  >
                    {isCopied[voucher.code] ? 'Đã sao chép mã' : 'Sao chép mã'}
                  </button>
                </div>
              )}

              {activeTab === "used" && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                  <div className="w-full py-2 px-4 rounded-md font-medium text-sm text-center text-orange-700 bg-orange-50">
                    Đã sử dụng hết số lần cho phép
                  </div>
                </div>
              )}

              {activeTab === "expired" && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                  <div className="w-full py-2 px-4 rounded-md font-medium text-sm text-center text-gray-500 bg-gray-100">
                    Đã hết hạn vào {formatDate(voucher.endDate)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 