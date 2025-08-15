'use client';

import { useState, useEffect } from 'react';

import { useLanguage } from '@/contexts/LanguageContext';

interface FAQ {
  question: string;
  answer: string;
}

interface ProductFAQProps {
  productId: string;
}

// Dữ liệu mẫu cho FAQs
const defaultFAQs: FAQ[] = [
  {
    question: 'Sản phẩm này có phải trả phí hàng tháng không?',
    answer: 'Không, đây là sản phẩm mua một lần và sử dụng vĩnh viễn. Bạn sẽ nhận được các bản cập nhật miễn phí trong thời gian bảo hành.'
  },
  {
    question: 'Làm thế nào để kích hoạt sản phẩm sau khi mua?',
    answer: 'Sau khi thanh toán thành công, bạn sẽ nhận được email chứa thông tin tài khoản và hướng dẫn kích hoạt chi tiết. Nếu cần hỗ trợ thêm, vui lòng liên hệ đội ngũ hỗ trợ 24/7 của chúng tôi.'
  },
  {
    question: 'Tôi có thể sử dụng sản phẩm này trên nhiều thiết bị không?',
    answer: 'Mỗi giấy phép sử dụng cho một thiết bị. Nếu bạn muốn sử dụng trên nhiều thiết bị, vui lòng mua thêm giấy phép hoặc liên hệ với chúng tôi để được tư vấn gói doanh nghiệp.'
  },
  {
    question: 'Làm thế nào để nhận hỗ trợ kỹ thuật?',
    answer: 'Bạn có thể liên hệ hỗ trợ kỹ thuật qua email support@xlab.vn hoặc qua trang Liên hệ trên website. Đội ngũ hỗ trợ của chúng tôi làm việc 24/7 và sẽ phản hồi trong vòng 24 giờ.'
  },
];

export default function ProductFAQ({ productId }: ProductFAQProps) {
  const { t, language } = useLanguage();
  const [faqs, setFaqs] = useState<FAQ[]>(defaultFAQs);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    // Fetch FAQs từ API nếu cần
    const fetchFAQs = async () => {
      try {
        // Thử lấy FAQs từ API
        const response = await fetch(`/api/products/${productId}/faqs?lang=${language}`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setFaqs(data);
            return;
          }
        }
        // Nếu không có dữ liệu từ API, giữ nguyên defaultFAQs
      } catch (error) {
        console.error('Không thể tải FAQs:', error);
      }
    };

    fetchFAQs();
  }, [productId, language]);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">{t('product.frequentlyAskedQuestions')}</h2>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="flex items-center justify-between w-full p-4 text-left font-medium text-gray-900 hover:bg-gray-50 focus:outline-none transition-colors"
            >
              <span>{faq.question}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                  openIndex === index ? 'transform rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            
            <div
              className={`transition-all duration-300 overflow-hidden ${
                openIndex === index ? 'max-h-96 p-4 bg-gray-50' : 'max-h-0'
              }`}
            >
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 