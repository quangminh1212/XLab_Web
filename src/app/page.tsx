import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-600 text-white pb-16 pt-24 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="heroPattern" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(30)">
                <rect width="100%" height="100%" fill="none"/>
                <path d="M0 20 L40 20 M20 0 L20 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#heroPattern)" stroke="none"/>
          </svg>
        </div>
        <div className="container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Giải pháp phần mềm chuyên nghiệp cho doanh nghiệp
              </h1>
              <p className="text-xl mb-8 text-white/90 max-w-xl">
                Chúng tôi cung cấp các giải pháp phần mềm và dịch vụ công nghệ tốt nhất để giúp doanh nghiệp của bạn phát triển.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="btn bg-white text-primary-600 hover:bg-secondary-100 shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                >
                  Khám phá ngay
                </Link>
                <Link 
                  href="/contact" 
                  className="btn bg-primary-500 border-2 border-white/20 hover:bg-primary-400 text-white shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                >
                  Liên hệ với chúng tôi
                </Link>
              </div>
            </div>
            <div className="order-1 md:order-2 flex justify-center md:justify-end">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary-400 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-5 -right-5 w-20 h-20 bg-secondary-400 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
                <Image
                  src="/images/hero-image.svg"
                  alt="XLab Solutions"
                  width={600}
                  height={400}
                  className="w-full h-auto relative z-10 drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" fill="#fff">
            <path d="M0,96L80,85.3C160,75,320,53,480,58.7C640,64,800,96,960,96C1120,96,1280,64,1360,48L1440,32L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"></path>
          </svg>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-900">Tại sao chọn XLab?</h2>
            <p className="text-lg text-primary-800 max-w-3xl mx-auto">
              Chúng tôi cung cấp các giải pháp toàn diện cho doanh nghiệp với công nghệ hiện đại và đội ngũ chuyên gia giàu kinh nghiệm.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-2 duration-300 border border-gray-100">
              <div className="text-primary-600 mb-4 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary-900 text-center">Bảo mật tối đa</h3>
              <p className="text-primary-800 text-center">
                Các giải pháp của chúng tôi được xây dựng với các tiêu chuẩn bảo mật cao nhất, đảm bảo dữ liệu của bạn luôn được an toàn.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-2 duration-300 border border-gray-100">
              <div className="text-primary-600 mb-4 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary-900 text-center">Hiệu suất cao</h3>
              <p className="text-primary-800 text-center">
                Các sản phẩm của chúng tôi được tối ưu hóa để mang lại hiệu suất cao nhất, giúp doanh nghiệp của bạn hoạt động hiệu quả hơn.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-2 duration-300 border border-gray-100">
              <div className="text-primary-600 mb-4 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary-900 text-center">Công nghệ đám mây</h3>
              <p className="text-primary-800 text-center">
                Tận dụng sức mạnh của điện toán đám mây để giảm chi phí, tăng khả năng mở rộng và linh hoạt cho doanh nghiệp của bạn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-900">Sản phẩm nổi bật</h2>
            <p className="text-lg text-primary-800 max-w-3xl mx-auto">
              Khám phá các sản phẩm đột phá của chúng tôi, được thiết kế để giải quyết các thách thức kinh doanh của bạn.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product 1 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
              <div className="h-48 bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center p-6 group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:to-primary-700 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-primary-900">XLab Analytics</h3>
                <p className="text-primary-800 mb-4">
                  Giải pháp phân tích dữ liệu thông minh, giúp doanh nghiệp ra quyết định dựa trên dữ liệu một cách nhanh chóng và chính xác.
                </p>
                <Link 
                  href="/products#analytics" 
                  className="text-primary-600 font-medium hover:text-primary-500 inline-flex items-center group-hover:translate-x-2 transition-transform duration-300"
                >
                  Tìm hiểu thêm
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Product 2 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
              <div className="h-48 bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center p-6 group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:to-primary-700 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-primary-900">XLab Mobile</h3>
                <p className="text-primary-800 mb-4">
                  Nền tảng phát triển ứng dụng di động đa nền tảng, giúp doanh nghiệp tiếp cận khách hàng mọi lúc, mọi nơi.
                </p>
                <Link 
                  href="/products#mobile" 
                  className="text-primary-600 font-medium hover:text-primary-500 inline-flex items-center group-hover:translate-x-2 transition-transform duration-300"
                >
                  Tìm hiểu thêm
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Product 3 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
              <div className="h-48 bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center p-6 group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:to-primary-700 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-primary-900">XLab Cloud</h3>
                <p className="text-primary-800 mb-4">
                  Dịch vụ đám mây toàn diện, giúp doanh nghiệp lưu trữ, quản lý và xử lý dữ liệu một cách hiệu quả và bảo mật.
                </p>
                <Link 
                  href="/products#cloud" 
                  className="text-primary-600 font-medium hover:text-primary-500 inline-flex items-center group-hover:translate-x-2 transition-transform duration-300"
                >
                  Tìm hiểu thêm
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/products" 
              className="btn bg-primary-600 hover:bg-primary-500 text-white shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            >
              Xem tất cả sản phẩm
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-900">Dịch vụ chuyên nghiệp</h2>
            <p className="text-lg text-primary-800 max-w-3xl mx-auto">
              Chúng tôi cung cấp các dịch vụ chuyên nghiệp để hỗ trợ doanh nghiệp của bạn trong hành trình chuyển đổi số.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
            {/* Service 1 */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-6 border border-gray-100">
              <div className="text-primary-600 shrink-0">
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-primary-900">Phát triển phần mềm</h3>
                <p className="text-primary-800 mb-4">
                  Phát triển các giải pháp phần mềm tùy chỉnh, đáp ứng nhu cầu cụ thể của doanh nghiệp bạn với công nghệ hiện đại.
                </p>
                <Link 
                  href="/services#software-development" 
                  className="text-primary-600 font-medium hover:text-primary-500 inline-flex items-center hover:translate-x-2 transition-transform duration-300"
                >
                  Tìm hiểu thêm
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Service 2 */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-6 border border-gray-100">
              <div className="text-primary-600 shrink-0">
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-primary-900">Dịch vụ đám mây</h3>
                <p className="text-primary-800 mb-4">
                  Cung cấp các dịch vụ đám mây toàn diện, từ tư vấn, triển khai đến quản lý và bảo trì hệ thống.
                </p>
                <Link 
                  href="/services#cloud-services" 
                  className="text-primary-600 font-medium hover:text-primary-500 inline-flex items-center hover:translate-x-2 transition-transform duration-300"
                >
                  Tìm hiểu thêm
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Service 3 */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-6 border border-gray-100">
              <div className="text-primary-600 shrink-0">
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-primary-900">Bảo mật CNTT</h3>
                <p className="text-primary-800 mb-4">
                  Bảo vệ hệ thống CNTT của bạn khỏi các mối đe dọa với các giải pháp bảo mật toàn diện và dịch vụ giám sát liên tục.
                </p>
                <Link 
                  href="/services#security" 
                  className="text-primary-600 font-medium hover:text-primary-500 inline-flex items-center hover:translate-x-2 transition-transform duration-300"
                >
                  Tìm hiểu thêm
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Service 4 */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-6 border border-gray-100">
              <div className="text-primary-600 shrink-0">
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-primary-900">Tư vấn CNTT</h3>
                <p className="text-primary-800 mb-4">
                  Cung cấp dịch vụ tư vấn chuyên nghiệp để giúp doanh nghiệp của bạn lựa chọn và triển khai các giải pháp CNTT phù hợp nhất.
                </p>
                <Link 
                  href="/services#consulting" 
                  className="text-primary-600 font-medium hover:text-primary-500 inline-flex items-center hover:translate-x-2 transition-transform duration-300"
                >
                  Tìm hiểu thêm
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/services" 
              className="btn bg-primary-600 hover:bg-primary-500 text-white shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            >
              Xem tất cả dịch vụ
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary-700 to-primary-600 text-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center border-r border-white/20 last:border-0">
              <div className="text-5xl md:text-6xl font-bold mb-2">12+</div>
              <p className="text-lg uppercase tracking-wider text-white/80">Năm kinh nghiệm</p>
            </div>
            <div className="text-center border-r border-white/20 last:border-0">
              <div className="text-5xl md:text-6xl font-bold mb-2">150+</div>
              <p className="text-lg uppercase tracking-wider text-white/80">Dự án hoàn thành</p>
            </div>
            <div className="text-center border-r border-white/20 last:border-0">
              <div className="text-5xl md:text-6xl font-bold mb-2">99%</div>
              <p className="text-lg uppercase tracking-wider text-white/80">Khách hàng hài lòng</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-900">Khách hàng nói gì về chúng tôi</h2>
            <p className="text-lg text-primary-800 max-w-3xl mx-auto">
              Những đánh giá từ khách hàng đã sử dụng dịch vụ của XLab
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 relative">
              <div className="absolute -top-5 -left-5 w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L9.758 4.03c0 0-.218.052-.597.144C8.97 4.222 8.737 4.278 8.472 4.345c-.271.05-.56.187-.882.312C7.272 4.799 6.904 4.895 6.562 5.123c-.344.218-.741.4-1.091.692C5.132 6.116 4.723 6.377 4.421 6.76c-.33.358-.656.734-.909 1.162C3.219 8.33 3.02 8.778 2.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C2.535 17.474 4.338 19 6.5 19c2.485 0 4.5-2.015 4.5-4.5S8.985 10 6.5 10zM17.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L20.758 4.03c0 0-.218.052-.597.144-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.686.238-1.028.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.944-.33.358-.656.734-.909 1.162C14.219 8.33 14.02 8.778 13.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C13.535 17.474 15.338 19 17.5 19c2.485 0 4.5-2.015 4.5-4.5S19.985 10 17.5 10z" />
                </svg>
              </div>
              <p className="text-gray-700 mb-6 mt-4">
                XLab đã giúp chúng tôi xây dựng một hệ thống quản lý dữ liệu hoàn toàn mới. Hiệu suất làm việc của đội ngũ tăng lên đáng kể và tiết kiệm được nhiều chi phí.
              </p>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-primary-600 font-bold text-xl">N</div>
                <div className="ml-4">
                  <h4 className="font-semibold text-primary-900">Nguyễn Văn A</h4>
                  <p className="text-gray-600 text-sm">Giám đốc Công nghệ - Tech Group</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 relative">
              <div className="absolute -top-5 -left-5 w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L9.758 4.03c0 0-.218.052-.597.144C8.97 4.222 8.737 4.278 8.472 4.345c-.271.05-.56.187-.882.312C7.272 4.799 6.904 4.895 6.562 5.123c-.344.218-.741.4-1.091.692C5.132 6.116 4.723 6.377 4.421 6.76c-.33.358-.656.734-.909 1.162C3.219 8.33 3.02 8.778 2.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C2.535 17.474 4.338 19 6.5 19c2.485 0 4.5-2.015 4.5-4.5S8.985 10 6.5 10zM17.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L20.758 4.03c0 0-.218.052-.597.144-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.686.238-1.028.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.944-.33.358-.656.734-.909 1.162C14.219 8.33 14.02 8.778 13.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C13.535 17.474 15.338 19 17.5 19c2.485 0 4.5-2.015 4.5-4.5S19.985 10 17.5 10z" />
                </svg>
              </div>
              <p className="text-gray-700 mb-6 mt-4">
                Đội ngũ XLab làm việc rất chuyên nghiệp. Họ đã cung cấp giải pháp cloud phù hợp với nhu cầu của chúng tôi và hỗ trợ kỹ thuật rất nhanh chóng.
              </p>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-primary-600 font-bold text-xl">T</div>
                <div className="ml-4">
                  <h4 className="font-semibold text-primary-900">Trần Thị B</h4>
                  <p className="text-gray-600 text-sm">Quản lý Dự án - Smart Solutions</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 relative">
              <div className="absolute -top-5 -left-5 w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L9.758 4.03c0 0-.218.052-.597.144C8.97 4.222 8.737 4.278 8.472 4.345c-.271.05-.56.187-.882.312C7.272 4.799 6.904 4.895 6.562 5.123c-.344.218-.741.4-1.091.692C5.132 6.116 4.723 6.377 4.421 6.76c-.33.358-.656.734-.909 1.162C3.219 8.33 3.02 8.778 2.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C2.535 17.474 4.338 19 6.5 19c2.485 0 4.5-2.015 4.5-4.5S8.985 10 6.5 10zM17.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L20.758 4.03c0 0-.218.052-.597.144-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.686.238-1.028.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.944-.33.358-.656.734-.909 1.162C14.219 8.33 14.02 8.778 13.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C13.535 17.474 15.338 19 17.5 19c2.485 0 4.5-2.015 4.5-4.5S19.985 10 17.5 10z" />
                </svg>
              </div>
              <p className="text-gray-700 mb-6 mt-4">
                Ứng dụng di động do XLab phát triển đã giúp chúng tôi tăng 40% tương tác với khách hàng. Giao diện đẹp và dễ sử dụng, khách hàng rất hài lòng.
              </p>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-primary-600 font-bold text-xl">L</div>
                <div className="ml-4">
                  <h4 className="font-semibold text-primary-900">Lê Văn C</h4>
                  <p className="text-gray-600 text-sm">Giám đốc Marketing - Digital Brand</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-700 to-primary-600 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-800 rounded-full opacity-20 translate-x-1/3 translate-y-1/2"></div>
        
        <div className="container relative z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-10 border border-white/20 shadow-xl">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">Sẵn sàng nâng cấp hệ thống CNTT của bạn?</h2>
              <p className="text-xl mb-8 text-white/90">
                Liên hệ với chúng tôi ngay hôm nay để nhận tư vấn miễn phí và khám phá cách chúng tôi có thể giúp doanh nghiệp của bạn phát triển.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact" 
                  className="btn bg-white text-primary-600 hover:bg-secondary-100 shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                >
                  Liên hệ ngay
                </Link>
                <Link 
                  href="/services" 
                  className="btn bg-primary-600 hover:bg-primary-500 text-white border-2 border-white/20 shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                >
                  Khám phá dịch vụ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 