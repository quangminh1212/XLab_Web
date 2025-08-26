import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';

import ProductCard from '@/components/product/ProductCard';
import ProductImage from '@/components/product/ProductImage';
import { siteConfig } from '@/config/siteConfig';
import { categories, products } from '@/data/mockData';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((cat) => cat.slug === slug);
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || siteConfig.url).replace(/\/$/, '');
  if (!category) {
    return { title: `Danh mục không tồn tại | ${siteConfig.name}`, robots: { index: false, follow: false }, alternates: { canonical: `${baseUrl}/categories/${slug}` } };
  }
  const title = `${category.name} | ${siteConfig.name}`;
  const desc = category.description || siteConfig.seo.defaultDescription;
  const url = `${baseUrl}/categories/${category.slug}`;
  const image = category.imageUrl || siteConfig.seo.ogImage;
  return {
    title,
    description: desc,
    alternates: {
      canonical: url,
      languages: {
        'vi-VN': url,
        'en-US': url.replace(siteConfig.url, `${siteConfig.url}/en`),
      },
    },
    openGraph: { type: 'website', url, title, description: desc, images: [{ url: image, width: 1200, height: 630, alt: category.name }] },
    twitter: { card: 'summary_large_image', title, description: desc, images: [image], creator: siteConfig.seo.twitterHandle },
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = React.use(params);
  const category = categories.find((cat) => cat.slug === slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = products.filter((product) => product.categoryId === category.id);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto px-0 sm:px-4 max-w-full md:max-w-[98%] xl:max-w-[1280px] 2xl:max-w-[1400px]">
        <div className="mb-8">
          <Link href="/categories" className="text-primary-600 flex items-center mb-4 text-sm">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Quay lại danh mục
          </Link>

          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-primary-50 rounded-lg flex items-center justify-center mr-4">
              <Image
                src={category.imageUrl || '/images/placeholder.svg'}
                alt={category.name}
                width={48}
                height={48}
                className="object-contain"
                unoptimized={true}
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 break-words text-balance">{category.name}</h1>
              <p className="text-gray-600 mt-1 leading-relaxed text-balance break-words">{category.description}</p>
            </div>
          </div>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {categoryProducts.map((product) => (
              <div key={product.id}>
                <ProductCard
                  id={product.id.toString()}
                  name={product.name}
                  description={product.description}
                  price={product.salePrice || product.price}
                  originalPrice={
                    product.salePrice && product.salePrice < product.price ? product.price : undefined
                  }
                  image={product.imageUrl || '/images/placeholder/product-placeholder.jpg'}
                  rating={product.rating}
                  isAccount={product.isAccount || product.type === 'account'}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Chưa có sản phẩm</h3>
            <p className="text-gray-500 max-w-lg mx-auto mb-6">
              Chúng tôi đang cập nhật thêm các sản phẩm cho danh mục này
            </p>
            <Link
              href="/categories"
              className="text-white bg-primary-500 hover:bg-primary-600 rounded-full px-6 py-2 transition-colors font-medium shadow-sm inline-block"
            >
              Xem các danh mục khác
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
