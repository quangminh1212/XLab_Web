'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product as ProductType } from '@/models/ProductModel';
import ProductDetail from './ProductDetail';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProductDetailPageProps {
  params: { id: string };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Tìm kiếm sản phẩm dựa trên ID hoặc slug
        console.log(`Đang tìm kiếm sản phẩm với ID hoặc slug: ${params.id}`);
        const res = await fetch(`/api/products/${params.id}`);
        if (!res.ok) {
          throw new Error('Không thể tải thông tin sản phẩm');
        }
        const data = await res.json();
        if (data && data.product) {
          setProduct(data.product);
          console.log(`Người dùng đang xem sản phẩm: ${data.product.name} (ID: ${data.product.id}, Slug: ${data.product.slug})`);
          
          // Cập nhật title động dựa trên ngôn ngữ hiện tại
          document.title = `${data.product.name} | ${t('product.metaTitle')}`;
        } else {
          setError('Không tìm thấy sản phẩm');
          router.push('/products'); // Chuyển hướng về trang sản phẩm
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Đã xảy ra lỗi khi tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, router, t]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-gray-600">{t('product.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Image
            src="/images/icons/error.svg"
            alt="Error"
            width={80}
            height={80}
            className="mb-4"
          />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {t('products.errorTitle')}
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            {t('products.backToHome')}
          </button>
        </div>
      </div>
    );
  }

  return <ProductDetail product={product} />;
}
