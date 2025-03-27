import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Giải pháp phần mềm tiên tiến cho doanh nghiệp
              </h1>
              <p className="text-xl mb-8">
                XLab cung cấp các giải pháp phần mềm chuyên nghiệp, giúp doanh nghiệp tối ưu hóa quy trình làm việc và tăng năng suất.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/products" 
                  className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium text-center"
                >
                  Khám phá sản phẩm
                </Link>
                <Link 
                  href="/contact" 
                  className="bg-transparent border border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium text-center"
                >
                  Liên hệ ngay
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="w-full max-w-md h-80 bg-white/10 rounded-lg flex items-center justify-center">
                <div className="text-6xl font-bold text-white/50">XLab</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Tại sao chọn XLab?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Bảo mật cao cấp</h3>
              <p className="text-gray-600">
                Chúng tôi ưu tiên bảo mật dữ liệu của khách hàng với các tiêu chuẩn bảo mật hàng đầu trong ngành.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Hiệu suất tối ưu</h3>
              <p className="text-gray-600">
                Các giải pháp của chúng tôi được tối ưu hóa để mang lại hiệu suất cao nhất, giúp doanh nghiệp tiết kiệm thời gian và chi phí.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Công nghệ đám mây</h3>
              <p className="text-gray-600">
                Tất cả sản phẩm của chúng tôi đều được xây dựng trên nền tảng đám mây, đảm bảo tính sẵn sàng và khả năng mở rộng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Sản phẩm nổi bật</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-blue-200 flex items-center justify-center">
                <div className="text-2xl font-bold text-blue-600">XLab CRM</div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">XLab CRM</h3>
                <p className="text-gray-600 mb-4">
                  Hệ thống quản lý khách hàng toàn diện với các tính năng phân tích dữ liệu thông minh.
                </p>
                <Link href="/products/crm" className="text-blue-600 hover:underline font-medium">
                  Tìm hiểu thêm →
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-indigo-200 flex items-center justify-center">
                <div className="text-2xl font-bold text-indigo-600">XLab ERP</div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">XLab ERP</h3>
                <p className="text-gray-600 mb-4">
                  Giải pháp hoạch định tài nguyên doanh nghiệp giúp tối ưu hóa quy trình vận hành.
                </p>
                <Link href="/products/erp" className="text-blue-600 hover:underline font-medium">
                  Tìm hiểu thêm →
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-purple-200 flex items-center justify-center">
                <div className="text-2xl font-bold text-purple-600">XLab Analytics</div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">XLab Analytics</h3>
                <p className="text-gray-600 mb-4">
                  Công cụ phân tích dữ liệu với các báo cáo trực quan giúp ra quyết định chính xác.
                </p>
                <Link href="/products/analytics" className="text-blue-600 hover:underline font-medium">
                  Tìm hiểu thêm →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Sẵn sàng nâng cấp hệ thống của bạn?</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Liên hệ ngay với chúng tôi để được tư vấn về giải pháp phù hợp nhất cho doanh nghiệp của bạn.
          </p>
          <Link 
            href="/contact" 
            className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 rounded-lg font-medium text-lg"
          >
            Liên hệ tư vấn
          </Link>
        </div>
      </section>
    </main>
  );
}
