"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Voucher {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: "percentage" | "fixed";
  value: number;
  endDate: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

export default function PublicVouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    alert(`Đã sao chép mã: ${code}`);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-3">Mã giảm giá công khai</h1>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-4"></div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Các mã giảm giá hiện có và còn hiệu lực mà bạn có thể sử dụng khi thanh toán
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : vouchers.length === 0 ? (
        <div className="text-center">
          <div className="bg-gray-50 rounded-lg p-8 shadow-sm">
            <svg 
              className="mx-auto h-16 w-16 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Không có mã giảm giá nào</h3>
            <p className="mt-2 text-sm text-gray-500">
              Hiện chưa có mã giảm giá công khai nào. Vui lòng quay lại sau.
            </p>
            <div className="mt-6">
              <Link 
                href="/" 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Quay lại trang chủ
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vouchers.map((voucher) => (
            <div 
              key={voucher.id} 
              className="bg-gradient-to-br from-white to-blue-50 border border-blue-200 rounded-lg shadow-sm p-4 hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span 
                      className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-mono font-bold px-3 py-2 rounded-md shadow cursor-pointer select-all text-lg hover:shadow-md transition-all" 
                      onClick={() => handleCopyVoucher(voucher.code)} 
                      title="Nhấn để sao chép mã"
                    >
                      {voucher.code}
                    </span>
                    <span className={`text-sm font-medium ${voucher.type === "percentage" ? 'text-purple-700 bg-purple-50 border border-purple-200' : 'text-amber-700 bg-amber-50 border border-amber-200'} rounded-full px-3 py-1 ml-2 shadow-sm`}>
                      {voucher.type === "percentage" ? `${voucher.value}%` : formatCurrency(voucher.value)}
                    </span>
                  </div>
                  <div className="font-semibold text-gray-800 mb-2">{voucher.name}</div>
                  {voucher.description && (
                    <div className="text-gray-600 text-sm mb-2">{voucher.description}</div>
                  )}
                  <div className="text-xs font-medium text-gray-600 bg-gray-100 inline-block px-2 py-1 rounded-full">Hiệu lực đến: {formatDate(voucher.endDate)}</div>
                </div>
                <button
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-md font-medium text-sm shadow transition-all hover:shadow-md"
                  onClick={() => handleCopyVoucher(voucher.code)}
                >
                  Sao chép
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 