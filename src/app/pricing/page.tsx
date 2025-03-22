import Header from '@/components/Header';
import Link from 'next/link';

export default function Pricing() {
  const pricingPlans = [
    {
      name: 'Cơ bản',
      price: '3,000,000',
      description: 'Giải pháp lý tưởng cho các doanh nghiệp nhỏ mới bắt đầu.',
      features: [
        'Các tính năng cơ bản',
        '5GB lưu trữ',
        'Hỗ trợ email',
        'Cập nhật hàng tháng',
        '1 người dùng'
      ],
      cta: 'Bắt đầu',
      popular: false
    },
    {
      name: 'Chuyên nghiệp',
      price: '8,000,000',
      description: 'Phù hợp với các doanh nghiệp vừa và nhỏ đang phát triển.',
      features: [
        'Tất cả tính năng cơ bản',
        '20GB lưu trữ',
        'Hỗ trợ ưu tiên qua email và điện thoại',
        'Cập nhật hàng tuần',
        '5 người dùng',
        'API tích hợp',
        'Báo cáo nâng cao'
      ],
      cta: 'Đăng ký ngay',
      popular: true
    },
    {
      name: 'Doanh nghiệp',
      price: 'Liên hệ',
      description: 'Giải pháp toàn diện cho các doanh nghiệp lớn và tập đoàn.',
      features: [
        'Tất cả tính năng chuyên nghiệp',
        'Lưu trữ không giới hạn',
        'Hỗ trợ 24/7',
        'Cập nhật ưu tiên',
        'Người dùng không giới hạn',
        'Tích hợp hệ thống đầy đủ',
        'Tùy chỉnh theo yêu cầu',
        'Triển khai tại chỗ'
      ],
      cta: 'Liên hệ báo giá',
      popular: false
    }
  ];

  const faqs = [
    {
      question: 'Có thời gian cam kết tối thiểu không?',
      answer: 'Không, chúng tôi cung cấp các kế hoạch linh hoạt với các lựa chọn thanh toán hàng tháng hoặc hàng năm. Bạn có thể nâng cấp, hạ cấp hoặc hủy bỏ gói dịch vụ của mình bất cứ lúc nào.'
    },
    {
      question: 'Làm thế nào để tôi có thể nâng cấp hoặc hạ cấp gói dịch vụ?',
      answer: 'Bạn có thể dễ dàng nâng cấp hoặc hạ cấp gói dịch vụ của mình thông qua bảng điều khiển tài khoản. Thay đổi sẽ có hiệu lực ngay lập tức và hóa đơn của bạn sẽ được điều chỉnh theo tỷ lệ.'
    },
    {
      question: 'Có hỗ trợ kỹ thuật cho tất cả các gói không?',
      answer: 'Có, tất cả các gói đều bao gồm hỗ trợ kỹ thuật. Cấp độ ưu tiên và phương thức hỗ trợ sẽ khác nhau theo từng gói. Gói Doanh nghiệp nhận được hỗ trợ ưu tiên 24/7 qua email, điện thoại và trò chuyện trực tiếp.'
    },
    {
      question: 'Tôi có thể dùng thử trước khi đăng ký không?',
      answer: 'Có, chúng tôi cung cấp bản dùng thử miễn phí 14 ngày cho các gói Cơ bản và Chuyên nghiệp. Đối với gói Doanh nghiệp, chúng tôi cung cấp demo và tư vấn miễn phí để đảm bảo giải pháp phù hợp với nhu cầu của bạn.'
    },
    {
      question: 'Có phí thiết lập nào không?',
      answer: 'Không có phí thiết lập cho các gói Cơ bản và Chuyên nghiệp. Đối với gói Doanh nghiệp, có thể có phí thiết lập tùy thuộc vào yêu cầu tùy chỉnh và triển khai của bạn. Chi tiết sẽ được thảo luận trong quá trình tư vấn.'
    },
    {
      question: 'Làm thế nào để tôi thanh toán?',
      answer: 'Chúng tôi chấp nhận nhiều phương thức thanh toán bao gồm thẻ tín dụng, chuyển khoản ngân hàng và các hình thức thanh toán điện tử khác. Đối với gói Doanh nghiệp, chúng tôi cũng cung cấp các tùy chọn thanh toán linh hoạt phù hợp với quy trình mua hàng của bạn.'
    }
  ];

  return (
    <main>
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Bảng giá minh bạch</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Chúng tôi cung cấp các gói dịch vụ linh hoạt để phù hợp với nhu cầu và ngân sách của bạn. Không có chi phí ẩn, không có điều khoản phức tạp.
          </p>
        </div>
      </section>
      
      {/* Pricing Plans */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-lg shadow-lg overflow-hidden border ${plan.popular ? 'border-blue-500' : 'border-gray-200'} relative`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white py-1 px-4 text-sm font-bold">
                    Phổ biến nhất
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-end mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== 'Liên hệ' && <span className="text-gray-600 ml-1">₫/tháng</span>}
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <Link
                    href={plan.price === 'Liên hệ' ? '/contact' : '/signup'}
                    className={`block text-center py-3 px-6 rounded-lg font-medium ${
                      plan.popular
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
                
                <div className={`bg-gray-50 p-8 ${plan.popular ? 'border-t border-blue-100' : 'border-t border-gray-100'}`}>
                  <h4 className="font-semibold mb-4">Tính năng bao gồm:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Custom Solutions */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Bạn cần giải pháp tùy chỉnh?</h2>
            <p className="text-lg text-gray-700 mb-8">
              Chúng tôi hiểu rằng mỗi doanh nghiệp có nhu cầu độc đáo. Đội ngũ của chúng tôi sẵn sàng làm việc với bạn để tạo ra giải pháp phần mềm tùy chỉnh phù hợp với yêu cầu cụ thể của bạn.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg font-medium"
            >
              Liên hệ để thảo luận
            </Link>
          </div>
        </div>
      </section>
      
      {/* Comparison Table */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">So sánh các gói dịch vụ</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left py-4 px-6 border-b">Tính năng</th>
                  <th className="text-center py-4 px-6 border-b">Cơ bản</th>
                  <th className="text-center py-4 px-6 border-b bg-blue-50">Chuyên nghiệp</th>
                  <th className="text-center py-4 px-6 border-b">Doanh nghiệp</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-4 px-6 border-b font-medium">Số người dùng</td>
                  <td className="text-center py-4 px-6 border-b">1</td>
                  <td className="text-center py-4 px-6 border-b bg-blue-50">5</td>
                  <td className="text-center py-4 px-6 border-b">Không giới hạn</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 border-b font-medium">Dung lượng lưu trữ</td>
                  <td className="text-center py-4 px-6 border-b">5GB</td>
                  <td className="text-center py-4 px-6 border-b bg-blue-50">20GB</td>
                  <td className="text-center py-4 px-6 border-b">Không giới hạn</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 border-b font-medium">Hỗ trợ kỹ thuật</td>
                  <td className="text-center py-4 px-6 border-b">Email</td>
                  <td className="text-center py-4 px-6 border-b bg-blue-50">Email & Điện thoại</td>
                  <td className="text-center py-4 px-6 border-b">24/7 Ưu tiên</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 border-b font-medium">Cập nhật</td>
                  <td className="text-center py-4 px-6 border-b">Hàng tháng</td>
                  <td className="text-center py-4 px-6 border-b bg-blue-50">Hàng tuần</td>
                  <td className="text-center py-4 px-6 border-b">Ưu tiên</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 border-b font-medium">API tích hợp</td>
                  <td className="text-center py-4 px-6 border-b">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </td>
                  <td className="text-center py-4 px-6 border-b bg-blue-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </td>
                  <td className="text-center py-4 px-6 border-b">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 border-b font-medium">Báo cáo nâng cao</td>
                  <td className="text-center py-4 px-6 border-b">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </td>
                  <td className="text-center py-4 px-6 border-b bg-blue-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </td>
                  <td className="text-center py-4 px-6 border-b">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 border-b font-medium">Tùy chỉnh</td>
                  <td className="text-center py-4 px-6 border-b">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </td>
                  <td className="text-center py-4 px-6 border-b bg-blue-50">Giới hạn</td>
                  <td className="text-center py-4 px-6 border-b">Đầy đủ</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">Triển khai tại chỗ</td>
                  <td className="text-center py-4 px-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </td>
                  <td className="text-center py-4 px-6 bg-blue-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </td>
                  <td className="text-center py-4 px-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      
      {/* FAQs */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Câu hỏi thường gặp</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-lg mb-4">Bạn có câu hỏi khác?</p>
            <Link
              href="/contact"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg font-medium"
            >
              Liên hệ với chúng tôi
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Sẵn sàng nâng cấp doanh nghiệp của bạn?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Bắt đầu hành trình chuyển đổi số của bạn ngay hôm nay với các giải pháp phần mềm mạnh mẽ từ XLab.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-white text-blue-600 hover:bg-gray-100 py-3 px-8 rounded-lg font-medium"
            >
              Liên hệ với chúng tôi
            </Link>
            <Link 
              href="/signup" 
              className="bg-transparent border border-white hover:bg-white hover:text-blue-600 py-3 px-8 rounded-lg font-medium"
            >
              Dùng thử miễn phí
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
} 