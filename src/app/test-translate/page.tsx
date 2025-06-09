'use client';

import React from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { AutoTranslate, NoTranslate } from '@/hooks/useAutoTranslate';

const TestTranslatePage = () => {
  const { language, changeLanguage } = useTranslation();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Kiểm tra tính năng dịch tự động</h1>
      
      <div className="flex items-center mb-6">
        <div className="mr-4">Ngôn ngữ hiện tại: <strong>{language === 'vi' ? 'Tiếng Việt' : 'English'}</strong></div>
        <button
          onClick={() => changeLanguage(language === 'vi' ? 'en' : 'vi')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {language === 'vi' ? 'Chuyển sang tiếng Anh' : 'Switch to Vietnamese'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Văn bản sẽ được dịch tự động</h2>
          <p className="mb-3">
            Đây là đoạn văn bản thông thường sẽ được dịch sang tiếng Anh khi bạn chuyển đổi ngôn ngữ.
          </p>
          <p className="mb-3">
            Tất cả các phần tử text trong trang web đều được dịch tự động, không cần phải đánh dấu
            từng đoạn văn bản bằng component AutoTranslate.
          </p>
          <div className="mt-4 bg-gray-100 p-3 rounded">
            <h3 className="font-medium">Các tính năng khác:</h3>
            <ul className="list-disc pl-5 mt-2">
              <li>Dịch tự động toàn bộ trang web</li>
              <li>Cache kết quả dịch để tăng tốc độ</li>
              <li>Hỗ trợ dịch từ Tiếng Việt sang Tiếng Anh</li>
              <li>Tương thích với tất cả component React</li>
            </ul>
          </div>
        </div>
        
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Văn bản sử dụng AutoTranslate</h2>
          <p className="mb-3">
            <AutoTranslate>Đoạn văn bản này sử dụng component AutoTranslate trực tiếp.</AutoTranslate>
          </p>
          <p className="mb-3">
            <NoTranslate>Đoạn văn bản này sử dụng NoTranslate nên sẽ không được dịch sang tiếng Anh.</NoTranslate>
          </p>
          <div className="mt-4 bg-gray-100 p-3 rounded">
            <h3 className="font-medium">So sánh các phương pháp:</h3>
            <ul className="list-disc pl-5 mt-2">
              <li>TranslateWrapper: <span className="text-green-600">Dịch tự động toàn bộ children</span></li>
              <li>AutoTranslate: <span className="text-blue-600">Dịch riêng từng đoạn văn bản</span></li>
              <li>NoTranslate: <span className="text-red-600">Ngăn không cho dịch nội dung</span></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h2 className="text-xl font-semibold mb-2">Lưu ý quan trọng:</h2>
        <p>
          Phương pháp này tận dụng dictionary có sẵn để dịch tự động, giúp tối ưu hiệu suất và không cần
          phải tạo file dịch sẵn. Trong trường hợp không tìm thấy bản dịch trong dictionary, hệ thống sẽ
          trả về văn bản gốc.
        </p>
      </div>
    </div>
  );
};

export default TestTranslatePage; 