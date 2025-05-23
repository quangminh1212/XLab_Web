'use client'

import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import { Product } from '@/types'
import { useState, useEffect } from 'react'

// Mở rộng kiểu Product để thêm thuộc tính plans
interface AccountProduct extends Product {
  plans?: {
    id: string;
    name: string;
    price: number;
    salePrice: number;
    description: string;
    features: string[];
  }[];
}

export default function AccountsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState('newest');

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error('Không thể tải sản phẩm');
        }
        
        const result = await response.json();
        
        // Đảm bảo dữ liệu được trả về đúng định dạng
        if (result.success && Array.isArray(result.data)) {
          setProducts(result.data);
        } else {
          setProducts([]);
          setError('Định dạng dữ liệu không hợp lệ');
        }
        
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Đã xảy ra lỗi');
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Lọc tài khoản từ danh sách sản phẩm - đảm bảo products là mảng
  const accounts = Array.isArray(products) 
    ? products.filter(product => product.isAccount === true)
    : [];

  // Sắp xếp tài khoản - đảm bảo accounts là mảng
  const sortedAccounts = Array.isArray(accounts) 
    ? [...accounts].sort((a, b) => {
        if (sortOrder === 'newest') {
          return new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime();
        } else if (sortOrder === 'price-low') {
          return (a.salePrice || a.price) - (b.salePrice || b.price);
        } else if (sortOrder === 'price-high') {
          return (b.salePrice || b.price) - (a.salePrice || a.price);
        } else if (sortOrder === 'popular') {
          return (b.downloadCount || 0) - (a.downloadCount || 0);
        }
        return 0;
      })
    : [];

  // Danh mục sản phẩm
  const categories = [
    { id: 'all', name: 'Tất cả', count: accounts.length },
    { id: 'accounts', name: 'Tài khoản', count: Array.isArray(accounts) 
        ? accounts.filter(a => a.categoryId === 'accounts').length
        : 0 
    }
  ];

  // Hiển thị loading
  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Đang tải tài khoản...</p>
        </div>
      </div>
    );
  }

  // Hiển thị lỗi
  if (error) {
    return (
      <div className="py-12 flex justify-center">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Không thể tải tài khoản</h2>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Thử lại
            </button>
            <Link
              href="/"
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-7-7v14" />
              </svg>
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 bg-gray-50">
      <div className="container mx-auto px-2 md:px-4 max-w-none w-[90%]">
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Tài khoản dịch vụ</h1>
          <p className="text-sm md:text-base text-gray-600">
            Danh sách các tài khoản dịch vụ chất lượng cao với mức giá tốt nhất thị trường.
          </p>
        </div>
        
        {/* Tabs điều hướng */}
        <div className="border-b border-gray-200 mb-4">
          <div className="flex space-x-4">
            <Link href="/products">
              <div className="py-2 px-2 text-gray-500 hover:text-gray-700 font-medium text-sm md:text-base">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Phần mềm
                </div>
              </div>
            </Link>
            <Link href="/accounts">
              <div className="py-2 px-2 border-b-2 border-primary-600 text-primary-600 font-medium text-sm md:text-base">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Tài khoản
                </div>
              </div>
            </Link>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          {/* Main content */}
          <div className="w-full">
            {/* Filters bar */}
            <div className="bg-white p-2 rounded-lg shadow-sm mb-3 flex flex-wrap justify-between items-center">
              <div className="text-sm md:text-base text-gray-600">
                Hiển thị {sortedAccounts.length} kết quả
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="sort" className="text-sm md:text-base text-gray-700">Sắp xếp:</label>
                <select 
                  id="sort"
                  className="text-sm md:text-base border-gray-200 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price-low">Giá thấp đến cao</option>
                  <option value="price-high">Giá cao đến thấp</option>
                  <option value="popular">Phổ biến nhất</option>
                </select>
              </div>
            </div>
            
            {/* Product grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              {sortedAccounts.length > 0 ? (
                sortedAccounts.map((account) => {
                  // Lấy ảnh sản phẩm từ account.images nếu có, hoặc từ imageUrl (cho tương thích)
                  const accountImageUrl = account.images && account.images.length > 0
                    ? (typeof account.images[0] === 'string' 
                        ? (account.images[0].startsWith('blob:') 
                            ? '/images/placeholder/product-placeholder.jpg' 
                            : account.images[0])
                        : ((account.images[0] as any)?.url || '/images/placeholder/product-placeholder.jpg'))
                    : (account.imageUrl || '/images/placeholder/product-placeholder.jpg');
                  
                  return (
                    <ProductCard
                      key={account.id}
                      id={account.id.toString()}
                      name={account.name}
                      description={account.description || ''}
                      price={account.salePrice || account.price || 0}
                      originalPrice={account.salePrice ? account.price : undefined}
                      image={accountImageUrl}
                      rating={account.rating || 0}
                      isAccount={true}
                    />
                  );
                })
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500">Không tìm thấy tài khoản nào.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to format currency
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
} 