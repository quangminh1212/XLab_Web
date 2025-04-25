'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { ProductImage } from './ProductImage';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/lib/CartContext';

interface ProductCardProps {
  product: Product;
}

// Hàm chọn biểu tượng phù hợp cho loại sản phẩm
const getProductIcon = (productSlug: string = '') => {
  if (!productSlug) return null;
  
  if (productSlug.includes('voice') || productSlug.includes('typing')) {
    return (
      <div className="flex flex-col items-center justify-center">
        <svg className="w-20 h-20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Vòng tròn nền */}
          <circle cx="12" cy="12" r="10" fill="#e6f7f5" />

          {/* Microphone */}
          <path d="M12 15C13.66 15 15 13.66 15 12V6C15 4.34 13.66 3 12 3C10.34 3 9 4.34 9 6V12C9 13.66 10.34 15 12 15Z"
            fill="#00a896" stroke="#008075" strokeWidth="0.5" />

          {/* Đường sóng âm */}
          <path d="M19 12C19 14.76 17.02 17.06 14.4 17.78V21H9.6V17.78C6.98 17.06 5 14.76 5 12H7C7 14.21 8.79 16 11 16H13C15.21 16 17 14.21 17 12H19Z"
            fill="#00a896" stroke="#008075" strokeWidth="0.5" />

          {/* Sóng âm phụ */}
          <path d="M17 9C17 9 17.9 10 17.9 12C17.9 14 17 15 17 15" stroke="#00a896" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M7 9C7 9 6.1 10 6.1 12C6.1 14 7 15 7 15" stroke="#00a896" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="text-[10px] font-semibold text-primary-600 mt-1">VoiceTyping</span>
      </div>
    );
  } else if (productSlug.includes('office')) {
    return (
      <svg className="w-12 h-12 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM5 19V5H19V19H5Z" fill="currentColor" />
        <path d="M7 12H9V17H7V12Z" fill="currentColor" />
        <path d="M11 7H13V17H11V7Z" fill="currentColor" />
        <path d="M15 9H17V17H15V9Z" fill="currentColor" />
      </svg>
    );
  } else if (productSlug.includes('design') || productSlug.includes('photo')) {
    return (
      <svg className="w-12 h-12 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.93 4.93L6.34 6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17.66 17.66L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  } else if (productSlug.includes('code') || productSlug.includes('web')) {
    return (
      <svg className="w-12 h-12 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 18L22 12L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 6L2 12L8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 4L14 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  } else if (productSlug.includes('secure') || productSlug.includes('backup')) {
    return (
      <svg className="w-12 h-12 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  } else if (productSlug.includes('system') || productSlug.includes('erp')) {
    return (
      <svg className="w-12 h-12 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 16C13.1046 16 14 15.1046 14 14C14 12.8954 13.1046 12 12 12C10.8954 12 10 12.8954 10 14C10 15.1046 10.8954 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 8C13.1046 8 14 7.10457 14 6C14 4.89543 13.1046 4 12 4C10.8954 4 10 4.89543 10 6C10 7.10457 10.8954 8 12 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 22C7.10457 22 8 21.1046 8 20C8 18.8954 7.10457 18 6 18C4.89543 18 4 18.8954 4 20C4 21.1046 4.89543 22 6 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 16C19.1046 16 20 15.1046 20 14C20 12.8954 19.1046 12 18 12C16.8954 12 16 12.8954 16 14C16 15.1046 16.8954 16 18 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 16V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 12V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 14H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 14H8.5C7.67 14 7 13.33 7 12.5C7 11.67 7.67 11 8.5 11H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  } else if (productSlug.includes('language')) {
    return (
      <svg className="w-12 h-12 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  } else {
    return (
      <svg className="w-12 h-12 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 7L12 3L4 7M20 7V17L12 21M20 7L12 11M12 21L4 17V7M12 21V11M4 7L12 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [addStatus, setAddStatus] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const { addToCart } = useCart();

  if (!product) return null;

  const discount = product.price && product.price > 0
    ? Math.round(((product.price - (product?.salePrice ?? product.price)) / product.price) * 100)
    : 0;

  // Xác định nếu là sản phẩm VoiceTyping
  const productSlug = product?.slug ?? '';
  const isVoiceTyping = productSlug.includes('voice') || productSlug.includes('typing');

  // Xác định đường dẫn sản phẩm dựa vào loại
  const productLink = product?.isAccount || product?.type === 'account'
    ? `/accounts/${product?.id ?? ''}`
    : `/products/${product?.id ?? ''}`;
    
  // Hàm thêm sản phẩm vào giỏ hàng
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn chặn hành vi điều hướng của thẻ Link
    e.stopPropagation(); // Ngăn chặn sự kiện lan tỏa
    
    if (!product.id) return;
    
    setIsAdding(true);
    setAddStatus(null);
    
    try {
      await addToCart({
        id: product.id.toString(),
        name: product.name,
        version: product.version || '',
        price: product.salePrice || product.price,
        quantity: 1,
        image: product.imageUrl || '',
      });
      
      setAddStatus({
        message: 'Đã thêm vào giỏ hàng',
        type: 'success'
      });
      
      // Tự động ẩn thông báo sau 3 giây
      setTimeout(() => {
        setAddStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      setAddStatus({
        message: error instanceof Error ? error.message : 'Không thể thêm vào giỏ hàng',
        type: 'error'
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="relative">
      {/* Notification */}
      {addStatus && (
        <div className={`absolute top-2 right-2 left-2 z-30 px-3 py-2 rounded-md text-sm font-medium text-white ${
          addStatus.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {addStatus.message}
        </div>
      )}
      
      <Link
        href={productLink}
        className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all hover:border-primary-200 flex flex-col h-full"
      >
        <div className="relative aspect-[4/3] w-full bg-gray-50 overflow-hidden flex items-center justify-center">
          {isVoiceTyping ? (
            // Hiển thị hình ảnh đẹp hơn cho VoiceTyping
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50">
              <div className="relative w-full h-full">
                <img
                  src="/speech-text.png"
                  alt="VoiceTyping"
                  className="w-full h-full object-contain group-hover:scale-105 transition-all duration-300"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary-900/20"></div>
                {/* Badge cho VoiceTyping */}
                <div className="absolute bottom-2 left-2 z-10">
                  <span className="inline-block px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded-md">
                    Voice Typing
                  </span>
                </div>
              </div>
            </div>
          ) : (
            // Sử dụng ProductImage cho các sản phẩm khác
            <div className="w-full h-full">
              <ProductImage
                src={product?.imageUrl ?? '/images/placeholder-product.jpg'}
                alt={product?.name ?? 'Product Image'}
                width={400}
                height={300}
                className="object-contain group-hover:scale-105 transition-transform duration-300"
                priority={true}
              />
            </div>
          )}

          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full z-20">
              -{discount}%
            </div>
          )}

          {product?.isNew && (
            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full z-20">
              Mới
            </div>
          )}
        </div>

        <div className="flex flex-col flex-grow p-3">
          <h3 className="text-xs md:text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
            {product?.name ?? 'Product Name'}
          </h3>

          <p className="text-xs text-gray-500 mt-1 mb-2 line-clamp-1 flex-grow">
            {product?.description ?? 'Product Description'}
          </p>

          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
            <div className="flex flex-col">
              {product?.salePrice && product?.salePrice < (product?.price ?? 0) ? (
                <>
                  <span className="text-xs font-semibold text-primary-600">
                    {formatCurrency(product?.salePrice ?? 0)}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    {formatCurrency(product?.price ?? 0)}
                  </span>
                </>
              ) : (
                <span className="text-xs font-semibold text-primary-600">
                  {product?.price === 0 ? 'Miễn phí' : formatCurrency(product?.price ?? 0)}
                </span>
              )}
            </div>

            <div className="flex items-center text-xs text-gray-500">
              <span className="inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-yellow-400 mr-1">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
                {product?.rating ?? 'N/A'}
              </span>

              <span className="mx-1">•</span>

              <span className="inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-gray-400 mr-1">
                  <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                  <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd" />
                  <path d="M2.25 18a.75.75 0 000 1.5h19.5a.75.75 0 000-1.5H2.25z" />
                </svg>
                {product?.downloadCount ? product.downloadCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : 'N/A'}
              </span>
            </div>
          </div>
          
          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            className="mt-3 w-full py-1.5 px-3 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium rounded transition-colors"
            disabled={isAdding}
          >
            {isAdding ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang thêm...
              </span>
            ) : 'Thêm vào giỏ hàng'}
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard; 