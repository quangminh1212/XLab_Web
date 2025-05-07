'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/components/ui/CartContext'
import { calculateCartTotals, formatCurrency } from '@/lib/utils'
import { useState } from 'react'

export default function CartPage() {
  const { cart, removeItemFromCart, updateItemQuantity, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  
  // Calculate cart totals
  const { subtotal, tax, total } = calculateCartTotals(cart);
  
  // Handle quantity change
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateItemQuantity(itemId, newQuantity);
    }
  };
  
  return (
    <div>
      {/* Page Header - Giảm padding từ py-16 xuống py-10 */}
      <section className="bg-primary-600 text-white py-8 md:py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Giỏ hàng</h1>
          <p className="text-base md:text-lg max-w-3xl">
            Xem lại và hoàn tất đơn hàng của bạn.
          </p>
        </div>
      </section>

      {/* Cart Content - Giảm padding từ py-16 xuống py-8 */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
            {/* Cart Items - Tăng kích thước trên màn hình lớn */}
            <div className="lg:w-3/5">
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-4 md:mb-6">
                <h2 className="text-xl font-bold mb-4">Sản phẩm ({cart.length})</h2>
                
                {cart.length > 0 ? (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex flex-col md:flex-row gap-3 border-b border-gray-200 pb-4">
                        {/* Giảm kích thước hình ảnh và container */}
                        <div className="md:w-1/5 h-24 md:h-28 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="max-w-full h-auto object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/product-placeholder.svg';
                            }}
                          />
                        </div>
                        <div className="md:w-4/5 flex flex-col justify-between">
                          <div className="flex flex-col md:flex-row md:justify-between">
                            <div>
                              <h3 className="text-lg font-bold">{item.name}</h3>
                              {item.version && <p className="text-sm text-gray-600">Phiên bản: {item.version}</p>}
                            </div>
                            <p className="text-lg font-bold text-primary-600 mt-1 md:mt-0">
                              {formatCurrency(item.price)}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-2 md:mt-4">
                            <div className="flex items-center border rounded-md w-24">
                              <button 
                                className="w-7 h-8 flex items-center justify-center text-gray-600 hover:text-primary-600"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              >
                                -
                              </button>
                              <input
                                type="text"
                                value={item.quantity}
                                readOnly
                                className="w-10 h-8 text-center border-x"
                              />
                              <button 
                                className="w-7 h-8 flex items-center justify-center text-gray-600 hover:text-primary-600"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                            <button 
                              className="text-red-500 hover:text-red-700 text-sm"
                              onClick={() => removeItemFromCart(item.id)}
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-lg text-gray-600 mb-4">Giỏ hàng của bạn đang trống</p>
                    <Link href="/accounts" className="bg-primary-600 text-white px-4 py-2 rounded text-sm">
                      Tiếp tục mua sắm
                    </Link>
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/accounts"
                    className="border border-gray-300 bg-white text-gray-700 px-3 py-2 rounded text-sm text-center"
                  >
                    Tiếp tục mua sắm
                  </Link>
                  <button 
                    className="bg-red-500 text-white px-3 py-2 rounded text-sm"
                    onClick={() => clearCart()}
                  >
                    Xóa giỏ hàng
                  </button>
                </div>
              )}
            </div>
            
            {/* Order Summary - Giảm kích thước so với phần giỏ hàng */}
            {cart.length > 0 && (
              <div className="lg:w-2/5">
                <div className="bg-white rounded-lg shadow-md p-4 md:p-6 sticky top-20">
                  <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span>Tạm tính</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    {/* Coupon code input */}
                    <div className="pt-3 border-t border-gray-200">
                      <label htmlFor="coupon" className="block mb-2 font-medium text-sm">
                        Mã khuyến mãi
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          id="coupon"
                          placeholder="Nhập mã khuyến mãi"
                          className="flex-grow border rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-600"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <button className="bg-primary-600 text-white px-3 py-2 rounded-r-md text-sm whitespace-nowrap">
                          Áp dụng
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-b border-gray-200 py-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Tổng cộng</span>
                      <span className="text-xl font-bold text-primary-600">{formatCurrency(total)}</span>
                    </div>
                  </div>
                  
                  <Link
                    href="/checkout"
                    className="bg-primary-600 text-white w-full mb-3 block text-center py-2 rounded text-sm md:text-base font-medium"
                  >
                    Tiến hành thanh toán
                  </Link>
                  
                  <div className="text-center text-xs text-gray-600">
                    <p className="mb-2">Chúng tôi chấp nhận các phương thức thanh toán sau</p>
                    <div className="flex justify-center space-x-2 mt-2">
                      <div className="w-8 h-5 bg-gray-200 rounded"></div>
                      <div className="w-8 h-5 bg-gray-200 rounded"></div>
                      <div className="w-8 h-5 bg-gray-200 rounded"></div>
                      <div className="w-8 h-5 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recommended Products - Giảm padding từ py-16 xuống */}
      <section className="py-6 md:py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold mb-4 md:mb-6">Bạn có thể quan tâm</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-36 bg-gradient-to-r from-primary-500 to-primary-700"></div>
                <div className="p-4">
                  <h3 className="text-base font-bold mb-2">Sản phẩm đề xuất {item}</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Mô tả ngắn gọn về sản phẩm và công dụng của nó đối với người dùng.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-primary-600">
                      {formatCurrency(1990000 * item)}
                    </span>
                    <button className="bg-primary-600 text-white px-3 py-1.5 rounded text-xs">
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
} 