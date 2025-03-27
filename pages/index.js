import Head from 'next/head';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div>
      <Head>
        <title>XLab - Giải pháp phần mềm chuyên nghiệp</title>
        <meta name="description" content="XLab cung cấp các giải pháp phần mềm tiên tiến giúp doanh nghiệp tối ưu hoá quy trình và phát triển bền vững." />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <Navbar />
      <main>
        <Hero />
        <Features />

        {/* Phần Products */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Sản phẩm của chúng tôi</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Khám phá danh mục các giải pháp phần mềm được thiết kế đặc biệt để đáp ứng nhu cầu kinh doanh của bạn.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((product) => (
                <div key={product} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-300 relative">
                    <img 
                      src={`https://via.placeholder.com/600x400?text=Product+${product}`}
                      alt={`Sản phẩm ${product}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3">Phần mềm {product}</h3>
                    <p className="text-gray-600 mb-4">
                      Giải pháp tối ưu giúp doanh nghiệp tăng hiệu quả hoạt động và tiết kiệm chi phí.
                    </p>
                    <button className="text-primary font-semibold hover:underline">
                      Tìm hiểu thêm &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <button className="bg-primary text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
                Xem tất cả sản phẩm
              </button>
            </div>
          </div>
        </section>

        {/* Phần Contact */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Liên hệ với chúng tôi</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Bạn có câu hỏi hoặc cần tư vấn? Hãy để lại thông tin, chúng tôi sẽ liên hệ lại ngay!
                </p>
              </div>

              <form className="max-w-3xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Nhập họ và tên của bạn"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Nhập địa chỉ email của bạn"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Nhập tiêu đề tin nhắn"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                  <textarea
                    id="message"
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Nhập nội dung tin nhắn"
                  ></textarea>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-primary text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Gửi tin nhắn
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
} 