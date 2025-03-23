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