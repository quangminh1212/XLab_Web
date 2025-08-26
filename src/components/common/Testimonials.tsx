'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';

import { useLanguage } from '@/contexts/LanguageContext';

interface Testimonial {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  content: string;
  date: string;
  productId?: string;
  verified?: boolean;
  position?: string;
  company?: string;
}

interface TestimonialsProps {
  productId?: string;
  limit?: number;
}

// Dữ liệu mẫu cho đánh giá
const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    avatar: '/images/placeholder/avatar-1.jpg',
    rating: 5,
    content: 'Sản phẩm rất tuyệt vời, đúng với mô tả và hoạt động rất ổn định. Đội ngũ hỗ trợ phản hồi nhanh và giải quyết vấn đề hiệu quả.',
    date: '2023-12-15',
    verified: true,
    position: 'Quản lý dự án',
    company: 'Tech Solution'
  },
  {
    id: '2',
    name: 'Trần Thị B',
    avatar: '/images/placeholder/avatar-2.jpg',
    rating: 4.5,
    content: 'Tôi đã sử dụng nhiều sản phẩm tương tự nhưng cái này có giao diện dễ sử dụng nhất. Tiết kiệm được rất nhiều thời gian cho công việc hàng ngày.',
    date: '2023-11-28',
    verified: true,
    position: 'Quản lý Marketing',
    company: 'Digital Agency'
  },
  {
    id: '3',
    name: 'Lê Văn C',
    avatar: '/images/placeholder/avatar-3.jpg',
    rating: 5,
    content: 'Phần mềm hoạt động ổn định, ít lỗi và được cập nhật thường xuyên. Đặc biệt là tính năng AI rất ấn tượng, giúp tăng hiệu suất công việc.',
    date: '2023-10-20',
    verified: true,
    position: 'Nhà phát triển',
    company: 'Software Inc.'
  },
];

export default function Testimonials({ productId, limit = 3 }: TestimonialsProps) {
  const { t, localCode } = useLanguage();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      try {
        // Thử lấy testimonials từ API
        let endpoint = '/api/testimonials';
        if (productId) {
          endpoint = `/api/testimonials?productId=${productId}&limit=${limit}`;
        }
        
        const response = await fetch(endpoint);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setTestimonials(data);
          } else {
            // Sử dụng dữ liệu mẫu nếu API không trả về dữ liệu
            setTestimonials(defaultTestimonials);
          }
        } else {
          // Sử dụng dữ liệu mẫu nếu API gặp lỗi
          setTestimonials(defaultTestimonials);
        }
      } catch (_error) {
        console.error('Không thể tải đánh giá:', _error);
        setTestimonials(defaultTestimonials);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();

    // Auto rotate testimonials every 5 seconds
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [productId, limit, testimonials.length]);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg 
          key={`full-${i}`}
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 fill-yellow-500" 
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <svg 
          key="half" 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 text-yellow-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      );
    }

    // Add empty stars to make it out of 5
    for (let i = stars.length; i < 5; i++) {
      stars.push(
        <svg 
          key={`empty-${i}`} 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 fill-gray-300" 
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
        <div className="h-8 w-1/3 bg-gray-200 rounded mb-6"></div>
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(localCode === 'vi' ? 'vi-VN' : 'en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (_error) {
      return dateString;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">{t('testimonials.title')}</h2>
      
      <div className="relative mx-auto max-w-4xl">
        {/* Navigation arrows */}
        {testimonials.length > 1 && (
          <>
            <button 
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-6 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-6 md:w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-6 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-6 md:w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {testimonials.map((testimonial, _index) => (
              <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                <div className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-xl border border-primary-100">
                  <div className="flex items-center mb-4">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                      <Image 
                        src={testimonial.avatar || '/images/placeholder/avatar-placeholder.jpg'} 
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{testimonial.name}</div>
                      {(testimonial.position || testimonial.company) && (
                        <div className="text-sm text-gray-600">
                          {localCode === 'en' && testimonial.position === 'CTO - Tech Solutions' ? 'Chief Technology Officer - Tech Solutions' :
                           localCode === 'en' && testimonial.position === 'Quản lý Marketing' ? 'Marketing Manager' :
                           localCode === 'en' && testimonial.position === 'Nhà phát triển' ? 'Developer' :
                           localCode === 'vi' && testimonial.position === 'CTO - Tech Solutions' ? 'Giám đốc Công nghệ - Tech Solutions' :
                           testimonial.position}
                          {testimonial.position && testimonial.company && ' - '}
                          {testimonial.company}
                        </div>
                      )}
                      <div className="flex items-center mt-1">
                        {renderStars(testimonial.rating)}
                        {testimonial.verified && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {t('testimonials.verified')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <blockquote className="text-gray-700 italic mb-3">
                    &quot;{testimonial.content}&quot;
                  </blockquote>
                  
                  <div className="text-xs text-gray-500 text-right">
                    {formatDate(testimonial.date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Dots navigation */}
        {testimonials.length > 1 && (
          <div className="flex justify-center mt-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 w-2 rounded-full mx-1 ${index === activeIndex ? 'bg-primary-500' : 'bg-gray-300'}`}
                aria-label={`Go to testimonial ${index + 1}`}
              ></button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 