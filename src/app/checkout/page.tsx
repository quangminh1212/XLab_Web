import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Thanh toán | XLab - Phần mềm và Dịch vụ',
  description: 'Thanh toán đơn hàng của bạn tại XLab - Phần mềm và Dịch vụ',
}

// This would normally come from a state management solution or API
const cartItems = [
  {
    id: 'business-suite',
    name: 'XLab Business Suite',
    version: 'Chuyên nghiệp',
    price: 4990000,
    quantity: 1,
    image: '/images/products/business-suite.svg',
  },
  {
    id: 'security-pro',
    name: 'XLab Security Pro',
    version: 'Cơ bản',
    price: 1990000,
    quantity: 1,
    image: '/images/products/security-pro.svg',
  },
]

export default function CheckoutPage() {
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  return (
    <div>
      {/* Page Header */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Thanh toán</h1>
          <p className="text-xl max-w-3xl">
            Hoàn tất đơn hàng của bạn với các phương thức thanh toán an toàn.
          </p>
        </div>
      </section>

      {/* Checkout Process */}
      <section className="py-16">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Checkout Forms */}
            <div className="lg:w-2/3">
              {/* Billing Information */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Thông tin thanh toán</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstname" className="block mb-2 font-semibold">
                      Họ
                    </label>
                    <input
                      type="text"
                      id="firstname"
                      className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastname" className="block mb-2 font-semibold">
                      Tên
                    </label>
                    <input
                      type="text"
                      id="lastname"
                      className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 font-semibold">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block mb-2 font-semibold">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block mb-2 font-semibold">
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      id="address"
                      className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block mb-2 font-semibold">
                      Thành phố
                    </label>
                    <input
                      type="text"
                      id="city"
                      className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block mb-2 font-semibold">
                      Quốc gia
                    </label>
                    <select
                      id="country"
                      className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    >
                      <option value="vietnam">Việt Nam</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2 h-5 w-5 text-primary-600 focus:ring-primary-500"
                    />
                    <span>Lưu thông tin này cho lần thanh toán sau</span>
                  </label>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Phương thức thanh toán</h2>
                
                <div className="space-y-4">
                  {/* Credit Card */}
                  <div className="border rounded-md p-4 hover:border-primary-600 cursor-pointer">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        value="credit"
                        className="mr-2 h-5 w-5 text-primary-600 focus:ring-primary-500"
                        defaultChecked
                      />
                      <span className="font-semibold">Thẻ tín dụng/ghi nợ</span>
                    </label>
                    
                    <div className="mt-4 pl-7">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label htmlFor="cardnumber" className="block mb-2">
                            Số thẻ
                          </label>
                          <input
                            type="text"
                            id="cardnumber"
                            placeholder="1234 5678 9012 3456"
                            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                          />
                        </div>
                        <div>
                          <label htmlFor="expiration" className="block mb-2">
                            Ngày hết hạn
                          </label>
                          <input
                            type="text"
                            id="expiration"
                            placeholder="MM/YY"
                            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                          />
                        </div>
                        <div>
                          <label htmlFor="cvv" className="block mb-2">
                            Mã bảo mật (CVV)
                          </label>
                          <input
                            type="text"
                            id="cvv"
                            placeholder="123"
                            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <div className="flex space-x-2">
                          <div className="w-10 h-6 bg-gray-200 rounded"></div>
                          <div className="w-10 h-6 bg-gray-200 rounded"></div>
                          <div className="w-10 h-6 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bank Transfer */}
                  <div className="border rounded-md p-4 hover:border-primary-600 cursor-pointer">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        value="bank"
                        className="mr-2 h-5 w-5 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="font-semibold">Chuyển khoản ngân hàng</span>
                    </label>
                    <p className="text-gray-600 text-sm mt-2 pl-7">
                      Chuyển khoản đến tài khoản ngân hàng của chúng tôi. Vui lòng sử dụng mã đơn hàng của bạn làm tham chiếu thanh toán.
                    </p>
                  </div>
                  
                  {/* Digital Wallet */}
                  <div className="border rounded-md p-4 hover:border-primary-600 cursor-pointer">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        value="wallet"
                        className="mr-2 h-5 w-5 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="font-semibold">Ví điện tử</span>
                    </label>
                    <div className="flex space-x-4 mt-2 pl-7">
                      <div className="w-16 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">Momo</div>
                      <div className="w-16 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">VNPay</div>
                      <div className="w-16 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">ZaloPay</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Điều khoản và điều kiện</h2>
                
                <div className="bg-gray-50 p-4 rounded-md mb-4 max-h-48 overflow-y-auto text-sm text-gray-600">
                  <p className="mb-2">
                    Bằng việc tiến hành thanh toán, bạn đồng ý với các điều khoản dịch vụ và chính sách bảo mật của chúng tôi.
                  </p>
                  <p className="mb-2">
                    1. Giấy phép phần mềm là vĩnh viễn và được cấp cho một người dùng.
                  </p>
                  <p className="mb-2">
                    2. Bạn có quyền cài đặt phần mềm trên nhiều thiết bị nhưng chỉ một người được phép sử dụng.
                  </p>
                  <p className="mb-2">
                    3. Bạn sẽ nhận được cập nhật miễn phí trong vòng 12 tháng kể từ ngày mua.
                  </p>
                  <p className="mb-2">
                    4. Hoàn tiền trong vòng 30 ngày nếu sản phẩm không đáp ứng nhu cầu của bạn.
                  </p>
                  <p>
                    5. Thông tin cá nhân của bạn sẽ được bảo mật theo chính sách bảo mật của chúng tôi.
                  </p>
                </div>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 h-5 w-5 text-primary-600 focus:ring-primary-500"
                  />
                  <span>Tôi đã đọc và đồng ý với điều khoản và điều kiện</span>
                </label>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Tóm tắt đơn hàng</h2>
                
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex py-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={60}
                          height={60}
                          className="max-w-full h-auto"
                          onError={(e) => {
                            e.currentTarget.src = '/images/product-placeholder.svg'
                          }}
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="text-gray-600 text-sm">Phiên bản: {item.version}</p>
                        <div className="flex justify-between mt-1">
                          <span className="text-gray-600 text-sm">x{item.quantity}</span>
                          <span className="font-semibold text-primary-600">{formatCurrency(item.price)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3 pt-4 mb-6">
                  <div className="flex justify-between">
                    <span>Tạm tính</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thuế (10%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                </div>
                
                <div className="border-t border-b border-gray-200 py-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">Tổng cộng</span>
                    <span className="text-2xl font-bold text-primary-600">{formatCurrency(total)}</span>
                  </div>
                </div>
                
                <button
                  className="btn bg-primary-600 text-white w-full mb-4"
                >
                  Hoàn tất thanh toán
                </button>
                
                <p className="text-center text-sm text-gray-600">
                  Giao dịch của bạn được bảo mật bởi SSL
                </p>
                
                <div className="mt-6">
                  <Link href="/cart" className="flex items-center text-primary-600 hover:text-primary-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Quay lại giỏ hàng
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 