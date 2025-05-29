"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function PaymentSuccessPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const productName = searchParams.get("product") || "Grok";
  const amountString = searchParams.get("amount") || "149000";
  const amount = parseInt(amountString, 10);
  const orderId = searchParams.get("orderId") || "";
  const transactionId = searchParams.get("transactionId") || "";
  
  // Định nghĩa giá đơn vị cho từng sản phẩm
  const getUnitPrice = (productName: string) => {
    const name = productName.toLowerCase();
    if (name.includes('chatgpt')) {
      return 149000; // Giá ChatGPT
    } else if (name.includes('grok')) {
      return 149000; // Giá Grok
    }
    return 149000; // Giá mặc định
  };
  
  const unitPrice = getUnitPrice(productName);
  // Tính số lượng dựa trên tổng tiền và giá đơn vị
  const calculatedQuantity = Math.round(amount / unitPrice);
  const quantityString = searchParams.get("quantity");
  const quantity = quantityString ? parseInt(quantityString, 10) : calculatedQuantity;
  
  const [orderNumber, setOrderNumber] = useState("");
  const [orderSaved, setOrderSaved] = useState(false);
  
  // Tạo mã đơn hàng giả lập và lưu đơn hàng
  useEffect(() => {
    let finalOrderNumber = "";
    
    if (orderId) {
      finalOrderNumber = orderId;
      setOrderNumber(orderId);
    } else {
      // Tạo mã đơn hàng ngẫu nhiên với định dạng XL-xxxxxx
      finalOrderNumber = "XL-" + Math.floor(100000 + Math.random() * 900000);
      setOrderNumber(finalOrderNumber);
    }

    // Lưu đơn hàng nếu có session và chưa lưu
    if (session?.user && !orderSaved && finalOrderNumber) {
      saveOrderToHistory(finalOrderNumber);
      setOrderSaved(true);
    }
  }, [orderId, session, orderSaved]);

  // Hàm lưu đơn hàng vào localStorage và gửi API
  const saveOrderToHistory = async (orderNumber: string) => {
    if (!session?.user?.email) return;

    // Lấy thông tin coupon discount từ URL params nếu có
    const couponDiscountString = searchParams.get("couponDiscount") || "0";
    const couponDiscount = parseInt(couponDiscountString, 10);

    const orderData = {
      id: orderNumber,
      userId: session.user.email,
      userName: session.user.name || 'Guest',
      userEmail: session.user.email,
      items: [{
        productId: productName.toLowerCase(),
        productName: productName,
        quantity: quantity,
        price: unitPrice,
        originalPrice: 500000,
        image: getProductImage(productName)
      }],
      totalAmount: amount,
      couponDiscount: couponDiscount, // Thêm thông tin voucher discount
      status: 'completed',
      paymentMethod: 'online',
      paymentStatus: 'paid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      transactionId: transactionId || '',
    };

    try {
      // Lưu vào localStorage
      const existingOrders = JSON.parse(localStorage.getItem(`orders_${session.user.email}`) || '[]');
      
      // Kiểm tra xem đơn hàng đã tồn tại chưa
      const orderExists = existingOrders.some((order: any) => order.id === orderNumber);
      
      if (!orderExists) {
        existingOrders.unshift(orderData); // Thêm vào đầu mảng
        localStorage.setItem(`orders_${session.user.email}`, JSON.stringify(existingOrders));
        
        // Gửi lên API để lưu database (trong production)
        try {
          await fetch('/api/orders/save', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
          });
        } catch (apiError) {
          console.error('Error saving order to API:', apiError);
          // Vẫn tiếp tục vì đã lưu vào localStorage
        }
        
        console.log('Order saved successfully:', orderData);
      }
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Hàm lấy ảnh sản phẩm
  const getProductImage = (productName: string) => {
    const name = productName.toLowerCase();
    if (name.includes('chatgpt')) {
      return '/images/products/chatgpt/8f03b3dc-86a9-49ef-9c61-ae5e6030f44b.png';
    } else if (name.includes('grok')) {
      return '/images/products/grok/95828df2-efbf-4ddf-aed5-ed1584954d69.png';
    }
    // Default fallback
    return null;
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Layout 2 cột */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Cột trái - Thông báo thành công và thông tin quan trọng */}
          <div className="space-y-6">
            {/* Header xác nhận thành công */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-green-600 mb-3">Thanh toán thành công!</h1>
                <p className="text-gray-600 text-lg">Cảm ơn bạn đã tin tướng và sử dụng dịch vụ của chúng tôi</p>
              </div>
            </div>

            {/* Thông tin quan trọng */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
                <h3 className="font-semibold text-teal-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Thông tin quan trọng
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-teal-700">
                  <li>Thông tin chi tiết về đơn hàng và hướng dẫn kích hoạt sản phẩm đã được gửi đến email của bạn.</li>
                  <li>Bạn sẽ nhận được bản quyền phần mềm và thông tin truy cập trong vòng <strong>24 giờ</strong>.</li>
                  <li>Vui lòng kiểm tra hộp thư spam nếu không thấy email trong hộp thư chính.</li>
                  <li>Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi.</li>
                </ul>
              </div>
            </div>

            {/* Action buttons */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/" 
                  className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors text-center shadow-lg"
                >
                  Về trang chủ
                </Link>
                <Link 
                  href="/products" 
                  className="px-8 py-3 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 rounded-lg font-semibold transition-colors text-center"
                >
                  Xem thêm sản phẩm
                </Link>
              </div>
            </div>
          </div>

          {/* Cột phải - Tóm tắt đơn hàng */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tóm tắt đơn hàng</h2>
            
            {/* Thông tin sản phẩm */}
            <div className="border-b pb-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {getProductImage(productName) ? (
                    <img 
                      src={getProductImage(productName)!} 
                      alt={productName}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-600 font-bold text-xl">
                      {productName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800">{productName}</h3>
                  <p className="text-gray-600">Phiên bản: <span className="font-medium">Premium</span></p>
                  <p className="text-gray-600">Số lượng: <span className="font-medium">{quantity}</span></p>
                  <p className="text-gray-600">Đơn giá: <span className="font-medium">{formatCurrency(unitPrice)}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600">{formatCurrency(amount)}</p>
                  <p className="text-sm text-gray-500">{formatCurrency(unitPrice)} × {quantity}</p>
                </div>
              </div>
            </div>

            {/* Tổng cộng */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính ({quantity} × {formatCurrency(unitPrice)})</span>
                <span>{formatCurrency(amount)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-xl font-bold text-gray-800">
                  <span>Tổng cộng</span>
                  <span className="text-primary-600">{formatCurrency(amount)}</span>
                </div>
              </div>
            </div>

            {/* Thông tin đơn hàng */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Thông tin đơn hàng</h3>
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Mã đơn hàng:</p>
                  <p className="font-semibold text-gray-800">{orderNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600">Ngày thanh toán:</p>
                  <p className="font-semibold text-gray-800">{new Date().toLocaleDateString("vi-VN")}</p>
                </div>
                {transactionId && (
                  <div>
                    <p className="text-gray-600">Mã giao dịch:</p>
                    <p className="font-semibold text-gray-800">{transactionId}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-600">Trạng thái:</p>
                  <p className="font-semibold text-green-600">Đã thanh toán</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer support */}
        <div className="max-w-7xl mx-auto mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Cần hỗ trợ? Liên hệ với chúng tôi qua{" "}
            <a href="mailto:support@xlab.vn" className="text-primary-600 hover:underline font-medium">
              support@xlab.vn
            </a>
            {" "}hoặc hotline{" "}
            <a href="tel:1900123456" className="text-primary-600 hover:underline font-medium">
              1900 123 456
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 