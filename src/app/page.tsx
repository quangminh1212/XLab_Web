import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section - Refined with more scientific visual elements */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between mb-24">
          <div className="md:w-1/2 mt-8 md:mt-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Chào mừng đến với <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-500">XLab</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
              Nền tảng xây dựng, phân tích và chia sẻ dữ liệu thông minh cho doanh nghiệp thời đại số.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/services" className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                Khám phá dịch vụ
              </Link>
              <Link href="/contact" className="px-6 py-3 bg-white text-primary-600 font-medium rounded-lg shadow-md border border-primary-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-300">
                Liên hệ ngay
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary-100 rounded-full opacity-70 blur-xl"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-secondary-100 rounded-full opacity-70 blur-xl"></div>
            <Image 
              src="/images/hero-image.svg"
              alt="XLab Analytics Platform" 
              width={600} 
              height={400}
              className="w-full h-auto relative z-10 drop-shadow-lg"
              priority
            />
            <div className="absolute top-1/4 right-10 w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full opacity-30 animate-pulse"></div>
          </div>
        </div>

        {/* Marketplace Section - Enhanced with more elegant styling */}
        <div className="mb-28 relative">
          <div className="absolute -top-20 right-0 w-64 h-64 bg-primary-50 rounded-full opacity-50 blur-3xl -z-10"></div>
          <div className="absolute -bottom-20 left-0 w-64 h-64 bg-secondary-50 rounded-full opacity-50 blur-3xl -z-10"></div>
          
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-block relative">
              Gian hàng phần mềm
              <span className="absolute -bottom-2 left-0 right-0 mx-auto w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></span>
            </h2>
            <p className="text-lg text-gray-600 mt-6 mb-12 max-w-3xl mx-auto leading-relaxed">
              Khám phá các giải pháp phần mềm chất lượng cao được thiết kế đặc biệt cho doanh nghiệp của bạn
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product 1 - Refined card with better visual hierarchy */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100">
              <div className="h-52 bg-gradient-to-r from-primary-500 to-primary-700 relative">
                <div className="absolute top-4 right-4 bg-white text-primary-600 font-bold py-1 px-3 rounded-full text-sm shadow-md">
                  Hot
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-6 text-white">
                  <div className="text-xs uppercase tracking-wider mb-1 font-medium">Analytics</div>
                  <h3 className="text-xl font-bold">XLab Analytics Pro</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-5 leading-relaxed">Giải pháp phân tích dữ liệu toàn diện với trực quan hóa nâng cao và AI.</p>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-500">2.999.000 ₫</span>
                    <span className="ml-2 text-sm text-gray-500 line-through">3.499.000 ₫</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <Link 
                  href="/products/analytics-pro" 
                  className="block w-full text-center py-2.5 px-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
            
            {/* Product 2 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100">
              <div className="h-52 bg-gradient-to-r from-secondary-500 to-secondary-700 relative">
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-6 text-white">
                  <div className="text-xs uppercase tracking-wider mb-1 font-medium">CRM</div>
                  <h3 className="text-xl font-bold">XLab CRM Suite</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-5 leading-relaxed">Quản lý khách hàng thông minh, tự động hóa tiếp thị và bán hàng với AI.</p>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary-600 to-secondary-500">1.899.000 ₫</span>
                    <span className="ml-2 text-sm text-gray-500 line-through">2.299.000 ₫</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <Link 
                  href="/products/crm-suite" 
                  className="block w-full text-center py-2.5 px-4 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
            
            {/* Product 3 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100">
              <div className="h-52 bg-gradient-to-r from-purple-500 to-purple-700 relative">
                <div className="absolute top-4 right-4 bg-white text-purple-600 font-bold py-1 px-3 rounded-full text-sm shadow-md">
                  Mới
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-6 text-white">
                  <div className="text-xs uppercase tracking-wider mb-1 font-medium">Security</div>
                  <h3 className="text-xl font-bold">XLab Cloud Security</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-5 leading-relaxed">Bảo mật đám mây toàn diện với giám sát thời gian thực và phòng chống mối đe dọa.</p>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-500">3.499.000 ₫</span>
                    <span className="ml-2 text-sm text-gray-500 line-through">4.199.000 ₫</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <Link 
                  href="/products/cloud-security" 
                  className="block w-full text-center py-2.5 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/products" 
              className="inline-flex items-center px-8 py-3 border border-primary-200 text-primary-600 bg-white rounded-lg hover:bg-primary-50 hover:border-primary-300 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
            >
              Xem tất cả sản phẩm
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Features Section - More scientific visualization */}
        <div className="mb-28 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-block relative">
              Giải pháp của chúng tôi
              <span className="absolute -bottom-2 left-0 right-0 mx-auto w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6 relative z-10 group-hover:bg-primary-200 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 relative z-10">Phân tích dữ liệu</h3>
              <p className="text-gray-600 leading-relaxed relative z-10">Biến đổi dữ liệu thô thành thông tin hữu ích với các công cụ phân tích tiên tiến và thuật toán AI.</p>
            </div>
            
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="w-16 h-16 bg-secondary-100 rounded-2xl flex items-center justify-center mb-6 relative z-10 group-hover:bg-secondary-200 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 relative z-10">Tự động hóa</h3>
              <p className="text-gray-600 leading-relaxed relative z-10">Tự động hóa quy trình làm việc và tập trung vào các quyết định quan trọng với công nghệ tiên tiến.</p>
            </div>
            
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 relative z-10 group-hover:bg-purple-200 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 relative z-10">Bảo mật dữ liệu</h3>
              <p className="text-gray-600 leading-relaxed relative z-10">Bảo vệ dữ liệu của bạn với các biện pháp bảo mật tiêu chuẩn quốc tế và mã hóa đầu cuối.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mt-20 -mr-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -mb-20 -ml-20"></div>
          <div className="text-center max-w-3xl mx-auto relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Sẵn sàng nâng cấp doanh nghiệp của bạn?</h2>
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn trong quá trình chuyển đổi số với các giải pháp công nghệ tiên tiến.
            </p>
            <Link href="/contact" className="px-8 py-4 bg-white text-primary-600 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-lg">
              Bắt đầu ngay hôm nay
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 