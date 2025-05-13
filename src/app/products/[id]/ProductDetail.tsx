'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/types';
import { products } from '@/data/mockData';
import { useCart } from '@/components/cart/CartContext';
import dynamic from 'next/dynamic';
import RichTextContent from '@/components/common/RichTextContent';

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
                <Image
                  src={product.imageUrl || '/images/product-placeholder.svg'}
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

export default function ProductDetail({ product }: { product: Product }) {
  // Update document title khi component được render
  useEffect(() => {
    document.title = `${product.name} | XLab - Phần mềm và Dịch vụ`;
  }, [product.name]);

  // State để theo dõi số lượt xem
  const [viewCount, setViewCount] = useState(product.viewCount || 0);
  
  // State lưu số lượng sản phẩm
  const [quantity, setQuantity] = useState(1);
  
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
        quantity: quantity,
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

  // Kiểm tra xem sản phẩm có phải là VoiceTyping không
  const isVoiceTyping = product.id === 'prod-vt' || product.slug === 'voicetyping';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
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
        
        {/* Tiêu đề sản phẩm (chỉ hiển thị trên mobile) */}
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:hidden">{product.name}</h1>
          
        {/* Grid layout cho sản phẩm */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Phần hình ảnh bên trái */}
          <div className="bg-white rounded-lg overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={product.imageUrl || '/images/product-placeholder.svg'}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-contain p-4"
                priority
              />
              <div className="absolute top-2 right-2">
                <button className="bg-white rounded-full p-2 shadow-sm">
                  <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Thông tin sản phẩm bên phải */}
          <div>
            {/* Tiêu đề sản phẩm (ẩn trên mobile) */}
            <h1 className="text-2xl md:text-3xl font-bold mb-4 hidden md:block">{product.name}</h1>
            
            {/* Giá sản phẩm */}
            <div className="mb-4">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-green-600 mr-2">
                  {formatCurrency(calculatePrice())}
                </span>
                <span className="text-xl font-bold text-green-600">
                  đ
                </span>
                {product.price > calculatePrice() && (
                  <span className="ml-3 text-gray-500 line-through text-lg">
                    {formatCurrency(product.price)} đ
                  </span>
                )}
              </div>
            </div>
            
            {/* Thông tin sản phẩm trong hộp xanh */}
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <div className="space-y-2">
                {product.features && product.features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <span className="mr-2 text-gray-700">– </span>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Dropdown chọn loại tài khoản nếu là tài khoản */}
            {isAccount && product.options && product.options.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <span className="inline-block w-24 text-gray-700 font-medium">Tài khoản</span>
                  <div className="flex-1">
                    <select
                      id="account-type"
                      value={selectedOption}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    >
                      {product.options.map((option, index) => (
                        <option key={index} value={option.name}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
            
            {/* Số lượng */}
            <div className="mb-6">
              <div className="flex items-center">
                <span className="inline-block w-24 text-gray-700 font-medium">Số lượng</span>
                <div className="flex border border-gray-300 rounded-md">
                  <button 
                    onClick={decreaseQuantity}
                    className="px-3 py-1 border-r border-gray-300 bg-gray-100 hover:bg-gray-200"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-12 text-center py-1 focus:outline-none"
                  />
                  <button 
                    onClick={increaseQuantity}
                    className="px-3 py-1 border-l border-gray-300 bg-gray-100 hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            
            {/* Nút thêm vào giỏ hàng */}
            <div className="mb-6">
              <button
                onClick={handleAddToCart}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium"
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
        
        {/* Chi tiết sản phẩm */}
        <ProductDescription description={product.longDescription} />
        
        {/* Thông số kỹ thuật */}
        <ProductSpecifications specifications={product.specifications} />
        
        {/* Demo VoiceTyping nếu sản phẩm là VoiceTyping */}
        {isVoiceTyping && <VoiceTypingDemo />}
        
        {/* Lợi ích sản phẩm */}
        <ProductBenefits />
        
        {/* Sản phẩm liên quan */}
        <div className="mt-12">
          <RelatedProducts currentProductId={product.id} categoryId={product.categoryId} />
        </div>
      </div>
    </div>
  );
} 