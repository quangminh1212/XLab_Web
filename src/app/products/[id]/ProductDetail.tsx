'use client'

import React from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Product as ProductType } from '@/models/ProductModel';
import { useCart } from '@/components/cart/CartContext';
import dynamic from 'next/dynamic';
import RichTextContent from '@/components/common/RichTextContent';
import { Product as UIProduct } from '@/types';

// Tải động component VoiceTypingDemo chỉ khi cần (khi sản phẩm là VoiceTyping)
const VoiceTypingDemo = dynamic(() => import('./VoiceTypingDemo'), {
  loading: () => <div className="animate-pulse h-40 bg-gray-100 rounded-lg"></div>,
  ssr: false // Tắt SSR vì component sử dụng Web Speech API chỉ hoạt động trên client
});

// Component hiển thị lợi ích của sản phẩm chỉ hiển thị trong trang chi tiết của website
const ProductBenefits = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 mt-6">
    <div className="p-4 rounded-lg shadow-sm border border-gray-100 bg-white">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-green-500 rounded-lg mb-3 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </div>
        <h3 className="text-center font-semibold text-gray-900 mb-2 text-sm">Giao hàng<br/>nhanh chóng</h3>
        <p className="text-xs text-gray-600 text-center">Giao tài khoản ngay trong vòng 5h sau khi nhận được thanh toán.</p>
      </div>
    </div>
    <div className="p-4 rounded-lg shadow-sm border border-gray-100 bg-white">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-orange-400 rounded-lg mb-3 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-7h-2c0-1-.5-1.5-1-2z"></path>
            <path d="M2 9v1c0 1.1.9 2 2 2h1"></path>
            <path d="M16 11a2 2 0 100-4 2 2 0 000 4z"></path>
          </svg>
        </div>
        <h3 className="text-center font-semibold text-gray-900 mb-2 text-sm">Rẻ nhất<br/>thị trường</h3>
        <p className="text-xs text-gray-600 text-center">Cam kết giá rẻ nhất thị trường, tiết kiệm lên đến 90% so với giá gốc.</p>
      </div>
    </div>
    <div className="p-4 rounded-lg shadow-sm border border-gray-100 bg-white">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-blue-500 rounded-lg mb-3 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
            <path d="M3.5 12.5l.5.5"></path>
            <path d="M20 12.5l.5.5"></path>
          </svg>
        </div>
        <h3 className="text-center font-semibold text-gray-900 mb-2 text-sm">Bảo hành<br/>1 đổi 1</h3>
        <p className="text-xs text-gray-600 text-center">Đổi tài khoản mới ngay trong 24h nếu tài khoản phát sinh lỗi.</p>
      </div>
    </div>
    <div className="p-4 rounded-lg shadow-sm border border-gray-100 bg-white">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-pink-500 rounded-lg mb-3 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
          </svg>
        </div>
        <h3 className="text-center font-semibold text-gray-900 mb-2 text-sm">Hỗ trợ<br/>nhanh chóng</h3>
        <p className="text-xs text-gray-600 text-center">Chúng tôi sẵn sàng hỗ trợ mọi khó khăn trong quá trình sử dụng tài khoản.</p>
      </div>
    </div>
  </div>
);

// Component hiển thị sản phẩm liên quan
const RelatedProducts = ({ currentProductId, categoryId }: { currentProductId: string | number, categoryId?: string | number }) => {
  // Trong trường hợp này chúng ta sẽ lấy dữ liệu từ API
  const [relatedProducts, setRelatedProducts] = useState<UIProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Tải sản phẩm liên quan từ API
    const fetchRelatedProducts = async () => {
      try {
        setIsLoading(true);
        
        // If no categoryId, try to get some random products instead
        const url = categoryId 
          ? `/api/products?categoryId=${categoryId}&exclude=${currentProductId}&limit=3`
          : `/api/products?exclude=${currentProductId}&limit=3`;
          
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
          setRelatedProducts(data.data);
        }
      } catch (err) {
        console.error('Error fetching related products:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRelatedProducts();
  }, [currentProductId, categoryId]);

  if (isLoading) {
    return (
      <div className="mt-8 pt-6 border-t border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Sản phẩm liên quan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
                <Image
                  src={product.imageUrl || '/images/placeholder/product-placeholder.jpg'}
                  alt={product.name}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-1 mt-1">{product.description}</p>
                <span className="text-xs font-medium text-primary-600 mt-1 block">
                  {product.salePrice === 0 ? 'Miễn phí' : formatCurrency(product.salePrice || product.price)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Component xử lý hiển thị mô tả sản phẩm với Rich Text Content
const ProductDescription = ({ description }: { description: string }) => {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-6">Thông tin chi tiết</h2>
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <div className="prose prose-sm sm:prose lg:prose-xl xl:prose-2xl max-w-none mx-auto">
          <RichTextContent content={description} className="product-description" />
        </div>
        
        <style jsx global>{`
          .product-description {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
          }
          
          .product-description img {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
            margin: 2rem auto;
            display: block;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          
          .product-description h2, 
          .product-description h3 {
            margin-top: 1.5rem;
            margin-bottom: 1rem;
            font-weight: 600;
          }
          
          .product-description p {
            margin-bottom: 1rem;
          }
          
          .product-description ul,
          .product-description ol {
            margin-left: 2rem;
            margin-bottom: 1.5rem;
            width: fit-content;
            max-width: 95%;
            margin: 0 auto 1.5rem auto;
          }
          
          .product-description li {
            margin-bottom: 0.75rem;
            line-height: 1.7;
          }
          
          .product-description p {
            line-height: 1.7;
          }
        `}</style>
      </div>
    </div>
  );
};

// Component hiển thị thông số kỹ thuật
const ProductSpecifications = ({ 
  specifications 
}: { 
  specifications?: { key: string, value: string }[] | { [key: string]: string } 
}) => {
  if (!specifications) return null;
  
  // Convert specifications từ object sang array nếu cần
  const specsArray = Array.isArray(specifications) 
    ? specifications 
    : Object.entries(specifications).map(([key, value]) => ({ key, value }));
  
  if (specsArray.length === 0) return null;
  
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-6">Thông số kỹ thuật</h2>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <table className="w-full border-collapse">
          <tbody>
            {specsArray.map((spec, index) => (
              <tr 
                key={index} 
                className={`${index < specsArray.length - 1 ? 'border-b' : ''} border-gray-200`}
              >
                <td className="py-3 w-1/3 font-medium text-gray-700">{spec.key}</td>
                <td className="py-3 text-gray-800">{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function ProductDetail({ product }: { product: ProductType }) {
  // Thêm class để đánh dấu khi component đã load xong
  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.classList.add('product-detail-loaded');
    }
  }, []);

  // Update document title khi component được render
  useEffect(() => {
    document.title = `${product.name} | XLab - Phần mềm và Dịch vụ`;
  }, [product.name]);

  // State để theo dõi số lượt xem
  const [viewCount, setViewCount] = useState(0);
  
  // State lưu số lượng sản phẩm
  const [quantity, setQuantity] = useState(1);
  
  // State để lưu phiên bản sản phẩm được chọn
  const [selectedVersion, setSelectedVersion] = useState(
    product.versions && product.versions.length > 0 ? product.versions[0].name : ''
  );
  
  // State quản lý tùy chọn mới
  const [newOptionText, setNewOptionText] = useState('');
  
  // State danh sách tùy chọn
  const [productOptions, setProductOptions] = useState(product.productOptions || []);
  
  // State hiển thị tùy chọn hiện có
  const [showOptions, setShowOptions] = useState(false);
  
  // Xử lý thêm tùy chọn mới
  const handleAddOption = () => {
    if (newOptionText.trim()) {
      setProductOptions([...productOptions, newOptionText.trim()]);
      setNewOptionText('');
    }
  };
  
  // Xử lý xóa tùy chọn
  const handleRemoveOption = (index: number) => {
    const newOptions = [...productOptions];
    newOptions.splice(index, 1);
    setProductOptions(newOptions);
  };
  
  // Lấy ảnh sản phẩm
  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      // Không sử dụng blob URLs
      if (typeof firstImage === 'string' && firstImage.startsWith('blob:')) {
        return '/images/placeholder/product-placeholder.jpg';
      }
      return typeof firstImage === 'string' ? firstImage : firstImage.url;
    }
    return '/images/placeholder/product-placeholder.jpg';
  };
  
  // Tính toán giá dựa trên phiên bản được chọn
  const calculatePrice = () => {
    if (!product.versions || product.versions.length === 0) {
      return 0; // Không có price trực tiếp trong ProductModel
    }
    
    const version = product.versions.find(v => v.name === selectedVersion);
    return version ? version.price : (product.versions[0]?.price || 0);
  };
  
  // Tính toán giá gốc nếu có
  const calculateOriginalPrice = () => {
    if (!product.versions || product.versions.length === 0) {
      return 0; // Không có salePrice trực tiếp trong ProductModel
    }
    
    const version = product.versions.find(v => v.name === selectedVersion);
    return version ? version.originalPrice : (product.versions[0]?.originalPrice || 0);
  };
  
  // Tính phần trăm giảm giá
  const calculateDiscountPercentage = () => {
    const originalPrice = calculateOriginalPrice();
    const price = calculatePrice();
    
    if (originalPrice > price) {
      return Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    return 0;
  };
  
  // Hook cart context
  const { addItem } = useCart();
  
  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    addItem({
      id: product.id.toString(),
      name: product.name,
      price: calculatePrice(),
      quantity: quantity,
      image: product.images && product.images.length > 0 ? 
             typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url : 
             '/images/placeholder/product-placeholder.jpg',
      options: selectedVersion ? [selectedVersion] : undefined
    });
    return true;
  };

  // Tăng số lượt xem khi người dùng truy cập trang
  useEffect(() => {
    // Tăng số lượt xem khi component được mount
    setViewCount(prev => prev + 1);
    
    // Trong ứng dụng thực tế, đây là nơi bạn sẽ gọi API để cập nhật số lượt xem
    console.log(`Đang xem sản phẩm: ${product.name}, Lượt xem: ${viewCount + 1}`);
  }, [product.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Kiểm tra xem có phải là sản phẩm tài khoản hay không
  const isAccount = product.categories?.some(cat => cat.id === 'tai-khoan-hoc-tap');
  
  // Xử lý tăng số lượng
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  // Xử lý giảm số lượng
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 product-detail-loaded">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm mb-4">
          <Link href="/" className="text-gray-500 hover:text-primary-600">
            Trang chủ
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link 
            href={isAccount ? "/categories/tai-khoan-hoc-tap" : "/products"} 
            className="text-gray-500 hover:text-primary-600"
          >
            {isAccount ? "Tài khoản học tập" : "Sản phẩm"}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-800">{product.name}</span>
        </div>
        
        {/* Product main info */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Product image */}
            <div className="flex flex-col">
              <div className="relative aspect-square bg-white rounded-lg overflow-hidden border border-gray-100">
                <Image
                  src={getProductImage()}
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              
              {/* Additional images */}
              {product.descriptionImages && product.descriptionImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {product.descriptionImages.slice(0, 4).map((img, index) => (
                    <div key={index} className="relative aspect-square bg-white rounded-lg overflow-hidden border border-gray-100">
                      <Image
                        src={img}
                        alt={`${product.name} - Hình ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product info */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{product.name}</h1>
              
              <div className="mt-4 flex items-center">
                <div className="text-2xl font-bold text-primary-600">
                  {calculatePrice() === 0 ? 'Miễn phí' : formatCurrency(calculatePrice())}
                </div>
                
                {calculateOriginalPrice() > calculatePrice() && (
                  <>
                    <div className="ml-3 text-lg text-gray-500 line-through">
                      {formatCurrency(calculateOriginalPrice())}
                    </div>
                    <div className="ml-2 bg-red-100 text-red-700 text-sm px-2 py-1 rounded">
                      -{calculateDiscountPercentage()}%
                    </div>
                  </>
                )}
              </div>
              
              {/* Tùy chọn loại sản phẩm - đưa lên đầu */}
              <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">Tùy chọn loại sản phẩm</h3>
                
                {/* Product options/versions */}
                {product.versions && product.versions.length > 1 && (
                  <div className="mb-3">
                    <div className="grid grid-cols-1 gap-1.5">
                      {product.versions.map((version) => (
                        <div 
                          key={version.name}
                          className={`
                            border rounded-md p-2 cursor-pointer transition flex items-center
                            ${selectedVersion === version.name 
                              ? 'border-primary-500 bg-primary-50' 
                              : 'border-gray-200 bg-white hover:border-gray-300'}
                          `}
                          onClick={() => setSelectedVersion(version.name)}
                        >
                          <div className="flex-1">
                            <div className="flex items-center">
                              <div className={`w-4 h-4 rounded-full border flex-shrink-0 mr-2 ${selectedVersion === version.name ? 'border-primary-500 bg-primary-500' : 'border-gray-300'}`}>
                                {selectedVersion === version.name && (
                                  <div className="w-2 h-2 bg-white rounded-full m-auto"></div>
                                )}
                              </div>
                              <span className="font-medium text-gray-900">{version.name}</span>
                            </div>
                            {version.description && (
                              <p className="mt-0.5 text-xs text-gray-500 ml-6">{version.description}</p>
                            )}
                          </div>
                          <span className="font-medium text-primary-600 ml-2 text-sm">
                            {formatCurrency(version.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Loại sản phẩm */}
                {product.productOptions && product.productOptions.length > 0 && (
                  <div className="mb-2">
                    <div className="mb-2 flex justify-between items-center">
                      <h4 className="font-medium text-gray-700 text-sm">Thêm tùy chọn</h4>
                      {productOptions.length > 0 && (
                        <button 
                          className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                          onClick={() => setShowOptions(!showOptions)}
                        >
                          {showOptions ? 'Ẩn tùy chọn' : 'Tùy chọn hiện có'}
                        </button>
                      )}
                    </div>
                    <div className="flex mb-2">
                      <div className="relative flex-1">
                        <input 
                          type="text"
                          placeholder="Nhập tùy chọn mới (VD: Full - Dùng riêng - 6 Tháng)"
                          className="block w-full bg-white border border-gray-300 px-3 py-2 text-sm rounded-l-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          value={newOptionText}
                          onChange={(e) => setNewOptionText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                        />
                      </div>
                      <button 
                        className="bg-primary-600 text-white px-3 py-2 text-sm rounded-r-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        onClick={handleAddOption}
                      >
                        Thêm
                      </button>
                    </div>
                    
                    {showOptions && productOptions.length > 0 && (
                      <div className="space-y-1">
                        {productOptions.map((option, index) => (
                          <div key={index} className="flex items-center justify-between bg-white p-2 rounded-md border border-gray-200 hover:border-gray-300 transition">
                            <div className="flex items-center flex-1">
                              <div className="w-4 h-4 rounded-full border border-green-500 bg-green-500 flex-shrink-0 mr-2 flex items-center justify-center">
                                <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </div>
                              <span className="font-medium text-gray-800 text-sm">{option}</span>
                            </div>
                            <button 
                              className="ml-1 text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition"
                              onClick={() => {
                                if (window.confirm(`Bạn có chắc muốn xóa tùy chọn "${option}"?`)) {
                                  handleRemoveOption(index);
                                }
                              }}
                              title="Xóa tùy chọn"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-1">Thiết lập các tùy chọn loại sản phẩm mà khách hàng có thể chọn khi mua hàng.</p>
                  </div>
                )}
              </div>
              
              <p className="mt-4 text-gray-600">{product.shortDescription || ''}</p>
              
              {/* Quantity selector */}
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-2">Số lượng:</h3>
                <div className="flex items-center">
                  <button 
                    onClick={decreaseQuantity}
                    className="w-10 h-10 rounded-l-lg bg-gray-100 flex items-center justify-center border border-gray-300"
                  >
                    <span className="text-xl">-</span>
                  </button>
                  <input 
                    type="number" 
                    value={quantity} 
                    readOnly
                    className="w-14 h-10 text-center border-t border-b border-gray-300"
                  />
                  <button 
                    onClick={increaseQuantity}
                    className="w-10 h-10 rounded-r-lg bg-gray-100 flex items-center justify-center border border-gray-300"
                  >
                    <span className="text-xl">+</span>
                  </button>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <button 
                  onClick={handleAddToCart}
                  className="px-4 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  Thêm vào giỏ hàng
                </button>
                <Link 
                  href="/cart" 
                  onClick={handleAddToCart}
                  className="px-4 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-center"
                >
                  Mua ngay
                </Link>
              </div>
              
              {/* Features list */}
              {product.features && product.features.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-medium text-gray-900 mb-2">Tính năng nổi bật:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="text-gray-600">
                        {typeof feature === 'string' ? feature : feature.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Product benefits banner */}
        <ProductBenefits />
        
        {/* Product description */}
        <div className="max-w-6xl mx-auto">
          <ProductDescription description={product.description} />
        </div>
        
        {/* Related products */}
        <RelatedProducts 
          currentProductId={product.id} 
          categoryId={product.categories && product.categories.length > 0 ? product.categories[0].id : undefined} 
        />
      </div>
    </div>
  );
} 