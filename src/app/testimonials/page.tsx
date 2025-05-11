'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Testimonial {
  id: string
  name: string
  company: string
  position: string
  image: string
  quote: string
  rating: number
}

interface CaseStudy {
  id: string
  company: string
  title: string
  description: string
  image: string
  results: string[]
  testimonial?: string
}

export default function TestimonialsPage() {
  const [activeTab, setActiveTab] = useState<'clients' | 'case-studies'>('clients')
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  
  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Nguyễn Văn An',
      company: 'TechViet Solutions',
      position: 'Giám đốc điều hành',
      image: '/images/products/office-suite-1.jpg',
      quote: 'Sản phẩm của XLab đã giúp công ty chúng tôi tăng hiệu suất làm việc lên 40%. Đội ngũ hỗ trợ rất chuyên nghiệp và luôn sẵn sàng giải đáp mọi thắc mắc. Chúng tôi rất hài lòng với sự hợp tác này.',
      rating: 5
    },
    {
      id: '2',
      name: 'Trần Thị Bình',
      company: 'Global Commerce',
      position: 'Giám đốc kỹ thuật',
      image: '/images/products/secure-vault-1.jpg',
      quote: 'Phần mềm quản lý khách hàng của XLab đã giúp chúng tôi nâng cao trải nghiệm người dùng và tăng tỷ lệ chuyển đổi. Giao diện dễ sử dụng và tính năng phân tích dữ liệu rất hữu ích cho việc ra quyết định kinh doanh.',
      rating: 5
    },
    {
      id: '3',
      name: 'Lê Minh Cường',
      company: 'FastRetail',
      position: 'Quản lý dự án',
      image: '/images/products/voice-typing.jpg',
      quote: 'Chúng tôi đã sử dụng giải pháp của XLab trong hơn 2 năm và thực sự ấn tượng với khả năng đáp ứng nhu cầu ngày càng tăng của doanh nghiệp. Đội ngũ phát triển luôn lắng nghe phản hồi và cải tiến sản phẩm liên tục.',
      rating: 4
    },
    {
      id: '4',
      name: 'Phạm Hoàng Dũng',
      company: 'EduTech',
      position: 'Giám đốc sản phẩm',
      image: '/images/products/adobe-logo.png',
      quote: 'XLab đã hỗ trợ chúng tôi xây dựng nền tảng học trực tuyến với nhiều tính năng tiên tiến. Học viên của chúng tôi rất hài lòng với trải nghiệm học tập mới và điều này đã giúp tăng số lượng đăng ký khóa học mới.',
      rating: 5
    },
    {
      id: '5',
      name: 'Hoàng Thị Lan',
      company: 'HealthPlus',
      position: 'Giám đốc công nghệ',
      image: '/images/products/chatgpt-logo.png',
      quote: 'Giải pháp quản lý bệnh viện của XLab đã giúp chúng tôi tối ưu hóa quy trình làm việc và cải thiện chất lượng chăm sóc bệnh nhân. Hệ thống ổn định và bảo mật cao, đáp ứng các tiêu chuẩn ngành y tế.',
      rating: 4
    }
  ]
  
  const caseStudies: CaseStudy[] = [
    {
      id: '1',
      company: 'TechViet Solutions',
      title: 'Chuyển đổi số toàn diện hệ thống quản lý nhân sự',
      description: 'TechViet Solutions cần một giải pháp quản lý nhân sự toàn diện để thay thế hệ thống cũ đã lỗi thời. XLab đã phát triển một nền tảng quản lý nhân sự hiện đại với các tính năng quản lý hiệu suất, chấm công tự động và hệ thống đánh giá KPI.',
      image: '/images/products/system-erp.png',
      results: [
        'Giảm 35% thời gian xử lý các quy trình hành chính nhân sự',
        'Tăng 25% hiệu quả quản lý nhân viên',
        'Tiết kiệm 20% chi phí vận hành hàng năm'
      ],
      testimonial: 'Hệ thống mới đã thay đổi hoàn toàn cách chúng tôi quản lý nhân sự. Các quy trình được tự động hóa giúp tiết kiệm thời gian và nguồn lực đáng kể.'
    },
    {
      id: '2',
      company: 'Global Commerce',
      title: 'Xây dựng nền tảng thương mại điện tử đa kênh',
      description: 'Global Commerce muốn mở rộng kinh doanh sang thị trường trực tuyến với một nền tảng thương mại điện tử hiện đại. XLab đã phát triển một giải pháp toàn diện bao gồm website, ứng dụng di động và hệ thống quản lý kho hàng tích hợp.',
      image: '/images/products/web-developer.png',
      results: [
        'Tăng 150% doanh số bán hàng trong năm đầu triển khai',
        'Tăng 60% số lượng khách hàng mới',
        'Tối ưu hóa quản lý kho, giảm 40% hàng tồn kho'
      ],
      testimonial: 'Giải pháp của XLab đã giúp chúng tôi mở rộng hoạt động kinh doanh sang thị trường trực tuyến một cách suôn sẻ. Hệ thống linh hoạt và dễ dàng mở rộng khi nhu cầu kinh doanh tăng lên.'
    },
    {
      id: '3',
      company: 'HealthPlus',
      title: 'Số hóa quy trình quản lý bệnh viện',
      description: 'HealthPlus cần một hệ thống quản lý bệnh viện toàn diện để cải thiện hiệu quả hoạt động và nâng cao chất lượng chăm sóc bệnh nhân. XLab đã phát triển một giải pháp quản lý bệnh viện tích hợp với các tính năng quản lý bệnh nhân, lịch hẹn và hồ sơ y tế điện tử.',
      image: '/images/products/document-management.png',
      results: [
        'Giảm 45% thời gian chờ đợi của bệnh nhân',
        'Cải thiện 30% hiệu quả làm việc của nhân viên y tế',
        'Giảm 25% sai sót trong quản lý hồ sơ y tế'
      ],
      testimonial: 'Hệ thống quản lý bệnh viện của XLab đã cách mạng hóa cách chúng tôi cung cấp dịch vụ chăm sóc sức khỏe. Bệnh nhân hài lòng hơn và nhân viên của chúng tôi có thể tập trung vào việc chăm sóc thay vì các công việc hành chính.'
    }
  ]
  
  // Xử lý lỗi ảnh không tải được
  const handleImageError = (id: string) => {
    setImageErrors(prev => ({
      ...prev,
      [id]: true
    }))
  }
  
  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Khách hàng nói gì về chúng tôi</h1>
          <p className="text-xl max-w-3xl">
            Khám phá những trải nghiệm và kết quả thực tế mà khách hàng đã đạt được khi sử dụng giải pháp của XLab
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-10 bg-gray-50">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="flex border-b border-gray-200">
              <button
                className={`px-6 py-3 font-medium text-sm sm:text-base ${
                  activeTab === 'clients'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('clients')}
                type="button"
              >
                Đánh giá từ khách hàng
              </button>
              <button
                className={`px-6 py-3 font-medium text-sm sm:text-base ${
                  activeTab === 'case-studies'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
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
      <section className="py-12">
        <div className="container">
          {activeTab === 'clients' && (
            <div className="animate-fadeIn">
              <div className="flex flex-col space-y-6">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-wrap md:flex-nowrap items-start">
                      <div className="flex items-center mb-4 md:mb-0 w-full md:w-auto md:mr-6">
                        <div className="relative w-14 h-14 rounded-full overflow-hidden mr-4 bg-gray-200 flex items-center justify-center">
                          {!imageErrors[testimonial.id] ? (
                            <Image
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="object-cover"
                              fill
                              sizes="56px"
                              priority={false}
                              onError={() => handleImageError(testimonial.id)}
                            />
                          ) : (
                            <div className="text-lg font-bold text-primary-600">
                              {testimonial.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                          <p className="text-gray-600 text-sm">
                            {testimonial.position}, {testimonial.company}
                          </p>
                          <div className="mt-1">{renderRatingStars(testimonial.rating)}</div>
                        </div>
                      </div>
                      <p className="text-gray-700 italic flex-1">&ldquo;{testimonial.quote}&rdquo;</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Testimonial Video */}
              <div className="mt-20">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">Video đánh giá từ khách hàng</h2>
                  <p className="text-gray-600 max-w-3xl mx-auto">
                    Xem video chia sẻ từ khách hàng về trải nghiệm sử dụng sản phẩm và dịch vụ của XLab
                  </p>
                </div>

                <div className="relative aspect-video max-w-4xl mx-auto shadow-xl rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-20 w-20 text-gray-400"
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
                      className="rounded-full bg-primary-600 bg-opacity-90 p-5 text-white hover:bg-opacity-100 transition-all"
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
            <div className="space-y-16 animate-fadeIn">
              {caseStudies.map((caseStudy) => (
                <div
                  key={caseStudy.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative h-64 lg:h-auto bg-gray-200">
                      {!imageErrors[`case-${caseStudy.id}`] ? (
                        <Image
                          src={caseStudy.image}
                          alt={caseStudy.title}
                          className="object-contain"
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          onError={() => handleImageError(`case-${caseStudy.id}`)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg font-bold text-primary-600">
                          {caseStudy.company}
                        </div>
                      )}
                    </div>
                    <div className="p-8">
                      <span className="text-sm font-medium text-primary-600">{caseStudy.company}</span>
                      <h3 className="text-2xl font-bold mt-2 mb-4">{caseStudy.title}</h3>
                      <p className="text-gray-700 mb-6">{caseStudy.description}</p>
                      
                      <h4 className="font-semibold text-lg mb-3">Kết quả đạt được:</h4>
                      <ul className="space-y-2 mb-6">
                        {caseStudy.results.map((result, index) => (
                          <li key={index} className="flex items-start">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>{result}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {caseStudy.testimonial && (
                        <div className="italic text-gray-600 border-l-4 border-primary-500 pl-4 py-1">
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
      <section className="py-16 bg-primary-600 text-white">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Sẵn sàng nâng tầm doanh nghiệp của bạn?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Hãy liên hệ với chúng tôi ngay hôm nay để được tư vấn về giải pháp phù hợp nhất cho nhu cầu của bạn.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/contact"
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-full font-medium transition-colors shadow-md"
              >
                Liên hệ tư vấn
              </a>
              <a
                href="/services"
                className="border border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-full font-medium transition-colors"
              >
                Khám phá dịch vụ
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 