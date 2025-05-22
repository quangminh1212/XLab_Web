'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/components/cart/CartContext'
import { calculateCartTotals, formatCurrency } from '@/lib/utils'
import { useState, useEffect } from 'react'
// import { products } from '@/data/mockData' // Sử dụng API thay vì mock data
import { AiOutlineShoppingCart, AiOutlinePlus, AiOutlineMinus, AiOutlineDelete, AiOutlineTag, AiOutlineInfoCircle } from 'react-icons/ai'
import { motion } from 'framer-motion'

// Kết hợp interface CartItem từ CartContext và utils
interface CartItemWithVersion {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  version?: string;
  description?: string;
}

// Định nghĩa danh sách mã giảm giá
const AVAILABLE_COUPONS = [
  { code: 'WELCOME10', discount: 0.1, name: 'Giảm 10% cho đơn hàng đầu tiên' },
  { code: 'FREESHIP', discount: 30000, name: 'Miễn phí vận chuyển (30.000đ)' },
  { code: 'XLAB20', discount: 0.2, name: 'Giảm 20% cho sản phẩm XLab' }
];

export default function CartPage() {
  const { items: cartItems, removeItem: removeItemFromCart, updateQuantity: updateItemQuantity, clearCart, addItem: addItemToCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; name: string } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [showCouponInfo, setShowCouponInfo] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from API when component loads
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const result = await response.json();
        
        if (result.success && result.data) {
          setProducts(result.data);
        } else {
          console.error('Failed to fetch products:', result.error);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  
  // Enrich cart items with image and description from product data
  const cart = cartItems.map(item => {
    // Find product with multiple matching strategies 
    const productDetail = products.find((p: any) => {
      const productId = String(p.id).toLowerCase();
      const itemId = String(item.id).toLowerCase();
      const productName = String(p.name).toLowerCase();
      const itemName = String(item.name).toLowerCase();
      
      return productId === itemId || 
             productId === itemName ||
             productName === itemId ||
             productName === itemName ||
             p.slug === itemId ||
             p.slug === itemName;
    });
    
    // Get image URL - priority: product.images[0], item.image, fallback
    let imageUrl = '/images/placeholder/product-placeholder.svg';
    
    if (productDetail?.images && Array.isArray(productDetail.images) && productDetail.images.length > 0) {
      imageUrl = productDetail.images[0];
    } else if (item.image && !item.image.includes('placeholder')) {
      imageUrl = item.image;
    }
    
    // Get description from product data
    let description = '';
    if (productDetail?.shortDescription) {
      // Clean HTML tags from description
      description = productDetail.shortDescription.replace(/<[^>]*>/g, '').trim();
    } else if (productDetail?.description) {
      // Clean HTML tags and limit length  
      description = productDetail.description.replace(/<[^>]*>/g, '').trim().substring(0, 150) + '...';
    }
    
    return {
      ...item,
      image: imageUrl,
      description: description
    };
  });
  
  // Tính tổng giá trị giỏ hàng
  const { subtotal, tax } = calculateCartTotals(cart);
  
  // Tính giảm giá từ mã coupon
  const calculateCouponDiscount = () => {
    if (!appliedCoupon) return 0;
    
    // Nếu giảm giá là phần trăm
    if (appliedCoupon.discount < 1) {
      return subtotal * appliedCoupon.discount;
    }
    
    // Nếu giảm giá là số tiền cố định
    return appliedCoupon.discount;
  };
  
  const couponDiscount = calculateCouponDiscount();
  
  // Tính tổng cộng (đã trừ giảm giá)
  const total = subtotal + tax - couponDiscount;
  
  // Lấy sản phẩm được đề xuất (đánh dấu là featured)
  const featuredProducts = products.filter((product: any) => product.isFeatured).slice(0, 3);
  
  // Handle quantity change
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateItemQuantity(itemId, newQuantity);
    }
  };

  // Áp dụng mã giảm giá
  const applyPromoCode = () => {
    setCouponError('');
    
    if (!couponCode.trim()) {
      setCouponError('Vui lòng nhập mã giảm giá');
      return;
    }
    
    const foundCoupon = AVAILABLE_COUPONS.find(
      coupon => coupon.code === couponCode.toUpperCase()
    );
    
    if (foundCoupon) {
      setAppliedCoupon(foundCoupon);
      setCouponCode('');
    } else {
      setCouponError('Mã giảm giá không hợp lệ hoặc đã hết hạn');
    }
  };
  
  // Biểu tượng giỏ hàng trống
  const EmptyCartIcon = () => (
    <div className="relative w-32 h-32 mx-auto mb-6 text-gray-300">
      <AiOutlineShoppingCart className="w-full h-full stroke-1" />
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500"
      >
        <AiOutlinePlus className="w-8 h-8 rotate-45" />
      </motion.div>
    </div>
  );
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };
  
  // Show loading state when fetching products
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <section className="bg-gradient-to-r from-primary-600 to-primary-500 text-white py-10 md:py-16">
          <div className="container mx-auto px-4">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold">Giỏ hàng của bạn</h1>
              <p className="text-base md:text-lg max-w-3xl opacity-90">
                Đang tải thông tin sản phẩm...
              </p>
            </div>
          </div>
        </section>
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-500 text-white py-10 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="space-y-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold">Giỏ hàng của bạn</h1>
            <p className="text-base md:text-lg max-w-3xl opacity-90 whitespace-nowrap">
              Xem lại và hoàn tất đơn hàng để bắt đầu trải nghiệm các sản phẩm tuyệt vời của chúng tôi.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {cart.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
              {/* Cart Items */}
              <motion.div 
                className="lg:w-3/5"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="bg-white rounded-lg shadow-md p-5 md:p-6 mb-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl md:text-2xl font-bold">Sản phẩm trong giỏ</h2>
                    <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
                      {cart.length} sản phẩm
                    </span>
                  </div>
                  
                  <div className="space-y-5">
                    {cart.map((item) => (
                      <motion.div 
                        key={item.id} 
                        className="flex flex-col md:flex-row gap-4 border-b border-gray-200 pb-5"
                        variants={itemVariants}
                        whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                      >
                        {/* Hình ảnh sản phẩm - Tăng kích thước */}
                        <div className="md:w-1/4 aspect-square bg-gray-50 rounded-lg flex items-center justify-center p-3 border border-gray-100">
                          <Image
                            src={item.image || '/images/placeholder/product-placeholder.svg'}
                            alt={item.name}
                            width={120}
                            height={120}
                            className="w-full h-full object-contain transition-transform hover:scale-105"
                            onError={(e) => {
                              console.log('Lỗi tải ảnh:', item.image);
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/placeholder/product-placeholder.svg';
                            }}
                            unoptimized={true}
                          />
                        </div>
                        <div className="md:w-3/4 flex flex-col justify-between flex-grow">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                            <div>
                              <h3 className="text-lg font-bold text-gray-800 hover:text-primary-600 transition-colors">
                                <Link href={`/products/${item.id}`}>
                                  {item.name}
                                </Link>
                              </h3>
                              {item.version && (
                                <span className="text-sm text-gray-500">Phiên bản: {item.version}</span>
                              )}
                              {item.description && (
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                              )}
                            </div>
                            <p className="text-lg font-bold text-primary-600 mt-1 md:mt-0 md:ml-4 whitespace-nowrap">
                              {formatCurrency(item.price)}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-3 md:mt-4">
                            <div className="flex items-center border rounded-md border-gray-300 overflow-hidden">
                              <button 
                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-primary-600 hover:bg-gray-100 transition-colors"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                aria-label="Giảm số lượng"
                              >
                                <AiOutlineMinus className="w-4 h-4" />
                              </button>
                              <input
                                type="text"
                                value={item.quantity}
                                readOnly
                                className="w-12 h-8 text-center border-x border-gray-300 focus:outline-none"
                              />
                              <button 
                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-primary-600 hover:bg-gray-100 transition-colors"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                aria-label="Tăng số lượng"
                              >
                                <AiOutlinePlus className="w-4 h-4" />
                              </button>
                            </div>
                            <button 
                              className="flex items-center text-red-500 hover:text-red-700 transition-colors text-sm font-medium"
                              onClick={() => removeItemFromCart(item.id)}
                            >
                              <AiOutlineDelete className="w-4 h-4 mr-1" />
                              <span>Xóa</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/accounts"
                    className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-md text-sm font-medium transition-colors text-center"
                  >
                    Tiếp tục mua sắm
                  </Link>
                  <button 
                    className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-5 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                    onClick={() => clearCart()}
                  >
                    <AiOutlineDelete className="w-4 h-4 mr-2" />
                    Xóa giỏ hàng
                  </button>
                </div>
              </motion.div>
              
              {/* Order Summary */}
              <motion.div 
                className="lg:w-2/5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="bg-white rounded-lg shadow-md p-5 md:p-6 sticky top-20">
                  <h2 className="text-xl font-bold mb-5 pb-4 border-b border-gray-200">Tóm tắt đơn hàng</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tạm tính ({cart.reduce((total, item) => total + item.quantity, 0)} sản phẩm)</span>
                      <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                    
                    {/* Coupon code input */}
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <label htmlFor="coupon" className="flex items-center text-sm font-medium">
                          <AiOutlineTag className="mr-2" />
                          Mã khuyến mãi
                        </label>
                        <button 
                          className="text-xs text-primary-600 hover:text-primary-700 flex items-center"
                          onClick={() => setShowCouponInfo(!showCouponInfo)}
                        >
                          <AiOutlineInfoCircle className="mr-1" />
                          Mã khuyến mãi
                        </button>
                      </div>
                      
                      {showCouponInfo && (
                        <motion.div 
                          className="bg-gray-50 p-3 rounded-md mb-3 text-xs space-y-1.5"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <p className="font-medium">Mã khuyến mãi có sẵn:</p>
                          {AVAILABLE_COUPONS.map(coupon => (
                            <div key={coupon.code} className="flex justify-between">
                              <span className="font-mono text-primary-700">{coupon.code}</span>
                              <span>{coupon.name}</span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                      
                      {appliedCoupon ? (
                        <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-green-700 text-sm">{appliedCoupon.name}</p>
                            <p className="text-green-600 text-xs mt-1">Mã: {appliedCoupon.code}</p>
                          </div>
                          <button
                            onClick={() => setAppliedCoupon(null)}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <div className="flex">
                          <input
                            type="text"
                            id="coupon"
                            placeholder="Nhập mã khuyến mãi"
                            className="flex-grow border rounded-l-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-600 focus:border-primary-600"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          />
                          <button 
                            className="bg-primary-600 text-white px-4 py-2.5 rounded-r-md text-sm whitespace-nowrap hover:bg-primary-700 transition-colors"
                            onClick={applyPromoCode}
                          >
                            Áp dụng
                          </button>
                        </div>
                      )}
                      
                      {couponError && (
                        <p className="text-red-500 text-xs mt-1">{couponError}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tạm tính</span>
                      <span className="whitespace-nowrap">{formatCurrency(subtotal)}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between items-center text-green-600">
                        <span>Giảm giá</span>
                        <span className="whitespace-nowrap">-{formatCurrency(couponDiscount)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t border-b border-gray-200 py-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Tổng cộng</span>
                      <span className="text-xl font-bold text-primary-600 whitespace-nowrap">{formatCurrency(total)}</span>
                    </div>
                  </div>
                  
                  <Link
                    href="/checkout?skipInfo=true"
                    className="bg-primary-600 hover:bg-primary-700 text-white w-full mb-4 block text-center py-3 rounded-md text-base font-medium transition-colors"
                  >
                    Tiến hành thanh toán
                  </Link>
                  
                  <div className="text-center">
                    <p className="mb-2 text-sm text-gray-600">Chúng tôi chấp nhận</p>
                    <div className="flex justify-center space-x-2">
                      <Image src="/images/payment/visa.svg" alt="Visa" width={20} height={14} className="h-4" />
                      <Image src="/images/payment/mastercard.svg" alt="Mastercard" width={20} height={14} className="h-4" />
                      <Image src="/images/payment/momo.svg" alt="MoMo" width={16} height={14} className="h-4" />
                      <Image src="/images/payment/zalopay.svg" alt="ZaloPay" width={20} height={14} className="h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            /* Thiết kế mới cho giỏ hàng trống */
            <motion.div 
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-lg shadow-lg p-8 md:p-10 mb-6 text-center">
                <EmptyCartIcon />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Giỏ hàng của bạn đang trống</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá các sản phẩm của chúng tôi và bắt đầu mua sắm ngay.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/accounts"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md text-base font-medium transition-colors shadow-sm"
                  >
                    Xem danh sách sản phẩm
                  </Link>
                  <Link 
                    href="/categories"
                    className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 px-6 py-3 rounded-md text-base font-medium transition-colors"
                  >
                    Xem danh mục
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Sản phẩm đề xuất */}
      <section className="py-8 md:py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">
            {cart.length > 0 ? 'Sản phẩm bạn có thể quan tâm' : 'Sản phẩm đề xuất cho bạn'}
          </h2>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {featuredProducts.map((product) => (
              <motion.div 
                key={product.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                variants={itemVariants}
              >
                {/* Thay đổi thành hình vuông nhỏ hơn */}
                <div className="aspect-square bg-gradient-to-r from-gray-50 to-gray-100 relative overflow-hidden">
                  {/* Hình ảnh sản phẩm */}
                  <div className="w-full h-full flex items-center justify-center p-4">
                    <Image
                      src={
                        (product.images && Array.isArray(product.images) && product.images.length > 0) 
                          ? product.images[0] 
                          : product.imageUrl || '/images/placeholder/product-placeholder.jpg'
                      }
                      alt={product.name}
                      width={160}
                      height={160}
                      className="w-3/4 h-3/4 object-contain transition-transform group-hover:scale-110"
                      unoptimized={true}
                    />
                  </div>
                  {product.isNew && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      Mới
                    </div>
                  )}
                  {product.salePrice && product.salePrice < product.price && (
                    <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded">
                      -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                    </div>
                  )}
                </div>
                
                <div className="p-4 flex-grow flex flex-col">
                  <Link href={`/products/${product.id}`} className="group">
                    <h3 className="text-base font-bold mb-1 text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">{product.name}</h3>
                  </Link>
                  <p className="text-gray-600 text-xs mb-2 line-clamp-2 flex-grow">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    <div>
                      {(() => {
                        // Xác định giá hiển thị từ versions hoặc fallback
                        const displayPrice = (product.versions && product.versions.length > 0)
                          ? product.versions[0].price 
                          : product.salePrice || product.price;
                        const originalPrice = (product.versions && product.versions.length > 0)
                          ? product.versions[0].originalPrice 
                          : product.price;
                        
                        if (originalPrice && originalPrice > displayPrice) {
                          return (
                            <div className="flex items-center gap-2">
                              <span className="text-base font-bold text-primary-600 whitespace-nowrap">
                                {formatCurrency(displayPrice)}
                              </span>
                              <span className="text-xs text-gray-500 line-through whitespace-nowrap">
                                {formatCurrency(originalPrice)}
                              </span>
                            </div>
                          );
                        } else {
                          return (
                            <span className="text-base font-bold text-primary-600 whitespace-nowrap">
                              {formatCurrency(displayPrice)}
                            </span>
                          );
                        }
                      })()}
                    </div>
                    <button 
                      className="bg-primary-50 hover:bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs font-medium transition-colors border border-primary-200 flex items-center"
                      onClick={() => addItemToCart({
                        id: product.id.toString(),
                        name: product.name,
                        price: 
                          (product.versions && product.versions.length > 0) 
                            ? product.versions[0].price 
                            : product.salePrice || product.price,
                        quantity: 1,
                        image: 
                          (product.images && Array.isArray(product.images) && product.images.length > 0) 
                            ? product.images[0] 
                            : product.imageUrl || '/images/placeholder/product-placeholder.svg'
                      })}
                    >
                      <AiOutlinePlus className="mr-1 w-3 h-3" />
                      Thêm
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
} 