import Link from 'next/link'
import Image from 'next/image'

export default function ProductsPage() {
  return (
    <div>
      {/* Page Header - Scientific style with particles */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/4 top-1/3 w-12 h-12 bg-white opacity-10 rounded-full"></div>
          <div className="absolute left-1/2 top-1/4 w-24 h-24 bg-white opacity-5 rounded-full"></div>
          <div className="absolute right-1/4 top-2/3 w-16 h-16 bg-white opacity-10 rounded-full"></div>
          <div className="absolute left-1/3 bottom-1/4 w-20 h-20 bg-white opacity-5 rounded-full"></div>
          <div className="absolute right-1/3 bottom-1/3 w-8 h-8 bg-white opacity-10 rounded-full"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Gian hàng phần mềm</h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed opacity-90">
              Khám phá các sản phẩm phần mềm hiện đại được thiết kế riêng cho doanh nghiệp của bạn.
            </p>
          </div>
        </div>
        <svg className="absolute bottom-0 left-0 right-0 w-full text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80">
          <path fill="currentColor" fillOpacity="1" d="M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"></path>
        </svg>
      </section>

      {/* Filter & Search Section - More refined UI */}
      <section className="py-10 bg-white border-b border-gray-100 relative z-20 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between gap-6 items-center">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="font-medium text-gray-700 mr-2">Phân loại:</div>
              <button className="px-5 py-2 bg-primary-600 text-white rounded-full text-sm hover:bg-primary-700 transition-all duration-300 shadow-sm hover:shadow-md">
                Tất cả
              </button>
              <button className="px-5 py-2 bg-white border border-gray-200 rounded-full text-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md">
                Phân tích dữ liệu
              </button>
              <button className="px-5 py-2 bg-white border border-gray-200 rounded-full text-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md">
                Quản lý khách hàng
              </button>
              <button className="px-5 py-2 bg-white border border-gray-200 rounded-full text-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md">
                Bảo mật
              </button>
            </div>
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-12 pr-4 py-3 w-full border border-gray-200 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none shadow-sm"
              />
              <svg
                className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Products List - Scientific and elegant presentation */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product 1 - Business Suite */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100 group">
              <div className="relative">
                <div className="h-64 bg-gradient-to-r from-primary-500 to-primary-700"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
                <div className="absolute top-4 right-4 bg-white text-primary-600 font-bold py-1 px-4 rounded-full text-sm shadow-md">
                  Hot
                </div>
                <div className="absolute top-4 left-4 bg-red-500 text-white font-medium py-1 px-4 rounded-full text-sm shadow-md">
                  -15%
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-xs uppercase tracking-wider font-medium bg-white/20 px-2 py-1 rounded-sm backdrop-blur-sm">Business Suite</div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-sm">4.9</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-1 group-hover:text-primary-200 transition-colors duration-300">XLab Business Suite</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Giải pháp phần mềm toàn diện cho việc quản lý doanh nghiệp, bao gồm kế toán, quản lý nhân sự, quản lý khách hàng và nhiều tính năng khác.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">Quản lý</span>
                  <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">Tự động hóa</span>
                  <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">Báo cáo</span>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-500">2.999.000 ₫</span>
                    <span className="ml-2 text-sm text-gray-500 line-through">3.499.000 ₫</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link
                    href="/products/business-suite"
                    className="flex-1 text-center py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    Chi tiết
                  </Link>
                  <button className="py-3 px-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Product 2 - Analytics Pro */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100 group">
              <div className="relative">
                <div className="h-64 bg-gradient-to-r from-secondary-500 to-secondary-700"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
                <div className="absolute top-4 right-4 bg-white text-secondary-600 font-bold py-1 px-4 rounded-full text-sm shadow-md">
                  Best Seller
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-xs uppercase tracking-wider font-medium bg-white/20 px-2 py-1 rounded-sm backdrop-blur-sm">Analytics</div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-sm">4.8</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-1 group-hover:text-secondary-200 transition-colors duration-300">XLab Analytics Pro</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Công cụ phân tích dữ liệu nâng cao giúp bạn hiểu rõ hoạt động kinh doanh và đưa ra quyết định dựa trên dữ liệu thực tế.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-secondary-50 text-secondary-700 text-xs font-medium rounded-full">Phân tích</span>
                  <span className="px-3 py-1 bg-secondary-50 text-secondary-700 text-xs font-medium rounded-full">Báo cáo</span>
                  <span className="px-3 py-1 bg-secondary-50 text-secondary-700 text-xs font-medium rounded-full">BI</span>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary-600 to-secondary-500">1.899.000 ₫</span>
                    <span className="ml-2 text-sm text-gray-500 line-through">2.299.000 ₫</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link
                    href="/products/analytics-pro"
                    className="flex-1 text-center py-3 px-4 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    Chi tiết
                  </Link>
                  <button className="py-3 px-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Product 3 - Cloud Solutions */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100 group">
              <div className="relative">
                <div className="h-64 bg-gradient-to-r from-purple-600 to-purple-800"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
                <div className="absolute top-4 right-4 bg-white text-purple-600 font-bold py-1 px-4 rounded-full text-sm shadow-md">
                  Mới
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-xs uppercase tracking-wider font-medium bg-white/20 px-2 py-1 rounded-sm backdrop-blur-sm">Cloud</div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-sm">5.0</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-1 group-hover:text-purple-200 transition-colors duration-300">XLab Cloud Solutions</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Giải pháp đám mây bảo mật và hiệu quả giúp doanh nghiệp vận hành mượt mà từ bất kỳ đâu với khả năng mở rộng linh hoạt.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">Cloud</span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">Bảo mật</span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">Lưu trữ</span>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-500">3.499.000 ₫</span>
                    <span className="ml-2 text-sm text-gray-500 line-through">4.199.000 ₫</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link
                    href="/products/cloud-solutions"
                    className="flex-1 text-center py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    Chi tiết
                  </Link>
                  <button className="py-3 px-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Product 4, 5, 6 with the same enhanced style... */}
            {/* Remaining products would follow the same pattern */}
            
          </div>
          
          {/* Pagination - More elegant */}
          <div className="flex justify-center mt-16">
            <nav className="inline-flex rounded-lg shadow-sm overflow-hidden">
              <a href="#" className="flex items-center justify-center py-2 px-4 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors duration-300">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Trước
              </a>
              <a href="#" className="py-2 px-4 bg-primary-600 text-white border border-primary-600 font-medium hover:bg-primary-700 transition-colors duration-300">
                1
              </a>
              <a href="#" className="py-2 px-4 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors duration-300">
                2
              </a>
              <a href="#" className="py-2 px-4 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors duration-300">
                3
              </a>
              <a href="#" className="flex items-center justify-center py-2 px-4 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors duration-300">
                Sau
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </a>
            </nav>
          </div>
        </div>
      </section>

      {/* CTA Section - More visually interesting */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-secondary-100"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-200 rounded-full opacity-50 blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-200 rounded-full opacity-50 blur-3xl -ml-32 -mb-32"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto border border-gray-100">
            <div className="text-center">
              <div className="inline-block p-3 bg-primary-100 rounded-full mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
                Bạn cần một giải pháp riêng biệt?
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Chúng tôi cung cấp dịch vụ phát triển phần mềm theo yêu cầu với đội ngũ chuyên gia hàng đầu. Hãy liên hệ với chúng tôi để được tư vấn giải pháp phù hợp nhất cho doanh nghiệp của bạn.
              </p>
              <Link href="/contact" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Liên hệ ngay
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 