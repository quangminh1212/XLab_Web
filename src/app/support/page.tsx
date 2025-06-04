import Link from 'next/link';

const faqCategories = [
  {
    id: 'general',
    name: 'Thông tin chung',
    questions: [
      {
        question: 'XLab là gì?',
        answer:
          'XLab là công ty chuyên cung cấp các giải pháp phần mềm chuyên nghiệp cho doanh nghiệp, bao gồm các phần mềm quản lý doanh nghiệp, bảo mật, thiết kế và nhiều lĩnh vực khác.',
      },
      {
        question: 'Làm thế nào để liên hệ với bộ phận hỗ trợ khách hàng?',
        answer:
          'Bạn có thể liên hệ với bộ phận hỗ trợ khách hàng của chúng tôi qua email support@xlab.vn, số điện thoại 1900-1234, hoặc chat trực tuyến trên trang web của chúng tôi. Thời gian hỗ trợ từ 8:00 đến 17:30 từ thứ Hai đến thứ Sáu.',
      },
      {
        question: 'Thời gian phản hồi cho các yêu cầu hỗ trợ là bao lâu?',
        answer:
          'Chúng tôi cam kết phản hồi các yêu cầu hỗ trợ trong vòng 24 giờ làm việc. Đối với khách hàng sử dụng gói dịch vụ Premium hoặc Enterprise, thời gian phản hồi sẽ nhanh hơn, từ 2-8 giờ làm việc.',
      },
    ],
  },
  {
    id: 'purchasing',
    name: 'Mua hàng & Thanh toán',
    questions: [
      {
        question: 'Các phương thức thanh toán nào được chấp nhận?',
        answer:
          'Chúng tôi chấp nhận thanh toán qua thẻ tín dụng/ghi nợ (Visa, MasterCard, JCB), chuyển khoản ngân hàng, và các ví điện tử phổ biến như MoMo, VNPay, ZaloPay.',
      },
      {
        question: 'Làm thế nào để nhận hóa đơn VAT?',
        answer:
          'Khi thanh toán, bạn có thể chọn tùy chọn "Yêu cầu hóa đơn VAT" và điền đầy đủ thông tin công ty. Hóa đơn VAT sẽ được gửi qua email trong vòng 3-7 ngày làm việc sau khi thanh toán thành công.',
      },
      {
        question: 'Chính sách hoàn tiền như thế nào?',
        answer:
          'Chúng tôi cung cấp chính sách hoàn tiền trong vòng 30 ngày nếu sản phẩm không đáp ứng được nhu cầu của bạn. Tuy nhiên, việc hoàn tiền chỉ áp dụng nếu bạn chưa kích hoạt giấy phép trên nhiều thiết bị và chưa sử dụng quá 50% thời gian dùng thử.',
      },
    ],
  },
  {
    id: 'licensing',
    name: 'Giấy phép & Kích hoạt',
    questions: [
      {
        question: 'Tôi có thể sử dụng phần mềm trên bao nhiêu thiết bị?',
        answer:
          'Đối với giấy phép cá nhân, bạn có thể cài đặt và sử dụng phần mềm trên tối đa 3 thiết bị, nhưng chỉ được sử dụng trên một thiết bị tại một thời điểm. Đối với giấy phép doanh nghiệp, số lượng thiết bị sẽ phụ thuộc vào gói giấy phép bạn mua.',
      },
      {
        question: 'Làm thế nào để kích hoạt phần mềm?',
        answer:
          'Sau khi mua, bạn sẽ nhận được mã giấy phép qua email. Khi cài đặt phần mềm, hãy chọn tùy chọn "Kích hoạt bằng mã giấy phép" và nhập mã bạn đã nhận. Bạn cũng có thể đăng nhập vào tài khoản XLab của mình và kích hoạt trực tiếp từ trang Quản lý giấy phép.',
      },
      {
        question: 'Làm thế nào để chuyển giấy phép sang thiết bị mới?',
        answer:
          'Đăng nhập vào tài khoản XLab của bạn, truy cập trang Quản lý giấy phép, và hủy kích hoạt thiết bị cũ. Sau đó, bạn có thể kích hoạt phần mềm trên thiết bị mới với cùng mã giấy phép.',
      },
    ],
  },
  {
    id: 'technical',
    name: 'Hỗ trợ kỹ thuật',
    questions: [
      {
        question: 'Làm thế nào để cập nhật phần mềm lên phiên bản mới nhất?',
        answer:
          'Phần mềm của chúng tôi tự động kiểm tra các bản cập nhật mới. Khi có bản cập nhật mới, bạn sẽ nhận được thông báo và có thể cập nhật trực tiếp từ phần mềm. Bạn cũng có thể tải xuống phiên bản mới nhất từ trang Tài khoản của mình trên website.',
      },
      {
        question: 'Phần mềm có tương thích với hệ điều hành của tôi không?',
        answer:
          'Các phần mềm của chúng tôi tương thích với Windows 10/11, macOS 11+, và các bản phân phối Linux phổ biến. Bạn có thể kiểm tra yêu cầu hệ thống cụ thể cho từng sản phẩm trên trang thông tin sản phẩm.',
      },
      {
        question: 'Tôi gặp lỗi khi sử dụng phần mềm, phải làm gì?',
        answer:
          'Trước tiên, hãy đảm bảo bạn đang sử dụng phiên bản mới nhất của phần mềm. Nếu vẫn gặp lỗi, bạn có thể tham khảo tài liệu hướng dẫn, diễn đàn cộng đồng, hoặc gửi yêu cầu hỗ trợ qua tài khoản của bạn với mô tả chi tiết về lỗi và môi trường bạn đang sử dụng.',
      },
    ],
  },
];

export default function SupportPage() {
  return (
    <div>
      {/* Page Header */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Hỗ trợ & FAQ</h1>
          <p className="text-xl max-w-3xl">
            Tìm câu trả lời nhanh chóng cho câu hỏi của bạn hoặc liên hệ với đội ngũ hỗ trợ của
            chúng tôi.
          </p>
        </div>
      </section>

      {/* Quick Support Links */}
      <section className="bg-white py-12 border-b">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Tài liệu hướng dẫn</h3>
              <p className="text-gray-600 mb-4">
                Khám phá hướng dẫn sử dụng, video hướng dẫn và tài liệu kỹ thuật.
              </p>
              <Link
                href="/support/documentation"
                className="text-primary-600 font-semibold hover:text-primary-700"
              >
                Xem tài liệu
              </Link>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Liên hệ hỗ trợ</h3>
              <p className="text-gray-600 mb-4">
                Gửi yêu cầu hỗ trợ và nhận trợ giúp từ đội ngũ kỹ thuật của chúng tôi.
              </p>
              <Link
                href="/support/contact"
                className="text-primary-600 font-semibold hover:text-primary-700"
              >
                Liên hệ ngay
              </Link>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Cộng đồng XLab</h3>
              <p className="text-gray-600 mb-4">
                Tham gia cộng đồng người dùng, đặt câu hỏi và chia sẻ kinh nghiệm.
              </p>
              <Link
                href="/community"
                className="text-primary-600 font-semibold hover:text-primary-700"
              >
                Tham gia cộng đồng
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="py-12">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Bạn cần trợ giúp?</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm câu hỏi, hướng dẫn, tài liệu..."
                className="w-full border rounded-full px-6 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-600 shadow-sm"
              />
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Câu hỏi thường gặp</h2>

          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {faqCategories.map((category) => (
                <a
                  key={category.id}
                  href={`#${category.id}`}
                  className="bg-white px-4 py-3 rounded border text-center hover:bg-primary-50 hover:border-primary-200 transition-colors"
                >
                  {category.name}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-12">
            {faqCategories.map((category) => (
              <div key={category.id} id={category.id}>
                <h3 className="text-2xl font-bold mb-6 pb-2 border-b">{category.name}</h3>
                <div className="space-y-4">
                  {category.questions.map((faq, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <details className="group">
                        <summary className="flex justify-between items-center font-semibold cursor-pointer list-none p-6">
                          <span>{faq.question}</span>
                          <span className="transition group-open:rotate-180">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </span>
                        </summary>
                        <div className="px-6 pb-6 text-gray-700">
                          <p>{faq.answer}</p>
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Tùy chọn hỗ trợ</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-primary-600 mb-4">
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Email</h3>
              <p className="text-gray-600 mb-4">
                Gửi yêu cầu hỗ trợ qua email và nhận phản hồi trong vòng 24 giờ làm việc.
              </p>
              <a
                href="mailto:support@xlab.vn"
                className="text-primary-600 font-semibold hover:text-primary-700"
              >
                support@xlab.vn
              </a>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-primary-600 mb-4">
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Điện thoại</h3>
              <p className="text-gray-600 mb-4">
                Gọi điện thoại trực tiếp đến đường dây nóng hỗ trợ của chúng tôi.
              </p>
              <a
                href="tel:19001234"
                className="text-primary-600 font-semibold hover:text-primary-700"
              >
                1900-1234
              </a>
              <p className="text-sm text-gray-500 mt-2">8:00 - 17:30, Thứ 2 - Chủ Nhật</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-primary-600 mb-4">
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Chat trực tuyến</h3>
              <p className="text-gray-600 mb-4">
                Chat trực tiếp với đội ngũ hỗ trợ khách hàng của chúng tôi.
              </p>
              <button className="btn bg-primary-600 text-white">Bắt đầu chat</button>
              <p className="text-sm text-gray-500 mt-2">
                Thời gian hoạt động: 8:00 - 20:00 hàng ngày
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Tutorials */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-4">Video hướng dẫn</h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            Xem các video hướng dẫn cách sử dụng các tính năng của phần mềm XLab
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">Hướng dẫn sử dụng tính năng {item}</h3>
                  <p className="text-gray-600 mb-4">
                    Học cách sử dụng hiệu quả các tính năng chính của phần mềm XLab.
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="flex items-center mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      8 phút
                    </span>
                    <span className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      1.2k lượt xem
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/support/videos" className="btn bg-primary-600 text-white">
              Xem tất cả video
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">Vẫn chưa tìm thấy câu trả lời?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn với bất kỳ câu hỏi nào.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/support/contact" className="btn bg-white text-primary-600">
              Liên hệ hỗ trợ
            </Link>
            <Link href="/support/documentation" className="btn bg-primary-700 text-white">
              Xem tài liệu hướng dẫn
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
