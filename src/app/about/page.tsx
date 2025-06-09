'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();
  
  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('about.pageTitle')}</h1>
          <p className="text-xl max-w-none whitespace-nowrap overflow-hidden text-ellipsis">
            {t('about.pageSubtitle')}
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-6">{t('about.ourStory')}</h2>
              <p className="mb-4">
                {t('about.storyP1')}
              </p>
              <p className="mb-4">
                {t('about.storyP2')}
              </p>
              <p>
                {t('about.storyP3')}
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <div className="relative slideshow-container h-96">
                <img
                  src="/images/office-workspace.jpg"
                  alt="Không gian làm việc tại XLab"
                  className="w-full h-full object-cover slideshow-item"
                />
                <img
                  src="/images/company-team.jpg"
                  alt="Đội ngũ XLab làm việc cùng nhau"
                  className="w-full h-full object-cover slideshow-item hidden"
                />
                <img
                  src="/images/tech-workspace.jpg"
                  alt="Không gian công nghệ tại XLab"
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
              <h2 className="text-2xl font-bold mb-4">{t('about.mission')}</h2>
              <p className="text-gray-600">
                {t('about.missionDesc')}
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
              <h2 className="text-2xl font-bold mb-4">{t('about.vision')}</h2>
              <p className="text-gray-600">
                {t('about.visionDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('about.coreValues')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('about.coreValuesDesc')}
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
              <h3 className="text-xl font-bold mb-2">{t('about.value1')}</h3>
              <p className="text-gray-600">
                {t('about.value1Desc')}
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
              <h3 className="text-xl font-bold mb-2">{t('about.value2')}</h3>
              <p className="text-gray-600">
                {t('about.value2Desc')}
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
              <h3 className="text-xl font-bold mb-2">{t('about.value3')}</h3>
              <p className="text-gray-600">
                {t('about.value3Desc')}
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
              <h3 className="text-xl font-bold mb-2">{t('about.value4')}</h3>
              <p className="text-gray-600">
                {t('about.value4Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">{t('about.partnership')}</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              {t('about.partnershipDesc')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/contact"
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold transition-colors"
              >
                {t('about.contactNow')}
              </a>
              <a
                href="/services"
                className="bg-primary-700 text-white hover:bg-primary-800 px-8 py-3 rounded-lg font-bold transition-colors"
              >
                {t('about.exploreServices')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Slideshow Script */}
      <script
        dangerouslySetInnerHTML={{
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
        `,
        }}
      />
    </div>
  );
}
