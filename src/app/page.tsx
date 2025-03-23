'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image'
import Link from 'next/link'
import { products, categories, stores } from '@/data/mockData'
import CategoryList from '@/components/CategoryList'
import ProductGrid from '@/components/ProductGrid'

export default function Home() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [showDebug, setShowDebug] = useState(false);
  
  useEffect(() => {
    try {
      // Collect detailed debug information
      const info = {
        // Environment info
        nextVersion: process.env.NEXT_PUBLIC_VERSION || 'unknown',
        nodeEnv: process.env.NODE_ENV,
        debugCalls: process.env.DEBUG_CALLS,
        
        // Runtime checks
        windowDefined: typeof window !== 'undefined',
        documentDefined: typeof document !== 'undefined',
        
        // Function prototype tests
        functionPrototype: {
          call: typeof Function.prototype.call === 'function',
          apply: typeof Function.prototype.apply === 'function',
          bind: typeof Function.prototype.bind === 'function',
        },
        
        // Error status
        hasErrors: false,
        errorMessages: [] as string[],
      };
      
      // Test Function.prototype.call
      try {
        const testObj = { value: 'test' };
        const testFn = function(this: any, arg: string) { 
          return `${this.value}-${arg}`; 
        };
        const result = Function.prototype.call.call(testFn, testObj, 'arg');
        info.callTestResult = result;
      } catch (e: any) {
        info.hasErrors = true;
        info.errorMessages.push(`Function.call test error: ${e.message}`);
        info.callTestError = e.message;
      }
      
      setDebugInfo(info);
    } catch (error: any) {
      setDebugInfo({
        error: error.message,
        stack: error.stack,
      });
    }
  }, []);

  // Get featured products for the homepage
  const featuredProducts = products.filter(product => product.featured)
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Simplified Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-10 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              XLab <span className="text-primary-600">Market</span>
              </h1>
            <p className="text-lg text-gray-600 mb-6">
              Chợ phần mềm riêng của bạn - Tải về và sử dụng ngay hôm nay
            </p>
            <div className="flex justify-center">
              <div className="relative max-w-lg w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
              </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm phần mềm, ứng dụng..."
                  className="block w-full bg-white border border-gray-200 rounded-full py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Danh mục</h2>
            <Link href="/categories" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Xem tất cả
            </Link>
          </div>
          <CategoryList categories={categories} />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Phần mềm nổi bật</h2>
            <Link href="/products" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Xem tất cả
            </Link>
          </div>
          <ProductGrid products={featuredProducts.slice(0, 4)} />
        </div>
      </section>

      {/* Newest Products */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Sản phẩm mới nhất</h2>
            <Link href="/products" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Xem tất cả
            </Link>
          </div>
          <ProductGrid 
            products={[...products].sort((a, b) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ).slice(0, 8)} 
          />
        </div>
      </section>

      {/* Popular Stores */}
      <section className="py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Gian hàng phổ biến</h2>
            <Link href="/stores" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Xem tất cả
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stores.map(store => (
              <Link 
                key={store.id}
                href={`/stores/${store.id}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden group"
              >
                <div className="p-6">
              <div className="flex items-center">
                    <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mr-4">
                      {store.imageUrl ? (
                        <Image 
                          src={store.imageUrl}
                          alt={store.name}
                          width={64}
                          height={64}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <svg className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                      )}
              </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                        {store.name}
                      </h3>
                      <p className="text-sm text-gray-500">{store.description}</p>
              </div>
            </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Simplified */}
      <section className="py-10 bg-primary-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Bạn muốn thêm phần mềm riêng?</h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Đăng ký làm chủ gian hàng để tải lên và quản lý các sản phẩm phần mềm của riêng bạn.
          </p>
          <div className="flex justify-center space-x-4">
                <Link 
              href="/register"
              className="bg-white text-primary-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
                >
              Đăng ký ngay
                </Link>
                <Link 
              href="/about"
              className="bg-primary-700 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-800 transition-colors"
                >
              Tìm hiểu thêm
                </Link>
          </div>
        </div>
      </section>

      {/* Debug Information Section - Hidden by default */}
      <div className="container mx-auto px-4 py-6">
        <button 
          onClick={() => setShowDebug(!showDebug)}
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded"
        >
          {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
        </button>
        
        {showDebug && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h3 className="font-mono text-sm font-bold mb-2">Debug Information</h3>
            <pre className="text-xs font-mono bg-gray-800 text-gray-100 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
            
            <div className="mt-4">
              <h4 className="font-mono text-sm font-bold mb-2">Function Test</h4>
              <button
                onClick={() => {
                  try {
                    const testFn = function(this: any, text: string) { 
                      return `Test: ${text}`; 
                    };
                    const result = testFn.call(null, "Function Call Test");
                    alert(`Test successful: ${result}`);
                  } catch (e: any) {
                    alert(`Test failed: ${e.message}`);
                  }
                }}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 py-1 px-2 rounded text-xs mr-2"
              >
                Test Function.call
              </button>
              
              <button
                onClick={() => {
                  try {
                    // Force an error by calling a method on undefined
                    const obj: any = undefined;
                    obj.method();
                  } catch (e: any) {
                    alert(`Caught error: ${e.message}`);
                  }
                }}
                className="bg-red-100 hover:bg-red-200 text-red-800 py-1 px-2 rounded text-xs"
              >
                Simulate Error
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 