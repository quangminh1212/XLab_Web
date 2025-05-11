import React from 'react';
import { useRouter } from 'next/navigation';

type PaymentFormProps = {
  orderId?: string;
  amount?: number;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export default function PaymentForm({ orderId, amount = 0, onSuccess, onError }: PaymentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState('credit_card');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Giả lập xử lý thanh toán
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Giả lập thành công
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/payment/success');
      }
    } catch (error) {
      if (onError) {
        onError(error);
      } else {
        console.error('Lỗi thanh toán:', error);
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Thông tin thanh toán</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Số tiền</label>
          <div className="text-2xl font-bold">{amount.toLocaleString('vi-VN')} VNĐ</div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Phương thức thanh toán</label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="credit_card"
                name="payment_method"
                value="credit_card"
                checked={paymentMethod === 'credit_card'}
                onChange={() => setPaymentMethod('credit_card')}
                className="mr-2"
              />
              <label htmlFor="credit_card">Thẻ tín dụng/Ghi nợ</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="radio"
                id="bank_transfer"
                name="payment_method"
                value="bank_transfer"
                checked={paymentMethod === 'bank_transfer'}
                onChange={() => setPaymentMethod('bank_transfer')}
                className="mr-2"
              />
              <label htmlFor="bank_transfer">Chuyển khoản ngân hàng</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="radio"
                id="momo"
                name="payment_method"
                value="momo"
                checked={paymentMethod === 'momo'}
                onChange={() => setPaymentMethod('momo')}
                className="mr-2"
              />
              <label htmlFor="momo">Ví điện tử MoMo</label>
            </div>
          </div>
        </div>
        
        {paymentMethod === 'credit_card' && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="card_number">Số thẻ</label>
              <input
                type="text"
                id="card_number"
                placeholder="1234 5678 9012 3456"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="expiry">Ngày hết hạn</label>
                <input
                  type="text"
                  id="expiry"
                  placeholder="MM/YY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  placeholder="123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="name">Tên chủ thẻ</label>
              <input
                type="text"
                id="name"
                placeholder="NGUYEN VAN A"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </>
        )}
        
        {paymentMethod === 'bank_transfer' && (
          <div className="mb-6 p-4 bg-gray-100 rounded-md">
            <h3 className="font-bold mb-2">Thông tin chuyển khoản</h3>
            <p className="mb-1">Ngân hàng: BIDV</p>
            <p className="mb-1">Số tài khoản: 12345678900</p>
            <p className="mb-1">Chủ tài khoản: CÔNG TY TNHH XLAB</p>
            <p className="mb-1">Nội dung: Thanh toán đơn hàng {orderId || 'ORD12345'}</p>
          </div>
        )}
        
        {paymentMethod === 'momo' && (
          <div className="mb-6 p-4 bg-gray-100 rounded-md text-center">
            <h3 className="font-bold mb-2">Quét mã QR để thanh toán</h3>
            <div className="w-48 h-48 mx-auto bg-gray-300 flex items-center justify-center mb-2">
              <span className="text-sm">Mã QR MoMo</span>
            </div>
            <p className="text-sm">Hoặc chuyển tới số điện thoại: 0987654321</p>
          </div>
        )}
        
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          disabled={loading}
        >
          {loading ? 'Đang xử lý...' : 'Hoàn tất thanh toán'}
        </button>
      </form>
    </div>
  );
} 