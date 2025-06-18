'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HomeTestimonials() {
  const { t, language } = useLanguage();

  // Sử dụng t() để lấy văn bản từ các file ngôn ngữ
  const testimonials = [
    {
      id: 1,
      text: t('testimonials.review1'),
      name: 'Michael Roberts',
      position: t('testimonials.position1'),
      image: '/images/testimonials/michael-roberts.jpg',
      fallbackImage: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 2,
      text: t('testimonials.review2'),
      name: 'David Wilson',
      position: t('testimonials.position2'),
      image: '/images/testimonials/david-wilson.jpg',
      fallbackImage: 'https://randomuser.me/api/portraits/men/41.jpg'
    },
    {
      id: 3,
      text: t('testimonials.review3'),
      name: 'Emily Parker',
      position: t('testimonials.position3'),
      image: '/images/testimonials/emily-parker.jpg',
      fallbackImage: 'https://randomuser.me/api/portraits/women/68.jpg'
    }
  ];

  return (
    <section className="mt-12 mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="heading-3 text-gray-800">{t('testimonials.title')}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
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
      
      <div className="mt-6">
        {/* Link removed */}
      </div>
    </section>
  );
} 