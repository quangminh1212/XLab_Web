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
    navigator.clipboard.writeText(code)
      .then(() => {
        setIsCopied({...isCopied, [code]: true});
        
        setTimeout(() => {
          setIsCopied({...isCopied, [code]: false});
        }, 2000);
      })
      .catch(err => {
        console.error('Copy failed:', err);
        alert('Không thể sao chép mã. Vui lòng thử lại.');
      });
  };

  // Lọc voucher theo tab đang active
  const filteredVouchers = vouchers.filter(voucher => {
    if (activeTab === "expired") {
      return isExpired(voucher.endDate) || (voucher.usageLimit !== undefined && voucher.usageLimit <= voucher.usedCount);
    } else if (activeTab === "used") {
      return !isExpired(voucher.endDate) && voucher.usageLimit !== undefined && voucher.usageLimit > voucher.usedCount && isFullyUsedByUser(voucher);
    } else { // available
      return !isExpired(voucher.endDate) && (!voucher.usageLimit || voucher.usageLimit > voucher.usedCount) && !isFullyUsedByUser(voucher);
    }
  });

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 min-h-screen bg-gradient-to-b from-white to-gray-50/50">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 mb-3">Mã giảm giá</h1>
        <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 mx-auto rounded-full mb-4"></div>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Các mã giảm giá hiện có và còn hiệu lực mà bạn có thể sử dụng khi thanh toán
        </p>

        {/* Tab navigation - improved design */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg shadow-md bg-white border border-gray-200 divide-x divide-gray-200 overflow-hidden">
            <button
              onClick={() => setActiveTab("available")}
              className={`px-6 py-3 text-sm font-medium transition-all ${
                activeTab === "available" 
                  ? 'bg-gradient-to-r from-teal-500/10 to-emerald-500/10 text-teal-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 ${activeTab === "available" ? "text-teal-500" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Có thể dùng
              </div>
            </button>
            <button
              onClick={() => setActiveTab("used")}
              className={`px-6 py-3 text-sm font-medium transition-all ${
                activeTab === "used" 
                  ? 'bg-orange-50 text-orange-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 ${activeTab === "used" ? "text-orange-500" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Đã dùng
              </div>
            </button>
            <button
              onClick={() => setActiveTab("expired")}
              className={`px-6 py-3 text-sm font-medium transition-all ${
                activeTab === "expired" 
                  ? 'bg-gray-100 text-gray-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 ${activeTab === "expired" ? "text-gray-500" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Đã hết hạn
              </div>
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
              {activeTab === "expired" && "Không có mã giảm giá nào đã hết hạn hoặc hết lượt"}
            </h3>
            <p className="text-gray-600 mb-5">
              {activeTab === "available" && "Hiện chưa có mã giảm giá nào có thể sử dụng. Vui lòng quay lại sau."}
              {activeTab === "used" && "Bạn chưa sử dụng mã giảm giá nào hoặc bạn chưa đăng nhập."}
              {activeTab === "expired" && "Không có mã giảm giá nào đã hết hạn hoặc hết lượt sử dụng. Các mã hiện tại vẫn còn hiệu lực và còn lượt sử dụng."}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {filteredVouchers.map((voucher) => (
            <div 
              key={voucher.id} 
              className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all flex flex-col ${
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
                  <span 
                    onClick={() => activeTab === "available" && handleCopyVoucher(voucher.code)}
                    className={`text-white font-mono font-bold text-lg select-all ${
                      activeTab === "available" ? "cursor-pointer hover:bg-white/20 transition-colors rounded-sm px-1 py-0.5 flex items-center" : ""
                    }`}
                    title={activeTab === "available" ? "Nhấn để sao chép mã" : ""}
                  >
                    {voucher.code}
                    {activeTab === "available" && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    )}
                  </span>
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
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-gray-800 text-lg mb-2">{voucher.name}</h3>
                {voucher.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{voucher.description}</p>
                )}
                
                <div className="flex-1 flex flex-col">
                  {/* Key info section */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center text-xs text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>HSD: {formatDate(voucher.endDate)}</span>
                    </div>
                    
                    {voucher.userUsage && (
                      <div className="flex items-center text-xs text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Đã dùng: {voucher.userUsage.current}/{voucher.userUsage.limit}</span>
                      </div>
                    )}
                    
                    {voucher.maxDiscount && (
                      <div className="flex items-center text-xs text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Tối đa: {formatCurrency(voucher.maxDiscount)}</span>
                      </div>
                    )}
                    
                    {voucher.userLimit ? (
                      <div className="flex items-center text-xs text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{voucher.userLimit} lần/người</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-xs text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Vô hạn lần/người</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Usage bar if applicable */}
                  {voucher.usageLimit ? (
                    <div className="mb-4">
                      <div className="flex justify-between items-center text-xs text-gray-600 mb-1.5">
                        <span className="font-medium">Còn lại: {voucher.usageLimit - voucher.usedCount}/{voucher.usageLimit}</span>
                        <span className={`${voucher.usageLimit - voucher.usedCount < 10 ? 'text-red-600 font-medium' : ''}`}>
                          {calculateUsagePercentage(voucher.usedCount, voucher.usageLimit)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
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
                    <div className="mb-4 text-xs text-gray-600">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                        <span>Số lượng: Vô hạn</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Applicable products if any */}
                  {voucher.applicableProducts && voucher.applicableProducts.length > 0 && (
                    <div className="text-xs text-gray-500 mt-auto">
                      <span className="font-medium">Áp dụng cho: </span>
                      {voucher.applicableProducts.join(', ')}
                    </div>
                  )}

                  {/* Out of uses warning */}
                  {voucher.userUsage && voucher.userUsage.current >= voucher.userUsage.limit && activeTab === "available" && (
                    <div className="mt-auto mb-2 text-xs px-3 py-2 bg-red-50 rounded-md text-center text-red-600 font-medium">
                      Bạn đã sử dụng hết lượt
                    </div>
                  )}
                </div>
              </div>
              
              {/* Button area - always same height regardless of content */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 mt-auto">
                {activeTab === "available" && (
                  <div>
                    <div className="flex justify-between items-center text-xs text-gray-600 mb-1.5">
                      <span>{voucher.minOrder ? `Đơn tối thiểu: ${formatCurrency(voucher.minOrder)} | ` : ""}Đã dùng: {voucher.userUsage ? `${voucher.userUsage.current}/${voucher.userUsage.limit}` : '0/1'}</span>
                      <span>Còn {(voucher.userUsage ? voucher.userUsage.limit - voucher.userUsage.current : 1)} lượt</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"
                        style={{ width: `${voucher.userUsage ? (voucher.userUsage.current / voucher.userUsage.limit) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 text-center mt-2">
                      Nhấn vào mã để sao chép
                    </div>
                  </div>
                )}
                
                {activeTab === "used" && (
                  <div>
                    <div className="flex justify-between items-center text-xs text-gray-600 mb-1.5">
                      <span>{voucher.minOrder ? `Đơn tối thiểu: ${formatCurrency(voucher.minOrder)} | ` : ""}Đã dùng: {voucher.userUsage ? `${voucher.userUsage.current}/${voucher.userUsage.limit}` : '1/1'}</span>
                      <span className="text-orange-600 font-medium">Hết lượt dùng</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className="h-full rounded-full bg-orange-500"
                        style={{ width: '100%' }}
                      ></div>
                    </div>
                    <div className="w-full py-1.5 px-4 mt-2 rounded-md font-medium text-xs text-center text-orange-700 bg-orange-50">
                      Đã sử dụng hết số lần cho phép
                    </div>
                  </div>
                )}
                
                {activeTab === "expired" && (
                  <div>
                    <div className="flex justify-between items-center text-xs text-gray-600 mb-1.5">
                      <span>{voucher.minOrder ? `Đơn tối thiểu: ${formatCurrency(voucher.minOrder)} | ` : ""}Trạng thái: </span>
                      <span className="text-gray-600 font-medium">Hết hạn</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className="h-full rounded-full bg-gray-400"
                        style={{ width: '100%' }}
                      ></div>
                    </div>
                    <div className="w-full py-1.5 px-4 mt-2 rounded-md font-medium text-xs text-center text-gray-500 bg-gray-100">
                      {voucher.usageLimit !== undefined && voucher.usageLimit <= voucher.usedCount 
                        ? "Đã hết lượt sử dụng" 
                        : `Đã hết hạn vào ${formatDate(voucher.endDate)}`
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 