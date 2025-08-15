'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { useLanguage } from '@/contexts/LanguageContext';

export default function HomeTestimonials() {
  const { t } = useLanguage();

  const testimonials = [
    {
      id: 1,
      text: t('testimonials.michael'),
      name: 'Michael Roberts',
      position: t('testimonials.position.business'),
      image: '/images/testimonials/michael-roberts.jpg',
      fallbackImage: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 2,
      text: t('testimonials.david'),
      name: 'David Wilson',
      position: t('testimonials.position.cto'),
      image: '/images/testimonials/david-wilson.jpg',
      fallbackImage: 'https://randomuser.me/api/portraits/men/41.jpg'
    },
    {
      id: 3,
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
      </div>
    </section>
  );
} 