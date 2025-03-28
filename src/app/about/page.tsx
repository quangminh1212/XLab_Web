'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AboutPage() {
  const { translate, isLoaded } = useLanguage()
  
  // Set page title
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = 'Giới thiệu | XLab - Phần mềm và Dịch vụ'
    }
  }, [])

  // Fallback text cho trường hợp dịch không thành công
  const getTranslation = (key, fallback) => {
    return isLoaded ? translate(key) : fallback;
  };

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {getTranslation('about.pageTitle', 'Giới thiệu về XLab')}
          </h1>
          <p className="text-xl max-w-3xl">
            {getTranslation('about.companyDescription', 'XLab là công ty hàng đầu trong lĩnh vực phát triển phần mềm và dịch vụ công nghệ thông tin tại Việt Nam.')}
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-6">
                {getTranslation('about.ourHistory', 'Lịch sử của chúng tôi')}
              </h2>
              <p className="mb-4">
                {getTranslation('about.historyParagraph1', 'XLab được thành lập vào năm 2020 bởi một nhóm các kỹ sư phần mềm nhiệt huyết với mục tiêu tạo ra các giải pháp công nghệ sáng tạo cho thị trường Việt Nam.')}
              </p>
              <p className="mb-4">
                {getTranslation('about.historyParagraph2', 'Với sự đầu tư mạnh mẽ vào nghiên cứu và phát triển, chúng tôi đã nhanh chóng phát triển từ một startup nhỏ thành một công ty công nghệ đáng tin cậy với nhiều khách hàng lớn trong và ngoài nước.')}
              </p>
              <p>
                {getTranslation('about.historyParagraph3', 'Hiện nay, XLab đã phát triển mạnh mẽ với đội ngũ hơn 50 nhân viên tài năng, làm việc trong môi trường chuyên nghiệp và sáng tạo.')}
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <div className="relative slideshow-container h-96">
                <img
                  src="/images/office-workspace.jpg"
                  alt={getTranslation('about.workspaceImageAlt', 'Không gian làm việc tại XLab')}
                  className="w-full h-full object-cover slideshow-item"
                />
                <img
                  src="/images/company-team.jpg"
                  alt={getTranslation('about.teamImageAlt', 'Đội ngũ XLab')}
                  className="w-full h-full object-cover slideshow-item hidden"
                />
                <img
                  src="/images/tech-workspace.jpg"
                  alt={getTranslation('about.techspaceImageAlt', 'Không gian công nghệ tại XLab')}
                  className="w-full h-full object-cover slideshow-item hidden"
                />

                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                  <button className="w-3 h-3 rounded-full bg-white opacity-50 slideshow-dot slideshow-dot-active"></button>
                  <button className="w-3 h-3 rounded-full bg-white opacity-50 slideshow-dot"></button>
                  <button className="w-3 h-3 rounded-full bg-white opacity-50 slideshow-dot"></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4">
                {getTranslation('about.ourMission', 'Sứ mệnh của chúng tôi')}
              </h2>
              <p className="text-gray-600">
                {getTranslation('about.missionContent', 'Sứ mệnh của XLab là phát triển các giải pháp công nghệ sáng tạo, hiệu quả và dễ tiếp cận cho mọi đối tượng khách hàng, từ doanh nghiệp nhỏ đến tập đoàn lớn tại Việt Nam và khu vực.')}
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-secondary-600 text-white rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4">
                {getTranslation('about.ourVision', 'Tầm nhìn của chúng tôi')}
              </h2>
              <p className="text-gray-600">
                {getTranslation('about.visionContent', 'Khát vọng của XLab là trở thành công ty công nghệ hàng đầu trong khu vực, mang lại giá trị thực sự cho khách hàng thông qua các giải pháp công nghệ tiên tiến và dịch vụ chất lượng cao.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {getTranslation('about.ourValues', 'Giá trị cốt lõi')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {getTranslation('about.valuesDescription', 'Những giá trị cốt lõi định hướng mọi hoạt động và quyết định của chúng tôi, từ phát triển sản phẩm đến chăm sóc khách hàng.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">
                {getTranslation('about.valueQuality', 'Chất lượng')}
              </h3>
              <p className="text-gray-600">
                {getTranslation('about.qualityDesc', 'Cam kết đảm bảo chất lượng trong mỗi sản phẩm và dịch vụ, mang đến trải nghiệm tốt nhất cho khách hàng.')}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">
                {getTranslation('about.valueInnovation', 'Đổi mới')}
              </h3>
              <p className="text-gray-600">
                {getTranslation('about.innovationDesc', 'Luôn tìm kiếm giải pháp sáng tạo và tiên phong trong việc áp dụng các công nghệ mới.')}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">
                {getTranslation('about.valueCollaboration', 'Hợp tác')}
              </h3>
              <p className="text-gray-600">
                {getTranslation('about.collaborationDesc', 'Làm việc cùng nhau trong tinh thần đồng đội, chia sẻ kiến thức và kinh nghiệm để đạt kết quả tốt nhất.')}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">
                {getTranslation('about.valueResponsibility', 'Trách nhiệm')}
              </h3>
              <p className="text-gray-600">
                {getTranslation('about.responsibilityDesc', 'Cam kết với khách hàng, đối tác và xã hội; làm việc có trách nhiệm và đạo đức.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">
              {getTranslation('about.ctaTitle', 'Sẵn sàng hợp tác với chúng tôi?')}
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              {getTranslation('about.ctaText', 'Liên hệ ngay hôm nay để thảo luận về dự án của bạn và khám phá cách XLab có thể giúp doanh nghiệp bạn phát triển.')}
            </p>
            <a
              href="/contact"
              className="inline-block bg-white text-primary-600 font-medium rounded-full py-3 px-8 shadow-md hover:bg-gray-100 transition-colors"
            >
              {getTranslation('about.ctaButton', 'Liên hệ với chúng tôi')}
            </a>
          </div>
        </div>
      </section>

      {/* Slideshow Script */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', function() {
            let slideIndex = 0;
            const slides = document.querySelectorAll('.slideshow-item');
            const dots = document.querySelectorAll('.slideshow-dot');
            
            function showSlides() {
              // Ẩn tất cả slides
              slides.forEach(slide => {
                slide.classList.add('hidden');
              });
              
              // Xóa lớp active khỏi tất cả dots
              dots.forEach(dot => {
                dot.classList.remove('slideshow-dot-active');
                dot.classList.remove('opacity-100');
                dot.classList.add('opacity-50');
              });
              
              // Tăng slideIndex
              slideIndex++;
              
              // Reset slideIndex nếu vượt quá số slides
              if (slideIndex > slides.length) {
                slideIndex = 1;
              }
              
              // Hiển thị slide hiện tại
              if (slides[slideIndex - 1]) {
                slides[slideIndex - 1].classList.remove('hidden');
              }
              
              // Đánh dấu dot tương ứng là active
              if (dots[slideIndex - 1]) {
                dots[slideIndex - 1].classList.add('slideshow-dot-active');
                dots[slideIndex - 1].classList.remove('opacity-50');
                dots[slideIndex - 1].classList.add('opacity-100');
              }
              
              // Gọi lại hàm sau 5 giây
              setTimeout(showSlides, 5000);
            }
            
            // Khởi tạo slideshow
            showSlides();
            
            // Xử lý sự kiện click vào dot
            dots.forEach((dot, index) => {
              dot.addEventListener('click', () => {
                slideIndex = index;
                showSlides();
              });
            });
          });
        `
      }} />
    </div>
  )
} 