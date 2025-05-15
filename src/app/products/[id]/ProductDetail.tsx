'use client'

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
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
          <RichTextContent content={description} className="product-description" />
        </div>
        
        <style jsx global>{`
          .product-description img {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
            margin: 1.5rem 0;
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
            margin-left: 1.5rem;
            margin-bottom: 1rem;
          }
          
          .product-description li {
            margin-bottom: 0.5rem;
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
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
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
                    <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
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
              
              <p className="mt-4 text-gray-600">{product.shortDescription || ''}</p>
              
              {/* Product options/versions */}
              {product.versions && product.versions.length > 1 && (
                <div className="mt-6">
                  <h3 className="font-medium text-gray-900 mb-2">Chọn phiên bản:</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {product.versions.map((version) => (
                      <div 
                        key={version.name}
                        className={`
                          border rounded-lg p-3 cursor-pointer transition
                          ${selectedVersion === version.name 
                            ? 'border-primary-500 bg-primary-50' 
                            : 'border-gray-200 hover:border-gray-300'}
                        `}
                        onClick={() => setSelectedVersion(version.name)}
                      >
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-900">{version.name}</span>
                          <span className="font-medium text-primary-600">
                            {formatCurrency(version.price)}
                          </span>
                        </div>
                        {version.description && (
                          <p className="mt-1 text-sm text-gray-500">{version.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
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
        <ProductDescription description={product.description} />
        
        {/* Related products */}
        <RelatedProducts 
          currentProductId={product.id} 
          categoryId={product.categories && product.categories.length > 0 ? product.categories[0].id : undefined} 
        />
      </div>
    </div>
  );
} 