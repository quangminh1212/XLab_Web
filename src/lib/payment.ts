/**
 * Các phương thức thanh toán được hỗ trợ
 */
export type PaymentMethod = 'bank_transfer' | 'momo' | 'zalopay' | 'vnpay' | 'paypal' | 'cod';

export interface PaymentOption {
  id: PaymentMethod;
  name: string;
  description: string;
  icon: string;
  isOnline: boolean;
  isAvailable: boolean;
  processingFee?: number;
  processingTime?: string;
}

/**
 * Danh sách phương thức thanh toán
 */
export const paymentMethods: PaymentOption[] = [
  {
    id: 'bank_transfer',
    name: 'Chuyển khoản ngân hàng',
    description: 'Chuyển khoản trực tiếp đến tài khoản ngân hàng của chúng tôi',
    icon: '/images/payment/bank.svg',
    isOnline: true,
    isAvailable: true,
    processingTime: '1-24 giờ sau khi xác nhận'
  },
  {
    id: 'momo',
    name: 'Ví MoMo',
    description: 'Thanh toán qua ví điện tử MoMo',
    icon: '/images/payment/momo.svg',
    isOnline: true,
    isAvailable: true,
    processingFee: 0.0,
    processingTime: 'Ngay lập tức'
  },
  {
    id: 'zalopay',
    name: 'ZaloPay',
    description: 'Thanh toán qua ví điện tử ZaloPay',
    icon: '/images/payment/zalopay.svg',
    isOnline: true,
    isAvailable: true,
    processingFee: 0.0,
    processingTime: 'Ngay lập tức'
  },
  {
    id: 'vnpay',
    name: 'VNPay',
    description: 'Thanh toán qua cổng thanh toán VNPay',
    icon: '/images/payment/vnpay.svg',
    isOnline: true,
    isAvailable: true,
    processingFee: 0.0,
    processingTime: 'Ngay lập tức'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Thanh toán qua PayPal (USD)',
    icon: '/images/payment/paypal.svg',
    isOnline: true,
    isAvailable: true,
    processingFee: 0.0,
    processingTime: 'Ngay lập tức'
  },
  {
    id: 'cod',
    name: 'Thanh toán khi nhận hàng (COD)',
    description: 'Chỉ áp dụng cho sản phẩm vật lý',
    icon: '/images/payment/cod.svg',
    isOnline: false,
    isAvailable: false,
    processingTime: 'Khi giao hàng'
  }
];

/**
 * Lấy thông tin phương thức thanh toán theo ID
 */
export const getPaymentMethod = (id: PaymentMethod): PaymentOption | undefined => {
  return paymentMethods.find(method => method.id === id);
};

/**
 * Lấy danh sách phương thức thanh toán có sẵn
 */
export const getAvailablePaymentMethods = (): PaymentOption[] => {
  return paymentMethods.filter(method => method.isAvailable);
};

/**
 * Tạo URL thanh toán cho phương thức được chọn
 */
export const createPaymentUrl = (
  method: PaymentMethod, 
  orderId: string, 
  amount: number, 
  returnUrl: string
): string => {
  // Trong môi trường thực tế, cần tích hợp API từ các nhà cung cấp dịch vụ thanh toán
  // Ở đây chỉ mô phỏng việc tạo URL
  
  switch (method) {
    case 'bank_transfer':
      return `/payment/bank?orderId=${orderId}&amount=${amount}&return=${encodeURIComponent(returnUrl)}`;
    case 'momo':
      return `/payment/momo?orderId=${orderId}&amount=${amount}&return=${encodeURIComponent(returnUrl)}`;
    case 'zalopay':
      return `/payment/zalopay?orderId=${orderId}&amount=${amount}&return=${encodeURIComponent(returnUrl)}`;
    case 'vnpay':
      return `/payment/vnpay?orderId=${orderId}&amount=${amount}&return=${encodeURIComponent(returnUrl)}`;
    case 'paypal':
      return `/payment/paypal?orderId=${orderId}&amount=${amount}&return=${encodeURIComponent(returnUrl)}`;
    case 'cod':
      return `/payment/cod?orderId=${orderId}&return=${encodeURIComponent(returnUrl)}`;
    default:
      throw new Error(`Phương thức thanh toán không hợp lệ: ${method}`);
  }
};

/**
 * Xử lý thanh toán
 */
export const processPayment = async (
  method: PaymentMethod,
  orderId: string,
  amount: number
): Promise<{ success: boolean; redirectUrl?: string; message?: string }> => {
  // Trong ứng dụng thực, đây sẽ là nơi gọi API thanh toán
  // Hiện tại chỉ mô phỏng các kết quả thanh toán
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const successUrl = `/payment/success?orderId=${orderId}`;
      
      switch (method) {
        case 'bank_transfer':
          resolve({
            success: true,
            message: 'Vui lòng chuyển khoản theo thông tin đã cung cấp',
            redirectUrl: successUrl
          });
          break;
        case 'momo':
        case 'zalopay':
        case 'vnpay':
        case 'paypal':
          resolve({
            success: true,
            redirectUrl: `${method}://payment?amount=${amount}&orderId=${orderId}&return=${encodeURIComponent(successUrl)}`
          });
          break;
        case 'cod':
          resolve({
            success: true,
            message: 'Đặt hàng thành công, bạn sẽ thanh toán khi nhận hàng',
            redirectUrl: successUrl
          });
          break;
        default:
          resolve({
            success: false,
            message: 'Phương thức thanh toán không hợp lệ'
          });
      }
    }, 800); // Giả lập độ trễ mạng
  });
}; 