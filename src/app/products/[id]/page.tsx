'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getProductBySlug, incrementDownloadCount, incrementViewCount } from '@/lib/utils';
import ProductImage from '@/components/ProductImage';
import { useParams } from 'next/navigation';
import { Product } from '@/types';
import { categories } from '@/data/mockData';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        if (!params || !params.id) {
          setError('Mã sản phẩm không hợp lệ');
          setLoading(false);
          return;
        }

        // Tìm sản phẩm theo slug
        const foundProduct = getProductBySlug(params.id);
        if (foundProduct) {
          setProduct(foundProduct);
          setError(null);
          
          // Tăng lượt xem sản phẩm
          incrementViewCount(params.id);
          
          // Cập nhật title cho trang
          document.title = `${foundProduct.name} | XLab - Phần mềm và Dịch vụ`;
        } else {
          setError('Không tìm thấy sản phẩm');
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Đã xảy ra lỗi khi tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [params]);

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-8 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-2xl font-bold text-red-600 mb-4">{error || 'Đã xảy ra lỗi'}</h1>
            <p className="text-gray-600 mb-6">
              Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa. 
              Vui lòng kiểm tra lại đường dẫn hoặc quay lại trang sản phẩm.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/products" 
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay lại danh sách sản phẩm
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const productImage = product.imageUrl || '/placeholder-product.jpg';
  
  const handleDownload = () => {
    if (!product.slug) return;
    
    try {
      // Tăng số lượt tải
      incrementDownloadCount(product.slug);
      
      // Mô phỏng tải xuống
      console.log(`Tải xuống sản phẩm: ${product.slug}`);
      
      // Tạo tệp trống để tải xuống
      const element = document.createElement('a');
      element.setAttribute('href', `data:text/plain;charset=utf-8,Đây là file demo cho sản phẩm ${product.slug}`);
      element.setAttribute('download', `${product.slug}-demo.txt`);
      
      element.style.display = 'none';
      document.body.appendChild(element);
      
      element.click();
      
      document.body.removeChild(element);
    } catch (error) {
      console.error('Lỗi khi tải xuống:', error);
    }
  };

  // Tìm thông tin danh mục của sản phẩm
  const category = categories.find(cat => cat.id === product.categoryId);

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row -mx-4">
              <div className="md:flex-1 px-4 mb-6 md:mb-0">
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-6 flex items-center justify-center h-80">
                  <ProductImage 
                    src={productImage}
                    alt={product.name || 'Product image'}
                    width={300}
                    height={300}
                    className="max-h-64 max-w-full object-contain"
                  />
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {product.viewCount || 0} lượt xem
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {product.downloadCount || 0} lượt tải
                  </div>
                </div>
              </div>

              <div className="md:flex-1 px-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                
                {category && (
                  <Link 
                    href={`/categories/${category.slug}`}
                    className="inline-block mb-3 text-sm text-primary-600 bg-primary-50 px-3 py-1 rounded-full"
                  >
                    {category.name}
                  </Link>
                )}
                
                <p className="text-gray-600 text-sm mb-4">
                  Phiên bản {product.version || '1.0'} | Cập nhật: {new Date(product.updatedAt || new Date()).toLocaleDateString('vi-VN')}
                </p>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-5 h-5 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">({product.rating || 0})</span>
                </div>
                
                <div className="flex items-center mb-6">
                  <div className="text-3xl font-bold text-gray-900">
                    {product.salePrice ? (
                      <>
                        <span>{product.salePrice.toLocaleString('vi-VN')}đ</span>
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getProductBySlug, incrementDownloadCount, incrementViewCount } from '@/lib/utils';
import { ProductImage } from '@/components/ProductImage';
import { useParams } from 'next/navigation';
import { Product } from '@/types';
import { categories } from '@/data/mockData';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        if (!params || !params.id) {
          setError('Mã sản phẩm không hợp lệ');
          setLoading(false);
          return;
        }

        // Tìm sản phẩm theo slug
        const foundProduct = getProductBySlug(params.id);
        if (foundProduct) {
          setProduct(foundProduct);
          setError(null);
          
          // Tăng lượt xem sản phẩm
          incrementViewCount(params.id);
          
          // Cập nhật title cho trang
          document.title = `${foundProduct.name} | XLab - Phần mềm và Dịch vụ`;
        } else {
          setError('Không tìm thấy sản phẩm');
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Đã xảy ra lỗi khi tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [params]);

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-8 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-2xl font-bold text-red-600 mb-4">{error || 'Đã xảy ra lỗi'}</h1>
            <p className="text-gray-600 mb-6">
              Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa. 
              Vui lòng kiểm tra lại đường dẫn hoặc quay lại trang sản phẩm.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/products" 
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay lại danh sách sản phẩm
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const productImage = product.imageUrl || '/placeholder-product.jpg';
  
  const handleDownload = () => {
    if (!product.slug) return;
    
    try {
      // Tăng số lượt tải
      incrementDownloadCount(product.slug);
      
      // Mô phỏng tải xuống
      console.log(`Tải xuống sản phẩm: ${product.slug}`);
      
      // Tạo tệp trống để tải xuống
      const element = document.createElement('a');
      element.setAttribute('href', `data:text/plain;charset=utf-8,Đây là file demo cho sản phẩm ${product.slug}`);
      element.setAttribute('download', `${product.slug}-demo.txt`);
      
      element.style.display = 'none';
      document.body.appendChild(element);
      
      element.click();
      
      document.body.removeChild(element);
    } catch (error) {
      console.error('Lỗi khi tải xuống:', error);
    }
  };

  // Tìm thông tin danh mục của sản phẩm
  const category = categories.find(cat => cat.id === product.categoryId);

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row -mx-4">
              <div className="md:flex-1 px-4 mb-6 md:mb-0">
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-6 flex items-center justify-center h-80">
                  <ProductImage 
                    src={productImage}
                    alt={product.name || 'Product image'}
                    width={300}
                    height={300}
                    className="max-h-64 max-w-full object-contain"
                  />
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {product.viewCount || 0} lượt xem
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {product.downloadCount || 0} lượt tải
                  </div>
                </div>
              </div>

              <div className="md:flex-1 px-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                
                {category && (
                  <Link 
                    href={`/categories/${category.slug}`}
                    className="inline-block mb-3 text-sm text-primary-600 bg-primary-50 px-3 py-1 rounded-full"
                  >
                    {category.name}
                  </Link>
                )}
                
                <p className="text-gray-600 text-sm mb-4">
                  Phiên bản {product.version || '1.0'} | Cập nhật: {new Date(product.updatedAt || new Date()).toLocaleDateString('vi-VN')}
                </p>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-5 h-5 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">({product.rating || 0})</span>
                </div>
                
                <div className="flex items-center mb-6">
                  <div className="text-3xl font-bold text-gray-900">
                    {product.salePrice ? (
                      <>
                        <span>{product.salePrice.toLocaleString('vi-VN')}đ</span>
                        <span className="ml-2 text-sm line-through text-gray-500">
                          {product.price.toLocaleString('vi-VN')}đ
                        </span>
                      </>
                    ) : (
                      <span>{product.price.toLocaleString('vi-VN')}đ</span>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex space-x-4">
                    <button 
                      onClick={handleDownload} 
                      className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Tải xuống
                    </button>
                    
                    <Button 
                      variant="outline" 
                      className="flex-1 py-3 border-2"
                      onClick={() => alert('Tính năng này đang được phát triển')}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Thêm vào giỏ hàng
                    </Button>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="text-gray-700">{product.description}</div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Thông tin sản phẩm</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Loại bản quyền:</span>
                      <span className="font-medium">{product.licenseType || 'Thương mại'}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Kích thước:</span>
                      <span className="font-medium">{product.size || '10MB'}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Ngày phát hành:</span>
                      <span className="font-medium">{new Date(product.createdAt || new Date()).toLocaleDateString('vi-VN')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chi tiết sản phẩm */}
          <div className="p-6 md:p-8 border-t border-gray-200">
            <h2 className="text-xl font-bold mb-4">Mô tả chi tiết</h2>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.longDescription || product.description }}></div>
          </div>
          
          {/* Sản phẩm liên quan */}
          <div className="p-6 md:p-8 border-t border-gray-200">
            <h2 className="text-xl font-bold mb-4">Sản phẩm tương tự</h2>
            <p className="text-gray-500">Tính năng này sẽ được cập nhật sau.</p>
          </div>
        </div>
        
        <div className="mt-8">
          <Link 
            href="/products" 
            className="text-primary-600 hover:text-primary-700 flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    </div>
  );
} 