'use client';

import React, { useEffect, useState } from 'react';

interface RichTextContentProps {
  content: string;
  className?: string;
}

const RichTextContent: React.FC<RichTextContentProps> = ({ content, className = '' }) => {
  // Nếu không có nội dung, không hiển thị gì cả
  if (!content) return null;

  // State to store processed HTML
  const [processedContent, setProcessedContent] = useState(content);
  
  // Kiểm tra xem nội dung có phải là HTML không (có chứa thẻ HTML hoặc không)
  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  // Process HTML in useEffect to ensure browser environment
  useEffect(() => {
    if (isHtml) {
      setProcessedContent(processHtml(content));
    }
  }, [content, isHtml]);

  // Xử lý HTML để loại bỏ các phần tử image-toolbar trước khi hiển thị
  const processHtml = (html: string): string => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return html; // Return unprocessed HTML on server
    }
    
    // Only run in browser environment
    try {
      // Tạo một DOM parser để xử lý HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Tìm và xóa tất cả các phần tử image-toolbar
      const toolbars = doc.querySelectorAll('.image-toolbar');
      toolbars.forEach(toolbar => {
        toolbar.remove();
      });

      // Tìm và xóa các nút điều khiển resize/alignment khác có thể tồn tại
      const imageWrappers = doc.querySelectorAll('.image-wrapper');
      imageWrappers.forEach(wrapper => {
        // Giữ lại ảnh và chú thích, nhưng loại bỏ các nút điều khiển
        const img = wrapper.querySelector('img');
        const caption = wrapper.querySelector('.image-caption');
        
        if (img) {
          // Đảm bảo hình ảnh luôn hiển thị với kích thước đầy đủ và căn giữa
          img.style.width = '100%';
          img.style.maxWidth = '100%';
          img.style.display = 'block';
          img.style.margin = '0 auto';

          const newWrapper = doc.createElement('div');
          newWrapper.className = 'image-wrapper';
          newWrapper.appendChild(img.cloneNode(true));
          
          if (caption) {
            newWrapper.appendChild(caption.cloneNode(true));
          }
          
          wrapper.replaceWith(newWrapper);
        }
      });

      return doc.body.innerHTML;
    } catch (error) {
      console.error('Error processing HTML:', error);
      return html; // Return original HTML if an error occurs
    }
  };

  // Nếu là HTML thì dùng dangerouslySetInnerHTML, nếu không thì hiển thị text thường
  return isHtml ? (
    <div
      className={`rich-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  ) : (
    <div className={`rich-text-content ${className}`}>
      {content.split('\n').map((line, index) => (
        <p key={index} className="mb-2">
          {line}
        </p>
      ))}
    </div>
  );
};

export default RichTextContent;
