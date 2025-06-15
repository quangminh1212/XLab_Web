'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface Testimonial {
  id: number;
  name: string;
  content: string;
  position: string;
  image: string;
  rating: number;
}

export default function Testimonials() {
  const { t, language } = useLanguage();

  const testimonials = [
    {
      id: 1,
      name: 'Michael Wilson',
      content: t('testimonial.michael'),
      position: t('testimonial.position.business'),
      image: '/images/testimonials/user1.jpg',
      rating: 5,
    },
    {
      id: 2,
      name: 'David Chen',
      content: t('testimonial.david'),
      position: t('testimonial.position.cto'),
      image: '/images/testimonials/user2.jpg',
      rating: 5,
    },
    {
      id: 3,
      name: 'Emily Nguyen',
      content: t('testimonial.emily'),
      position: t('testimonial.position.project'),
      image: '/images/testimonials/user3.jpg',
      rating: 5,
    },
  ];
  
  return (
    <section className="py-12 bg-gray-50">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {t('home.testimonials')}
          </h2>
          <Link href="/testimonials" className="text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium">
            {t('home.viewAllTestimonials')}
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex text-yellow-400 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
          </svg>
        ))}
      </div>
      <p className="text-gray-700 flex-grow min-h-[120px]">
        {testimonial.content}
      </p>
      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
          <Image 
            src={testimonial.image} 
            alt={testimonial.name} 
            width={40} 
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
          <p className="text-sm text-gray-500">{testimonial.position}</p>
        </div>
      </div>
    </div>
  );
} 