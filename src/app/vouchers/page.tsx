"use client";

import React, { useEffect, useState } from "react";

interface Coupon {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: "percentage" | "fixed";
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

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/admin/coupons");
        const data = await response.json();
        // Lọc chỉ lấy mã công khai, đang hoạt động, chưa hết hạn
        const now = new Date();
        const publicCoupons = (data.coupons || []).filter(
          (c: Coupon) =>
            c.isPublic &&
            c.isActive &&
            new Date(c.startDate) <= now &&
            new Date(c.endDate) >= now
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
    navigator.clipboard.writeText(code);
    alert("Đã copy mã: " + code);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-2 min-h-screen">
      <h1 className="text-2xl font-bold text-primary-700 mb-6 text-center">Mã giảm giá</h1>
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
                    <span className="bg-primary-500 text-white font-mono font-bold px-3 py-1.5 rounded select-all text-lg">{coupon.code}</span>
                    <button 
                      onClick={() => handleCopy(coupon.code)}
                      className="ml-2 bg-primary-200 text-primary-700 hover:bg-primary-300 p-1.5 rounded-md flex items-center justify-center transition-all"
                      title="Sao chép mã"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </button>
                  </div>
                  <span className="text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2 py-0.5">{coupon.type === "percentage" ? `${coupon.value}%` : formatCurrency(coupon.value)}</span>
                </div>
                <div className="font-semibold text-gray-800 mb-1">{coupon.name}</div>
                {coupon.description && <div className="text-gray-600 text-sm mb-1">{coupon.description}</div>}
                <div className="text-xs text-gray-500">Hiệu lực: {formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}</div>
                <div className="text-xs text-gray-500">Số lượt dùng còn lại: {coupon.usageLimit ? coupon.usageLimit - coupon.usedCount : 'Không giới hạn'}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 