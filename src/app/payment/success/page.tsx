"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const productName = searchParams.get("product") || "Sản phẩm XLab";
  const amountString = searchParams.get("amount") || "0";
  const amount = parseInt(amountString, 10);
  
  const [orderNumber, setOrderNumber] = useState("");
  
  // Tạo mã đơn hàng giả lập
  useEffect(() => {
    // Tạo mã đơn hàng ngẫu nhiên với định dạng XL-xxxxxx
    const randomOrderNumber = "XL-" + Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(randomOrderNumber);
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Thanh toán thành công!</h1>
          <p className="text-gray-600">Cảm ơn bạn đã mua sản phẩm của XLab</p>
        </div>
        
        <div className="border-t border-b py-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Mã đơn hàng:</p>
              <p className="font-semibold">{orderNumber}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Ngày thanh toán:</p>
              <p className="font-semibold">{new Date().toLocaleDateString("vi-VN")}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Sản phẩm:</p>
              <p className="font-semibold">{productName}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Tổng tiền:</p>
              <p className="font-semibold text-blue-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md mb-6">
          <h2 className="font-semibold text-lg mb-2">Thông tin quan trọng</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Thông tin chi tiết về đơn hàng và hướng dẫn kích hoạt sản phẩm đã được gửi đến email của bạn.</li>
            <li>Bạn sẽ nhận được bản quyền phần mềm và thông tin truy cập trong vòng 24 giờ.</li>
            <li>Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi.</li>
          </ul>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
          <Link 
            href="/" 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-center"
          >
            Về trang chủ
          </Link>
          <Link 
            href="/products" 
            className="px-6 py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-center"
          >
            Xem thêm sản phẩm
          </Link>
        </div>
      </div>
    </div>
  );
} 