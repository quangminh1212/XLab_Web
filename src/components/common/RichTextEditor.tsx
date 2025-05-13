'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Import Quill dynamically để tránh lỗi SSR
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="h-60 w-full bg-gray-100 animate-pulse rounded-md"></div>,
});

// Import CSS
import 'react-quill/dist/quill.snow.css';

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
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Modules và formats cho Quill editor
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      ['link', 'image'],
      ['clean'],
      [{ align: [] }],
      [{ indent: '-1' }, { indent: '+1' }],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'link', 'image',
    'align',
    'indent',
  ];

  if (!mounted) {
    return <div className="h-60 w-full bg-gray-100 rounded-md"></div>;
  }

  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        theme="snow"
        className="min-h-[200px]"
      />
      <style jsx global>{`
        .ql-editor {
          min-height: 200px;
          max-height: 500px;
          overflow-y: auto;
        }
        .rich-text-editor .ql-container {
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
          border-color: #e5e7eb;
        }
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          border-color: #e5e7eb;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor; 