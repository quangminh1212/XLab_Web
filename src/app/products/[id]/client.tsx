'use client';

import React from 'react';
import { incrementDownloadCount } from '@/lib/utils';

export interface DownloadButtonProps {
  slug: string;
  children: React.ReactNode;
  className?: string;
}

export function DownloadButton({ slug, children, className = '' }: DownloadButtonProps) {
  const handleDownload = () => {
    if (!slug) {
      console.error('Không có slug hợp lệ cho sản phẩm');
      return;
    }
    
    try {
      // Tăng số lượt tải
      incrementDownloadCount(slug);
      
      // Mô phỏng tải xuống (trong thực tế sẽ tải file thực)
      console.log(`Tải xuống sản phẩm: ${slug}`);
      
      // Tạo một tệp trống để tải xuống (chỉ để demo)
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,Đây là file demo cho sản phẩm ' + slug);
      element.setAttribute('download', `${slug}-demo.txt`);
      
      element.style.display = 'none';
      document.body.appendChild(element);
      
      element.click();
      
      document.body.removeChild(element);
    } catch (error) {
      console.error('Lỗi khi tải xuống:', error);
    }
  };

  return (
    <button onClick={handleDownload} className={className}>
      {children}
    </button>
  );
} 