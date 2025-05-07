'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { ProductImage } from './ProductImage';
import { formatCurrency } from '@/lib/utils';
import { useCart } from './ui/CartContext';

interface ProductCardProps {
  product: Product;
}

// Hàm chọn biểu tượng phù hợp cho loại sản phẩm
const getProductIcon = (productSlug: string) => {
  if (productSlug.includes('voice') || productSlug.includes('typing')) {
    return (
      <div className="flex flex-col items-center justify-center">
        <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        <span className="text-sm font-semibold text-primary-600 mt-1">VoiceTyping</span>
      </div>
    );
  } else if (productSlug.includes('office')) {
    return (
      <div className="flex items-center justify-center p-2 bg-primary-50 rounded-full">
        <svg className="w-16 h-16 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM5 19V5H19V19H5Z" fill="currentColor" />
          <path d="M7 12H9V17H7V12Z" fill="currentColor" />
          <path d="M11 7H13V17H11V7Z" fill="currentColor" />
          <path d="M15 9H17V17H15V9Z" fill="currentColor" />
        </svg>
      </div>
    );
  } else if (productSlug.includes('design') || productSlug.includes('photo')) {
    return (
      <div className="flex items-center justify-center p-2 bg-blue-50 rounded-full">
        <svg className="w-16 h-16 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4.93 4.93L6.34 6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17.66 17.66L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  } else if (productSlug.includes('code') || productSlug.includes('web')) {
    return (
      <div className="flex items-center justify-center p-2 bg-indigo-50 rounded-full">
        <svg className="w-16 h-16 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 18L22 12L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 6L2 12L8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 4L14 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  } else if (productSlug.includes('secure') || productSlug.includes('backup')) {
    return (
      <div className="flex items-center justify-center p-2 bg-green-50 rounded-full">
        <svg className="w-16 h-16 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  } else if (productSlug.includes('system') || productSlug.includes('erp')) {
    return (
      <div className="flex items-center justify-center p-2 bg-purple-50 rounded-full">
        <svg className="w-16 h-16 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 16C13.1046 16 14 15.1046 14 14C14 12.8954 13.1046 12 12 12C10.8954 12 10 12.8954 10 14C10 15.1046 10.8954 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 8C13.1046 8 14 7.10457 14 6C14 4.89543 13.1046 4 12 4C10.8954 4 10 4.89543 10 6C10 7.10457 10.8954 8 12 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 22C7.10457 22 8 21.1046 8 20C8 18.8954 7.10457 18 6 18C4.89543 18 4 18.8954 4 20C4 21.1046 4.89543 22 6 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 16C19.1046 16 20 15.1046 20 14C20 12.8954 19.1046 12 18 12C16.8954 12 16 12.8954 16 14C16 15.1046 16.8954 16 18 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 16V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 12V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 14H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 14H8.5C7.67 14 7 13.33 7 12.5C7 11.67 7.67 11 8.5 11H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  } else if (productSlug.includes('language')) {
    return (
      <div className="flex items-center justify-center p-2 bg-yellow-50 rounded-full">
        <svg className="w-16 h-16 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-center p-2 bg-primary-50 rounded-full">
        <svg className="w-16 h-16 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 7L12 3L4 7M20 7V17L12 21M20 7L12 11M12 21L4 17V7M12 21V11M4 7L12 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItemToCart } = useCart();
  
  if (!product) return null;

  // Tính toán giảm giá
  const discount = product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0;
  
  // Kiểm tra xem có phải là VoiceTyping không
  const isVoiceTyping = product.slug === 'voicetyping' || product.name === 'VoiceTyping';

  // Xác định đường dẫn sản phẩm dựa vào loại
  const productLink = product.isAccount || product.type === 'account'
    ? `/accounts/${product.id}`
    : `/products/${product.id}`;
    
  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn chặn chuyển hướng khi nhấp vào liên kết
    e.stopPropagation(); // Ngăn lan truyền sự kiện
    
    addItemToCart({
      id: String(product.id),
      name: product.name,
      price: product.salePrice || product.price,
      image: product.imageUrl || '/images/product-placeholder.svg',
      quantity: 1
    });
  };

  return (
    <Link 
      href={productLink}
      className="group flex flex-col overflow-hidden rounded border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all h-full"
    >
      <div className="relative w-full pt-[68%] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center p-3">
          <div className="w-16 h-16 relative">
            <ProductImage
              src={product.imageUrl || '/images/product-placeholder.svg'}
              alt={product.name}
              width={80} 
              height={80}
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-sm"
              priority={true}
            />
          </div>
        </div>

        {/* Badge giảm giá */}
        {discount > 0 && (
          <div className="absolute top-1 right-1 bg-red-500 text-white text-sm font-bold px-2 py-0.5 rounded-sm z-10 shadow-sm">
            -{discount}%
          </div>
        )}

        {/* Badge sản phẩm mới */}
        {product.isNew && (
          <div className="absolute top-1 left-1 bg-blue-500 text-white text-sm font-bold px-2 py-0.5 rounded-sm z-10 shadow-sm">
            Mới
          </div>
        )}
      </div>

      <div className="flex flex-col flex-grow p-3">
        <h3 className="text-base font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1 mb-1">
          {product.name}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-2 mb-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <div className="flex flex-col">
            {product.salePrice && product.salePrice < product.price ? (
              <>
                <span className="text-base font-bold text-primary-600">
                  {formatCurrency(product.salePrice)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {formatCurrency(product.price)}
                </span>
              </>
            ) : (
              <span className="text-base font-bold text-primary-600">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          <button 
            onClick={handleAddToCart}
            className="bg-primary-600 hover:bg-primary-700 text-white text-xs px-2 py-1 rounded transition-colors"
          >
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard; 