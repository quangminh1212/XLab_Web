import Header from '@/components/Header';
import Link from 'next/link';
import Image from 'next/image';

export default function Products() {
  const products = [
    {
      id: 'crm',
      name: 'XLab CRM',
      description: 'Hệ thống quản lý quan hệ khách hàng toàn diện, giúp theo dõi và chăm sóc khách hàng hiệu quả.',
      features: [
        'Quản lý thông tin khách hàng',
        'Theo dõi cơ hội bán hàng',
        'Lập kế hoạch tiếp thị',
        'Báo cáo phân tích',
        'Tích hợp email marketing'
      ],
      image: '/images/crm.svg'
    },
    {
      id: 'erp',
      name: 'XLab ERP',
      description: 'Giải pháp quản lý nguồn lực doanh nghiệp, tối ưu hóa quy trình vận hành và tăng năng suất.',
      features: [
        'Quản lý tài chính kế toán',
        'Quản lý nhân sự',
        'Quản lý hàng tồn kho',
        'Quản lý sản xuất',
        'Báo cáo tổng hợp'
      ],
      image: '/images/erp.svg'
    },
    {
      id: 'analytics',
      name: 'XLab Analytics',
      description: 'Công cụ phân tích dữ liệu thông minh, giúp doanh nghiệp hiểu rõ thị trường và đưa ra quyết định đúng đắn.',
      features: [
        'Phân tích dữ liệu kinh doanh',
        'Báo cáo trực quan',
        'Dự đoán xu hướng',
        'Phân tích khách hàng',
        'Tích hợp nhiều nguồn dữ liệu'
      ],
      image: '/images/analytics.svg'
    },
    {
      id: 'ecommerce',
      name: 'XLab E-commerce',
      description: 'Nền tảng thương mại điện tử hoàn chỉnh, giúp doanh nghiệp kinh doanh trực tuyến hiệu quả.',
      features: [
        'Trang web bán hàng chuyên nghiệp',
        'Quản lý đơn hàng',
        'Tích hợp thanh toán đa dạng',
        'SEO tối ưu',
        'Mobile responsive'
      ],
      image: '/images/ecommerce.svg'
    }
  ];

  return (
    <main>
      <Header />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Sản phẩm phần mềm</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Khám phá các sản phẩm phần mềm chất lượng cao của chúng tôi, được thiết kế để đáp ứng nhu cầu kinh doanh hiện đại.
          </p>
        </div>
      </section>
      
      {/* Products List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-24">
            {products.map((product, index) => (
              <div key={product.id} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}>
                <div className="md:w-1/2">
                  <div className="relative h-64 md:h-96 w-full">
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="md:w-1/2">
                  <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
                  <p className="text-lg text-gray-700 mb-6">{product.description}</p>
                  <ul className="space-y-2 mb-8">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-4">
                    <Link href={`/products/${product.id}`} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg">
                      Chi tiết
                    </Link>
                    <Link href="/contact" className="border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 px-6 rounded-lg">
                      Liên hệ tư vấn
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Không tìm thấy thứ bạn cần?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Chúng tôi cung cấp các giải pháp phần mềm tùy chỉnh để đáp ứng chính xác nhu cầu của doanh nghiệp bạn.
          </p>
          <Link 
            href="/services/custom-software" 
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg font-medium inline-block"
          >
            Tìm hiểu về dịch vụ tùy chỉnh
          </Link>
        </div>
      </section>
    </main>
  );
} 