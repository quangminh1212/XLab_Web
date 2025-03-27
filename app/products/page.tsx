import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: "Sản phẩm - XLab",
  description: "Danh sách các sản phẩm phần mềm tiên tiến của XLab",
};

export default function Products() {
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
            <h1 className="mb-6">Sản phẩm</h1>
            <p className="text-xl text-blue-100 mb-0">
              Khám phá bộ giải pháp phần mềm toàn diện của XLab giúp doanh nghiệp tối ưu hoá quy trình và tăng năng suất
            </p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 gap-16">
            {/* CRM Product */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-blue-50 rounded-2xl p-8 flex items-center justify-center">
                <Image
                  src="/images/crm.svg"
                  alt="XLab CRM"
                  width={400}
                  height={300}
                  className="w-full max-w-md"
                />
              </div>
              <div>
                <h2 className="mb-4">XLab CRM</h2>
                <p className="text-gray-600 mb-6">
                  Hệ thống quản lý quan hệ khách hàng toàn diện, giúp doanh nghiệp quản lý và tối ưu hóa quy trình bán hàng, chăm sóc khách hàng và phát triển kinh doanh.
                </p>
                <h3 className="text-xl font-semibold mb-4">Tính năng nổi bật</h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Quản lý thông tin khách hàng tập trung</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Theo dõi cơ hội bán hàng và quản lý tiến trình</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Tự động hóa quy trình marketing và chăm sóc khách hàng</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Phân tích dữ liệu và báo cáo chi tiết</span>
                  </li>
                </ul>
                <Link href="/products/crm" className="button-primary">
                  Tìm hiểu thêm
                </Link>
              </div>
            </div>
            
            {/* ERP Product */}
            <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
              <div className="order-1 md:order-2 bg-indigo-50 rounded-2xl p-8 flex items-center justify-center">
                <Image
                  src="/images/erp.svg"
                  alt="XLab ERP"
                  width={400}
                  height={300}
                  className="w-full max-w-md"
                />
              </div>
              <div className="order-2 md:order-1">
                <h2 className="mb-4">XLab ERP</h2>
                <p className="text-gray-600 mb-6">
                  Giải pháp quản trị nguồn lực doanh nghiệp tích hợp, giúp quản lý toàn diện các hoạt động từ tài chính, kế toán, chuỗi cung ứng đến nhân sự và sản xuất.
                </p>
                <h3 className="text-xl font-semibold mb-4">Tính năng nổi bật</h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Quản lý tài chính và kế toán tích hợp</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Quản lý chuỗi cung ứng và kho hàng</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Quản lý nhân sự và tính lương tự động</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Lập kế hoạch và quản lý sản xuất</span>
                  </li>
                </ul>
                <Link href="/products/erp" className="button-primary">
                  Tìm hiểu thêm
                </Link>
              </div>
            </div>
            
            {/* Analytics Product */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-purple-50 rounded-2xl p-8 flex items-center justify-center">
                <Image
                  src="/images/analytics.svg"
                  alt="XLab Analytics"
                  width={400}
                  height={300}
                  className="w-full max-w-md"
                />
              </div>
              <div>
                <h2 className="mb-4">XLab Analytics</h2>
                <p className="text-gray-600 mb-6">
                  Công cụ phân tích dữ liệu thông minh với báo cáo trực quan, giúp doanh nghiệp phân tích xu hướng, nắm bắt thông tin và ra quyết định chính xác.
                </p>
                <h3 className="text-xl font-semibold mb-4">Tính năng nổi bật</h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Bảng điều khiển tùy chỉnh theo vai trò người dùng</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Phân tích xu hướng và dự báo kinh doanh</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Đo lường hiệu suất doanh nghiệp qua KPI</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Báo cáo tự động và chia sẻ thông tin liền mạch</span>
                  </li>
                </ul>
                <Link href="/products/analytics" className="button-primary">
                  Tìm hiểu thêm
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customization */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="mb-4">Giải pháp tùy chỉnh</h2>
            <p className="text-xl text-gray-600">
              Không tìm thấy giải pháp phù hợp với doanh nghiệp của bạn? Chúng tôi cung cấp dịch vụ phát triển giải pháp phần mềm tùy chỉnh.
            </p>
          </div>
          <div className="max-w-3xl mx-auto text-center">
            <Link href="/contact" className="button-primary">
              Liên hệ với chúng tôi
            </Link>
          </div>
        </div>
      </section>
    </>
  );
} 