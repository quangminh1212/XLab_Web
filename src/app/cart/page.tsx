'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/components/cart/CartContext'
import { calculateCartTotals, formatCurrency } from '@/lib/utils'
import { useState } from 'react'
import { products } from '@/data/mockData'
import { useRecentlyViewed } from '@/contexts/RecentlyViewedContext'

// Kết hợp interface CartItem từ CartContext và utils
interface CartItemWithVersion {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  version?: string;
}

export default function CartPage() {
  const { items: cartItems, removeItem: removeItemFromCart, updateQuantity: updateItemQuantity, clearCart, addItem: addItemToCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const { recentProducts } = useRecentlyViewed();
  
  // Chuyển đổi items thành định dạng phù hợp với calculateCartTotals
  const cart = cartItems.map(item => ({
    ...item,
    image: item.image || '/images/product-placeholder.svg'
  }));
  
  // Calculate cart totals
  const { subtotal, tax, total } = calculateCartTotals(cart);
  
  // Lấy sản phẩm được đề xuất (đánh dấu là featured)
  const featuredProducts = products.filter(product => product.isFeatured).slice(0, 3);
  
  // Handle quantity change
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateItemQuantity(itemId, newQuantity);
    }
  };

  // Hàm thêm sản phẩm vào giỏ hàng
  const handleAddToCart = (product: any) => {
    addItemToCart({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      quantity: 1,
      image: product.imageUrl
    });
    alert('Đã thêm sản phẩm vào giỏ hàng!');
  };

  // Biểu tượng giỏ hàng trống
  const EmptyCartIcon = () => (
    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4 text-gray-300">
      <path d="M2 3H4.5L6.5 17H17.5L21.5 7M9 21C9 21.5523 8.55228 22 8 22C7.44772 22 7 21.5523 7 21C7 20.4477 7.44772 20 8 20C8.55228 20 9 20.4477 9 21ZM20 21C20 21.5523 19.5523 22 19 22C18.4477 22 18 21.5523 18 21C18 20.4477 18.4477 20 19 20C19.5523 20 20 20.4477 20 21Z" 
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3"/>
      <path d="M13 9L11 11M11 9L13 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
  
  return (
    <div>
      {/* Page Header */}
      <section className="bg-primary-600 text-white py-8 md:py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Giỏ hàng</h1>
          <p className="text-base md:text-lg max-w-3xl">
            Xem lại và hoàn tất đơn hàng của bạn.
          </p>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4">
          {cart.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
              {/* Cart Items */}
              <div className="lg:w-3/5">
                <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-4 md:mb-6">
                  <h2 className="text-xl font-bold mb-4">Sản phẩm ({cart.length})</h2>
                  
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex flex-col md:flex-row gap-3 border-b border-gray-200 pb-4">
                        {/* Hình ảnh sản phẩm */}
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
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/products"
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
              </div>
              
              {/* Order Summary */}
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
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8 text-center">
              <EmptyCartIcon />
              <h2 className="text-xl font-bold mb-2">Giỏ hàng trống</h2>
              <p className="text-gray-600 mb-4">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
              <Link
                href="/products"
                className="bg-primary-600 text-white px-6 py-2 rounded-md text-sm md:text-base font-medium inline-block"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Recently Viewed Products */}
      {recentProducts.length > 0 && (
        <section className="py-6 md:py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-bold mb-4">Sản phẩm đã xem gần đây</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recentProducts.slice(0, 4).map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <Link href={`/products/${product.id}`} className="block">
                    <div className="aspect-square relative">
                      <Image 
                        src={product.imageUrl || '/images/product-placeholder.svg'} 
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-contain p-4"
                      />
                    </div>
                  </Link>
                  <div className="p-4 border-t">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-medium mb-1 line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
                    </Link>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-lg font-bold text-primary-600">
                        {formatCurrency(product.salePrice || product.price)}
                      </div>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="bg-primary-600 text-white p-1.5 rounded-full hover:bg-primary-700"
                        aria-label="Thêm vào giỏ hàng"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-6 md:py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold mb-4">Sản phẩm đề xuất</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <Link href={`/products/${product.id}`} className="block">
                  <div className="aspect-square relative">
                    <Image 
                      src={product.imageUrl || '/images/product-placeholder.svg'} 
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-contain p-4"
                    />
                  </div>
                </Link>
                <div className="p-4 border-t">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-medium mb-1 line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
                  </Link>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-lg font-bold text-primary-600">
                      {formatCurrency(product.salePrice || product.price)}
                    </div>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="bg-primary-600 text-white p-1.5 rounded-full hover:bg-primary-700"
                      aria-label="Thêm vào giỏ hàng"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 