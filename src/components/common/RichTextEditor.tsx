'use client';

import React, { useState, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Nhập nội dung chi tiết...',
  className = '',
}) => {
  const [content, setContent] = useState(value || '');
  
  // Cập nhật nội dung khi prop value thay đổi
  useEffect(() => {
    setContent(value || '');
  }, [value]);

  // Xử lý thay đổi nội dung
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setContent(newValue);
    onChange(newValue);
  };

  // Thêm thẻ vào vị trí con trỏ
  const insertTag = (tag: string) => {
    const textarea = document.getElementById('rich-textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let newContent;
    switch (tag) {
      case 'b':
        newContent = content.substring(0, start) + `<strong>${selectedText}</strong>` + content.substring(end);
        break;
      case 'i':
        newContent = content.substring(0, start) + `<em>${selectedText}</em>` + content.substring(end);
        break;
      case 'u':
        newContent = content.substring(0, start) + `<u>${selectedText}</u>` + content.substring(end);
        break;
      case 'a':
        newContent = content.substring(0, start) + `<a href="#">${selectedText}</a>` + content.substring(end);
        break;
      case 'img':
        newContent = content.substring(0, start) + `<img src="" alt="Hình ảnh" />` + content.substring(end);
        break;
      case 'h2':
        newContent = content.substring(0, start) + `<h2>${selectedText}</h2>` + content.substring(end);
        break;
      case 'p':
        newContent = content.substring(0, start) + `<p>${selectedText}</p>` + content.substring(end);
        break;
      case 'ul':
        newContent = content.substring(0, start) + `<ul>\n  <li>${selectedText}</li>\n</ul>` + content.substring(end);
        break;
      default:
        newContent = content;
    }
    
    setContent(newContent);
    onChange(newContent);
    
    // Focus lại textarea sau khi chèn tag
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, end + tag.length * 2 + 5);
    }, 0);
  };

  return (
    <div className={`rich-text-editor ${className}`}>
      <div className="toolbar p-2 bg-gray-100 rounded-t-md border border-gray-300 flex flex-wrap gap-2">
        <button 
          type="button" 
          onClick={() => insertTag('h2')}
          className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
        >
          H2
        </button>
        <button 
          type="button" 
          onClick={() => insertTag('p')}
          className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
        >
          P
        </button>
        <button 
          type="button" 
          onClick={() => insertTag('b')}
          className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 font-bold"
        >
          B
        </button>
        <button 
          type="button" 
          onClick={() => insertTag('i')}
          className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 italic"
        >
          I
        </button>
        <button 
          type="button" 
          onClick={() => insertTag('u')}
          className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 underline"
        >
          U
        </button>
        <button 
          type="button" 
          onClick={() => insertTag('a')}
          className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 text-blue-500"
        >
          Link
        </button>
        <button 
          type="button" 
          onClick={() => insertTag('img')}
          className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
        >
          Hình ảnh
        </button>
        <button 
          type="button" 
          onClick={() => insertTag('ul')}
          className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
        >
          Danh sách
        </button>
      </div>
      <textarea
        id="rich-textarea"
        value={content}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full min-h-[300px] p-3 border border-gray-300 border-t-0 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={10}
      />
      <div className="mt-2 text-xs text-gray-500">
        Bạn có thể viết HTML trực tiếp để định dạng văn bản và chèn hình ảnh.
      </div>
      <style jsx global>{`
        .rich-text-editor textarea {
          font-family: monospace;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor; 