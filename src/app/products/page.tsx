import Link from 'next/link'

export default function ProductsPage() {
  return (
    <div>
      {/* Page Header */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Sản phẩm</h1>
          <p className="text-xl max-w-3xl">
            Khám phá các sản phẩm phần mềm hiện đại được thiết kế riêng cho doanh nghiệp của bạn.
          </p>
        </div>
      </section>

      {/* Products List */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product 1 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-primary-500 to-primary-700"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">XLab Business Suite</h3>
                <p className="text-gray-600 mb-4">
                  Giải pháp phần mềm toàn diện cho việc quản lý doanh nghiệp, bao gồm kế toán, quản lý nhân sự, quản lý khách hàng và nhiều tính năng khác.
                </p>
                <Link
                  href="/products/business-suite"
                  className="btn btn-primary"
                >
                  Chi tiết
                </Link>
              </div>
            </div>

            {/* Product 2 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-secondary-500 to-secondary-700"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">XLab Analytics Pro</h3>
                <p className="text-gray-600 mb-4">
                  Công cụ phân tích dữ liệu nâng cao giúp bạn hiểu rõ hoạt động kinh doanh và đưa ra quyết định dựa trên dữ liệu thực tế.
                </p>
                <Link
                  href="/products/analytics-pro"
                  className="btn btn-primary"
                >
                  Chi tiết
                </Link>
              </div>
            </div>

            {/* Product 3 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-primary-700 to-secondary-700"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">XLab Cloud Solutions</h3>
                <p className="text-gray-600 mb-4">
                  Giải pháp đám mây bảo mật và hiệu quả giúp doanh nghiệp vận hành mượt mà từ bất kỳ đâu với khả năng mở rộng linh hoạt.
                </p>
                <Link
                  href="/products/cloud-solutions"
                  className="btn btn-primary"
                >
                  Chi tiết
                </Link>
              </div>
            </div>

            {/* Product 4 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-primary-600 to-primary-800"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">XLab CRM Pro</h3>
                <p className="text-gray-600 mb-4">
                  Phần mềm quản lý quan hệ khách hàng giúp doanh nghiệp quản lý, phân tích và tối ưu hóa mọi tương tác với khách hàng.
                </p>
                <Link
                  href="/products/crm-pro"
                  className="btn btn-primary"
                >
                  Chi tiết
                </Link>
              </div>
            </div>

            {/* Product 5 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-secondary-600 to-secondary-800"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">XLab HR Management</h3>
                <p className="text-gray-600 mb-4">
                  Giải pháp quản lý nhân sự toàn diện, từ tuyển dụng đến đánh giá hiệu suất và phát triển nhân tài.
                </p>
                <Link
                  href="/products/hr-management"
                  className="btn btn-primary"
                >
                  Chi tiết
                </Link>
              </div>
            </div>

            {/* Product 6 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-primary-800 to-secondary-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">XLab E-commerce Platform</h3>
                <p className="text-gray-600 mb-4">
                  Nền tảng thương mại điện tử mạnh mẽ giúp doanh nghiệp nhanh chóng triển khai cửa hàng trực tuyến với đầy đủ tính năng.
                </p>
                <Link
                  href="/products/ecommerce-platform"
                  className="btn btn-primary"
                >
                  Chi tiết
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Bạn cần một giải pháp riêng biệt?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Chúng tôi cung cấp dịch vụ phát triển phần mềm theo yêu cầu. Hãy liên hệ với chúng tôi để được tư vấn giải pháp phù hợp nhất.
              </p>
              <Link href="/contact" className="btn btn-primary px-8">
                Liên hệ ngay
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 