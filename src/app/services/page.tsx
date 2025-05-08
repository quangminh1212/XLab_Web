import Link from 'next/link'

export default function ServicesPage() {
  return (
    <div>
      {/* Page Header */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Dịch vụ</h1>
          <p className="text-xl max-w-3xl">
            Chúng tôi cung cấp các dịch vụ công nghệ chuyên nghiệp giúp doanh nghiệp của bạn phát triển.
          </p>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Service 1 */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex-shrink-0">
                <div className="bg-primary-100 text-primary-600 rounded-full w-20 h-20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
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
                <h3 className="text-xl font-bold mb-3">Phát triển phần mềm theo yêu cầu</h3>
                <p className="text-gray-600 mb-4">
                  Chúng tôi xây dựng các giải pháp phần mềm tùy chỉnh theo nhu cầu cụ thể của doanh nghiệp, từ ứng dụng web đến ứng dụng di động và hệ thống backend.
                </p>
                <Link
                  href="/services/software-development"
                  className="text-primary-600 font-medium hover:text-primary-700 inline-flex items-center"
                >
                  Tìm hiểu thêm
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
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
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex-shrink-0">
                <div className="bg-primary-100 text-primary-600 rounded-full w-20 h-20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
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
                <h3 className="text-xl font-bold mb-3">Dịch vụ đám mây</h3>
                <p className="text-gray-600 mb-4">
                  Cung cấp giải pháp đám mây toàn diện, từ tư vấn và triển khai đến quản lý và tối ưu hóa, giúp doanh nghiệp tiết kiệm chi phí và tăng cường khả năng mở rộng.
                </p>
                <Link
                  href="/services/cloud-services"
                  className="text-primary-600 font-medium hover:text-primary-700 inline-flex items-center"
                >
                  Tìm hiểu thêm
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
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
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex-shrink-0">
                <div className="bg-primary-100 text-primary-600 rounded-full w-20 h-20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
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
                <h3 className="text-xl font-bold mb-3">Tư vấn công nghệ</h3>
                <p className="text-gray-600 mb-4">
                  Cung cấp dịch vụ tư vấn chuyên nghiệp về chiến lược công nghệ, lộ trình chuyển đổi số và tối ưu hóa quy trình, giúp doanh nghiệp đưa ra quyết định đúng đắn.
                </p>
                <Link
                  href="/services/consulting"
                  className="text-primary-600 font-medium hover:text-primary-700 inline-flex items-center"
                >
                  Tìm hiểu thêm
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
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
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex-shrink-0">
                <div className="bg-primary-100 text-primary-600 rounded-full w-20 h-20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
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
                <h3 className="text-xl font-bold mb-3">Hỗ trợ kỹ thuật</h3>
                <p className="text-gray-600 mb-4">
                  Đội ngũ hỗ trợ kỹ thuật 24/7 luôn sẵn sàng giải quyết mọi vấn đề, đảm bảo hệ thống của bạn hoạt động trơn tru và hiệu quả.
                </p>
                <Link
                  href="/services/technical-support"
                  className="text-primary-600 font-medium hover:text-primary-700 inline-flex items-center"
                >
                  Tìm hiểu thêm
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
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

      {/* Additional Services */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">Dịch vụ bổ sung</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Ngoài các dịch vụ chính, chúng tôi còn cung cấp nhiều dịch vụ bổ sung để đáp ứng đầy đủ nhu cầu của doanh nghiệp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">Đào tạo</h3>
              <p className="text-gray-600">
                Chương trình đào tạo chuyên sâu giúp nhân viên của bạn nắm vững cách sử dụng và tối ưu hóa các giải pháp phần mềm.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">Bảo trì và nâng cấp</h3>
              <p className="text-gray-600">
                Dịch vụ bảo trì và nâng cấp hệ thống thường xuyên, đảm bảo phần mềm luôn hoạt động ổn định và cập nhật với công nghệ mới nhất.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">Tích hợp hệ thống</h3>
              <p className="text-gray-600">
                Giúp kết nối và tích hợp các hệ thống, ứng dụng và dịch vụ khác nhau để tạo ra một hệ sinh thái công nghệ thống nhất.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">An ninh mạng</h3>
              <p className="text-gray-600">
                Dịch vụ bảo mật toàn diện, từ đánh giá rủi ro đến triển khai các giải pháp bảo mật và giám sát liên tục.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">Phân tích dữ liệu</h3>
              <p className="text-gray-600">
                Dịch vụ phân tích dữ liệu chuyên sâu giúp bạn khai thác giá trị từ dữ liệu và đưa ra quyết định kinh doanh sáng suốt.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">Thiết kế UX/UI</h3>
              <p className="text-gray-600">
                Dịch vụ thiết kế trải nghiệm người dùng và giao diện chuyên nghiệp, giúp tạo ra các sản phẩm số thân thiện và hấp dẫn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Features */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">Các tính năng nổi bật</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Chúng tôi cung cấp nhiều tính năng và lợi ích để đảm bảo dịch vụ của chúng tôi đáp ứng được nhu cầu của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-100 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Chất lượng cao</h3>
              <p className="text-gray-600">Đảm bảo chất lượng cao nhất trong mọi dịch vụ chúng tôi cung cấp.</p>
            </div>

            <div className="p-6 border border-gray-100 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Đúng thời hạn</h3>
              <p className="text-gray-600">Hoàn thành dự án đúng thời hạn mà không làm ảnh hưởng đến chất lượng.</p>
            </div>

            <div className="p-6 border border-gray-100 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Bảo mật</h3>
              <p className="text-gray-600">Bảo vệ dữ liệu và thông tin của bạn với các tiêu chuẩn bảo mật cao nhất.</p>
            </div>

            <div className="p-6 border border-gray-100 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Chi phí hợp lý</h3>
              <p className="text-gray-600">Cung cấp dịch vụ với chi phí phải chăng và minh bạch, không có phí ẩn.</p>
            </div>

            <div className="p-6 border border-gray-100 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 8l-7 7-7-7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Mở rộng dễ dàng</h3>
              <p className="text-gray-600">Dễ dàng mở rộng dịch vụ khi nhu cầu kinh doanh của bạn tăng lên.</p>
            </div>

            <div className="p-6 border border-gray-100 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Hiệu suất cao</h3>
              <p className="text-gray-600">Tối ưu hóa hiệu suất cho mọi dịch vụ và giải pháp chúng tôi cung cấp.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              Sẵn sàng nâng cấp hệ thống công nghệ của bạn?
            </h2>
            <p className="text-xl mb-8">
              Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí về giải pháp phù hợp nhất cho doanh nghiệp của bạn.
            </p>
            <Link
              href="/contact"
              className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg"
            >
              Đặt lịch tư vấn
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 