'use client';

import React, { useEffect, useRef } from 'react';

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
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Đồng bộ giá trị từ props vào editor
  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      // Chỉ cập nhật nếu nội dung khác nhau để tránh mất vị trí con trỏ
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  // Xử lý các sự kiện khi thêm ảnh vào editor
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!editorRef.current) return;
      
      // Xử lý dán ảnh từ clipboard
      if (e.clipboardData && e.clipboardData.items) {
        const items = e.clipboardData.items;
        
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            e.preventDefault();
            
            const file = items[i].getAsFile();
            if (!file) continue;
            
            const reader = new FileReader();
            reader.onload = (event) => {
              if (!event.target?.result) return;
              
              // Tạo phần tử ảnh với các công cụ điều chỉnh
              const imageId = `img-${Date.now()}`;
              const imageWrapper = document.createElement('div');
              imageWrapper.className = 'image-wrapper';
              imageWrapper.contentEditable = 'false';
              
              const img = document.createElement('img');
              img.id = imageId;
              img.src = event.target.result as string;
              img.className = 'editor-image';
              
              // Thêm toolbar điều chỉnh ảnh
              const imageToolbar = document.createElement('div');
              imageToolbar.className = 'image-toolbar';
              
              // Nút căn giữa ảnh
              const centerBtn = document.createElement('button');
              centerBtn.innerHTML = '&#8592;&#8594;';
              centerBtn.title = 'Căn giữa';
              centerBtn.className = 'image-tool-btn';
              centerBtn.onclick = (e) => {
                e.preventDefault();
                img.style.display = 'block';
                img.style.margin = '0 auto';
              };
              
              // Nút resize ảnh về 100%
              const fullWidthBtn = document.createElement('button');
              fullWidthBtn.innerHTML = '100%';
              fullWidthBtn.title = 'Kích thước đầy đủ';
              fullWidthBtn.className = 'image-tool-btn';
              fullWidthBtn.onclick = (e) => {
                e.preventDefault();
                img.style.width = '100%';
              };
              
              // Nút resize ảnh về 75%
              const threeQuarterBtn = document.createElement('button');
              threeQuarterBtn.innerHTML = '75%';
              threeQuarterBtn.title = 'Kích thước 75%';
              threeQuarterBtn.className = 'image-tool-btn';
              threeQuarterBtn.onclick = (e) => {
                e.preventDefault();
                img.style.width = '75%';
              };
              
              // Nút resize ảnh về 50%
              const halfBtn = document.createElement('button');
              halfBtn.innerHTML = '50%';
              halfBtn.title = 'Kích thước 50%';
              halfBtn.className = 'image-tool-btn';
              halfBtn.onclick = (e) => {
                e.preventDefault();
                img.style.width = '50%';
              };
              
              // Nút xóa ảnh
              const deleteBtn = document.createElement('button');
              deleteBtn.innerHTML = '✕';
              deleteBtn.title = 'Xóa ảnh';
              deleteBtn.className = 'image-tool-btn delete-btn';
              deleteBtn.onclick = (e) => {
                e.preventDefault();
                imageWrapper.remove();
                handleInput(); // Cập nhật nội dung sau khi xóa
              };
              
              // Thêm các nút vào toolbar
              imageToolbar.appendChild(centerBtn);
              imageToolbar.appendChild(fullWidthBtn);
              imageToolbar.appendChild(threeQuarterBtn);
              imageToolbar.appendChild(halfBtn);
              imageToolbar.appendChild(deleteBtn);
              
              // Thêm ảnh và toolbar vào wrapper
              imageWrapper.appendChild(img);
              imageWrapper.appendChild(imageToolbar);
              
              // Chèn vào vị trí con trỏ
              const selection = window.getSelection();
              if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.insertNode(imageWrapper);
                
                // Di chuyển con trỏ sau ảnh
                range.setStartAfter(imageWrapper);
                range.setEndAfter(imageWrapper);
                selection.removeAllRanges();
                selection.addRange(range);
              } else {
                editorRef.current.appendChild(imageWrapper);
              }
              
              // Thêm một dòng mới sau ảnh để dễ tiếp tục soạn thảo
              const br = document.createElement('br');
              imageWrapper.after(br);
              
              handleInput();
            };
            reader.readAsDataURL(file);
          }
        }
      }
    };
    
    // Xử lý khi click vào ảnh để hiện toolbar
    const handleImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Nếu click vào ảnh trong editor, hiển thị toolbar
      if (target.tagName === 'IMG' && target.classList.contains('editor-image')) {
        const toolbar = target.parentElement?.querySelector('.image-toolbar');
        if (toolbar) {
          toolbar.classList.add('visible');
        }
      } else if (!target.closest('.image-toolbar')) {
        // Ẩn tất cả các toolbar nếu click ngoài ảnh và toolbar
        const toolbars = editorRef.current?.querySelectorAll('.image-toolbar');
        toolbars?.forEach(toolbar => {
          toolbar.classList.remove('visible');
        });
      }
    };
    
    // Thêm sự kiện paste để xử lý dán ảnh
    editorRef.current?.addEventListener('paste', handlePaste);
    document.addEventListener('click', handleImageClick);
    
    return () => {
      editorRef.current?.removeEventListener('paste', handlePaste);
      document.removeEventListener('click', handleImageClick);
    };
  }, []);
  
  // Xử lý các thay đổi từ người dùng
  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };
  
  // Xử lý khi editor trống, hiển thị placeholder
  const handleFocus = () => {
    if (editorRef.current && editorRef.current.innerHTML === '') {
      editorRef.current.classList.remove('empty');
    }
  };
  
  const handleBlur = () => {
    if (editorRef.current && editorRef.current.innerHTML === '') {
      editorRef.current.classList.add('empty');
    }
  };

  return (
    <div className={`simple-editor ${className}`}>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`content-editable w-full min-h-[300px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${value === '' ? 'empty' : ''}`}
        data-placeholder={placeholder}
      />
      <div className="mt-2 text-xs text-gray-500">
        Dán hình ảnh trực tiếp từ clipboard (Ctrl+V) vào đây
      </div>
      <style jsx global>{`
        .simple-editor .content-editable {
          line-height: 1.5;
          min-height: 300px;
          overflow-y: auto;
        }
        
        .simple-editor .content-editable.empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          position: absolute;
          pointer-events: none;
        }
        
        .simple-editor .content-editable:focus {
          outline: none;
        }
        
        .simple-editor .content-editable img {
          max-width: 100%;
          height: auto;
          margin: 8px 0;
        }
        
        .image-wrapper {
          position: relative;
          display: inline-block;
          margin: 8px 0;
          max-width: 100%;
        }
        
        .image-toolbar {
          display: none;
          position: absolute;
          top: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.7);
          border-radius: 4px;
          padding: 5px;
          z-index: 10;
        }
        
        .image-toolbar.visible {
          display: flex;
          gap: 5px;
        }
        
        .image-tool-btn {
          background: transparent;
          color: white;
          border: 1px solid white;
          border-radius: 3px;
          width: 28px;
          height: 28px;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }
        
        .image-tool-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .delete-btn {
          background: rgba(255, 0, 0, 0.5);
        }
        
        .delete-btn:hover {
          background: rgba(255, 0, 0, 0.7);
        }
        
        .editor-image {
          display: block;
          max-width: 100%;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor; 