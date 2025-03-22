import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Personalized Welcome */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 sm:py-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-100 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary-100 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl mx-auto">
            <svg className="w-full h-full text-primary-100 opacity-10" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" d="M44.3,-76C57.8,-69.7,69.4,-58.8,77.8,-45.3C86.3,-31.9,91.6,-16,93.2,0.9C94.8,17.9,92.6,35.8,83.5,50C74.3,64.3,58.1,75,41.2,79.9C24.3,84.9,6.6,84.1,-10.7,80.8C-28.1,77.4,-45.1,71.5,-57.6,60.5C-70,49.5,-77.9,33.5,-81.9,16.2C-85.9,-1.1,-86.1,-19.6,-79.4,-35C-72.7,-50.4,-59.1,-62.7,-44.6,-68.9C-30.1,-75,-15.1,-75.1,0.2,-75.5C15.5,-75.8,30.9,-76.4,44.3,-76Z" transform="translate(100 100)" />
            </svg>
          </div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <span className="inline-block px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-medium text-sm mb-6 animate-pulse">
                Nền tảng giải pháp toàn diện cho doanh nghiệp và cá nhân
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Trải nghiệm <span className="text-primary-600 relative">
                  cá nhân hóa
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-primary-100 -z-10 opacity-70"></span>
                </span> tốt nhất cho nhu cầu của bạn
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                Chúng tôi tạo ra các giải pháp tùy chỉnh, thiết kế riêng cho từng khách hàng, đảm bảo trải nghiệm người dùng tuyệt vời và hiệu quả công việc tối ưu.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  href="/contact" 
                  className="group px-6 py-3 bg-primary-600 text-white font-medium rounded-full hover:bg-primary-700 transition-all shadow-lg shadow-primary-100 flex items-center justify-center space-x-2"
                >
                  <span>Tư vấn miễn phí</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link 
                  href="/products" 
                  className="group px-6 py-3 bg-white text-primary-600 font-medium rounded-full border border-primary-200 hover:bg-primary-50 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Khám phá dịch vụ</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              
              <div className="mt-10 flex items-center justify-center lg:justify-start">
                <p className="text-sm font-medium text-gray-500 mr-4">Được tin tưởng bởi:</p>
                <div className="flex space-x-6 items-center">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-gray-400 hover:text-primary-600 transition-colors">
                      {i === 1 && (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                        </svg>
                      )}
                      {i === 2 && (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                          <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" />
                        </svg>
                      )}
                      {i === 3 && (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                          <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm1-11h-2v3H8v2h3v3h2v-3h3v-2h-3V8z" />
                        </svg>
                      )}
                      {i === 4 && (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                          <path d="M18 11v2h4v-2h-4zm-2 6.61c.96.71 2.21 1.65 3.2 2.39.4-.53.8-1.07 1.2-1.6-.99-.74-2.24-1.68-3.2-2.4-.4.54-.8 1.08-1.2 1.61zM20.4 5.6c-.4-.53-.8-1.07-1.2-1.6-.99.74-2.24 1.68-3.2 2.4.4.53.8 1.07 1.2 1.6.96-.72 2.21-1.65 3.2-2.4zM4 9c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1v4h2v-4h1l5 3V6L8 9H4zm11.5 3c0-1.33-.58-2.53-1.5-3.35v6.69c.92-.81 1.5-2.01 1.5-3.34z" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="relative mx-auto lg:mx-0 max-w-md">
              <div className="absolute inset-0 -m-4 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-2xl rotate-2 blur-sm opacity-70"></div>
              <div className="absolute inset-0 -m-4 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-2xl -rotate-2 blur-sm opacity-70"></div>
              
              <div className="relative bg-white p-6 rounded-xl shadow-xl overflow-hidden">
                <div className="absolute top-0 left-0 w-20 h-20 bg-primary-500 opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-secondary-500 opacity-10 rounded-full translate-x-1/2 translate-y-1/2"></div>
                
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-800">Giải pháp cho bạn</h3>
                </div>
                
                <div className="space-y-4">
                  {[
                    { name: 'Giao diện cá nhân hóa', percent: 95 },
                    { name: 'Tính năng tùy chọn', percent: 90 },
                    { name: 'Tích hợp đa nền tảng', percent: 92 },
                    { name: 'Bảo mật dữ liệu', percent: 98 },
                  ].map((item) => (
                    <div key={item.name}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                        <span className="text-sm font-medium text-primary-600">{item.percent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-gradient-to-r from-primary-500 to-primary-600 h-2.5 rounded-full" 
                          style={{ width: `${item.percent}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm text-gray-600">
                        "XLab đã tạo ra trải nghiệm người dùng tuyệt vời, cá nhân hóa theo nhu cầu của tôi. Tôi rất hài lòng với kết quả!"
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-800">Nguyễn Thanh Hải, Giám đốc Marketing</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tính năng nổi bật - Thiết kế thân thiện với người dùng */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
              Lấy người dùng làm trung tâm
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-4">Trải nghiệm tuyệt vời cho bạn</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Chúng tôi tạo ra các giải pháp lấy người dùng làm trung tâm, đảm bảo mọi trải nghiệm đều vượt trội
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                  </svg>
                ),
                title: 'Thiết kế cá nhân hóa',
                description: 'Mọi giải pháp của chúng tôi đều được thiết kế riêng cho từng người dùng, đảm bảo trải nghiệm tuyệt vời và hiệu quả tối đa.'
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: 'Bảo mật tối đa',
                description: 'Chúng tôi ưu tiên bảo vệ dữ liệu cá nhân của bạn với các công nghệ mã hóa tiên tiến và quy trình bảo mật nghiêm ngặt.'
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Hiệu suất tối ưu',
                description: 'Các giải pháp của chúng tôi được tối ưu hóa để đạt hiệu suất cao nhất, giúp công việc của bạn luôn diễn ra trơn tru.'
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                ),
                title: 'Hỗ trợ 24/7',
                description: 'Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc và hỗ trợ bạn bất cứ khi nào cần thiết.'
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                ),
                title: 'Giao diện thân thiện',
                description: 'Chúng tôi thiết kế giao diện trực quan, dễ sử dụng và tương thích với mọi thiết bị, đảm bảo trải nghiệm người dùng tốt nhất.'
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ),
                title: 'Cập nhật liên tục',
                description: 'Chúng tôi liên tục cải tiến và cập nhật các tính năng mới, đảm bảo giải pháp của bạn luôn tiên tiến và phù hợp nhất.'
              },
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100 hover:border-primary-100 group"
              >
                <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lời kêu gọi hành động - Thiết kế cá nhân hóa */}
      <section className="py-16 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
            <path d="M0,0 L100,100 M100,0 L0,100" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="rounded-full bg-white/10 inline-flex p-2 mb-6">
              <div className="bg-white text-primary-600 rounded-full px-4 py-1 text-sm font-medium">
                Bắt đầu ngay hôm nay
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Cá nhân hóa trải nghiệm của bạn</h2>
            <p className="text-lg text-primary-100 mb-8 max-w-3xl mx-auto">
              Đăng ký tư vấn miễn phí với chuyên gia của chúng tôi để tìm hiểu thêm về các giải pháp phù hợp với nhu cầu cá nhân của bạn.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/contact" 
                className="group px-6 py-3 bg-white text-primary-600 font-medium rounded-full hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center space-x-2"
              >
                <span>Tư vấn miễn phí</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link 
                href="/demo" 
                className="group px-6 py-3 bg-primary-500 text-white font-medium rounded-full border border-primary-400 hover:bg-primary-400 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Đăng ký dùng thử</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 