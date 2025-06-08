export default function PricingPage() {
  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Báo giá dịch vụ</h1>
          <p className="text-xl max-w-3xl">
            Chúng tôi cung cấp các gói dịch vụ với giá cả linh hoạt, phù hợp với quy mô và nhu cầu
            của doanh nghiệp bạn
          </p>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Gói phần mềm doanh nghiệp</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Các giải pháp phần mềm toàn diện, đáp ứng nhu cầu quản lý và phát triển kinh doanh
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:border-primary-300 transition duration-300">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Cơ bản</h3>
                <div className="flex items-baseline mb-8">
                  <span className="text-5xl font-extrabold text-gray-900">3.900.000</span>
                  <span className="text-xl text-gray-500 ml-2">VND/tháng</span>
                </div>
                <p className="text-gray-600 mb-8">
                  Giải pháp phù hợp cho các doanh nghiệp nhỏ và vừa, mới bắt đầu ứng dụng công nghệ
                  vào quản lý.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Quản lý khách hàng cơ bản</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Quản lý đơn hàng & kho hàng</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Báo cáo kinh doanh cơ bản</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Hỗ trợ kỹ thuật trong giờ hành chính</span>
                  </li>
                  <li className="flex items-start text-gray-400">
                    <svg
                      className="h-6 w-6 text-gray-300 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span>Tích hợp thanh toán online</span>
                  </li>
                  <li className="flex items-start text-gray-400">
                    <svg
                      className="h-6 w-6 text-gray-300 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span>Phân tích dữ liệu nâng cao</span>
                  </li>
                </ul>
                <a
                  href="/contact"
                  className="block w-full text-center py-3 px-6 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium transition duration-300"
                >
                  Liên hệ tư vấn
                </a>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-primary-500 transform scale-105 z-10">
              <div className="bg-primary-500 text-white text-center py-2">
                <span className="font-medium">Phổ biến nhất</span>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Chuyên nghiệp</h3>
                <div className="flex items-baseline mb-8">
                  <span className="text-5xl font-extrabold text-gray-900">8.500.000</span>
                  <span className="text-xl text-gray-500 ml-2">VND/tháng</span>
                </div>
                <p className="text-gray-600 mb-8">
                  Giải pháp toàn diện cho doanh nghiệp đang phát triển, cần quản lý hiệu quả và tối
                  ưu hóa quy trình.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Tất cả tính năng của gói Cơ bản</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Quản lý nhân sự & chấm công</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Quản lý tài chính & kế toán</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Tích hợp thanh toán online</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Hỗ trợ kỹ thuật 24/7</span>
                  </li>
                  <li className="flex items-start text-gray-400">
                    <svg
                      className="h-6 w-6 text-gray-300 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span>Tùy chỉnh theo yêu cầu</span>
                  </li>
                </ul>
                <a
                  href="/contact"
                  className="block w-full text-center py-3 px-6 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-medium transition duration-300"
                >
                  Liên hệ tư vấn
                </a>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:border-primary-300 transition duration-300">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Doanh nghiệp</h3>
                <div className="flex items-baseline mb-8">
                  <span className="text-3xl font-extrabold text-gray-900">Liên hệ báo giá</span>
                </div>
                <p className="text-gray-600 mb-8">
                  Giải pháp tùy chỉnh cho doanh nghiệp lớn, có nhu cầu đặc thù và quy trình phức
                  tạp.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Tất cả tính năng của gói Chuyên nghiệp</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Phân tích dữ liệu nâng cao</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Tích hợp hệ thống hiện có</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Tùy chỉnh theo yêu cầu</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Quản lý dự án chuyên biệt</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Ưu tiên hỗ trợ 24/7</span>
                  </li>
                </ul>
                <a
                  href="/contact"
                  className="block w-full text-center py-3 px-6 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium transition duration-300"
                >
                  Liên hệ tư vấn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Development Services */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Dịch vụ phát triển phần mềm</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chi phí phát triển phần mềm theo yêu cầu và dự án
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-4">Phát triển theo giờ</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-700">Lập trình viên Junior</span>
                  <span className="font-semibold">350.000 VND/giờ</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-700">Lập trình viên Senior</span>
                  <span className="font-semibold">500.000 VND/giờ</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-700">UX/UI Designer</span>
                  <span className="font-semibold">450.000 VND/giờ</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-700">Project Manager</span>
                  <span className="font-semibold">600.000 VND/giờ</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-700">Solution Architect</span>
                  <span className="font-semibold">700.000 VND/giờ</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                * Giá trên chỉ áp dụng cho dự án có khối lượng công việc tối thiểu 40 giờ. Vui lòng
                liên hệ để được tư vấn chi tiết.
              </p>
              <a href="/contact" className="btn btn-primary">
                Nhận báo giá chi tiết
              </a>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-4">Phát triển theo dự án</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-700">Website doanh nghiệp</span>
                  <span className="font-semibold">Từ 30.000.000 VND</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-700">Ứng dụng di động</span>
                  <span className="font-semibold">Từ 150.000.000 VND</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-700">Hệ thống quản lý nội bộ</span>
                  <span className="font-semibold">Từ 200.000.000 VND</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-700">Hệ thống thương mại điện tử</span>
                  <span className="font-semibold">Từ 250.000.000 VND</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-700">Giải pháp AI/ML</span>
                  <span className="font-semibold">Liên hệ báo giá</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                * Chi phí có thể thay đổi tùy thuộc vào quy mô dự án, yêu cầu kỹ thuật và thời gian
                triển khai. Vui lòng liên hệ để được tư vấn chi tiết.
              </p>
              <a href="/contact" className="btn btn-primary">
                Nhận báo giá chi tiết
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Câu hỏi thường gặp</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những thông tin bạn cần biết về chính sách giá và dịch vụ của chúng tôi
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-3">
                Các gói dịch vụ có ràng buộc về thời hạn không?
              </h3>
              <p className="text-gray-600">
                Các gói dịch vụ của chúng tôi thường có hợp đồng tối thiểu 12 tháng để đảm bảo sự ổn
                định và hiệu quả của giải pháp. Tuy nhiên, chúng tôi cũng có những lựa chọn linh
                hoạt hơn tùy theo nhu cầu cụ thể của doanh nghiệp.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-3">
                Chi phí triển khai ban đầu có được bao gồm trong giá gói dịch vụ không?
              </h3>
              <p className="text-gray-600">
                Chi phí triển khai ban đầu thường không bao gồm trong giá gói dịch vụ hàng tháng và
                sẽ được tính riêng. Chi phí này phụ thuộc vào quy mô triển khai, yêu cầu tích hợp và
                đào tạo. Chúng tôi sẽ cung cấp báo giá chi tiết sau khi tìm hiểu nhu cầu cụ thể của
                bạn.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-3">
                Có thể nâng cấp hoặc hạ cấp gói dịch vụ giữa chừng không?
              </h3>
              <p className="text-gray-600">
                Có, bạn có thể nâng cấp gói dịch vụ bất kỳ lúc nào trong thời gian hợp đồng. Việc hạ
                cấp gói dịch vụ thường có thể được thực hiện khi kết thúc thời hạn hợp đồng hiện
                tại. Trong một số trường hợp đặc biệt, chúng tôi có thể xem xét điều chỉnh giữa
                chừng.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-3">
                Có hỗ trợ kỹ thuật sau khi triển khai không?
              </h3>
              <p className="text-gray-600">
                Tất cả các gói dịch vụ của chúng tôi đều bao gồm hỗ trợ kỹ thuật, khác nhau về mức
                độ ưu tiên và thời gian phản hồi. Gói Cơ bản có hỗ trợ trong giờ hành chính, gói
                Chuyên nghiệp và Doanh nghiệp có hỗ trợ 24/7 với thời gian phản hồi nhanh hơn.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-3">
                Doanh nghiệp có thể yêu cầu tính năng tùy chỉnh không có trong gói cơ bản không?
              </h3>
              <p className="text-gray-600">
                Có, chúng tôi cung cấp dịch vụ phát triển tùy chỉnh cho tất cả các gói. Chi phí phát
                triển tùy chỉnh sẽ được tính riêng và phụ thuộc vào độ phức tạp của tính năng yêu
                cầu. Gói Doanh nghiệp có mức ưu đãi lớn hơn cho các tính năng tùy chỉnh.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Không tìm thấy gói phù hợp?</h2>
            <p className="text-xl mb-8">
              Chúng tôi hiểu rằng mỗi doanh nghiệp có nhu cầu riêng biệt. Hãy liên hệ với chúng tôi
              để nhận được tư vấn và báo giá phù hợp nhất.
            </p>
            <a
              href="/contact"
              className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3"
            >
              Liên hệ tư vấn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
