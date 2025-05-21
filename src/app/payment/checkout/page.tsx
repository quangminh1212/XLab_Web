"use client";

import { useSearchParams } from "next/navigation";
import PaymentForm from "@/components/payment/PaymentForm";
import Link from "next/link";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const productName = searchParams.get("product") || "Sản phẩm không xác định";
  const amountString = searchParams.get("amount") || "0";
  const amount = parseInt(amountString, 10);
  
  if (!productName || amount <= 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-6">Thông tin thanh toán không hợp lệ</h1>
        <p className="mb-6">Không tìm thấy thông tin sản phẩm hoặc số tiền thanh toán không chính xác.</p>
        <Link 
          href="/payment" 
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          Quay lại trang thanh toán
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Thanh toán đơn hàng</h1>
      
      <div className="mb-6 text-center">
        <Link href="/payment" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Quay lại danh sách sản phẩm
        </Link>
      </div>
      
      <PaymentForm amount={amount} productName={productName} />
      
      <div className="mt-12 text-center text-sm text-gray-600">
        <p>Thông tin thanh toán của bạn được bảo mật theo tiêu chuẩn PCI DSS.</p>
        <p className="mt-2">Nếu bạn có thắc mắc về việc thanh toán, vui lòng liên hệ đội ngũ hỗ trợ của chúng tôi qua <a href="mailto:support@xlab.vn" className="text-blue-600 hover:underline">support@xlab.vn</a>.</p>
      </div>
    </div>
  );
} 