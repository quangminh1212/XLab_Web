'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AboutPage() {
  const { translate } = useLanguage()
  
  // Set page title
  React.useEffect(() => {
    document.title = 'Giới thiệu | XLab - Phần mềm và Dịch vụ'
  }, [])

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{translate('about.pageTitle')}</h1>
          <p className="text-xl max-w-3xl">
            {translate('about.companyDescription')}
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-6">{translate('about.ourHistory')}</h2>
              <p className="mb-4">
                {translate('about.historyParagraph1')}
              </p>
              <p className="mb-4">
                {translate('about.historyParagraph2')}
              </p>
              <p>
                {translate('about.historyParagraph3')}
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <div className="relative slideshow-container h-96">
                <img
                  src="/images/office-workspace.jpg"
                  alt={translate('about.workspaceImageAlt')}
                  className="w-full h-full object-cover slideshow-item"
                />
                <img
                  src="/images/company-team.jpg"
                  alt={translate('about.teamImageAlt')}
                  className="w-full h-full object-cover slideshow-item hidden"
                />
                <img
                  src="/images/tech-workspace.jpg"
                  alt={translate('about.techspaceImageAlt')}
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
              <h2 className="text-2xl font-bold mb-4">{translate('about.ourMission')}</h2>
              <p className="text-gray-600">
                {translate('about.missionContent')}
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
              <h2 className="text-2xl font-bold mb-4">{translate('about.ourVision')}</h2>
              <p className="text-gray-600">
                {translate('about.visionContent')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{translate('about.ourValues')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {translate('about.valuesDescription')}
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
              <h3 className="text-xl font-bold mb-2">{translate('about.valueQuality')}</h3>
              <p className="text-gray-600">
                {translate('about.qualityDesc')}
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
              <h3 className="text-xl font-bold mb-2">{translate('about.valueInnovation')}</h3>
              <p className="text-gray-600">
                {translate('about.innovationDesc')}
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
              <h3 className="text-xl font-bold mb-2">{translate('about.valueCollaboration')}</h3>
              <p className="text-gray-600">
                {translate('about.collaborationDesc')}
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
              <h3 className="text-xl font-bold mb-2">{translate('about.valueResponsibility')}</h3>
              <p className="text-gray-600">
                {translate('about.responsibilityDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">{translate('about.ctaTitle')}</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              {translate('about.ctaText')}
            </p>
            <a
              href="/contact"
              className="inline-block bg-white text-primary-600 font-medium rounded-full py-3 px-8 shadow-md hover:bg-gray-100 transition-colors"
            >
              {translate('about.ctaButton')}
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