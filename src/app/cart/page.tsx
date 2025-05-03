<<<<<<< HEAD
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Giỏ hàng | XLab - Phần mềm và Dịch vụ',
  description: 'Giỏ hàng của bạn tại XLab - Phần mềm và Dịch vụ',
}

// This would normally come from a state management solution like Redux or Context API
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

export default function CartPage() {
  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
=======
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/lib/CartContext';
import { formatCurrency } from '@/lib/utils';

// Định nghĩa interface cho cart item
interface CartItem {
  id: string;
  name: string;
  version: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CartPage() {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    isLoading, 
    subtotal, 
    tax, 
    total 
  } = useCart();
  
  // Cập nhật tiêu đề trang
  useEffect(() => {
    document.title = 'Giỏ hàng | XLab - Phần mềm và Dịch vụ';
  }, []);
  
  // Phần loading
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-gray-600">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
>>>>>>> 2aea817a
  }
  
  return (
    <div>
      {/* Page Header */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Giỏ hàng</h1>
          <p className="text-xl max-w-3xl">
            Xem lại và hoàn tất đơn hàng của bạn.
          </p>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-16">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Sản phẩm ({cartItems.length})</h2>
                
                {cartItems.length > 0 ? (
                  <div className="space-y-6">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex flex-col md:flex-row gap-4 border-b border-gray-200 pb-6">
                        <div className="md:w-1/4 h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={120}
                            height={120}
                            className="max-w-full h-auto"
                            onError={(e) => {
                              e.currentTarget.src = '/images/product-placeholder.svg'
                            }}
                          />
                        </div>
                        <div className="md:w-3/4">
                          <div className="flex flex-col md:flex-row md:justify-between">
                            <div>
                              <h3 className="text-xl font-bold">{item.name}</h3>
                              <p className="text-gray-600">Phiên bản: {item.version}</p>
                            </div>
                            <p className="text-xl font-bold text-primary-600">
                              {formatCurrency(item.price)}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center border rounded-md w-32">
<<<<<<< HEAD
                              <button className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-primary-600">
=======
                              <button 
                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-primary-600"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
>>>>>>> 2aea817a
                                -
                              </button>
                              <input
                                type="text"
                                value={item.quantity}
                                readOnly
                                className="w-12 h-10 text-center border-x"
                              />
<<<<<<< HEAD
                              <button className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-primary-600">
                                +
                              </button>
                            </div>
                            <button className="text-red-500 hover:text-red-700">
=======
                              <button 
                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-primary-600"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                            <button 
                              className="text-red-500 hover:text-red-700"
                              onClick={() => removeFromCart(item.id)}
                            >
>>>>>>> 2aea817a
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
                    <Link href="/products" className="btn bg-primary-600 text-white">
                      Tiếp tục mua sắm
                    </Link>
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/products"
                    className="btn border border-gray-300 bg-white text-gray-700"
                  >
                    Tiếp tục mua sắm
                  </Link>
<<<<<<< HEAD
                  <button className="btn bg-red-500 text-white">
=======
                  <button 
                    className="btn bg-red-500 text-white"
                    onClick={clearCart}
                  >
>>>>>>> 2aea817a
                    Xóa giỏ hàng
                  </button>
                </div>
              )}
            </div>
            
            {/* Order Summary */}
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
                  className="btn bg-primary-600 text-white w-full mb-4"
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
          </div>
        </div>
      </section>

      {/* Recommended Products */}
      <section className="py-16 bg-gray-50">
        <div className="container">
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
                    <button className="btn bg-primary-600 text-white">
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