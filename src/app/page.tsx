import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between mb-20">
          <div className="md:w-1/2 mt-8 md:mt-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Chào mừng đến với <span className="text-indigo-600">XLab</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Nền tảng xây dựng, phân tích và chia sẻ dữ liệu thông minh cho doanh nghiệp thời đại số.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/services" className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                Khám phá dịch vụ
              </Link>
              <Link href="/contact" className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg shadow-md border border-indigo-600 hover:bg-indigo-50 transition-colors">
                Liên hệ ngay
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <Image 
              src="/images/hero-image.svg"
              alt="XLab Analytics Platform" 
              width={600} 
              height={400}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>

        {/* Marketplace Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-6">Gian hàng phần mềm</h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Khám phá các giải pháp phần mềm chất lượng cao được thiết kế đặc biệt cho doanh nghiệp của bạn
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product 1 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="h-48 bg-gradient-to-r from-indigo-500 to-indigo-700 relative">
                <div className="absolute top-4 right-4 bg-white text-indigo-600 font-bold py-1 px-3 rounded-full text-sm">
                  Hot
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">XLab Analytics Pro</h3>
                <p className="text-gray-600 mb-4">Giải pháp phân tích dữ liệu toàn diện với trực quan hóa nâng cao.</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-indigo-600">2.999.000 ₫</span>
                  <span className="text-sm text-gray-500 line-through">3.499.000 ₫</span>
                </div>
                <Link 
                  href="/products/analytics-pro" 
                  className="block w-full text-center py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
            
            {/* Product 2 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="h-48 bg-gradient-to-r from-teal-500 to-teal-700"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">XLab CRM Suite</h3>
                <p className="text-gray-600 mb-4">Quản lý khách hàng thông minh, tự động hóa tiếp thị và bán hàng.</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-indigo-600">1.899.000 ₫</span>
                  <span className="text-sm text-gray-500 line-through">2.299.000 ₫</span>
                </div>
                <Link 
                  href="/products/crm-suite" 
                  className="block w-full text-center py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
            
            {/* Product 3 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="h-48 bg-gradient-to-r from-purple-500 to-purple-700 relative">
                <div className="absolute top-4 right-4 bg-white text-indigo-600 font-bold py-1 px-3 rounded-full text-sm">
                  Mới
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">XLab Cloud Security</h3>
                <p className="text-gray-600 mb-4">Bảo mật đám mây toàn diện với giám sát thời gian thực và phòng chống mối đe dọa.</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-indigo-600">3.499.000 ₫</span>
                  <span className="text-sm text-gray-500 line-through">4.199.000 ₫</span>
                </div>
                <Link 
                  href="/products/cloud-security" 
                  className="block w-full text-center py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link 
              href="/products" 
              className="inline-flex items-center px-6 py-3 border border-indigo-600 text-indigo-600 bg-white rounded-lg hover:bg-indigo-50 transition-colors font-medium"
            >
              Xem tất cả sản phẩm
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Giải pháp của chúng tôi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Phân tích dữ liệu</h3>
              <p className="text-gray-600">Biến đổi dữ liệu thô thành thông tin hữu ích với các công cụ phân tích tiên tiến.</p>
            </div>
            
            <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Tự động hóa</h3>
              <p className="text-gray-600">Tự động hóa quy trình làm việc và tập trung vào các quyết định quan trọng.</p>
            </div>
            
            <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Bảo mật dữ liệu</h3>
              <p className="text-gray-600">Bảo vệ dữ liệu của bạn với các biện pháp bảo mật tiêu chuẩn quốc tế.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-indigo-100 rounded-2xl p-8 md:p-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Sẵn sàng nâng cấp doanh nghiệp của bạn?</h2>
            <p className="text-lg text-gray-700 mb-8">
              Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn trong quá trình chuyển đổi số.
            </p>
            <Link href="/contact" className="px-8 py-4 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-colors text-lg">
              Bắt đầu ngay hôm nay
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 