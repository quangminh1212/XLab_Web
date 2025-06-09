'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Testimonial {
  id: string;
  name: string;
  company: string;
  position: string;
  image: string;
  quote: string;
  rating: number;
}

interface CaseStudy {
  id: string;
  company: string;
  title: string;
  description: string;
  image: string;
  results: string[];
  testimonial?: string;
}

export default function TestimonialsPage() {
  const [activeTab, setActiveTab] = useState<'clients' | 'case-studies'>('clients');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Nguyễn Văn An',
      company: 'TechViet Solutions',
      position: 'Giám đốc điều hành',
      image: '/images/products/office-suite-1.jpg',
      quote:
        'Sản phẩm của XLab đã giúp công ty chúng tôi tăng hiệu suất làm việc lên 40%. Đội ngũ hỗ trợ rất chuyên nghiệp và luôn sẵn sàng giải đáp mọi thắc mắc. Chúng tôi rất hài lòng với sự hợp tác này.',
      rating: 5,
    },
    {
      id: '2',
      name: 'Trần Thị Bình',
      company: 'Global Commerce',
      position: 'Giám đốc kỹ thuật',
      image: '/images/products/secure-vault-1.jpg',
      quote:
        'Phần mềm quản lý khách hàng của XLab đã giúp chúng tôi nâng cao trải nghiệm người dùng và tăng tỷ lệ chuyển đổi. Giao diện dễ sử dụng và tính năng phân tích dữ liệu rất hữu ích cho việc ra quyết định kinh doanh.',
      rating: 5,
    },
    {
      id: '3',
      name: 'Lê Minh Cường',
      company: 'FastRetail',
      position: 'Quản lý dự án',
      image: '/images/products/voice-typing.jpg',
      quote:
        'Chúng tôi đã sử dụng giải pháp của XLab trong hơn 2 năm và thực sự ấn tượng với khả năng đáp ứng nhu cầu ngày càng tăng của doanh nghiệp. Đội ngũ phát triển luôn lắng nghe phản hồi và cải tiến sản phẩm liên tục.',
      rating: 4,
    },
    {
      id: '4',
      name: 'Phạm Hoàng Dũng',
      company: 'EduTech',
      position: 'Giám đốc sản phẩm',
      image: '/images/products/adobe-logo.png',
      quote:
        'XLab đã hỗ trợ chúng tôi xây dựng nền tảng học trực tuyến với nhiều tính năng tiên tiến. Học viên của chúng tôi rất hài lòng với trải nghiệm học tập mới và điều này đã giúp tăng số lượng đăng ký khóa học mới.',
      rating: 5,
    },
    {
      id: '5',
      name: 'Hoàng Thị Lan',
      company: 'HealthPlus',
      position: 'Giám đốc công nghệ',
      image: '/images/products/chatgpt-logo.png',
      quote:
        'Giải pháp quản lý bệnh viện của XLab đã giúp chúng tôi tối ưu hóa quy trình làm việc và cải thiện chất lượng chăm sóc bệnh nhân. Hệ thống ổn định và bảo mật cao, đáp ứng các tiêu chuẩn ngành y tế.',
      rating: 4,
    },
  ];

  const caseStudies: CaseStudy[] = [
    {
      id: '1',
      company: 'TechViet Solutions',
      title: 'Chuyển đổi số toàn diện hệ thống quản lý nhân sự',
      description:
        'TechViet Solutions cần một giải pháp quản lý nhân sự toàn diện để thay thế hệ thống cũ đã lỗi thời. XLab đã phát triển một nền tảng quản lý nhân sự hiện đại với các tính năng quản lý hiệu suất, chấm công tự động và hệ thống đánh giá KPI.',
      image: '/images/products/system-erp.png',
      results: [
        'Giảm 35% thời gian xử lý các quy trình hành chính nhân sự',
        'Tăng 25% hiệu quả quản lý nhân viên',
        'Tiết kiệm 20% chi phí vận hành hàng năm',
      ],
      testimonial:
        'Hệ thống mới đã thay đổi hoàn toàn cách chúng tôi quản lý nhân sự. Các quy trình được tự động hóa giúp tiết kiệm thời gian và nguồn lực đáng kể.',
    },
    {
      id: '2',
      company: 'Global Commerce',
      title: 'Xây dựng nền tảng thương mại điện tử đa kênh',
      description:
        'Global Commerce muốn mở rộng kinh doanh sang thị trường trực tuyến với một nền tảng thương mại điện tử hiện đại. XLab đã phát triển một giải pháp toàn diện bao gồm website, ứng dụng di động và hệ thống quản lý kho hàng tích hợp.',
      image: '/images/products/web-developer.png',
      results: [
        'Tăng 150% doanh số bán hàng trong năm đầu triển khai',
        'Tăng 60% số lượng khách hàng mới',
        'Tối ưu hóa quản lý kho, giảm 40% hàng tồn kho',
      ],
      testimonial:
        'Giải pháp của XLab đã giúp chúng tôi mở rộng hoạt động kinh doanh sang thị trường trực tuyến một cách suôn sẻ. Hệ thống linh hoạt và dễ dàng mở rộng khi nhu cầu kinh doanh tăng lên.',
    },
    {
      id: '3',
      company: 'HealthPlus',
      title: 'Số hóa quy trình quản lý bệnh viện',
      description:
        'HealthPlus cần một hệ thống quản lý bệnh viện toàn diện để cải thiện hiệu quả hoạt động và nâng cao chất lượng chăm sóc bệnh nhân. XLab đã phát triển một giải pháp quản lý bệnh viện tích hợp với các tính năng quản lý bệnh nhân, lịch hẹn và hồ sơ y tế điện tử.',
      image: '/images/products/document-management.png',
      results: [
        'Giảm 45% thời gian chờ đợi của bệnh nhân',
        'Cải thiện 30% hiệu quả làm việc của nhân viên y tế',
        'Giảm 25% sai sót trong quản lý hồ sơ y tế',
      ],
      testimonial:
        'Hệ thống quản lý bệnh viện của XLab đã cách mạng hóa cách chúng tôi cung cấp dịch vụ chăm sóc sức khỏe. Bệnh nhân hài lòng hơn và nhân viên của chúng tôi có thể tập trung vào việc chăm sóc thay vì các công việc hành chính.',
    },
  ];

  // Xử lý lỗi ảnh không tải được
  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${i < rating ? 'text-amber-400' : 'text-gray-300'}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-500 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Khách hàng nói gì về chúng tôi
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Khám phá những trải nghiệm và kết quả thực tế mà khách hàng đã đạt được khi sử dụng
              giải pháp của XLab
            </p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-8 border-b border-gray-200 sticky top-0 bg-white z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center">
              <button
                className={`px-8 py-4 font-medium text-sm sm:text-base rounded-t-lg transition-all duration-300 ${
                  activeTab === 'clients'
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-white'
                    : 'text-gray-500 hover:text-primary-500 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('clients')}
                type="button"
              >
                Đánh giá từ khách hàng
              </button>
              <button
                className={`px-8 py-4 font-medium text-sm sm:text-base rounded-t-lg transition-all duration-300 ${
                  activeTab === 'case-studies'
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-white'
                    : 'text-gray-500 hover:text-primary-500 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('case-studies')}
                type="button"
              >
                Các dự án tiêu biểu
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {activeTab === 'clients' && (
            <div className="animate-fadeIn">
              <div className="grid grid-cols-1 gap-8 max-w-3xl mx-auto">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:-translate-y-1 border border-gray-100"
                  >
                    <div className="p-8">
                      <div className="mb-6">
                        <div className="flex items-center">
                          <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 bg-gray-200 flex items-center justify-center ring-4 ring-primary-50">
                            {!imageErrors[testimonial.id] ? (
                              <Image
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="object-cover"
                                fill
                                sizes="64px"
                                priority={false}
                                onError={() => handleImageError(testimonial.id)}
                              />
                            ) : (
                              <div className="text-2xl font-bold text-primary-600">
                                {testimonial.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-xl text-gray-900">{testimonial.name}</h3>
                            <p className="text-gray-600 text-sm">
                              {testimonial.position}, {testimonial.company}
                            </p>
                            <div className="mt-2">{renderRatingStars(testimonial.rating)}</div>
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <svg
                          className="absolute top-0 left-0 w-10 h-10 text-primary-100 transform -translate-x-6 -translate-y-6 opacity-50"
                          fill="currentColor"
                          viewBox="0 0 32 32"
                        >
                          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                        </svg>
                        <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                          {testimonial.quote}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Testimonial Video */}
              <div className="mt-24">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">Video đánh giá từ khách hàng</h2>
                  <p className="text-gray-600 max-w-3xl mx-auto">
                    Xem video chia sẻ từ khách hàng về trải nghiệm sử dụng sản phẩm và dịch vụ của
                    XLab
                  </p>
                </div>

                <div className="relative aspect-video max-w-4xl mx-auto shadow-xl rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 to-gray-900/40 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-20 w-20 text-white opacity-80"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  {/* Placeholder for video - in production, replace with actual video component */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      className="rounded-full bg-primary-600 bg-opacity-90 p-5 text-white hover:bg-opacity-100 transition-all transform hover:scale-110"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log('Video play button clicked');
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'case-studies' && (
            <div className="space-y-20 animate-fadeIn">
              {caseStudies.map((caseStudy, index) => (
                <div
                  key={caseStudy.id}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:shadow-xl ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative h-80 lg:h-auto bg-gradient-to-br from-primary-50 to-primary-100 p-6 flex items-center justify-center">
                      {!imageErrors[`case-${caseStudy.id}`] ? (
                        <div className="relative w-full h-full max-w-md mx-auto">
                          <Image
                            src={caseStudy.image}
                            alt={caseStudy.title}
                            className="object-contain"
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            onError={() => handleImageError(`case-${caseStudy.id}`)}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-primary-600">
                          {caseStudy.company}
                        </div>
                      )}
                    </div>
                    <div className="p-10">
                      <span className="text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                        {caseStudy.company}
                      </span>
                      <h3 className="text-2xl font-bold mt-4 mb-4 text-gray-900">
                        {caseStudy.title}
                      </h3>
                      <p className="text-gray-700 mb-8 leading-relaxed">{caseStudy.description}</p>

                      <h4 className="font-semibold text-lg mb-4 flex items-center text-gray-900">
                        <svg
                          className="w-5 h-5 mr-2 text-primary-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Kết quả đạt được:
                      </h4>
                      <ul className="space-y-3 mb-8">
                        {caseStudy.results.map((result, index) => (
                          <li key={index} className="flex items-start">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-gray-700">{result}</span>
                          </li>
                        ))}
                      </ul>

                      {caseStudy.testimonial && (
                        <div className="italic text-gray-700 border-l-4 border-primary-500 pl-4 py-3 bg-primary-50 rounded-r-lg">
                          &ldquo;{caseStudy.testimonial}&rdquo;
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-primary-700 to-primary-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Sẵn sàng nâng tầm doanh nghiệp của bạn?
            </h2>
            <p className="text-xl mb-10 max-w-3xl mx-auto opacity-90">
              Hãy liên hệ với chúng tôi ngay hôm nay để được tư vấn về giải pháp phù hợp nhất cho
              nhu cầu của bạn.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/contact"
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              >
                Liên hệ tư vấn
              </a>
              <a
                href="/services"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-full font-semibold transition-all transform hover:-translate-y-1"
              >
                Khám phá dịch vụ
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
