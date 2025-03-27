import Link from "next/link";

export const metadata = {
  title: "Dịch vụ - XLab",
  description: "Các dịch vụ phát triển và triển khai phần mềm của XLab",
};

export default function ServicesPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Dịch vụ của XLab</h1>
          <p className="text-xl max-w-3xl">
            Chúng tôi cung cấp các dịch vụ chuyên nghiệp từ tư vấn chiến lược, thiết kế giải pháp đến triển khai và hỗ trợ kỹ thuật.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Service 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 flex flex-col">
              <div className="p-6 flex-grow">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Tư vấn & Thiết kế giải pháp</h3>
                <p className="text-gray-600 mb-6">
                  Đội ngũ chuyên gia của chúng tôi sẽ phân tích nhu cầu doanh nghiệp của bạn và đề xuất giải pháp phần mềm phù hợp nhất.
                </p>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Dịch vụ bao gồm:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Phân tích nhu cầu kinh doanh</li>
                    <li>Thiết kế giải pháp tổng thể</li>
                    <li>Đánh giá công nghệ</li>
                    <li>Lên kế hoạch triển khai</li>
                  </ul>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100">
                <Link 
                  href="/contact" 
                  className="inline-block bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg font-medium"
                >
                  Tư vấn miễn phí
                </Link>
              </div>
            </div>

            {/* Service 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 flex flex-col">
              <div className="p-6 flex-grow">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Phát triển phần mềm tùy chỉnh</h3>
                <p className="text-gray-600 mb-6">
                  Chúng tôi xây dựng các giải pháp phần mềm tùy chỉnh theo yêu cầu cụ thể của doanh nghiệp bạn.
                </p>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Dịch vụ bao gồm:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Phát triển ứng dụng web/mobile</li>
                    <li>Xây dựng API và tích hợp hệ thống</li>
                    <li>Phát triển theo phương pháp Agile</li>
                    <li>Kiểm thử và đảm bảo chất lượng</li>
                  </ul>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100">
                <Link 
                  href="/contact" 
                  className="inline-block bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium"
                >
                  Yêu cầu báo giá
                </Link>
              </div>
            </div>

            {/* Service 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 flex flex-col">
              <div className="p-6 flex-grow">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Triển khai & Tích hợp</h3>
                <p className="text-gray-600 mb-6">
                  Chúng tôi đảm bảo quá trình triển khai và tích hợp phần mềm diễn ra suôn sẻ với quy trình được tối ưu hóa.
                </p>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Dịch vụ bao gồm:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Triển khai hệ thống</li>
                    <li>Tích hợp với các hệ thống hiện có</li>
                    <li>Di chuyển dữ liệu</li>
                    <li>Đào tạo người dùng</li>
                  </ul>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100">
                <Link 
                  href="/contact" 
                  className="inline-block bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg font-medium"
                >
                  Tìm hiểu thêm
                </Link>
              </div>
            </div>

            {/* Service 4 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 flex flex-col">
              <div className="p-6 flex-grow">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Hỗ trợ & Bảo trì</h3>
                <p className="text-gray-600 mb-6">
                  Chúng tôi cung cấp dịch vụ hỗ trợ và bảo trì liên tục để đảm bảo phần mềm của bạn luôn hoạt động tốt nhất.
                </p>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Dịch vụ bao gồm:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Hỗ trợ kỹ thuật 24/7</li>
                    <li>Cập nhật và nâng cấp hệ thống</li>
                    <li>Giám sát hiệu suất</li>
                    <li>Sao lưu và khôi phục dữ liệu</li>
                  </ul>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100">
                <Link 
                  href="/contact" 
                  className="inline-block bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-lg font-medium"
                >
                  Đăng ký dịch vụ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Quy trình làm việc của chúng tôi</h2>
          
          <div className="flex flex-col md:flex-row justify-between max-w-4xl mx-auto">
            <div className="text-center mb-8 md:mb-0">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Tìm hiểu & Phân tích</h3>
              <p className="text-gray-600 px-4">Hiểu rõ nhu cầu và mục tiêu của bạn</p>
            </div>
            
            <div className="text-center mb-8 md:mb-0">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Thiết kế & Phát triển</h3>
              <p className="text-gray-600 px-4">Xây dựng giải pháp tùy chỉnh</p>
            </div>
            
            <div className="text-center mb-8 md:mb-0">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Kiểm thử & Triển khai</h3>
              <p className="text-gray-600 px-4">Đảm bảo chất lượng và hiệu suất</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">4</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Hỗ trợ & Cải tiến</h3>
              <p className="text-gray-600 px-4">Duy trì và nâng cấp liên tục</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Bắt đầu dự án của bạn ngay hôm nay</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Hãy liên hệ với chúng tôi để thảo luận về yêu cầu dự án và nhận tư vấn miễn phí từ đội ngũ chuyên gia của XLab.
          </p>
          <Link 
            href="/contact" 
            className="bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-3 rounded-lg font-medium"
          >
            Liên hệ ngay
          </Link>
        </div>
      </section>
    </main>
  );
} 