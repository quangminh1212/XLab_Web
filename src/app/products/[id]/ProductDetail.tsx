'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/types';
import ProductImage from '@/components/product/ProductImage';
import { products } from '@/data/mockData';
import { useCart } from '@/components/cart/CartContext';

// Component hiển thị yêu cầu hệ thống
const SystemRequirements = () => (
  <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
    <h3 className="text-sm font-medium text-gray-700 mb-2">Yêu cầu hệ thống</h3>
    <ul className="text-xs text-gray-600 space-y-1">
      <li>• Windows 10 hoặc mới hơn</li>
      <li>• 2 GB RAM tối thiểu</li>
      <li>• 100 MB dung lượng ổ cứng</li>
      <li>• Kết nối internet</li>
    </ul>
  </div>
);

// Component hiển thị nút chia sẻ
const SocialShareButtons = () => (
  <div className="mt-6 pt-4 border-t border-gray-100">
    <h3 className="text-sm font-medium text-gray-600 mb-2">Chia sẻ sản phẩm này</h3>
    <div className="flex space-x-3">
      <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1.02-1.1h3.2V.5h-4.3c-4.3 0-5.3 3.4-5.3 5.57v1.4H6v4.08h3.12V24h5.38V11.55h3.62l.47-4.08z" />
        </svg>
      </button>
      <button className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.1 10.1 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.16a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      </button>
      <button className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21.593 7.203a2.506 2.506 0 00-1.762-1.766c-1.566-.43-7.83-.437-7.83-.437s-6.265-.007-7.832.404a2.56 2.56 0 00-1.766 1.778c-.413 1.566-.417 4.814-.417 4.814s-.004 3.264.406 4.814c.23.857.905 1.534 1.763 1.765 1.582.43 7.83.437 7.83.437s6.265.007 7.831-.403a2.5 2.5 0 001.767-1.763c.414-1.565.417-4.812.417-4.812s.02-3.265-.407-4.831z" />
          <path fill="#fff" d="M9.996 15.005l5.227-3.005-5.227-3.005v6.01z" />
        </svg>
      </button>
      <button className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm0-2C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.848 12.459l.741-.741c.161-.161.161-.425 0-.586l-.741-.741c-.161-.161-.425-.161-.586 0l-.741.741-.741-.741c-.161-.161-.425-.161-.586 0l-.741.741c-.161.161-.161.425 0 .586l.741.741-.741.741c-.161.161-.161.425 0 .586l.741.741c.161.161.425.161.586 0l.741-.741.741.741c.161.161.425.161.586 0l.741-.741c.161-.161.161-.425 0-.586l-.741-.741zM7 14.12c-.882 0-1.6.728-1.6 1.6 0 .881.718 1.6 1.6 1.6.881 0 1.6-.719 1.6-1.6 0-.871-.719-1.6-1.6-1.6zm0-8c.881 0 1.6.718 1.6 1.6 0 .881-.719 1.6-1.6 1.6-.882 0-1.6-.719-1.6-1.6 0-.882.718-1.6 1.6-1.6z" />
        </svg>
      </button>
    </div>
  </div>
);

// Component hiển thị sản phẩm liên quan
const RelatedProducts = ({ currentProductId, categoryId }: { currentProductId: string | number, categoryId: string | number }) => {
  // Lọc sản phẩm cùng danh mục nhưng không phải sản phẩm hiện tại
  const relatedProducts = products
    .filter(p => p.categoryId === categoryId && p.id !== currentProductId)
    .slice(0, 3); // Chỉ lấy tối đa 3 sản phẩm

  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-gray-100">
      <h2 className="text-xl font-semibold mb-4">Sản phẩm liên quan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {relatedProducts.map((product) => (
          <Link 
            key={product.id} 
            href={`/products/${product.id}`}
            className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-white rounded-md overflow-hidden flex items-center justify-center">
                <ProductImage
                  images={[product.imageUrl || '/images/product-placeholder.svg']}
                  name={product.name}
                  aspectRatio="square"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-1 mt-1">{product.description}</p>
                <span className="text-xs font-medium text-primary-600 mt-1 block">
                  {product.price === 0 ? 'Miễn phí' : formatCurrency(product.salePrice || product.price)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Component hiển thị lợi ích của sản phẩm
const ProductBenefits = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 mt-6">
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-center font-semibold text-gray-900 mb-2 text-sm">Giao hàng<br/>nhanh chóng</h3>
      <p className="text-xs text-gray-600 text-center">Giao tài khoản ngay trong vòng 5h sau khi nhận được thanh toán.</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-center font-semibold text-gray-900 mb-2 text-sm">Rẻ nhất<br/>thị trường</h3>
      <p className="text-xs text-gray-600 text-center">Cam kết giá rẻ nhất thị trường, tiết kiệm lên đến 90% so với giá gốc.</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-center font-semibold text-gray-900 mb-2 text-sm">Bảo hành<br/>1 đổi 1</h3>
      <p className="text-xs text-gray-600 text-center">Đổi tài khoản mới ngay trong 24h nếu tài khoản phát sinh lỗi.</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-center font-semibold text-gray-900 mb-2 text-sm">Hỗ trợ<br/>nhanh chóng</h3>
      <p className="text-xs text-gray-600 text-center">Chúng tôi sẵn sàng hỗ trợ mọi khó khăn trong quá trình sử dụng tài khoản.</p>
    </div>
  </div>
);

export default function ProductDetail({ product }: { product: Product }) {
  // Update document title khi component được render
  useEffect(() => {
    document.title = `${product.name} | XLab - Phần mềm và Dịch vụ`;
  }, [product.name]);

  // State để theo dõi số lượt xem
  const [viewCount, setViewCount] = useState(product.viewCount || 0);
  
  // State để lưu loại sản phẩm được chọn
  const [selectedOption, setSelectedOption] = useState(
    product.options && product.options.length > 0 ? product.options[0].name : ''
  );
  
  // Tính toán giá dựa trên option được chọn
  const calculatePrice = () => {
    if (!product.options || product.options.length === 0) {
      return product.salePrice || product.price;
    }
    
    const option = product.options.find(opt => opt.name === selectedOption);
    return option ? option.price : (product.salePrice || product.price);
  };
  
  // Hook cart context
  const { addItem } = useCart();
  
  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    const selectedProduct = products.find(p => p.id === product.id);
    if (selectedProduct) {
      addItem({
        id: selectedProduct.id.toString(),
        name: selectedProduct.name,
        price: calculatePrice(),
        quantity: 1,
        image: selectedProduct.imageUrl,
        options: selectedOption ? [selectedOption] : undefined
      });
      return true;
    }
    return false;
  };

  // Tăng số lượt xem khi người dùng truy cập trang
  useEffect(() => {
    // Tăng số lượt xem khi component được mount
    setViewCount(prev => prev + 1);
    
    // Trong ứng dụng thực tế, đây là nơi bạn sẽ gọi API để cập nhật số lượt xem
    console.log(`Đang xem sản phẩm: ${product.name}, Lượt xem: ${viewCount + 1}`);
  }, [product.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Kiểm tra xem có phải là sản phẩm tài khoản hay không
  const isAccount = product.isAccount || product.type === 'account';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm mb-4">
          <Link href="/" className="text-gray-500 hover:text-primary-600">
            Trang chủ
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link 
            href={isAccount ? "/accounts" : "/products"} 
            className="text-gray-500 hover:text-primary-600"
          >
            {isAccount ? "Tài khoản" : "Sản phẩm"}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>

        {/* Sản phẩm chính */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Phần hình ảnh bên trái */}
              <div className="w-full lg:w-2/5">
                <div className="bg-white p-4 border border-gray-200 rounded-lg">
                  <div className="relative pt-[100%]">
                    <Image
                      src={product.imageUrl || '/images/product-placeholder.svg'}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-contain rounded-md"
                      priority
                    />
                  </div>
                </div>
              </div>
              
              {/* Thông tin sản phẩm bên phải */}
              <div className="w-full lg:w-3/5">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
                
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg 
                        key={star} 
                        className={`w-4 h-4 ${star <= Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-1 text-sm text-gray-500">({Math.round(product.downloadCount / 5)} đánh giá)</span>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-primary-600">
                      {formatCurrency(calculatePrice())}
                    </span>
                    {product.price > calculatePrice() && (
                      <span className="ml-2 text-gray-500 line-through text-lg">
                        {formatCurrency(product.price)}
                      </span>
                    )}
                    {product.price > calculatePrice() && (
                      <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-sm font-medium rounded">
                        Giảm {Math.round(((product.price - calculatePrice()) / product.price) * 100)}%
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-700 mb-4">{product.description}</p>
                </div>
                
                {/* Hiển thị tính năng nổi bật */}
                {product.features && product.features.length > 0 && (
                  <div className="mb-6">
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-5 h-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Dropdown chọn loại tài khoản nếu là tài khoản */}
                {isAccount && product.options && product.options.length > 0 && (
                  <div className="mb-6">
                    <label htmlFor="account-type" className="block text-sm font-medium text-gray-700 mb-2">
                      Tài khoản
                    </label>
                    <div className="relative">
                      <select
                        id="account-type"
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                      >
                        {product.options.map((option, index) => (
                          <option key={index} value={option.name}>
                            {option.name} - {formatCurrency(option.price)}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Nút thêm vào giỏ hàng */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <button
                    onClick={handleAddToCart}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Thêm vào giỏ hàng
                  </button>
                </div>
                
                {/* Thông tin thêm cho tài khoản */}
                {isAccount && (
                  <div className="border-t border-gray-200 pt-4 mt-4 text-sm text-gray-600">
                    <p className="mb-2">
                      <span className="font-medium text-gray-700">Thời gian giao hàng:</span> Trong vòng 5 giờ sau khi thanh toán thành công
                    </p>
                    <p className="mb-2">
                      <span className="font-medium text-gray-700">Bảo hành:</span> Bảo hành 1 đổi 1 trong thời gian sử dụng
                    </p>
                    <p className="mb-2">
                      <span className="font-medium text-gray-700">Hỗ trợ:</span> 24/7 qua email và chat
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Hiển thị lợi ích của sản phẩm */}
        {isAccount && <ProductBenefits />}
        
        {/* Nội dung chi tiết */}
        <div className="bg-white rounded-lg shadow overflow-hidden p-6 md:p-8">
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: product.longDescription }} />
          </div>
        </div>
        
        {/* Sản phẩm tương tự */}
        <div className="bg-white rounded-lg shadow overflow-hidden p-6 md:p-8">
          <h2 className="text-xl font-bold mb-4">Sản phẩm tương tự</h2>
          <RelatedProducts currentProductId={product.id} categoryId={product.categoryId} />
        </div>
      </div>
      
      {/* Nút quay về */}
      <div className="mt-6">
        <Link 
          href={isAccount ? "/accounts" : "/products"} 
          className="text-primary-600 hover:underline flex items-center"
        >
          <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại danh sách {isAccount ? "tài khoản" : "sản phẩm"}
        </Link>
      </div>
    </div>
  );
} 