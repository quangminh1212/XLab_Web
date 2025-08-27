'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLangFetch } from '@/lib/langFetch';
import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  shortDescription: string;
  images: string[];
}

export default function LanguageTestPage() {
  const [language, setLanguage] = useState<'vie' | 'eng'>('vie');
  const lfetch = useLangFetch(language);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await lfetch(`/api/products`);
        setProducts(result.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [language, lfetch]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {language === 'vie' ? 'Kiểm tra đa ngôn ngữ' : 'Language Test'}
      </h1>
      
      <div className="flex justify-center mb-8">
        <div className="flex space-x-4">
          <button
            onClick={() => setLanguage('vie')}
            className={`px-4 py-2 rounded ${
              language === 'vie' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Tiếng Việt
          </button>
          <button
            onClick={() => setLanguage('eng')}
            className={`px-4 py-2 rounded ${
              language === 'eng' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2">
            {language === 'vie' ? 'Đang tải sản phẩm...' : 'Loading products...'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg overflow-hidden shadow-md">
              <div className="relative h-48 w-full">
                {product.images && product.images[0] && (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-3">{product.shortDescription}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">
                    {new Intl.NumberFormat(language === 'vie' ? 'vi-VN' : 'en-US', {
                      style: 'currency',
                      currency: language === 'vie' ? 'VND' : 'USD',
                      minimumFractionDigits: 0,
                    }).format(language === 'vie' ? product.price : product.price / 24000)}
                  </span>
                  <Link 
                    href={`/products/${product.slug}?lang=${language}`}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {language === 'vie' ? 'Xem chi tiết' : 'View details'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 