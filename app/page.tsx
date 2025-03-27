import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="/images/hero-bg.svg" 
            alt="Hero Background" 
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        <div className="container relative py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="mb-6">
                Giải pháp phần mềm <br />
                <span className="text-blue-200">tiên tiến cho doanh nghiệp</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-lg">
                Tối ưu hóa quy trình làm việc, nâng cao năng suất và thúc đẩy tăng trưởng với các giải pháp phần mềm của XLab.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="button-primary bg-white text-blue-600 hover:bg-blue-50">
                  Liên hệ ngay
                </Link>
                <Link href="/products" className="button-secondary border-blue-200 text-white hover:bg-blue-700">
                  Xem sản phẩm
                </Link>
              </div>
            </div>
            <div className="relative animate-float hidden md:block">
              <Image 
                src="/images/hero-illustration.svg" 
                alt="XLab Dashboard" 
                width={500}
                height={400}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="py-10 bg-gray-50">
        <div className="container">
          <p className="text-center text-gray-500 mb-8">Được tin dùng bởi các doanh nghiệp hàng đầu</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center items-center opacity-70">
            <div className="grayscale hover:grayscale-0 transition duration-300">
              <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="120" height="40" rx="4" fill="#F3F4F6" />
                <path d="M23 20H33" stroke="#4B5563" strokeWidth="2" />
                <path d="M28 15V25" stroke="#4B5563" strokeWidth="2" />
                <path d="M42 15H52L42 25H52" stroke="#4B5563" strokeWidth="2" />
                <path d="M62 15V25H72" stroke="#4B5563" strokeWidth="2" />
                <path d="M82 15V25H92V15" stroke="#4B5563" strokeWidth="2" />
              </svg>
            </div>
            <div className="grayscale hover:grayscale-0 transition duration-300">
              <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="120" height="40" rx="4" fill="#F3F4F6" />
                <circle cx="28" cy="20" r="5" stroke="#4B5563" strokeWidth="2" />
                <path d="M42 15L52 15L52 25L42 25" stroke="#4B5563" strokeWidth="2" />
                <path d="M62 17L72 17M62 23L72 23" stroke="#4B5563" strokeWidth="2" />
                <path d="M82 15L92 20L82 25" stroke="#4B5563" strokeWidth="2" />
              </svg>
            </div>
            <div className="grayscale hover:grayscale-0 transition duration-300">
              <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="120" height="40" rx="4" fill="#F3F4F6" />
                <path d="M28 15V25" stroke="#4B5563" strokeWidth="2" />
                <path d="M23 15H33" stroke="#4B5563" strokeWidth="2" />
                <rect x="42" y="15" width="10" height="10" stroke="#4B5563" strokeWidth="2" />
                <circle cx="67" cy="20" r="5" stroke="#4B5563" strokeWidth="2" />
                <path d="M82 15L92 15L92 25L82 25" stroke="#4B5563" strokeWidth="2" />
              </svg>
            </div>
            <div className="grayscale hover:grayscale-0 transition duration-300">
              <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="120" height="40" rx="4" fill="#F3F4F6" />
                <path d="M28 15L28 25L33 20L38 25L38 15" stroke="#4B5563" strokeWidth="2" />
                <circle cx="52" cy="20" r="5" stroke="#4B5563" strokeWidth="2" />
                <path d="M67 15V25H72M67 20H72" stroke="#4B5563" strokeWidth="2" />
                <path d="M83 15L83 25M93 15L93 25M83 20L93 20" stroke="#4B5563" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="mb-4">Điểm nổi bật</h2>
            <p className="text-xl text-gray-600">
              Chúng tôi cung cấp các giải pháp phần mềm hiện đại với nhiều tính năng vượt trội
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8">
              <div className="feature-icon">
                <Image src="/images/security.svg" alt="Bảo mật" width={48} height={48} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Bảo mật tối đa</h3>
              <p className="text-gray-600">
                Hệ thống bảo mật đa lớp bảo vệ dữ liệu của doanh nghiệp an toàn trước mọi mối đe dọa.
              </p>
            </div>
            <div className="card p-8">
              <div className="feature-icon">
                <Image src="/images/performance.svg" alt="Hiệu suất" width={48} height={48} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Hiệu suất cao</h3>
              <p className="text-gray-600">
                Tốc độ xử lý nhanh chóng và khả năng mở rộng linh hoạt theo nhu cầu doanh nghiệp.
              </p>
            </div>
            <div className="card p-8">
              <div className="feature-icon">
                <Image src="/images/cloud.svg" alt="Đám mây" width={48} height={48} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Công nghệ đám mây</h3>
              <p className="text-gray-600">
                Truy cập hệ thống từ mọi nơi với giải pháp đám mây tiên tiến và đồng bộ dữ liệu thời gian thực.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="mb-4">Sản phẩm của chúng tôi</h2>
            <p className="text-xl text-gray-600">
              Khám phá bộ giải pháp phần mềm toàn diện đáp ứng mọi nhu cầu của doanh nghiệp
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card">
              <div className="aspect-video relative bg-blue-50">
                <Image
                  src="/images/crm.svg"
                  alt="XLab CRM"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">XLab CRM</h3>
                <p className="text-gray-600 mb-4">
                  Hệ thống quản lý quan hệ khách hàng toàn diện, tối ưu hóa quy trình bán hàng và chăm sóc khách hàng.
                </p>
                <Link href="/products/crm" className="text-blue-600 font-medium hover:text-blue-700 inline-flex items-center">
                  Tìm hiểu thêm
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="card">
              <div className="aspect-video relative bg-blue-50">
                <Image
                  src="/images/erp.svg"
                  alt="XLab ERP"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">XLab ERP</h3>
                <p className="text-gray-600 mb-4">
                  Giải pháp quản trị nguồn lực doanh nghiệp tích hợp, quản lý hiệu quả từ tài chính đến nhân sự.
                </p>
                <Link href="/products/erp" className="text-blue-600 font-medium hover:text-blue-700 inline-flex items-center">
                  Tìm hiểu thêm
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="card">
              <div className="aspect-video relative bg-blue-50">
                <Image
                  src="/images/analytics.svg"
                  alt="XLab Analytics"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">XLab Analytics</h3>
                <p className="text-gray-600 mb-4">
                  Công cụ phân tích dữ liệu thông minh với các báo cáo trực quan, hỗ trợ ra quyết định chính xác.
                </p>
                <Link href="/products/analytics" className="text-blue-600 font-medium hover:text-blue-700 inline-flex items-center">
                  Tìm hiểu thêm
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Link href="/products" className="button-primary">
              Xem tất cả sản phẩm
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="mb-4">Dịch vụ chuyên nghiệp</h2>
            <p className="text-xl text-gray-600">
              Chúng tôi không chỉ cung cấp phần mềm mà còn đồng hành cùng doanh nghiệp trong suốt quá trình triển khai và sử dụng
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card p-6">
              <div className="mb-4">
                <Image src="/images/consulting.svg" alt="Tư vấn" width={60} height={60} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tư vấn giải pháp</h3>
              <p className="text-gray-600">
                Đội ngũ chuyên gia giàu kinh nghiệm tư vấn giải pháp phù hợp nhất với doanh nghiệp.
              </p>
            </div>
            <div className="card p-6">
              <div className="mb-4">
                <Image src="/images/development.svg" alt="Phát triển" width={60} height={60} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Phát triển phần mềm</h3>
              <p className="text-gray-600">
                Phát triển các tính năng tùy chỉnh theo yêu cầu đặc thù của từng doanh nghiệp.
              </p>
            </div>
            <div className="card p-6">
              <div className="mb-4">
                <Image src="/images/integration.svg" alt="Tích hợp" width={60} height={60} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Triển khai & Tích hợp</h3>
              <p className="text-gray-600">
                Triển khai nhanh chóng và tích hợp liền mạch với các hệ thống hiện có của doanh nghiệp.
              </p>
            </div>
            <div className="card p-6">
              <div className="mb-4">
                <Image src="/images/support.svg" alt="Hỗ trợ" width={60} height={60} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Hỗ trợ & Bảo trì</h3>
              <p className="text-gray-600">
                Dịch vụ hỗ trợ 24/7 và bảo trì thường xuyên đảm bảo hệ thống luôn hoạt động ổn định.
              </p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Link href="/services" className="button-primary">
              Tìm hiểu thêm về dịch vụ
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-gradient text-white py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mb-6">Sẵn sàng nâng cấp hệ thống của bạn?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí về giải pháp phù hợp với doanh nghiệp của bạn.
            </p>
            <Link href="/contact" className="button-primary bg-white text-blue-600 hover:bg-blue-50">
              Liên hệ ngay
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
