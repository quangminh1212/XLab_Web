'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { useCart } from '@/components/cart/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string | object;
  rating?: number;
  reviewCount?: number;
  isAccount?: boolean;
  weeklyPurchases?: number;
  totalSold?: number;
  slug?: string;
  onAddToCart?: (id: string) => void;
  onView?: (id: string) => void;
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  originalPrice,
  image,
  category,
  rating = 0,
  reviewCount = 0,
  isAccount = false,
  weeklyPurchases = 0,
  totalSold = 0,
  slug = '',
  onAddToCart = () => {},
  onView = () => {},
}: ProductCardProps) {
  const { t, language } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showAddedEffect, setShowAddedEffect] = useState(false);
  const [translatedDescription, setTranslatedDescription] = useState<string>(description);
  const [translatedName, setTranslatedName] = useState<string>(name);
  const router = useRouter();
  const { addItem, clearCart } = useCart();

  useEffect(() => {
    if (language === 'eng') {
      const fetchTranslation = async () => {
        try {
          const response = await fetch('/api/product-translations?id=' + id + '&lang=' + language);
          if (response.ok) {
            const data = await response.json();
            if (data && data.shortDescription) {
              setTranslatedDescription(data.shortDescription);
            } else {
              setTranslatedDescription(description);
            }
            if (data && data.name) {
              setTranslatedName(data.name);
            } else {
              setTranslatedName(name);
            }
          } else {
            setTranslatedDescription(description);
            setTranslatedName(name);
          }
        } catch (_error) {
          setTranslatedDescription(description);
          setTranslatedName(name);
        }
      };
      fetchTranslation();
    } else {
      setTranslatedDescription(description);
      setTranslatedName(name);
    }
  }, [description, name, language, id]);

  const getValidImageUrl = (imgUrl: string | null | undefined): string => {
    if (!imgUrl) return '/images/placeholder/product-placeholder.svg';
    const fixed = imgUrl.replace(/\\/g, '/');
    if (fixed.startsWith('blob:')) return '/images/placeholder/product-placeholder.svg';
    if (fixed.includes('undefined')) return '/images/placeholder/product-placeholder.svg';
    if (fixed.trim() === '') return '/images/placeholder/product-placeholder.svg';
    try {
      if (fixed.startsWith('/')) {
        return fixed;
      }
      const url = new URL(fixed, window.location.origin);
      return url.toString();
    } catch (_e) {
      return '/images/placeholder/product-placeholder.svg';
    }
  };

  const handleAddToCart = () => {
    addItem({ id, name: translatedName, price, quantity: 1, image });
    setShowAddedEffect(true);
    setTimeout(() => setShowAddedEffect(false), 1200);
    if (onAddToCart) onAddToCart(id);
  };

  const handleView = () => {
    if (onView) onView(id);
  };

  const imageUrl = getValidImageUrl(image);
  const discountPercentage = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div
      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200 flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full pt-[75%] bg-gray-50">
        <Image
          src={imageUrl}
          alt={name}
          fill
          unoptimized
          className={`object-contain p-2 transition-opacity duration-300 ${
            isImageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoadingComplete={() => setIsImageLoaded(true)}
          onError={() => setImageError(true)}
        />
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-400 text-sm">Không thể tải ảnh</span>
          </div>
        )}
        {isAccount && (
          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
            {t('product.account')}
          </div>
        )}
        {discountPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            -{discountPercentage}%
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-gray-900 font-semibold leading-snug line-clamp-2 flex-1">
            <Link href={slug ? `/products/${slug}` : `/products/${id}`} onClick={handleView}>
              {translatedName}
            </Link>
          </h3>
          {typeof rating !== 'undefined' && (
            <div className="flex items-center">
              <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.803 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.803-2.034a1 1 0 00-1.176 0l-2.803 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.718c-.783-.570-.38-1.810.588-1.810h3.461a1 1 0 00.951-.690l1.070-3.292z"/>
              </svg>
              <span className="text-sm text-gray-600">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {category && (
          <p className="mt-1 text-xs text-gray-500">
            {typeof category === 'string' ? category : ''}
          </p>
        )}

        <p className="mt-2 text-sm text-gray-700 line-clamp-2">{translatedDescription}</p>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <div className="text-lg font-bold text-gray-900">{formatCurrency(price)}</div>
            {originalPrice && originalPrice > price && (
              <div className="text-sm text-gray-500 line-through">
                {formatCurrency(originalPrice)}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md"
          >
            {t('product.addToCart')}
          </button>
        </div>

        {(weeklyPurchases || totalSold) && (
          <div className="mt-3 text-xs text-gray-500">
            {weeklyPurchases ? (
              <span>{t('product.weeklyPurchases')}: {weeklyPurchases}</span>
            ) : (
              <span>{t('product.totalSold')}: {totalSold}</span>
            )}
          </div>
        )}

        {slug && (
          <Link href={`/products/${slug}`} className="mt-3 inline-flex items-center text-blue-600 hover:text-blue-800 text-sm">
            {t('product.viewDetails')}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}


