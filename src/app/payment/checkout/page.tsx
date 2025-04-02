"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import PaymentForm from "@/components/PaymentForm";
import Link from "next/link";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productName = searchParams.get("product") || "Sản phẩm XLab";
  const amountString = searchParams.get("amount") || "0";
  const amount = parseInt(amountString, 10);
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    email: ""
  });
  
  const [errors, setErrors] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    email: ""
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo({
      ...paymentInfo,
      [name]: value
    });
    
    // Xóa thông báo lỗi khi người dùng nhập lại
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };
  
  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    // Kiểm tra số thẻ
    if (!/^\d{16}$/.test(paymentInfo.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = "Số thẻ không hợp lệ";
      valid = false;
    }
    
    // Kiểm tra tên chủ thẻ
    if (!paymentInfo.cardHolder.trim()) {
      newErrors.cardHolder = "Vui lòng nhập tên chủ thẻ";
      valid = false;
    }
    
    // Kiểm tra ngày hết hạn
    if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) {
      newErrors.expiryDate = "Định dạng MM/YY";
      valid = false;
    } else {
      const [month, year] = paymentInfo.expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      if (parseInt(year, 10) < currentYear || 
          (parseInt(year, 10) === currentYear && parseInt(month, 10) < currentMonth) ||
          parseInt(month, 10) > 12 || parseInt(month, 10) < 1) {
        newErrors.expiryDate = "Ngày hết hạn không hợp lệ";
        valid = false;
      }
    }
    
    // Kiểm tra CVV
    if (!/^\d{3,4}$/.test(paymentInfo.cvv)) {
      newErrors.cvv = "CVV không hợp lệ";
      valid = false;
    }
    
    // Kiểm tra email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentInfo.email)) {
      newErrors.email = "Email không hợp lệ";
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsProcessing(true);
      
      // Giả lập quá trình thanh toán
      setTimeout(() => {
        setIsProcessing(false);
        // Chuyển hướng đến trang thanh toán thành công
        router.push(`/payment/success?product=${encodeURIComponent(productName)}&amount=${amount}`);
      }, 2000);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Thanh toán</h1>
        
        <div className="mb-8 p-4 bg-gray-50 rounded-md">
          <h2 className="text-xl font-semibold mb-2">Thông tin đơn hàng</h2>
          <p className="text-gray-700 mb-1"><span className="font-medium">Sản phẩm:</span> {productName}</p>
          <p className="text-gray-700 mb-1"><span className="font-medium">Tổng tiền:</span> <span className="text-blue-600 font-semibold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}</span></p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              type="email"
              id="email"
              name="email"
              placeholder="example@xlab.com"
              value={paymentInfo.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cardNumber">
              Số thẻ
            </label>
            <input
              className={`w-full px-3 py-2 border rounded-md ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
              type="text"
              id="cardNumber"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={paymentInfo.cardNumber}
              onChange={handleChange}
              maxLength="16"
            />
            {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cardHolder">
              Tên chủ thẻ
            </label>
            <input
              className={`w-full px-3 py-2 border rounded-md ${errors.cardHolder ? 'border-red-500' : 'border-gray-300'}`}
              type="text"
              id="cardHolder"
              name="cardHolder"
              placeholder="NGUYEN VAN A"
              value={paymentInfo.cardHolder}
              onChange={handleChange}
            />
            {errors.cardHolder && <p className="text-red-500 text-xs mt-1">{errors.cardHolder}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="expiryDate">
                Ngày hết hạn
              </label>
              <input
                className={`w-full px-3 py-2 border rounded-md ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
                type="text"
                id="expiryDate"
                name="expiryDate"
                placeholder="MM/YY"
                value={paymentInfo.expiryDate}
                onChange={handleChange}
                maxLength="5"
              />
              {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cvv">
                CVV
              </label>
              <input
                className={`w-full px-3 py-2 border rounded-md ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                type="text"
                id="cvv"
                name="cvv"
                placeholder="123"
                value={paymentInfo.cvv}
                onChange={handleChange}
                maxLength="4"
              />
              {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full py-3 font-semibold rounded-md ${isProcessing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white transition-colors`}
          >
            {isProcessing ? 'Đang xử lý...' : 'Thanh toán ngay'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Thanh toán được bảo mật bởi XLab</p>
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function CheckoutLoading() {
  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-6 w-48 bg-gray-200 rounded mb-8"></div>
        <div className="h-24 w-full max-w-md bg-gray-200 rounded mb-8"></div>
        <div className="h-40 w-full max-w-md bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent />
    </Suspense>
  );
} 