'use client';

import React, { useEffect } from 'react';

export default function TestHydrationFixPage() {
  useEffect(() => {
    // Kiểm tra lỗi hydration
    console.log('Kiểm tra lỗi hydration trong Footer...');
    
    // Đợi DOM được tải hoàn toàn
    setTimeout(() => {
      // Kiểm tra phần copyright trong footer
      const footerCopyright = document.querySelector('.text-center.sm\\:text-left p.text-xs.sm\\:text-sm.text-slate-400');
      if (footerCopyright) {
        console.log('Đã tìm thấy phần copyright trong footer');
        console.log('Cấu trúc HTML:', footerCopyright.innerHTML);
        
        // Kiểm tra nếu có lỗi hydration
        if (footerCopyright.innerHTML.includes('{"."}') || 
            footerCopyright.innerHTML.includes('{". "}') || 
            footerCopyright.innerHTML.includes('<span>.')) {
          console.warn('⚠️ Vẫn còn lỗi hydration trong footer!');
        } else {
          console.log('✅ Lỗi hydration đã được khắc phục!');
        }
      } else {
        console.error('Không tìm thấy phần copyright trong footer');
      }
    }, 1000);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Kiểm tra lỗi Hydration</h1>
      <p className="mb-4">Trang này dùng để kiểm tra xem lỗi hydration trong component Footer đã được khắc phục chưa.</p>
      <p>Vui lòng kiểm tra console của trình duyệt để xem kết quả.</p>
    </div>
  );
} 