'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

type TestimonialItem = {
  text: string;
  name: string;
  position: string;
};

export default function HomeTestimonials() {
  const { t } = useLanguage();

<<<<<<< HEAD
<<<<<<< HEAD
  // Sử dụng t() để lấy văn bản từ các file ngôn ngữ
  const testimonials = [
    {
      id: 1,
      text: t('testimonials.review1'),
      name: 'Michael Roberts',
      position: t('testimonials.position1'),
=======
  const testimonials = [
    {
      id: 1,
      text: t('testimonials.michael'),
      name: 'Michael Roberts',
      position: t('testimonials.position.business'),
>>>>>>> 77d40f007c10996d4a8a25a577d10a9b0f3ca33d
      image: '/images/testimonials/michael-roberts.jpg',
      fallbackImage: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 2,
<<<<<<< HEAD
      text: t('testimonials.review2'),
      name: 'David Wilson',
      position: t('testimonials.position2'),
=======
      text: t('testimonials.david'),
      name: 'David Wilson',
      position: t('testimonials.position.cto'),
>>>>>>> 77d40f007c10996d4a8a25a577d10a9b0f3ca33d
      image: '/images/testimonials/david-wilson.jpg',
      fallbackImage: 'https://randomuser.me/api/portraits/men/41.jpg'
    },
    {
      id: 3,
<<<<<<< HEAD
      text: t('testimonials.review3'),
      name: 'Emily Parker',
      position: t('testimonials.position3'),
      image: '/images/testimonials/emily-parker.jpg',
      fallbackImage: 'https://randomuser.me/api/portraits/women/68.jpg'
    }
  ];
=======
  // Using translation system for testimonials
  const testimonialItems = t<any>('home.testimonials.items', undefined, true) as TestimonialItem[];
>>>>>>> 0e6a978e2821224c596be981352e1ca98e6637ce

  return (
    <section className="mt-12 mb-12">
      <div className="flex items-center justify-between mb-6">
<<<<<<< HEAD
        <h2 className="heading-3 text-gray-800">{t('testimonials.title')}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full">
=======
        <h2 className="heading-3 text-gray-800">{t('home.testimonials.title')}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.isArray(testimonialItems) && testimonialItems.map((testimonial, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full">
>>>>>>> 0e6a978e2821224c596be981352e1ca98e6637ce
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
                  src={`/images/testimonials/${testimonial.name.toLowerCase().replace(' ', '-')}.jpg`}
                  alt={testimonial.name} 
                  width={40} 
                  height={40}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://randomuser.me/api/portraits/${index % 2 === 0 ? 'men' : 'women'}/${30 + index}.jpg`;
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
<<<<<<< HEAD
          {t('testimonials.viewAll')}
=======
          {t('home.testimonials.viewAll')}
>>>>>>> 0e6a978e2821224c596be981352e1ca98e6637ce
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
          </svg>
        </Link>
=======
      text: t('testimonials.emily'),
      name: 'Emily Johnson',
      position: t('testimonials.position.project'),
      image: '/images/testimonials/emily-johnson.jpg',
      fallbackImage: 'https://randomuser.me/api/portraits/women/24.jpg'
    },
  ];

  return (
    <section className="py-14 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">{t('home.testimonials')}</h2>
            <Link href="/testimonials" className="text-blue-600 hover:underline hidden md:block">
              {t('home.viewAllTestimonials')} &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                  <div className="flex items-center mb-3">
                    <div className="relative w-12 h-12 mr-4">
                      <Image
                        src={item.fallbackImage}
                        alt={item.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-gray-600 text-sm">{item.position}</p>
                    </div>
                  </div>
                  <p className="text-gray-700">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/testimonials" className="text-blue-600 hover:underline">
              {t('home.viewAllTestimonials')} &rarr;
            </Link>
          </div>
        </div>
>>>>>>> 77d40f007c10996d4a8a25a577d10a9b0f3ca33d
      </div>
    </section>
  );
} 