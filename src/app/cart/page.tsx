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
      {/* Page Header */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Giỏ hàng</h1>
          <p className="text-xl max-w-3xl">
            Xem lại và hoàn tất đơn hàng của bạn.
          </p>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Sản phẩm ({cart.length})</h2>
                
                {cart.length > 0 ? (
                  <div className="space-y-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex flex-col md:flex-row gap-4 border-b border-gray-200 pb-6">
                        <div className="md:w-1/4 h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={120}
                            height={120}
                            className="max-w-full h-auto"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/product-placeholder.svg';
                            }}
                          />
                        </div>
                        <div className="md:w-3/4">
                          <div className="flex flex-col md:flex-row md:justify-between">
                            <div>
                              <h3 className="text-xl font-bold">{item.name}</h3>
                              {item.version && <p className="text-gray-600">Phiên bản: {item.version}</p>}
                            </div>
                            <p className="text-xl font-bold text-primary-600">
                              {formatCurrency(item.price)}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center border rounded-md w-32">
                              <button 
                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-primary-600"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              >
                                -
                              </button>
                              <input
                                type="text"
                                value={item.quantity}
                                readOnly
                                className="w-12 h-10 text-center border-x"
                              />
                              <button 
                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-primary-600"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                            <button 
                              className="text-red-500 hover:text-red-700"
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
                  <div className="text-center py-12">
                    <p className="text-xl text-gray-600 mb-6">Giỏ hàng của bạn đang trống</p>
                    <Link href="/accounts" className="btn bg-primary-600 text-white px-4 py-2 rounded">
                      Tiếp tục mua sắm
                    </Link>
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/accounts"
                    className="btn border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded"
                  >
                    Tiếp tục mua sắm
                  </Link>
                  <button 
                    className="btn bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => clearCart()}
                  >
                    Xóa giỏ hàng
                  </button>
                </div>
              )}
            </div>
            
            {/* Order Summary */}
            {cart.length > 0 && (
              <div className="lg:w-1/3">
                <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                  <h2 className="text-2xl font-bold mb-6">Tóm tắt đơn hàng</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span>Tạm tính</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Thuế (10%)</span>
                      <span>{formatCurrency(tax)}</span>
                    </div>
                    {/* Coupon code input */}
                    <div className="pt-4 border-t border-gray-200">
                      <label htmlFor="coupon" className="block mb-2 font-semibold">
                        Mã khuyến mãi
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          id="coupon"
                          placeholder="Nhập mã khuyến mãi"
                          className="flex-grow border rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <button className="bg-primary-600 text-white px-4 py-2 rounded-r-md">
                          Áp dụng
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-b border-gray-200 py-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold">Tổng cộng</span>
                      <span className="text-2xl font-bold text-primary-600">{formatCurrency(total)}</span>
                    </div>
                  </div>
                  
                  <Link
                    href="/checkout"
                    className="btn bg-primary-600 text-white w-full mb-4 block text-center py-2 rounded"
                  >
                    Tiến hành thanh toán
                  </Link>
                  
                  <div className="text-center text-sm text-gray-600">
                    <p className="mb-2">Chúng tôi chấp nhận các phương thức thanh toán sau</p>
                    <div className="flex justify-center space-x-2 mt-3">
                      <div className="w-10 h-6 bg-gray-200 rounded"></div>
                      <div className="w-10 h-6 bg-gray-200 rounded"></div>
                      <div className="w-10 h-6 bg-gray-200 rounded"></div>
                      <div className="w-10 h-6 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recommended Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Bạn có thể quan tâm</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-primary-500 to-primary-700"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">Sản phẩm đề xuất {item}</h3>
                  <p className="text-gray-600 mb-4">
                    Mô tả ngắn gọn về sản phẩm và công dụng của nó đối với người dùng.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-primary-600">
                      {formatCurrency(1990000 * item)}
                    </span>
                    <button className="btn bg-primary-600 text-white px-4 py-2 rounded">
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