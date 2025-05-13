'use client';

import React, { useEffect, useRef, useState } from 'react';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  
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
              
              insertImageToEditor(event.target.result as string);
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
  
  // Thêm ảnh vào editor
  const insertImageToEditor = (imageSrc: string) => {
    if (!editorRef.current) return;
    
    // Tạo phần tử ảnh với các công cụ điều chỉnh
    const imageId = `img-${Date.now()}`;
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'image-wrapper';
    imageWrapper.contentEditable = 'false';
    
    const img = document.createElement('img');
    img.id = imageId;
    img.src = imageSrc;
    img.className = 'editor-image';
    // Đặt kích thước mặc định nhỏ hơn cho ảnh (50%)
    img.style.width = '50%';
    
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
    
    // Nút resize ảnh về 25%
    const quarterBtn = document.createElement('button');
    quarterBtn.innerHTML = '25%';
    quarterBtn.title = 'Kích thước 25%';
    quarterBtn.className = 'image-tool-btn';
    quarterBtn.onclick = (e) => {
      e.preventDefault();
      img.style.width = '25%';
    };
    
    // Nút thêm chú thích cho ảnh
    const captionBtn = document.createElement('button');
    captionBtn.innerHTML = 'Abc';
    captionBtn.title = 'Thêm chú thích';
    captionBtn.className = 'image-tool-btn';
    captionBtn.onclick = (e) => {
      e.preventDefault();
      
      // Kiểm tra xem đã có caption chưa
      let caption = imageWrapper.querySelector('.image-caption');
      
      if (!caption) {
        // Tạo mới caption nếu chưa có
        caption = document.createElement('div');
        caption.className = 'image-caption';
        (caption as HTMLDivElement).contentEditable = 'true';
        caption.innerHTML = 'Nhập chú thích...';
        imageWrapper.appendChild(caption);
        
        // Focus vào caption để người dùng nhập
        setTimeout(() => {
          (caption as HTMLDivElement)?.focus();
          
          // Chọn toàn bộ văn bản mặc định
          const selection = window.getSelection();
          const range = document.createRange();
          if (selection && caption) {
            range.selectNodeContents(caption);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }, 0);
        
        // Xử lý sự kiện blur để cập nhật nội dung
        caption.addEventListener('blur', () => {
          if (caption instanceof HTMLElement && caption.innerHTML.trim() === 'Nhập chú thích...') {
            caption.remove();
          }
          handleInput();
        });
        
        // Ngăn sự kiện click truyền ra ngoài
        caption.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      } else {
        // Nếu đã có caption thì xóa đi
        caption.remove();
        handleInput();
      }
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
    imageToolbar.appendChild(quarterBtn);
    imageToolbar.appendChild(captionBtn);
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
  
  // Xử lý tải lên ảnh từ máy tính
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/)) {
      alert('Chỉ chấp nhận file hình ảnh (JPEG, PNG, GIF, WEBP)');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        insertImageToEditor(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    
    // Reset input file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
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
    setShowToolbar(true);
  };
  
  const handleBlur = () => {
    if (editorRef.current && editorRef.current.innerHTML === '') {
      editorRef.current.classList.add('empty');
    }
  };

  // Xử lý định dạng văn bản
  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      handleInput();
    }
  };

  return (
    <div className={`simple-editor ${className}`}>
      <div 
        className={`text-toolbar ${showToolbar ? 'visible' : ''}`}
      >
        <div className="toolbar-group">
          <button 
            type="button"
            title="Đậm"
            className="toolbar-btn"
            onClick={() => execCommand('bold')}
          >
            <strong>B</strong>
          </button>
          <button 
            type="button"
            title="Nghiêng"
            className="toolbar-btn"
            onClick={() => execCommand('italic')}
          >
            <em>I</em>
          </button>
          <button 
            type="button"
            title="Gạch chân"
            className="toolbar-btn"
            onClick={() => execCommand('underline')}
          >
            <u>U</u>
          </button>
        </div>

        <div className="toolbar-group">
          <button 
            type="button"
            title="Căn trái"
            className="toolbar-btn"
            onClick={() => execCommand('justifyLeft')}
          >
            &#8592;
          </button>
          <button 
            type="button"
            title="Căn giữa"
            className="toolbar-btn"
            onClick={() => execCommand('justifyCenter')}
          >
            &#8596;
          </button>
          <button 
            type="button"
            title="Căn phải"
            className="toolbar-btn"
            onClick={() => execCommand('justifyRight')}
          >
            &#8594;
          </button>
        </div>

        <div className="toolbar-group">
          <select 
            className="font-size-select"
            onChange={(e) => execCommand('fontSize', e.target.value)}
            title="Kích cỡ chữ"
          >
            <option value="">Cỡ chữ</option>
            <option value="1">Rất nhỏ</option>
            <option value="2">Nhỏ</option>
            <option value="3">Bình thường</option>
            <option value="4">Lớn</option>
            <option value="5">Rất lớn</option>
            <option value="6">Cực lớn</option>
            <option value="7">Siêu lớn</option>
          </select>
        </div>
        
        <div className="toolbar-group">
          <button 
            type="button"
            title="Chèn ảnh"
            className="toolbar-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            <span role="img" aria-label="insert-image">🖼️</span>
          </button>
        </div>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`content-editable w-full min-h-[300px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${value === '' ? 'empty' : ''}`}
        data-placeholder={placeholder}
      />
      
      {/* Input ẩn để upload ảnh */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />
      
      <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
        <span>Dán hình ảnh trực tiếp từ clipboard (Ctrl+V) vào đây</span>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-blue-500 hover:text-blue-700"
        >
          hoặc tải lên từ máy tính
        </button>
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
          width: 100%;
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
          margin: 0 auto;
        }
        
        .image-caption {
          width: 100%;
          text-align: center;
          padding: 5px;
          margin-top: 5px;
          border: 1px dashed #ccc;
          background: #f8f8f8;
          font-style: italic;
          font-size: 0.9em;
          color: #666;
        }

        /* Định dạng cho thanh công cụ văn bản */
        .text-toolbar {
          display: flex;
          gap: 10px;
          background: #f9f9f9;
          border: 1px solid #e2e8f0;
          border-bottom: none;
          padding: 5px;
          border-radius: 4px 4px 0 0;
          flex-wrap: wrap;
        }

        .text-toolbar.visible {
          display: flex;
        }

        .toolbar-group {
          display: flex;
          gap: 3px;
          border-right: 1px solid #e2e8f0;
          padding-right: 10px;
          margin-right: 3px;
        }

        .toolbar-group:last-child {
          border-right: none;
          padding-right: 0;
          margin-right: 0;
        }

        .toolbar-btn {
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 3px;
          width: 28px;
          height: 28px;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }

        .toolbar-btn:hover {
          background: #f3f4f6;
        }

        .font-size-select {
          padding: 2px 5px;
          border: 1px solid #d1d5db;
          border-radius: 3px;
          font-size: 14px;
          height: 28px;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor; 