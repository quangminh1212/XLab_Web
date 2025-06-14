'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HomeTestimonials() {
  const { t, language } = useLanguage();

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
          ? '"He estado utilizando los servicios de XLab durante 2 años y estoy extremadamente satisfecho. El software funciona sin problemas, tiene características completas y el equipo de soporte es muy dedicado."'
          : '"I have been using XLab services for 2 years and am extremely satisfied. The software runs smoothly, has complete features, and the support team is very dedicated."',
        name: 'Michael Roberts',
        position: language === 'vi' ? 'Giám đốc kinh doanh' : 
                  language === 'es' ? 'Director de Negocios' : 'Business Director',
        image: '/images/testimonials/michael-roberts.jpg',
        fallbackImage: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      {
        id: 2,
        text: language === 'vi'
          ? '"Các giải pháp AI của XLab đã giúp doanh nghiệp của chúng tôi tiết kiệm được 30% chi phí vận hành. Đội ngũ hỗ trợ kỹ thuật phản hồi nhanh chóng và hiệu quả."'
          : language === 'es'
          ? '"Las soluciones de IA de XLab han ayudado a nuestra empresa a ahorrar un 30% en costos operativos. El equipo de soporte técnico responde de manera rápida y efectiva."'
          : '"XLab\'s AI solutions have helped our business save 30% in operating costs. The technical support team responds quickly and effectively."',
        name: 'David Wilson',
        position: language === 'vi' ? 'CTO - Tech Solutions' : 
                  language === 'es' ? 'CTO - Tech Solutions' : 'CTO - Tech Solutions',
        image: '/images/testimonials/david-wilson.jpg',
        fallbackImage: 'https://randomuser.me/api/portraits/men/41.jpg'
      },
      {
        id: 3,
        text: language === 'vi'
          ? '"Các bản cập nhật liên tục của XLab đảm bảo sản phẩm luôn đáp ứng được những yêu cầu ngày càng cao của chúng tôi. Giao diện thân thiện và dễ sử dụng ngay cả với người mới."'
          : language === 'es'
          ? '"Las actualizaciones continuas de XLab aseguran que el producto siempre satisfaga nuestras demandas cada vez más altas. La interfaz es amigable y fácil de usar incluso para los principiantes."'
          : '"XLab\'s continuous updates ensure the product always meets our increasingly high demands. The interface is friendly and easy to use even for newcomers."',
        name: 'Emily Parker',
        position: language === 'vi' ? 'Quản lý dự án' : 
                  language === 'es' ? 'Gerente de Proyectos' : 'Project Manager',
        image: '/images/testimonials/emily-parker.jpg',
        fallbackImage: 'https://randomuser.me/api/portraits/women/68.jpg'
      }
    ]
  };

  return (
    <section className="mt-12 mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="heading-3 text-gray-800">{texts.title}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {texts.testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="flex text-yellow-400 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
              ))}
            </div>
            <p className="text-gray-700 flex-grow min-h-[120px]">
              {testimonial.text}
            </p>
            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                <Image 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  width={40} 
                  height={40}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = testimonial.fallbackImage;
                  }}
                />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                <p className="text-sm text-gray-500">{testimonial.position}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-6">
        <Link href="/testimonials" className="text-primary-600 hover:text-primary-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
          {texts.viewAll}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </section>
  );
} 