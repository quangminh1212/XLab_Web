import Header from '@/components/Header';
import Link from 'next/link';
import Image from 'next/image';

export default function Services() {
  const services = [
    {
      id: 'custom-software',
      title: 'Phát triển phần mềm tùy chỉnh',
      description: 'Chúng tôi phát triển các giải pháp phần mềm tùy chỉnh để đáp ứng nhu cầu cụ thể của doanh nghiệp bạn, từ các ứng dụng doanh nghiệp đến phần mềm quản lý nội bộ.',
      process: [
        'Phân tích yêu cầu',
        'Thiết kế giải pháp',
        'Phát triển phần mềm',
        'Kiểm thử toàn diện',
        'Triển khai và bàn giao',
        'Bảo trì và hỗ trợ'
      ],
      image: '/images/custom-software.svg'
    },
    {
      id: 'web-development',
      title: 'Phát triển web',
      description: 'Dịch vụ phát triển website và ứng dụng web chuyên nghiệp, từ trang web thương mại điện tử đến các ứng dụng web phức tạp với công nghệ hiện đại.',
      process: [
        'Tư vấn và lên ý tưởng',
        'Thiết kế giao diện người dùng',
        'Phát triển front-end và back-end',
        'Tối ưu hóa trải nghiệm người dùng',
        'Tích hợp các hệ thống',
        'Hỗ trợ kỹ thuật'
      ],
      image: '/images/web-development.svg'
    },
    {
      id: 'mobile-development',
      title: 'Phát triển ứng dụng di động',
      description: 'Phát triển ứng dụng di động đa nền tảng (iOS và Android) với giao diện đẹp, tốc độ nhanh và trải nghiệm người dùng tuyệt vời.',
      process: [
        'Xác định yêu cầu và khảo sát thị trường',
        'Thiết kế giao diện người dùng (UI/UX)',
        'Phát triển ứng dụng',
        'Kiểm thử và đảm bảo chất lượng',
        'Phát hành lên App Store/Google Play',
        'Bảo trì và cập nhật'
      ],
      image: '/images/mobile-development.svg'
    },
    {
      id: 'it-consulting',
      title: 'Tư vấn CNTT',
      description: 'Dịch vụ tư vấn chuyên nghiệp về chiến lược công nghệ thông tin, tối ưu hóa quy trình, và chuyển đổi số cho doanh nghiệp.',
      process: [
        'Đánh giá hiện trạng',
        'Phân tích nhu cầu kinh doanh',
        'Đề xuất giải pháp công nghệ',
        'Lập kế hoạch triển khai',
        'Hỗ trợ thực hiện',
        'Đánh giá hiệu quả'
      ],
      image: '/images/it-consulting.svg'
    }
  ];

  return (
    <main>
      <Header />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Dịch vụ của chúng tôi</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Chúng tôi cung cấp các dịch vụ phát triển phần mềm và tư vấn công nghệ chuyên nghiệp, giúp doanh nghiệp của bạn phát triển trong kỷ nguyên số.
          </p>
        </div>
      </section>
      
      {/* Services List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-32">
            {services.map((service, index) => (
              <div key={service.id} className="scroll-mt-16" id={service.id}>
                <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}>
                  <div className="md:w-1/2">
                    <div className="relative h-64 md:h-96 w-full">
                      <Image 
                        src={service.image} 
                        alt={service.title} 
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div className="md:w-1/2">
                    <h2 className="text-3xl font-bold mb-4">{service.title}</h2>
                    <p className="text-lg text-gray-700 mb-6">{service.description}</p>
                    
                    <h3 className="text-xl font-semibold mb-3">Quy trình làm việc:</h3>
                    <ol className="list-decimal pl-5 space-y-2 mb-8">
                      {service.process.map((step, i) => (
                        <li key={i} className="pl-2">
                          <span className="text-gray-800">{step}</span>
                        </li>
                      ))}
                    </ol>
                    
                    <div className="flex gap-4">
                      <Link href={`/services/${service.id}`} className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg">
                        Chi tiết
                      </Link>
                      <Link href="/contact" className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 py-2 px-6 rounded-lg">
                        Liên hệ tư vấn
                      </Link>
                    </div>
                  </div>
                </div>
                
                {index < services.length - 1 && (
                  <div className="border-b border-gray-200 mt-16"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Khách hàng nói gì về chúng tôi</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-indigo-100 w-12 h-12 flex items-center justify-center mr-4">
                  <span className="text-indigo-700 font-bold text-xl">N</span>
                </div>
                <div>
                  <h3 className="font-semibold">Nguyễn Văn A</h3>
                  <p className="text-gray-600">CEO, Công ty ABC</p>
                </div>
              </div>
              <p className="text-gray-700">
                "XLab đã giúp chúng tôi chuyển đổi toàn bộ hệ thống quản lý nội bộ. Đội ngũ làm việc chuyên nghiệp, đúng tiến độ và chất lượng sản phẩm vượt mong đợi."
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-indigo-100 w-12 h-12 flex items-center justify-center mr-4">
                  <span className="text-indigo-700 font-bold text-xl">T</span>
                </div>
                <div>
                  <h3 className="font-semibold">Trần Thị B</h3>
                  <p className="text-gray-600">CTO, Công ty XYZ</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Ứng dụng di động do XLab phát triển đã giúp chúng tôi tăng doanh số bán hàng 30% trong quý đầu tiên. Giao diện đẹp, tối ưu trải nghiệm người dùng."
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-indigo-100 w-12 h-12 flex items-center justify-center mr-4">
                  <span className="text-indigo-700 font-bold text-xl">L</span>
                </div>
                <div>
                  <h3 className="font-semibold">Lê Văn C</h3>
                  <p className="text-gray-600">Giám đốc Marketing, Công ty DEF</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Dịch vụ tư vấn CNTT của XLab đã giúp chúng tôi xây dựng chiến lược công nghệ hiệu quả. Đội ngũ am hiểu sâu về công nghệ và nhu cầu kinh doanh."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Sẵn sàng bắt đầu dự án của bạn?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí về giải pháp công nghệ phù hợp cho doanh nghiệp của bạn.
          </p>
          <Link 
            href="/contact" 
            className="bg-white text-indigo-600 hover:bg-gray-100 py-3 px-8 rounded-lg font-medium inline-block"
          >
            Liên hệ ngay
          </Link>
        </div>
      </section>
    </main>
  );
} 