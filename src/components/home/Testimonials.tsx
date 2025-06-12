'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HomeTestimonials() {
  const { t } = useLanguage();

<<<<<<< HEAD
  // Sử dụng các keys từ LanguageContext
  const testimonials = [
    {
      id: 1,
      text: t('testimonial.michael'),
      name: 'Michael Roberts',
      position: t('testimonial.position.business'),
      image: '/images/testimonials/michael-roberts.jpg',
      fallbackImage: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 2,
      text: t('testimonial.david'),
      name: 'David Wilson',
      position: t('testimonial.position.cto'),
      image: '/images/testimonials/david-wilson.jpg',
      fallbackImage: 'https://randomuser.me/api/portraits/men/41.jpg'
    },
    {
      id: 3,
      text: t('testimonial.emily'),
      name: 'Emily Parker',
      position: t('testimonial.position.project'),
      image: '/images/testimonials/emily-parker.jpg',
      fallbackImage: 'https://randomuser.me/api/portraits/women/24.jpg'
    }
  ];

  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: number) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
=======
  // Định nghĩa các chuỗi văn bản trực tiếp dựa trên ngôn ngữ hiện tại
  const texts = {
    title: language === 'vi' ? 'Đánh giá của khách hàng' : 
           language === 'es' ? 'Opiniones de Clientes' : 'Customer Reviews',
    viewAll: language === 'vi' ? 'Xem tất cả đánh giá' : 
             language === 'es' ? 'Ver todas las opiniones' : 'View all reviews',
    testimonials: [
      {
        id: 1,
        text: language === 'vi' 
          ? '"Tôi đã sử dụng dịch vụ của XLab được 2 năm và cực kỳ hài lòng. Phần mềm hoạt động mượt mà, có đầy đủ tính năng, và đội ngũ hỗ trợ rất tận tâm."'
          : language === 'es'
            ? '"He estado usando los servicios de XLab durante 2 años y estoy extremadamente satisfecho. El software funciona sin problemas, tiene características completas, y el equipo de soporte está muy dedicado."'
            : '"I have been using XLab services for 2 years and am extremely satisfied. The software runs smoothly, has complete features, and the support team is very dedicated."',
        name: 'Michael Roberts',
        position: language === 'vi' ? 'Giám đốc kinh doanh' : 
                 language === 'es' ? 'Director de Negocio' : 'Business Director',
        image: '/images/testimonials/michael-roberts.jpg',
        fallbackImage: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      {
        id: 2,
        text: language === 'vi'
          ? '"Các giải pháp AI của XLab đã giúp doanh nghiệp của chúng tôi tiết kiệm được 30% chi phí vận hành. Đội ngũ hỗ trợ kỹ thuật phản hồi nhanh chóng và hiệu quả."'
          : language === 'es'
            ? '"Las soluciones de IA de XLab han ayudado a nuestro negocio a ahorrar un 30% en costos operativos. El equipo de soporte técnico responde rápidamente y de manera efectiva."'
            : '"XLab\'s AI solutions have helped our business save 30% in operating costs. The technical support team responds quickly and effectively."',
        name: 'David Wilson',
        position: language === 'vi' ? 'CTO - Tech Solutions' : 
                 language === 'es' ? 'CTO - Soluciones Tecnológicas' : 'CTO - Tech Solutions',
        image: '/images/testimonials/david-wilson.jpg',
        fallbackImage: 'https://randomuser.me/api/portraits/men/41.jpg'
      },
      {
        id: 3,
        text: language === 'vi'
          ? '"Các bản cập nhật liên tục của XLab đảm bảo sản phẩm luôn đáp ứng được những yêu cầu ngày càng cao của chúng tôi. Giao diện thân thiện và dễ sử dụng ngay cả với người mới."'
          : language === 'es'
            ? '"Las actualizaciones continuas de XLab aseguran que el producto siempre cumple con nuestras demandas cada vez más exigentes. La interfaz es amigable y fácil de usar incluso para principiantes."'
            : '"XLab\'s continuous updates ensure the product always meets our increasingly high demands. The interface is friendly and easy to use even for newcomers."',
        name: 'Emily Parker',
        position: language === 'vi' ? 'Quản lý dự án' : 
                 language === 'es' ? 'Gerente de Proyecto' : 'Project Manager',
        image: '/images/testimonials/emily-parker.jpg',
        fallbackImage: 'https://randomuser.me/api/portraits/women/68.jpg'
      }
    ]
>>>>>>> a4060eb998188ab3e088647752a5818a316f642c
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2 text-gray-900">{t('testimonials.title')}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-xl shadow-md p-6 relative">
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4">
                <div className="bg-primary-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                  </svg>
                </div>
              </div>
              
              <div className="flex flex-col h-full">
                <div className="mb-4 flex-grow">
                  <p className="text-gray-700 italic">{testimonial.text}</p>
                </div>
                
                <div className="flex items-center mt-4">
                  <div className="w-12 h-12 relative rounded-full overflow-hidden mr-4">
                    {!imageErrors[testimonial.id] ? (
                      <Image 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="object-cover rounded-full"
                        onError={() => handleImageError(testimonial.id)}
                      />
                    ) : (
                      <Image 
                        src={testimonial.fallbackImage} 
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="object-cover rounded-full"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.position}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link 
            href="/testimonials" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            {t('testimonials.viewAll')}
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
} 