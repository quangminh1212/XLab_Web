import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section - Thiết kế tối giản, hiện đại */}
      <section className="py-16 md:py-28 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 z-10">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                Chào mừng đến với <span className="text-primary-600">XLab</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
                Nền tảng xây dựng, phân tích và chia sẻ dữ liệu thông minh cho doanh nghiệp thời đại số.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/services" 
                  className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg transition-all hover:bg-primary-700 hover:shadow-lg">
                  Bắt đầu ngay
                </Link>
                <Link href="/contact" 
                  className="px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all">
                  Liên hệ ngay
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0 relative">
              <div className="relative flex justify-center items-center">
                <div className="absolute w-72 h-72 bg-primary-100 rounded-full opacity-30 animate-pulse"></div>
                <Image 
                  src="/images/hero-image.svg"
                  alt="XLab Analytics Platform" 
                  width={600} 
                  height={400}
                  priority
                  className="relative z-10"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/3 right-0 w-64 h-64 rounded-full bg-primary-50 -z-10 blur-3xl opacity-70"></div>
        <div className="absolute bottom-0 left-20 w-72 h-72 rounded-full bg-secondary-50 -z-10 blur-3xl opacity-70"></div>
      </section>

      {/* Features Section - Thiết kế tối giản */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Giải pháp tối ưu cho doanh nghiệp</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Tối ưu hiệu suất và đơn giản hóa quy trình làm việc với các tính năng tiên tiến
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Phân tích dữ liệu</h3>
              <p className="text-gray-600 mb-4">Thu thập, phân tích và trực quan hóa dữ liệu giúp ra quyết định tốt hơn.</p>
              <Link href="/services/analytics" className="text-primary-600 font-medium hover:text-primary-700 inline-flex items-center group">
                Tìm hiểu thêm
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quản lý khách hàng</h3>
              <p className="text-gray-600 mb-4">Theo dõi tương tác, hiểu nhu cầu và tạo trải nghiệm tuyệt vời cho khách hàng.</p>
              <Link href="/services/crm" className="text-primary-600 font-medium hover:text-primary-700 inline-flex items-center group">
                Tìm hiểu thêm
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Tự động hóa</h3>
              <p className="text-gray-600 mb-4">Tự động hóa quy trình lặp lại giúp tiết kiệm thời gian và tăng năng suất.</p>
              <Link href="/services/automation" className="text-primary-600 font-medium hover:text-primary-700 inline-flex items-center group">
                Tìm hiểu thêm
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section - Thiết kế giống các trang sản phẩm lớn */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Gian hàng phần mềm</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Khám phá các giải pháp phần mềm chất lượng cao được thiết kế đặc biệt cho doanh nghiệp của bạn
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Product 1 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
              <div className="relative">
                <div className="h-48 bg-gradient-to-r from-primary-500 to-primary-600"></div>
                <div className="absolute top-4 right-4 bg-white text-primary-600 font-medium py-1 px-3 rounded-full text-sm shadow-sm">
                  Hot
                </div>
                <div className="absolute -bottom-6 left-0 right-0 flex justify-center">
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-10 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">XLab Analytics Pro</h3>
                <p className="text-gray-600 mb-6">Giải pháp phân tích dữ liệu toàn diện với trực quan hóa nâng cao và AI.</p>
                <div className="mb-6">
                  <span className="text-2xl font-bold text-gray-900">2.999.000 ₫</span>
                  <span className="ml-2 text-sm text-gray-500 line-through">3.499.000 ₫</span>
                </div>
                <Link 
                  href="/products/analytics-pro" 
                  className="block w-full py-2.5 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
            
            {/* Product 2 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
              <div className="relative">
                <div className="h-48 bg-gradient-to-r from-secondary-500 to-secondary-600"></div>
                <div className="absolute -bottom-6 left-0 right-0 flex justify-center">
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-10 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">XLab CRM Suite</h3>
                <p className="text-gray-600 mb-6">Nâng cao trải nghiệm khách hàng với hệ thống quản lý quan hệ khách hàng thông minh.</p>
                <div className="mb-6">
                  <span className="text-2xl font-bold text-gray-900">1.799.000 ₫</span>
                  <span className="ml-2 text-sm text-gray-500 line-through">2.199.000 ₫</span>
                </div>
                <Link 
                  href="/products/crm-suite" 
                  className="block w-full py-2.5 px-4 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
            
            {/* Product 3 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
              <div className="relative">
                <div className="h-48 bg-gradient-to-r from-purple-500 to-purple-600"></div>
                <div className="absolute top-4 right-4 bg-white text-purple-600 font-medium py-1 px-3 rounded-full text-sm shadow-sm">
                  Mới
                </div>
                <div className="absolute -bottom-6 left-0 right-0 flex justify-center">
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-10 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">XLab Automation</h3>
                <p className="text-gray-600 mb-6">Tự động hóa quy trình kinh doanh và tiết kiệm thời gian với các công cụ tự động.</p>
                <div className="mb-6">
                  <span className="text-2xl font-bold text-gray-900">1.499.000 ₫</span>
                </div>
                <Link 
                  href="/products/automation" 
                  className="block w-full py-2.5 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Thiết kế tối giản, hiện đại */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Sẵn sàng nâng cấp doanh nghiệp của bạn?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Bắt đầu ngay hôm nay với giải pháp phần mềm hoàn chỉnh từ XLab. Chúng tôi sẽ đồng hành cùng bạn trong hành trình chuyển đổi số.
          </p>
          <div className="flex justify-center flex-wrap gap-4">
            <Link href="/contact" 
              className="px-8 py-3 bg-primary-600 text-white font-medium rounded-lg shadow-sm hover:shadow-md hover:bg-primary-700 transition-all">
              Liên hệ tư vấn
            </Link>
            <Link href="/products" 
              className="px-8 py-3 bg-white text-gray-700 font-medium rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-all">
              Xem tất cả sản phẩm
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 