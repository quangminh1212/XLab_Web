"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productName = searchParams.get("product") || "Sản phẩm không xác định";
  const amountString = searchParams.get("amount") || "0";
  const amount = parseInt(amountString, 10);
  
  // Redirect to deposit page immediately
  useEffect(() => {
    if (productName && amount > 0) {
      router.push(`/account/deposit?amount=${amount}&product=${encodeURIComponent(productName)}`);
    }
  }, [productName, amount, router]);
  
  if (!productName || amount <= 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-6">Thông tin thanh toán không hợp lệ</h1>
        <p className="mb-6">Không tìm thấy thông tin sản phẩm hoặc số tiền thanh toán không chính xác.</p>
        <Link 
          href="/payment" 
          className="inline-block px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors"
        >
          Quay lại trang thanh toán
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang chuyển hướng đến trang thanh toán...</p>
        <p className="text-sm text-gray-500 mt-2">
          Sản phẩm: {productName} | Số tiền: {amount.toLocaleString('vi-VN')} ₫
        </p>
      </div>
    </div>
  );
} 