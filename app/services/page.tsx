import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: "Dịch vụ - XLab",
  description: "Các dịch vụ phát triển và triển khai phần mềm của XLab",
};

export default function Services() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="/images/hero-bg.svg" 
            alt="Hero Background" 
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6">Dịch vụ chuyên nghiệp</h1>
            <p className="text-xl text-blue-100 mb-0">
              Chúng tôi cung cấp các dịch vụ chuyên nghiệp để giúp doanh nghiệp của bạn triển khai, vận hành và tối ưu hóa các giải pháp phần mềm
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 gap-16">
            {/* Consulting Service */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-blue-50 rounded-2xl p-8 flex items-center justify-center">
                <Image
                  src="/images/consulting.svg"
                  alt="Tư vấn giải pháp"
                  width={400}
                  height={300}
                  className="w-full max-w-md"
                />
              </div>
              <div>
                <h2 className="mb-4">Tư vấn giải pháp</h2>
                <p className="text-gray-600 mb-6">
                  Đội ngũ chuyên gia giàu kinh nghiệm của chúng tôi sẽ tư vấn và đề xuất giải pháp phù hợp nhất với mô hình kinh doanh và nhu cầu cụ thể của doanh nghiệp bạn.
                </p>
                <h3 className="text-xl font-semibold mb-4">Lợi ích</h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Đánh giá chi tiết nhu cầu và thách thức của doanh nghiệp</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Đề xuất giải pháp tối ưu dựa trên kinh nghiệm thực tế</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Lộ trình triển khai rõ ràng và quản lý thay đổi hiệu quả</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Development Service */}
            <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
              <div className="order-1 md:order-2 bg-indigo-50 rounded-2xl p-8 flex items-center justify-center">
                <Image
                  src="/images/development.svg"
                  alt="Phát triển phần mềm"
                  width={400}
                  height={300}
                  className="w-full max-w-md"
                />
              </div>
              <div className="order-2 md:order-1">
                <h2 className="mb-4">Phát triển phần mềm</h2>
                <p className="text-gray-600 mb-6">
                  Chúng tôi cung cấp dịch vụ phát triển phần mềm theo yêu cầu, giúp doanh nghiệp tạo ra các ứng dụng tùy chỉnh hoặc mở rộng các giải pháp hiện có để đáp ứng nhu cầu đặc thù.
                </p>
                <h3 className="text-xl font-semibold mb-4">Quy trình làm việc</h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Thu thập yêu cầu và phân tích chi tiết</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Thiết kế kiến trúc và giao diện người dùng</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Phát triển linh hoạt với review thường xuyên</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Kiểm thử kỹ lưỡng và đảm bảo chất lượng</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Integration Service */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-green-50 rounded-2xl p-8 flex items-center justify-center">
                <Image
                  src="/images/integration.svg"
                  alt="Triển khai & Tích hợp"
                  width={400}
                  height={300}
                  className="w-full max-w-md"
                />
              </div>
              <div>
                <h2 className="mb-4">Triển khai & Tích hợp</h2>
                <p className="text-gray-600 mb-6">
                  Chúng tôi hỗ trợ triển khai và tích hợp các giải pháp phần mềm vào hệ thống hiện có của doanh nghiệp một cách liền mạch, đảm bảo quá trình chuyển đổi diễn ra suôn sẻ và an toàn.
                </p>
                <h3 className="text-xl font-semibold mb-4">Dịch vụ bao gồm</h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Thiết lập hệ thống và cấu hình theo yêu cầu</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Tích hợp với các hệ thống và ứng dụng hiện có</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Di chuyển dữ liệu an toàn và toàn vẹn</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Đào tạo người dùng và quản trị viên hệ thống</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Support Service */}
            <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
              <div className="order-1 md:order-2 bg-purple-50 rounded-2xl p-8 flex items-center justify-center">
                <Image
                  src="/images/support.svg"
                  alt="Hỗ trợ & Bảo trì"
                  width={400}
                  height={300}
                  className="w-full max-w-md"
                />
              </div>
              <div className="order-2 md:order-1">
                <h2 className="mb-4">Hỗ trợ & Bảo trì</h2>
                <p className="text-gray-600 mb-6">
                  Dịch vụ hỗ trợ và bảo trì của chúng tôi đảm bảo hệ thống của bạn luôn hoạt động ổn định, an toàn và cập nhật với các tính năng mới nhất.
                </p>
                <h3 className="text-xl font-semibold mb-4">Gói hỗ trợ</h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Hỗ trợ kỹ thuật 24/7 qua nhiều kênh liên lạc</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Bảo trì định kỳ và cập nhật phần mềm tự động</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Giám sát hiệu suất và bảo mật hệ thống</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Sao lưu dữ liệu và khôi phục sự cố nhanh chóng</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="mb-4">Quy trình làm việc</h2>
            <p className="text-xl text-gray-600">
              Chúng tôi tuân theo quy trình làm việc minh bạch và hiệu quả để đảm bảo chất lượng dịch vụ
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="card p-8 relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 rounded-full text-white text-xl font-bold flex items-center justify-center">1</div>
                <h3 className="text-xl font-semibold mb-3 mt-2">Tư vấn ban đầu</h3>
                <p className="text-gray-600">
                  Gặp gỡ và trao đổi để hiểu rõ nhu cầu, mục tiêu và thách thức của doanh nghiệp.
                </p>
              </div>
              <div className="card p-8 relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 rounded-full text-white text-xl font-bold flex items-center justify-center">2</div>
                <h3 className="text-xl font-semibold mb-3 mt-2">Đề xuất giải pháp</h3>
                <p className="text-gray-600">
                  Phân tích và đề xuất giải pháp phù hợp kèm theo kế hoạch triển khai chi tiết.
                </p>
              </div>
              <div className="card p-8 relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 rounded-full text-white text-xl font-bold flex items-center justify-center">3</div>
                <h3 className="text-xl font-semibold mb-3 mt-2">Triển khai</h3>
                <p className="text-gray-600">
                  Thực hiện giải pháp theo kế hoạch với sự phối hợp chặt chẽ và báo cáo tiến độ thường xuyên.
                </p>
              </div>
              <div className="card p-8 relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 rounded-full text-white text-xl font-bold flex items-center justify-center">4</div>
                <h3 className="text-xl font-semibold mb-3 mt-2">Bàn giao & Hỗ trợ</h3>
                <p className="text-gray-600">
                  Bàn giao hệ thống, đào tạo người dùng và cung cấp hỗ trợ liên tục sau triển khai.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-gradient text-white py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mb-6">Sẵn sàng nâng cấp quy trình kinh doanh?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí về các dịch vụ chuyên nghiệp phù hợp với doanh nghiệp của bạn.
            </p>
            <Link href="/contact" className="button-primary bg-white text-blue-600 hover:bg-blue-50">
              Liên hệ tư vấn
            </Link>
          </div>
        </div>
      </section>
    </>
  );
} 