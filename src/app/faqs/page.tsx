'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { faqs, faqCategories } from '@/data/faqData';

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Lọc FAQ dựa trên danh mục đã chọn và từ khóa tìm kiếm
  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      const matchesSearch = !searchQuery || 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Câu hỏi thường gặp</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Tìm câu trả lời cho những thắc mắc phổ biến về sản phẩm và dịch vụ của XLab
          </p>
        </div>

        {/* Search bar */}
        <div className="relative max-w-xl mx-auto mb-8">
          <input
            type="text"
            placeholder="Tìm kiếm câu hỏi..."
            className="w-full px-4 py-3 pr-12 rounded-lg shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            className={`px-4 py-2 text-sm rounded-full ${
              activeCategory === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } transition-colors`}
            onClick={() => setActiveCategory('all')}
          >
            Tất cả
          </button>
          {faqCategories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 text-sm rounded-full ${
                activeCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition-colors`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto">
          {filteredFaqs.length > 0 ? (
            <div className="space-y-4">
              {filteredFaqs.map((faq) => (
                <div key={faq.id} className="bg-white rounded-lg shadow-sm p-5 transition-all hover:shadow-md">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Không tìm thấy câu hỏi phù hợp</h3>
              <p className="text-gray-500 max-w-lg mx-auto">
                Vui lòng thử tìm kiếm với từ khóa khác hoặc liên hệ trực tiếp với chúng tôi để được hỗ trợ.
              </p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <h3 className="text-lg md:text-xl font-medium text-gray-900 mb-4">Không tìm thấy câu trả lời cho thắc mắc của bạn?</h3>
          <p className="text-gray-700 mb-6">
            Hãy liên hệ trực tiếp với đội ngũ hỗ trợ của chúng tôi
          </p>
          <Link
            href="/contact"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Liên hệ hỗ trợ
          </Link>
        </div>
      </div>
    </div>
  );
} 