'use client';

import React from 'react';

interface RichTextContentProps {
  content: string;
  className?: string;
}

const RichTextContent: React.FC<RichTextContentProps> = ({ content, className = '' }) => {
  // Nếu không có nội dung, không hiển thị gì cả
  if (!content) return null;

  return (
    <div 
      className={`rich-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default RichTextContent; 