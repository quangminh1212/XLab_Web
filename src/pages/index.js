import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FigmaTestComponent from '../components/FigmaTestComponent'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>XLab - Phần mềm chuyên nghiệp</title>
        <meta name="description" content="XLab - Giải pháp phần mềm chuyên nghiệp cho doanh nghiệp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        <section className="py-12 bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight">
                Giải pháp phần mềm tối ưu cho doanh nghiệp
              </h2>
              <p className="mt-5 max-w-xl mx-auto text-xl text-gray-100">
                XLab cung cấp các giải pháp phần mềm chuyên nghiệp, đáp ứng mọi nhu cầu của doanh nghiệp bạn.
              </p>
              <div className="mt-8 flex justify-center">
                <div className="inline-flex rounded-md shadow">
                  <a href="#products" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50">
                    Khám phá sản phẩm
                  </a>
                </div>
                <div className="ml-3 inline-flex">
                  <a href="#contact" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-accent hover:bg-blue-400">
                    Liên hệ ngay
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Sản phẩm nổi bật
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                Khám phá các sản phẩm phần mềm chất lượng cao của XLab
              </p>
            </div>

            <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {/* Sản phẩm 1 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">XLab ERP</h3>
                  <p className="mt-2 text-base text-gray-500">Hệ thống quản lý nguồn lực doanh nghiệp toàn diện, tích hợp mọi phòng ban vào một nền tảng duy nhất.</p>
                  <div className="mt-4">
                    <a href="#" className="text-primary hover:text-blue-700">Tìm hiểu thêm →</a>
                  </div>
                </div>
              </div>

              {/* Sản phẩm 2 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">XLab CRM</h3>
                  <p className="mt-2 text-base text-gray-500">Phần mềm quản lý quan hệ khách hàng hiệu quả, nâng cao tỷ lệ chuyển đổi và chăm sóc khách hàng.</p>
                  <div className="mt-4">
                    <a href="#" className="text-primary hover:text-blue-700">Tìm hiểu thêm →</a>
                  </div>
                </div>
              </div>

              {/* Sản phẩm 3 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">XLab Analytics</h3>
                  <p className="mt-2 text-base text-gray-500">Công cụ phân tích dữ liệu thông minh, cung cấp báo cáo chi tiết và dự báo xu hướng kinh doanh.</p>
                  <div className="mt-4">
                    <a href="#" className="text-primary hover:text-blue-700">Tìm hiểu thêm →</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Dịch vụ của chúng tôi
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                XLab cung cấp đa dạng dịch vụ công nghệ thông tin
              </p>
            </div>

            <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Tư vấn & Triển khai</h3>
                <p className="mt-2 text-gray-500">Đội ngũ chuyên gia giàu kinh nghiệm sẽ tư vấn và triển khai giải pháp phù hợp nhất với doanh nghiệp của bạn.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Đào tạo & Hỗ trợ</h3>
                <p className="mt-2 text-gray-500">Cung cấp dịch vụ đào tạo và hỗ trợ 24/7 để đảm bảo hệ thống của bạn luôn vận hành tốt nhất.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Phát triển tùy chỉnh</h3>
                <p className="mt-2 text-gray-500">Phát triển các tính năng và module tùy chỉnh theo yêu cầu riêng của doanh nghiệp.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Bảo trì & Nâng cấp</h3>
                <p className="mt-2 text-gray-500">Dịch vụ bảo trì định kỳ và nâng cấp hệ thống để đảm bảo phần mềm luôn cập nhật và an toàn.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Về XLab
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                XLab là công ty công nghệ hàng đầu chuyên cung cấp giải pháp phần mềm cho doanh nghiệp vừa và nhỏ tại Việt Nam.
              </p>
            </div>

            <div className="mt-10">
              <p className="text-gray-600">
                Được thành lập vào năm 2015, XLab đã không ngừng phát triển và khẳng định vị thế trên thị trường phần mềm Việt Nam. Với đội ngũ nhân sự tài năng, giàu kinh nghiệm, chúng tôi tự hào đã cung cấp các giải pháp phần mềm chất lượng cao, đáp ứng nhu cầu đa dạng của hơn 500 khách hàng.
              </p>
              <p className="mt-4 text-gray-600">
                Sứ mệnh của chúng tôi là đồng hành cùng doanh nghiệp Việt trong hành trình chuyển đổi số, nâng cao hiệu suất hoạt động và tăng tính cạnh tranh trên thị trường.
              </p>
            </div>
          </div>
        </section>

        <section id="contact" className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Liên hệ với chúng tôi
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                Bạn có thắc mắc? Hãy liên hệ ngay với XLab
              </p>
            </div>

            <div className="mt-12 bg-white rounded-lg shadow overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">Thông tin liên hệ</h3>
                  <ul className="mt-4 space-y-4">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 text-primary">Địa chỉ:</span>
                      <span className="ml-2 text-gray-500">123 Đường Lê Lợi, Quận 1, TP.HCM</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 text-primary">Email:</span>
                      <span className="ml-2 text-gray-500">info@xlab.vn</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 text-primary">Điện thoại:</span>
                      <span className="ml-2 text-gray-500">(+84) 28 1234 5678</span>
                    </li>
                  </ul>
                </div>
                <div className="p-6 border-t md:border-t-0 md:border-l border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Gửi tin nhắn</h3>
                  <form className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Họ tên</label>
                      <input type="text" id="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <input type="email" id="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">Tin nhắn</label>
                      <textarea id="message" rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"></textarea>
                    </div>
                    <div>
                      <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        Gửi tin nhắn
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Test Figma Component */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FigmaTestComponent />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
} 