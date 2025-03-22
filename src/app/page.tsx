import Header from '@/components/Header';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main>
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Phần mềm tùy chỉnh và giải pháp công nghệ
              </h1>
              <p className="text-xl mb-8">
                Nâng cao hiệu suất kinh doanh của bạn với các giải pháp phần mềm chất lượng cao và dịch vụ hỗ trợ toàn diện.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/products" 
                  className="bg-white text-blue-600 hover:bg-gray-100 py-3 px-6 rounded-lg font-medium"
                >
                  Xem sản phẩm
                </Link>
                <Link 
                  href="/contact" 
                  className="bg-transparent border border-white hover:bg-white hover:text-blue-600 py-3 px-6 rounded-lg font-medium"
                >
                  Liên hệ với chúng tôi
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative h-64 md:h-96 w-full">
                <Image 
                  src="/images/hero-image.svg" 
                  alt="Software development illustration" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Giải pháp đa dạng cho doanh nghiệp của bạn</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Phần mềm tùy chỉnh</h3>
              <p className="text-gray-600 mb-4">Giải pháp phần mềm được thiết kế riêng để đáp ứng nhu cầu cụ thể của doanh nghiệp bạn.</p>
              <Link href="/services/custom-software" className="text-blue-600 font-medium hover:underline">Tìm hiểu thêm →</Link>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Dịch vụ web</h3>
              <p className="text-gray-600 mb-4">Thiết kế và phát triển website, ứng dụng web với trải nghiệm người dùng tối ưu.</p>
              <Link href="/services/web-development" className="text-blue-600 font-medium hover:underline">Tìm hiểu thêm →</Link>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Tư vấn CNTT</h3>
              <p className="text-gray-600 mb-4">Dịch vụ tư vấn chuyên nghiệp để giúp doanh nghiệp tận dụng tối đa công nghệ.</p>
              <Link href="/services/it-consulting" className="text-blue-600 font-medium hover:underline">Tìm hiểu thêm →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Sẵn sàng nâng cấp công nghệ cho doanh nghiệp?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Chúng tôi đem đến các giải pháp công nghệ hiện đại, giúp doanh nghiệp của bạn phát triển và tiết kiệm chi phí.
          </p>
          <Link 
            href="/contact" 
            className="bg-white text-blue-600 hover:bg-gray-100 py-3 px-8 rounded-lg font-medium inline-block"
          >
            Liên hệ ngay
          </Link>
        </div>
      </section>
    </main>
  );
} 