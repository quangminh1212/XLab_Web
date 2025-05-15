'use client';

import React from 'react';

interface RichTextContentProps {
  content: string;
  className?: string;
}

const RichTextContent: React.FC<RichTextContentProps> = ({ content, className = '' }) => {
  // Nếu không có nội dung, không hiển thị gì cả
  if (!content) return null;
  
  // Kiểm tra xem nội dung có phải là HTML không (có chứa thẻ HTML hoặc không)
  const isHtml = /<[a-z][\s\S]*>/i.test(content);
  
  // Nếu là HTML thì dùng dangerouslySetInnerHTML, nếu không thì hiển thị text thường
  return isHtml ? (
    <div 
      className={`rich-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  ) : (
    <div className={`rich-text-content ${className}`}>
      {content.split('\n').map((line, index) => (
        <p key={index} className="mb-2">{line}</p>
      ))}
    </div>
  );
};

export default RichTextContent; 