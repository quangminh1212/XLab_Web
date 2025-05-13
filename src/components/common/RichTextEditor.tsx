'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';

// Import Editor động
const DraftEditor = dynamic(
  () => import('react-draft-wysiwyg').then(mod => mod.Editor),
  { ssr: false, loading: () => <div className="h-60 w-full bg-gray-100 animate-pulse rounded-md"></div> }
);

// Import CSS cho Editor
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

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
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [mounted, setMounted] = useState(false);
  
  // Khởi tạo editor từ HTML khi component mount
  useEffect(() => {
    if (value) {
      const contentBlock = htmlToDraft(value);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        setEditorState(editorState);
      }
    }
    setMounted(true);
  }, []);

  // Cập nhật editorState khi value thay đổi từ bên ngoài
  useEffect(() => {
    if (mounted && value) {
      const contentBlock = htmlToDraft(value);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        setEditorState(editorState);
      }
    }
  }, [value, mounted]);

  // Xử lý khi nội dung thay đổi
  const handleEditorChange = (currentState: EditorState) => {
    setEditorState(currentState);
    const htmlContent = draftToHtml(convertToRaw(currentState.getCurrentContent()));
    onChange(htmlContent);
  };

  if (!mounted) {
    return <div className="h-60 w-full bg-gray-100 rounded-md"></div>;
  }

  return (
    <div className={`rich-text-editor ${className}`}>
      <DraftEditor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        placeholder={placeholder}
        toolbar={{
          options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'image', 'history'],
          inline: { options: ['bold', 'italic', 'underline', 'strikethrough'] },
          list: { options: ['unordered', 'ordered'] },
          textAlign: { options: ['left', 'center', 'right', 'justify'] },
          link: { options: ['link'] },
          history: { options: ['undo', 'redo'] },
        }}
        editorClassName="editor-content"
        wrapperClassName="editor-wrapper"
        toolbarClassName="editor-toolbar"
      />
      <style jsx global>{`
        .rich-text-editor .editor-wrapper {
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          min-height: 200px;
        }
        
        .rich-text-editor .editor-toolbar {
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          border: none;
          border-bottom: 1px solid #e5e7eb;
          background-color: #f9fafb;
        }
        
        .rich-text-editor .editor-content {
          min-height: 200px;
          max-height: 500px;
          padding: 0.5rem 1rem;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor; 