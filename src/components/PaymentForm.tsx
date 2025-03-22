"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PaymentFormProps {
  amount: number;
  productName: string;
}

export default function PaymentForm({ amount, productName }: PaymentFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    address: "",
    city: "",
    zipCode: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim()
        .slice(0, 19);
    }

    // Format expiry date with /
    if (name === "expiryDate") {
      formattedValue = value
        .replace(/\//g, "")
        .replace(/(.{2})/, "$1/")
        .slice(0, 5);
    }

    setFormData({
      ...formData,
      [name]: formattedValue,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Redirect to success page
      router.push("/payment/success?product=" + encodeURIComponent(productName));
    } catch (err) {
      setError("Thanh toán thất bại. Vui lòng thử lại sau.");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 bg-primary-700 text-white">
          <h2 className="text-xl font-semibold">Thông tin đơn hàng</h2>
        </div>
        
        <div className="p-6 flex flex-col md:flex-row">
          <div className="md:w-1/2 md:pr-6 mb-6 md:mb-0">
            <div className="bg-secondary-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-medium text-primary-800 mb-2">Chi tiết sản phẩm</h3>
              <p className="text-primary-900 font-semibold mb-1">{productName}</p>
              <p className="text-primary-700 text-xl font-bold">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-primary-900 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-secondary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-primary-900 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-secondary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-primary-900 mb-1">
                  Số thẻ
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="XXXX XXXX XXXX XXXX"
                  required
                  maxLength={19}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-primary-900 mb-1">
                    Ngày hết hạn
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    required
                    maxLength={5}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-primary-900 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    required
                    maxLength={3}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-primary-900 mb-1">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-secondary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-primary-900 mb-1">
                    Thành phố
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-secondary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-primary-900 mb-1">
                    Mã bưu điện
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-secondary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-500 bg-red-50 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-600 hover:bg-primary-500 text-white py-3 px-4 rounded-md font-medium transition-colors disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  "Thanh toán ngay"
                )}
              </button>
            </form>
          </div>

          <div className="md:w-1/2 md:pl-6 border-t pt-6 md:pt-0 md:border-t-0 md:border-l border-secondary-200">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-primary-800 mb-2">Phương thức thanh toán</h3>
                <p className="text-primary-700">
                  Chúng tôi chấp nhận các phương thức thanh toán sau:
                </p>
                <div className="flex space-x-4 mt-3">
                  <div className="bg-secondary-50 px-3 py-1 rounded text-primary-600">Visa</div>
                  <div className="bg-secondary-50 px-3 py-1 rounded text-primary-600">Mastercard</div>
                  <div className="bg-secondary-50 px-3 py-1 rounded text-primary-600">JCB</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-primary-800 mb-2">Bảo mật thanh toán</h3>
                <p className="text-primary-700">
                  Mọi thông tin thanh toán của bạn được bảo mật tuyệt đối với chuẩn mã hóa SSL 256-bit.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-primary-800 mb-2">Cần hỗ trợ?</h3>
                <p className="text-primary-700">
                  Liên hệ với chúng tôi qua email <span className="font-medium">support@xlab.vn</span> hoặc gọi đến số <span className="font-medium">(84) 28 1234 5678</span> trong giờ làm việc.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 