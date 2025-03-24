import Link from 'next/link'
import Image from 'next/image'

export default function ProductsPage() {
  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Gian hàng phần mềm</h1>
          <p className="text-xl max-w-3xl">
            Khám phá các sản phẩm phần mềm hiện đại được thiết kế riêng cho doanh nghiệp của bạn.
          </p>
        </div>
      </section>

      {/* Filter & Search Section */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="font-medium">Phân loại:</div>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-full text-sm hover:bg-primary-700 transition-colors">
                Tất cả
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition-colors">
                Phân tích dữ liệu
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition-colors">
                Quản lý khách hàng
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition-colors">
                Bảo mật
              </button>
            </div>
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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

      {/* Products List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product 1 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:-translate-y-1 duration-300">
              <div className="relative">
                <div className="h-48 bg-gradient-to-r from-primary-500 to-primary-700"></div>
                <div className="absolute top-4 right-4 bg-white text-primary-600 font-bold py-1 px-3 rounded-full text-sm">
                  Hot
                </div>
                <div className="absolute top-4 left-4 bg-red-500 text-white font-medium py-1 px-3 rounded-full text-sm">
                  -15%
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold">XLab Business Suite</h3>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-sm text-gray-600">4.9</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Giải pháp phần mềm toàn diện cho việc quản lý doanh nghiệp, bao gồm kế toán, quản lý nhân sự, quản lý khách hàng và nhiều tính năng khác.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">Quản lý</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">Tự động hóa</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">Báo cáo</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-primary-600">2.999.000 ₫</span>
                    <span className="ml-2 text-sm text-gray-500 line-through">3.499.000 ₫</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href="/products/business-suite"
                    className="flex-1 text-center py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Chi tiết
                  </Link>
                  <button className="py-2 px-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Product 2 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:-translate-y-1 duration-300">
              <div className="relative">
                <div className="h-48 bg-gradient-to-r from-secondary-500 to-secondary-700"></div>
                <div className="absolute top-4 right-4 bg-white text-secondary-600 font-bold py-1 px-3 rounded-full text-sm">
                  Best Seller
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold">XLab Analytics Pro</h3>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-sm text-gray-600">4.8</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Công cụ phân tích dữ liệu nâng cao giúp bạn hiểu rõ hoạt động kinh doanh và đưa ra quyết định dựa trên dữ liệu thực tế.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">Phân tích</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">Báo cáo</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">BI</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-primary-600">1.899.000 ₫</span>
                    <span className="ml-2 text-sm text-gray-500 line-through">2.299.000 ₫</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href="/products/analytics-pro"
                    className="flex-1 text-center py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Chi tiết
                  </Link>
                  <button className="py-2 px-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Product 3 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:-translate-y-1 duration-300">
              <div className="relative">
                <div className="h-48 bg-gradient-to-r from-primary-700 to-secondary-700"></div>
                <div className="absolute top-4 right-4 bg-white text-primary-600 font-bold py-1 px-3 rounded-full text-sm">
                  Mới
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold">XLab Cloud Solutions</h3>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-sm text-gray-600">5.0</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Giải pháp đám mây bảo mật và hiệu quả giúp doanh nghiệp vận hành mượt mà từ bất kỳ đâu với khả năng mở rộng linh hoạt.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">Cloud</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">Bảo mật</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">Lưu trữ</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-primary-600">3.499.000 ₫</span>
                    <span className="ml-2 text-sm text-gray-500 line-through">4.199.000 ₫</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href="/products/cloud-solutions"
                    className="flex-1 text-center py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Chi tiết
                  </Link>
                  <button className="py-2 px-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Remaining products from the original file */}
            {/* Product 4 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:-translate-y-1 duration-300">
              <div className="relative">
                <div className="h-48 bg-gradient-to-r from-primary-600 to-primary-800"></div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold">XLab CRM Pro</h3>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-sm text-gray-600">4.7</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Phần mềm quản lý quan hệ khách hàng giúp doanh nghiệp quản lý, phân tích và tối ưu hóa mọi tương tác với khách hàng.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">CRM</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">Khách hàng</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">Bán hàng</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-primary-600">2.499.000 ₫</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href="/products/crm-pro"
                    className="flex-1 text-center py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Chi tiết
                  </Link>
                  <button className="py-2 px-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Product 5 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:-translate-y-1 duration-300">
              <div className="relative">
                <div className="h-48 bg-gradient-to-r from-secondary-600 to-secondary-800"></div>
                <div className="absolute top-4 left-4 bg-red-500 text-white font-medium py-1 px-3 rounded-full text-sm">
                  -20%
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold">XLab HR Management</h3>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-sm text-gray-600">4.5</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Giải pháp quản lý nhân sự toàn diện, từ tuyển dụng đến đánh giá hiệu suất và phát triển nhân tài.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">HR</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">Nhân sự</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">Tuyển dụng</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-primary-600">1.999.000 ₫</span>
                    <span className="ml-2 text-sm text-gray-500 line-through">2.499.000 ₫</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href="/products/hr-management"
                    className="flex-1 text-center py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Chi tiết
                  </Link>
                  <button className="py-2 px-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Product 6 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:-translate-y-1 duration-300">
              <div className="relative">
                <div className="h-48 bg-gradient-to-r from-primary-800 to-secondary-600"></div>
                <div className="absolute top-4 right-4 bg-white text-primary-600 font-bold py-1 px-3 rounded-full text-sm">
                  Premium
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold">XLab E-commerce Platform</h3>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-sm text-gray-600">4.9</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Nền tảng thương mại điện tử mạnh mẽ giúp doanh nghiệp nhanh chóng triển khai cửa hàng trực tuyến với đầy đủ tính năng.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">E-commerce</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">Bán hàng</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">Marketing</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-primary-600">4.999.000 ₫</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href="/products/ecommerce-platform"
                    className="flex-1 text-center py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Chi tiết
                  </Link>
                  <button className="py-2 px-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <nav className="inline-flex rounded-md shadow">
              <a href="#" className="py-2 px-4 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50">
                Trước
              </a>
              <a href="#" className="py-2 px-4 bg-primary-600 text-white border border-primary-600">
                1
              </a>
              <a href="#" className="py-2 px-4 bg-white border border-gray-300 hover:bg-gray-50">
                2
              </a>
              <a href="#" className="py-2 px-4 bg-white border border-gray-300 hover:bg-gray-50">
                3
              </a>
              <a href="#" className="py-2 px-4 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50">
                Sau
              </a>
            </nav>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Bạn cần một giải pháp riêng biệt?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Chúng tôi cung cấp dịch vụ phát triển phần mềm theo yêu cầu. Hãy liên hệ với chúng tôi để được tư vấn giải pháp phù hợp nhất.
              </p>
              <Link href="/contact" className="px-8 py-3 bg-primary-600 text-white font-medium rounded-lg shadow-md hover:bg-primary-700 transition-colors">
                Liên hệ ngay
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 