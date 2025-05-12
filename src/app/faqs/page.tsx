import Link from 'next/link'

const faqCategories = [
  {
    id: 'general',
    name: 'Thông tin chung',
    questions: [
      {
        question: 'XLab là gì?',
        answer: 'XLab là công ty chuyên cung cấp các giải pháp phần mềm chuyên nghiệp cho doanh nghiệp, bao gồm các phần mềm quản lý doanh nghiệp, bảo mật, thiết kế và nhiều lĩnh vực khác.'
      },
      {
        question: 'Làm thế nào để liên hệ với bộ phận hỗ trợ khách hàng?',
        answer: 'Bạn có thể liên hệ với bộ phận hỗ trợ khách hàng của chúng tôi qua email support@xlab.vn, số điện thoại 1900-1234, hoặc chat trực tuyến trên trang web của chúng tôi. Thời gian hỗ trợ từ 8:00 đến 17:30 từ thứ Hai đến thứ Sáu.'
      },
      {
        question: 'Thời gian phản hồi cho các yêu cầu hỗ trợ là bao lâu?',
        answer: 'Chúng tôi cam kết phản hồi các yêu cầu hỗ trợ trong vòng 24 giờ làm việc. Đối với khách hàng sử dụng gói dịch vụ Premium hoặc Enterprise, thời gian phản hồi sẽ nhanh hơn, từ 2-8 giờ làm việc.'
      }
    ]
  },
  {
    id: 'purchasing',
    name: 'Mua hàng & Thanh toán',
    questions: [
      {
        question: 'Các phương thức thanh toán nào được chấp nhận?',
        answer: 'Chúng tôi chấp nhận thanh toán qua thẻ tín dụng/ghi nợ (Visa, MasterCard, JCB), chuyển khoản ngân hàng, và các ví điện tử phổ biến như MoMo, VNPay, ZaloPay.'
      },
      {
        question: 'Làm thế nào để nhận hóa đơn VAT?',
        answer: 'Khi thanh toán, bạn có thể chọn tùy chọn "Yêu cầu hóa đơn VAT" và điền đầy đủ thông tin công ty. Hóa đơn VAT sẽ được gửi qua email trong vòng 3-7 ngày làm việc sau khi thanh toán thành công.'
      },
      {
        question: 'Chính sách hoàn tiền như thế nào?',
        answer: 'Chúng tôi cung cấp chính sách hoàn tiền trong vòng 30 ngày nếu sản phẩm không đáp ứng được nhu cầu của bạn. Tuy nhiên, việc hoàn tiền chỉ áp dụng nếu bạn chưa kích hoạt giấy phép trên nhiều thiết bị và chưa sử dụng quá 50% thời gian dùng thử.'
      }
    ]
  },
  {
    id: 'licensing',
    name: 'Giấy phép & Kích hoạt',
    questions: [
      {
        question: 'Tôi có thể sử dụng phần mềm trên bao nhiêu thiết bị?',
        answer: 'Đối với giấy phép cá nhân, bạn có thể cài đặt và sử dụng phần mềm trên tối đa 3 thiết bị, nhưng chỉ được sử dụng trên một thiết bị tại một thời điểm. Đối với giấy phép doanh nghiệp, số lượng thiết bị sẽ phụ thuộc vào gói giấy phép bạn mua.'
      },
      {
        question: 'Làm thế nào để kích hoạt phần mềm?',
        answer: 'Sau khi mua, bạn sẽ nhận được mã giấy phép qua email. Khi cài đặt phần mềm, hãy chọn tùy chọn "Kích hoạt bằng mã giấy phép" và nhập mã bạn đã nhận. Bạn cũng có thể đăng nhập vào tài khoản XLab của mình và kích hoạt trực tiếp từ trang Quản lý giấy phép.'
      },
      {
        question: 'Làm thế nào để chuyển giấy phép sang thiết bị mới?',
        answer: 'Đăng nhập vào tài khoản XLab của bạn, truy cập trang Quản lý giấy phép, và hủy kích hoạt thiết bị cũ. Sau đó, bạn có thể kích hoạt phần mềm trên thiết bị mới với cùng mã giấy phép.'
      }
    ]
  },
  {
    id: 'technical',
    name: 'Hỗ trợ kỹ thuật',
    questions: [
      {
        question: 'Làm thế nào để cập nhật phần mềm lên phiên bản mới nhất?',
        answer: 'Phần mềm của chúng tôi tự động kiểm tra các bản cập nhật mới. Khi có bản cập nhật mới, bạn sẽ nhận được thông báo và có thể cập nhật trực tiếp từ phần mềm. Bạn cũng có thể tải xuống phiên bản mới nhất từ trang Tài khoản của mình trên website.'
      },
      {
        question: 'Phần mềm có tương thích với hệ điều hành của tôi không?',
        answer: 'Các phần mềm của chúng tôi tương thích với Windows 10/11, macOS 11+, và các bản phân phối Linux phổ biến. Bạn có thể kiểm tra yêu cầu hệ thống cụ thể cho từng sản phẩm trên trang thông tin sản phẩm.'
      },
      {
        question: 'Tôi gặp lỗi khi sử dụng phần mềm, phải làm gì?',
        answer: 'Trước tiên, hãy đảm bảo bạn đang sử dụng phiên bản mới nhất của phần mềm. Nếu vẫn gặp lỗi, bạn có thể tham khảo tài liệu hướng dẫn, diễn đàn cộng đồng, hoặc gửi yêu cầu hỗ trợ qua tài khoản của bạn với mô tả chi tiết về lỗi và môi trường bạn đang sử dụng.'
      }
    ]
  },
  {
    id: 'service',
    name: 'Dịch vụ & Bảo hành',
    questions: [
      {
        question: 'Thời gian bảo hành các sản phẩm là bao lâu?',
        answer: 'Thời gian bảo hành tiêu chuẩn cho các sản phẩm phần mềm của chúng tôi là 12 tháng. Đối với các gói dịch vụ cao cấp hoặc doanh nghiệp, thời gian bảo hành có thể kéo dài lên đến 36 tháng tùy theo gói dịch vụ bạn đã chọn.'
      },
      {
        question: 'Chính sách hỗ trợ sau bán hàng như thế nào?',
        answer: 'Chúng tôi cung cấp hỗ trợ kỹ thuật miễn phí trong thời gian bảo hành. Sau thời gian này, bạn có thể mua gói hỗ trợ mở rộng hoặc gia hạn bảo hành để tiếp tục nhận được hỗ trợ kỹ thuật chuyên nghiệp.'
      },
      {
        question: 'XLab có cung cấp dịch vụ tùy chỉnh không?',
        answer: 'Có, chúng tôi cung cấp dịch vụ tùy chỉnh theo yêu cầu của khách hàng. Đội ngũ chuyên gia của chúng tôi có thể phát triển, tùy chỉnh các giải pháp phần mềm để đáp ứng nhu cầu cụ thể của doanh nghiệp bạn. Vui lòng liên hệ với chúng tôi để được tư vấn chi tiết.'
      }
    ]
  }
];

export default function FAQsPage() {
  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Câu hỏi thường gặp (FAQ)</h1>
          <p className="text-xl max-w-3xl">
            Tìm câu trả lời nhanh chóng cho các câu hỏi phổ biến về sản phẩm và dịch vụ của XLab
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 border-b">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Bạn có thắc mắc?</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm câu hỏi, hướng dẫn, tài liệu..."
                className="w-full border rounded-full px-6 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-600 shadow-sm"
              />
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Categories */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Danh mục câu hỏi</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {faqCategories.map((category) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-4">
                  {category.questions.length} câu hỏi
                </p>
                <div className="text-primary-600 font-medium flex items-center">
                  Xem chi tiết
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Tất cả câu hỏi</h2>
          
          <div className="space-y-16">
            {faqCategories.map((category) => (
              <div key={category.id} id={category.id} className="scroll-mt-24">
                <h3 className="text-2xl font-bold mb-6 pb-2 border-b">{category.name}</h3>
                <div className="space-y-4">
                  {category.questions.map((faq, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <details className="group">
                        <summary className="flex justify-between items-center font-semibold cursor-pointer list-none p-6">
                          <span>{faq.question}</span>
                          <span className="transition group-open:rotate-180">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </span>
                        </summary>
                        <div className="px-6 pb-6 pt-2 text-gray-700">
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

      {/* Contact CTA */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="bg-primary-50 rounded-2xl p-8 md:p-12 max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Không tìm thấy câu trả lời bạn cần?</h2>
              <p className="text-lg text-gray-700">
                Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn!
              </p>
            </div>
            <div className="flex flex-col md:flex-row md:justify-center gap-4">
              <Link href="/contact" className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Liên hệ với chúng tôi
              </Link>
              <Link href="/support" className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 font-medium rounded-lg border border-primary-200 hover:bg-primary-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Trung tâm hỗ trợ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 