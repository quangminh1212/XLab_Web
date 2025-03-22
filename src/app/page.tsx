import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Giải pháp phần mềm cho doanh nghiệp của bạn
              </h1>
              <p className="text-xl mb-8">
                Chúng tôi cung cấp các giải pháp phần mềm và dịch vụ công nghệ tốt nhất để giúp doanh nghiệp của bạn phát triển.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="btn bg-white text-primary-600 hover:bg-secondary-100"
                >
                  Xem sản phẩm
                </Link>
                <Link 
                  href="/contact" 
                  className="btn bg-primary-500 hover:bg-primary-400 text-white"
                >
                  Liên hệ ngay
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <Image
                src="/images/hero-image.svg"
                alt="Hero Image"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 bg-secondary-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-900">Tại sao chọn XLab?</h2>
            <p className="text-lg text-primary-800 max-w-3xl mx-auto">
              Chúng tôi cung cấp các giải pháp toàn diện cho doanh nghiệp với công nghệ hiện đại và đội ngũ chuyên gia giàu kinh nghiệm.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-primary-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary-900">Bảo mật tối đa</h3>
              <p className="text-primary-800">
                Các giải pháp của chúng tôi được xây dựng với các tiêu chuẩn bảo mật cao nhất, đảm bảo dữ liệu của bạn luôn được an toàn.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-primary-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary-900">Hiệu suất cao</h3>
              <p className="text-primary-800">
                Các sản phẩm của chúng tôi được tối ưu hóa để mang lại hiệu suất cao nhất, giúp doanh nghiệp của bạn hoạt động hiệu quả hơn.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-primary-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary-900">Công nghệ đám mây</h3>
              <p className="text-primary-800">
                Tận dụng sức mạnh của điện toán đám mây để giảm chi phí, tăng khả năng mở rộng và linh hoạt cho doanh nghiệp của bạn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-900">Sản phẩm nổi bật</h2>
            <p className="text-lg text-primary-800 max-w-3xl mx-auto">
              Khám phá các sản phẩm đột phá của chúng tôi, được thiết kế để giải quyết các thách thức kinh doanh của bạn.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Product 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-48 w-full bg-primary-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  className="text-primary-600 font-medium hover:text-primary-500 inline-flex items-center"
                >
                  Tìm hiểu thêm
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Product 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-48 w-full bg-primary-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  className="text-primary-600 font-medium hover:text-primary-500 inline-flex items-center"
                >
                  Tìm hiểu thêm
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Product 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-48 w-full bg-primary-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  className="text-primary-600 font-medium hover:text-primary-500 inline-flex items-center"
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
              className="btn bg-primary-600 hover:bg-primary-500 text-white"
            >
              Xem tất cả sản phẩm
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-secondary-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-900">Dịch vụ của chúng tôi</h2>
            <p className="text-lg text-primary-800 max-w-3xl mx-auto">
              Chúng tôi cung cấp các dịch vụ chuyên nghiệp để hỗ trợ doanh nghiệp của bạn trong hành trình chuyển đổi số.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Service 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow flex">
              <div className="text-primary-600 mr-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-primary-900">Phát triển phần mềm</h3>
                <p className="text-primary-800">
                  Phát triển các giải pháp phần mềm tùy chỉnh, đáp ứng nhu cầu cụ thể của doanh nghiệp bạn với công nghệ hiện đại.
                </p>
                <Link 
                  href="/services#software-development" 
                  className="text-primary-600 font-medium hover:text-primary-500 inline-flex items-center mt-3"
                >
                  Tìm hiểu thêm
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Service 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow flex">
              <div className="text-primary-600 mr-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-primary-900">Dịch vụ đám mây</h3>
                <p className="text-primary-800">
                  Cung cấp các dịch vụ đám mây toàn diện, từ tư vấn, triển khai đến quản lý và bảo trì hệ thống.
                </p>
                <Link 
                  href="/services#cloud-services" 
                  className="text-primary-600 font-medium hover:text-primary-500 inline-flex items-center mt-3"
                >
                  Tìm hiểu thêm
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Service 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow flex">
              <div className="text-primary-600 mr-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-primary-900">Bảo mật CNTT</h3>
                <p className="text-primary-800">
                  Bảo vệ hệ thống CNTT của bạn khỏi các mối đe dọa với các giải pháp bảo mật toàn diện và dịch vụ giám sát liên tục.
                </p>
                <Link 
                  href="/services#security" 
                  className="text-primary-600 font-medium hover:text-primary-500 inline-flex items-center mt-3"
                >
                  Tìm hiểu thêm
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Service 4 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow flex">
              <div className="text-primary-600 mr-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-primary-900">Tư vấn CNTT</h3>
                <p className="text-primary-800">
                  Cung cấp dịch vụ tư vấn chuyên nghiệp để giúp doanh nghiệp của bạn lựa chọn và triển khai các giải pháp CNTT phù hợp nhất.
                </p>
                <Link 
                  href="/services#consulting" 
                  className="text-primary-600 font-medium hover:text-primary-500 inline-flex items-center mt-3"
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
              className="btn bg-primary-600 hover:bg-primary-500 text-white"
            >
              Xem tất cả dịch vụ
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-700 text-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Sẵn sàng nâng cấp hệ thống CNTT của bạn?</h2>
            <p className="text-xl mb-8">
              Liên hệ với chúng tôi ngay hôm nay để nhận tư vấn miễn phí và khám phá cách chúng tôi có thể giúp doanh nghiệp của bạn phát triển.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="btn bg-white text-primary-600 hover:bg-secondary-100"
              >
                Liên hệ ngay
              </Link>
              <Link 
                href="/services" 
                className="btn bg-primary-600 hover:bg-primary-500 text-white"
              >
                Khám phá dịch vụ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 