import Link from "next/link";

export const metadata = {
  title: "Sản phẩm - XLab",
  description: "Danh sách các sản phẩm phần mềm tiên tiến của XLab",
};

export default function ProductsPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Sản phẩm của XLab</h1>
          <p className="text-xl max-w-3xl">
            Khám phá các giải pháp phần mềm tiên tiến được thiết kế để giải quyết các thách thức kinh doanh của doanh nghiệp hiện đại.
          </p>
        </div>
      </section>

      {/* Products List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Product 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100">
              <div className="h-48 bg-blue-200 flex items-center justify-center">
                <div className="text-2xl font-bold text-blue-600">XLab CRM</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">XLab CRM</h3>
                <p className="text-gray-600 mb-6">
                  Hệ thống quản lý khách hàng toàn diện với các tính năng phân tích dữ liệu thông minh, 
                  tự động hóa tiếp thị và quản lý bán hàng hiệu quả.
                </p>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Tính năng chính:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Quản lý thông tin khách hàng</li>
                    <li>Theo dõi cơ hội bán hàng</li>
                    <li>Tự động hóa tiếp thị</li>
                    <li>Báo cáo và phân tích dữ liệu</li>
                  </ul>
                </div>
                <Link 
                  href="/products/crm" 
                  className="inline-block bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg font-medium"
                >
                  Chi tiết
                </Link>
              </div>
            </div>

            {/* Product 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100">
              <div className="h-48 bg-indigo-200 flex items-center justify-center">
                <div className="text-2xl font-bold text-indigo-600">XLab ERP</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">XLab ERP</h3>
                <p className="text-gray-600 mb-6">
                  Giải pháp hoạch định tài nguyên doanh nghiệp hiện đại, tích hợp mọi quy trình
                  từ kế toán, mua hàng đến quản lý tồn kho và sản xuất.
                </p>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Tính năng chính:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Quản lý tài chính và kế toán</li>
                    <li>Quản lý chuỗi cung ứng</li>
                    <li>Quản lý sản xuất</li>
                    <li>Quản lý nhân sự</li>
                  </ul>
                </div>
                <Link 
                  href="/products/erp" 
                  className="inline-block bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium"
                >
                  Chi tiết
                </Link>
              </div>
            </div>

            {/* Product 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100">
              <div className="h-48 bg-purple-200 flex items-center justify-center">
                <div className="text-2xl font-bold text-purple-600">XLab Analytics</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">XLab Analytics</h3>
                <p className="text-gray-600 mb-6">
                  Công cụ phân tích dữ liệu mạnh mẽ với khả năng trực quan hóa thông tin, 
                  tạo báo cáo tùy chỉnh và đề xuất chiến lược dựa trên AI.
                </p>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Tính năng chính:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Phân tích dữ liệu thời gian thực</li>
                    <li>Trực quan hóa dữ liệu đa nền tảng</li>
                    <li>Dự báo và phân tích xu hướng</li>
                    <li>Tích hợp AI cho đề xuất thông minh</li>
                  </ul>
                </div>
                <Link 
                  href="/products/analytics" 
                  className="inline-block bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-lg font-medium"
                >
                  Chi tiết
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Cần tư vấn thêm về sản phẩm?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn lựa chọn giải pháp 
            phù hợp nhất với nhu cầu doanh nghiệp của bạn.
          </p>
          <Link 
            href="/contact" 
            className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg font-medium"
          >
            Liên hệ ngay
          </Link>
        </div>
      </section>
    </main>
  );
} 