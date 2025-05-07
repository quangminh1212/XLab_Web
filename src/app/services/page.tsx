import Link from 'next/link'

export default function ServicesPage() {
  return (
    <div>
      {/* Page Header - Cải thiện với nền gradient và kích thước lớn hơn */}
      <section className="relative bg-gradient-to-r from-teal-600 to-teal-800 text-white py-28">
        <div className="absolute inset-0 bg-[url('/images/pattern-bg.svg')] opacity-10"></div>
        <div className="container relative z-10 max-w-6xl mx-auto px-6">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">Dịch vụ</h1>
            <p className="text-xl md:text-2xl font-light max-w-3xl">
              Chúng tôi cung cấp các dịch vụ công nghệ chuyên nghiệp giúp doanh nghiệp của bạn phát triển.
            </p>
          </div>
        </div>
      </section>

      {/* Main Services - Làm lớn hơn và thêm khoảng cách */}
      <section className="py-24">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-5">Dịch vụ chính</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Các giải pháp công nghệ toàn diện được thiết kế riêng cho doanh nghiệp của bạn
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Service 1 */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/4 flex-shrink-0">
                <div className="bg-teal-100 text-teal-600 rounded-full w-24 h-24 flex items-center justify-center shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-2xl font-bold mb-4">Phát triển phần mềm theo yêu cầu</h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Chúng tôi xây dựng các giải pháp phần mềm tùy chỉnh theo nhu cầu cụ thể của doanh nghiệp, từ ứng dụng web đến ứng dụng di động và hệ thống backend.
                </p>
                <Link
                  href="/services/software-development"
                  className="text-teal-600 font-medium hover:text-teal-700 inline-flex items-center text-lg"
                >
                  Tìm hiểu thêm
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Service 2 */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/4 flex-shrink-0">
                <div className="bg-teal-100 text-teal-600 rounded-full w-24 h-24 flex items-center justify-center shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                </div>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-2xl font-bold mb-4">Dịch vụ đám mây</h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Cung cấp giải pháp đám mây toàn diện, từ tư vấn và triển khai đến quản lý và tối ưu hóa, giúp doanh nghiệp tiết kiệm chi phí và tăng cường khả năng mở rộng.
                </p>
                <Link
                  href="/services/cloud-services"
                  className="text-teal-600 font-medium hover:text-teal-700 inline-flex items-center text-lg"
                >
                  Tìm hiểu thêm
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Service 3 */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/4 flex-shrink-0">
                <div className="bg-teal-100 text-teal-600 rounded-full w-24 h-24 flex items-center justify-center shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-2xl font-bold mb-4">Tư vấn công nghệ</h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Cung cấp dịch vụ tư vấn chuyên nghiệp về chiến lược công nghệ, lộ trình chuyển đổi số và tối ưu hóa quy trình, giúp doanh nghiệp đưa ra quyết định đúng đắn.
                </p>
                <Link
                  href="/services/consulting"
                  className="text-teal-600 font-medium hover:text-teal-700 inline-flex items-center text-lg"
                >
                  Tìm hiểu thêm
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Service 4 */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/4 flex-shrink-0">
                <div className="bg-teal-100 text-teal-600 rounded-full w-24 h-24 flex items-center justify-center shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-2xl font-bold mb-4">Hỗ trợ kỹ thuật</h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Đội ngũ hỗ trợ kỹ thuật 24/7 luôn sẵn sàng giải quyết mọi vấn đề, đảm bảo hệ thống của bạn hoạt động trơn tru và hiệu quả.
                </p>
                <Link
                  href="/services/technical-support"
                  className="text-teal-600 font-medium hover:text-teal-700 inline-flex items-center text-lg"
                >
                  Tìm hiểu thêm
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Services - Cải thiện bố cục với bóng đổ và kích thước lớn hơn */}
      <section className="py-24 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-5">Dịch vụ bổ sung</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Ngoài các dịch vụ chính, chúng tôi còn cung cấp nhiều dịch vụ bổ sung để đáp ứng đầy đủ nhu cầu của doanh nghiệp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="mb-4 text-teal-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Đào tạo</h3>
              <p className="text-gray-600 text-lg">
                Chương trình đào tạo chuyên sâu giúp nhân viên của bạn nắm vững cách sử dụng và tối ưu hóa các giải pháp phần mềm.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="mb-4 text-teal-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Bảo trì và nâng cấp</h3>
              <p className="text-gray-600 text-lg">
                Dịch vụ bảo trì và nâng cấp hệ thống thường xuyên, đảm bảo phần mềm luôn hoạt động ổn định và cập nhật với công nghệ mới nhất.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="mb-4 text-teal-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Tích hợp hệ thống</h3>
              <p className="text-gray-600 text-lg">
                Giúp kết nối và tích hợp các hệ thống, ứng dụng và dịch vụ khác nhau để tạo ra một hệ sinh thái công nghệ thống nhất.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="mb-4 text-teal-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">An ninh mạng</h3>
              <p className="text-gray-600 text-lg">
                Dịch vụ bảo mật toàn diện, từ đánh giá rủi ro đến triển khai các giải pháp bảo mật và giám sát liên tục.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="mb-4 text-teal-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Phân tích dữ liệu</h3>
              <p className="text-gray-600 text-lg">
                Dịch vụ phân tích dữ liệu chuyên sâu giúp bạn khai thác giá trị từ dữ liệu và đưa ra quyết định kinh doanh sáng suốt.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="mb-4 text-teal-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Thiết kế UX/UI</h3>
              <p className="text-gray-600 text-lg">
                Dịch vụ thiết kế trải nghiệm người dùng và giao diện chuyên nghiệp, giúp tạo ra các sản phẩm số thân thiện và hấp dẫn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Cải thiện với kích thước lớn hơn và thêm nút to */}
      <section className="py-24 bg-gradient-to-r from-teal-600 to-teal-800 text-white">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Sẵn sàng nâng cấp hệ thống công nghệ của bạn?
            </h2>
            <p className="text-xl md:text-2xl mb-10 font-light">
              Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí về giải pháp phù hợp nhất cho doanh nghiệp của bạn.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-teal-600 hover:bg-gray-100 px-10 py-4 text-xl font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Đặt lịch tư vấn
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 