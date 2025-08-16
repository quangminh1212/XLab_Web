'use client';

import React, { useEffect, useRef, useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onPaste?: (e: React.ClipboardEvent<HTMLDivElement>) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Nhập nội dung chi tiết...',
  className = '',
  onPaste,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pasteListenerAttached = useRef<boolean>(false);
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
    // Đính kèm sự kiện click để xử lý ảnh
    document.addEventListener('click', handleImageClick);

    return () => {
      document.removeEventListener('click', handleImageClick);
    };
  }, []);
  
  // Xử lý dán ảnh từ clipboard
  const handlePasteInEditor = (e: React.ClipboardEvent<HTMLDivElement>) => {
    // Xử lý dán ảnh từ clipboard
    if (e.clipboardData && e.clipboardData.items) {
      const items = e.clipboardData.items;
      let imageFound = false;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!item) continue;
        if (item.type && item.type.indexOf('image') !== -1) {
          // Prevent default paste behavior to avoid duplicate insertions
          e.preventDefault();

          // Only process the first image found to prevent duplication
          if (imageFound) continue;
          imageFound = true;

          const file = item.getAsFile ? item.getAsFile() : null;
          if (!file) continue;

          // Upload image to server if available
          handleUploadPastedFile(file);
          
          // Exit early since we've handled the image
          return;
        }
      }
    }
    
    // If no image was found, call the external onPaste handler if provided
    if (onPaste) {
      onPaste(e);
    }
  };
  
  // Upload pasted file
  const handleUploadPastedFile = async (file: File) => {
    try {
      if (!editorRef.current) return;
      
      // Kiểm tra kích thước file (giới hạn 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 5MB');
        return;
      }

      // Kiểm tra loại file
      if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/)) {
        alert('Chỉ chấp nhận file hình ảnh (JPEG, PNG, GIF, WEBP)');
        return;
      }

      // Xử lý trực tiếp với DataURL ngay lập tức để có phản hồi nhanh
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          // Chèn ảnh vào editor với data URL
          insertImageToEditor(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      
      try {
        // Cố gắng upload lên server ở background
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        // Upload hình ảnh lên server
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          const imageUrl = data.url || data.filepath || data.fileUrl;
          
          if (imageUrl) {
            // Thay thế ảnh data URL bằng URL server khi đã upload xong
            // Tìm ảnh đã chèn trong editor và cập nhật src
            const images = editorRef.current.querySelectorAll('.editor-image');
            const lastImage = images[images.length - 1];
            if (lastImage) {
              lastImage.setAttribute('src', imageUrl);
              // Update HTML
              handleInput();
            }
          }
        }
      } catch (uploadErr) {
        console.error('Lỗi khi upload hình ảnh lên server:', uploadErr);
        // Không cần xử lý lỗi vì đã có ảnh local
      }
    } catch (err) {
      console.error('Lỗi khi xử lý hình ảnh:', err);
      alert('Có lỗi khi xử lý hình ảnh: ' + (err as Error).message);
    }
  };

  // Xử lý khi click vào ảnh để hiện toolbar
  const handleImageClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    // Đầu tiên ẩn tất cả các toolbar đang mở
    if (editorRef.current) {
      const allToolbars = editorRef.current.querySelectorAll('.image-toolbar');
      allToolbars.forEach(toolbar => {
        toolbar.classList.remove('visible');
      });
    }

    // Xử lý khi click vào ảnh bất kỳ trong editor
    if (target.tagName === 'IMG') {
      // Nếu ảnh đã có wrapper với toolbar, chỉ hiển thị toolbar
      if (target.classList.contains('editor-image')) {
        const toolbar = target.parentElement?.querySelector('.image-toolbar');
        if (toolbar) {
          toolbar.classList.add('visible');
          
          // Đảm bảo toolbar hiển thị trong khung nhìn
          const rect = toolbar.getBoundingClientRect();
          if (rect.top < 0) {
            window.scrollBy(0, rect.top - 10);
          }
        }
      } 
      // Nếu ảnh chưa có wrapper và toolbar, tạo mới
      else if (editorRef.current) {
        // Tạo wrapper bao quanh ảnh đã có
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'image-wrapper';
        imageWrapper.contentEditable = 'false';
        
        // Lấy thông tin ảnh hiện tại
        const originalSrc = target.getAttribute('src') || '';
        
        // Thay thế ảnh với phiên bản mới có toolbar
        const img = document.createElement('img');
        img.src = originalSrc;
        img.className = 'editor-image';
        // Luôn đặt kích thước là đầy đủ và căn giữa
        img.style.width = '100%';
        img.style.display = 'block';
        img.style.margin = '0 auto';
        
        // Thêm thuộc tính từ ảnh cũ vào ảnh mới
        for (const attr of target.attributes) {
          if (attr.name !== 'src' && attr.name !== 'style' && attr.name !== 'class') {
            img.setAttribute(attr.name, attr.value);
          }
        }
        
        // Tạo toolbar điều chỉnh ảnh
        const imageToolbar = document.createElement('div');
        imageToolbar.className = 'image-toolbar visible';
        
        // Function để update editor content khi thay đổi
        const updateContent = () => {
          if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
          }
        };
        
        // Nút căn giữa ảnh
        const centerBtn = document.createElement('button');
        centerBtn.innerHTML = '&#8592;&#8594;';
        centerBtn.title = 'Căn giữa';
        centerBtn.className = 'image-tool-btn';
        centerBtn.onclick = (e) => {
          e.preventDefault();
          img.style.display = 'block';
          img.style.margin = '0 auto';
          handleInput();
        };
        
        // Nút xóa ảnh
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '&#10005;';
        deleteBtn.title = 'Xóa ảnh';
        deleteBtn.className = 'image-tool-btn delete-btn';
        deleteBtn.onclick = (e) => {
          e.preventDefault();
          const wrapper = img.parentElement;
          if (wrapper) {
            wrapper.remove();
            handleInput();
          }
        };

        // Thêm các nút vào toolbar
        imageToolbar.appendChild(centerBtn);
        imageToolbar.appendChild(deleteBtn);
        
        // Thêm ảnh và toolbar vào wrapper
        imageWrapper.appendChild(img);
        imageWrapper.appendChild(imageToolbar);
        
        // Thay thế ảnh cũ bằng wrapper mới
        target.replaceWith(imageWrapper);
        
        // Cập nhật nội dung và đánh dấu đã thay đổi
        handleInput();
      }
    } 
    // Ẩn các toolbar khi click ra ngoài ảnh
    else if (editorRef.current) {
      // Kiểm tra nếu click vào toolbar thì bỏ qua
      if (target.closest('.image-toolbar')) {
        return;
      }
      
      const toolbars = editorRef.current?.querySelectorAll('.image-toolbar');
      toolbars?.forEach(toolbar => {
        toolbar.classList.remove('visible');
      });
    }
  };

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
    // Luôn đặt kích thước là đầy đủ và căn giữa
    img.style.width = '100%';
    img.style.display = 'block';
    img.style.margin = '0 auto';

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
      handleInput();
    };

    // Nút xóa ảnh
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '&#10005;';
    deleteBtn.title = 'Xóa ảnh';
    deleteBtn.className = 'image-tool-btn delete-btn';
    deleteBtn.onclick = (e) => {
      e.preventDefault();
      const wrapper = img.parentElement;
      if (wrapper) {
        wrapper.remove();
        handleInput();
      }
    };

    // Thêm các nút vào toolbar
    imageToolbar.appendChild(centerBtn);
    imageToolbar.appendChild(deleteBtn);

    // Thêm ảnh và toolbar vào wrapper
    imageWrapper.appendChild(img);
    imageWrapper.appendChild(imageToolbar);

    // Thêm wrapper vào editor
    if (editorRef.current.innerHTML === '' || editorRef.current.innerHTML === '<br>') {
      editorRef.current.innerHTML = '';
      editorRef.current.appendChild(imageWrapper);
    } else {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        if (range.commonAncestorContainer === editorRef.current || editorRef.current.contains(range.commonAncestorContainer)) {
          // Thêm dòng trống trước ảnh nếu cần
          const p = document.createElement('p');
          p.innerHTML = '<br>';
          
          // Thêm ảnh và một dòng trống sau ảnh
          range.deleteContents();
          range.insertNode(p.cloneNode(true));
          range.collapse(false);
          
          range.insertNode(imageWrapper);
          
          // Thêm dòng trống sau ảnh
          const pAfter = p.cloneNode(true);
          imageWrapper.after(pAfter);
          
          // Di chuyển con trỏ xuống dòng sau ảnh
          range.setStartAfter(pAfter);
          range.setEndAfter(pAfter);
          sel.removeAllRanges();
          sel.addRange(range);
        } else {
          // Nếu không thì thêm vào cuối
          editorRef.current.appendChild(document.createElement('br'));
          editorRef.current.appendChild(imageWrapper);
          editorRef.current.appendChild(document.createElement('br'));
        }
      } else {
        // Nếu không có selection, thêm vào cuối
        editorRef.current.appendChild(document.createElement('br'));
        editorRef.current.appendChild(imageWrapper);
        editorRef.current.appendChild(document.createElement('br'));
      }
    }

    // Thông báo thay đổi
    handleInput();
  };

  // Xử lý tải lên ảnh từ máy tính
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reuse our upload handler for consistency
    try {
      await handleUploadPastedFile(file);
    } catch (err) {
      alert((err as Error).message || 'Không thể tải lên hình ảnh');
    }

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

  // Xử lý chèn link
  const handleInsertLink = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const selectedText = selection.toString();
    const url = prompt('Nhập đường dẫn liên kết (URL):', 'https://');

    if (url && url !== 'https://') {
      if (selectedText) {
        // Nếu đã chọn văn bản, chèn link vào văn bản đó
        execCommand('createLink', url);
      } else {
        // Nếu chưa chọn văn bản, tạo một link mới với URL là văn bản
        const linkText = prompt('Nhập văn bản hiển thị cho liên kết:', url);
        const linkElement = document.createElement('a');
        linkElement.href = url;
        linkElement.textContent = linkText || url;
        linkElement.target = '_blank';

        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(linkElement);

        // Di chuyển con trỏ sau link
        range.setStartAfter(linkElement);
        range.setEndAfter(linkElement);
        selection.removeAllRanges();
        selection.addRange(range);

        handleInput();
      }
    }
  };

  // Hàm thêm bảng
  const handleInsertTable = () => {
    const rows = prompt('Nhập số hàng:', '3');
    const cols = prompt('Nhập số cột:', '3');

    if (!rows || !cols) return;

    const numRows = parseInt(rows, 10);
    const numCols = parseInt(cols, 10);

    if (isNaN(numRows) || isNaN(numCols) || numRows <= 0 || numCols <= 0) {
      alert('Số hàng và số cột phải là số nguyên dương');
      return;
    }

    // Tạo bảng
    const table = document.createElement('table');
    table.className = 'editor-table';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '10px';

    // Tạo phần thân bảng
    const tbody = document.createElement('tbody');

    // Tạo các hàng và cột
    for (let i = 0; i < numRows; i++) {
      const row = document.createElement('tr');

      for (let j = 0; j < numCols; j++) {
        const cell = document.createElement('td');
        cell.style.border = '1px solid #ddd';
        cell.style.padding = '8px';
        cell.style.verticalAlign = 'top';
        cell.appendChild(document.createElement('br'));
        row.appendChild(cell);
      }

      tbody.appendChild(row);
    }

    table.appendChild(tbody);

    // Chèn bảng vào editor
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(table);

      // Di chuyển con trỏ sau bảng
      range.setStartAfter(table);
      range.setEndAfter(table);
      selection.removeAllRanges();
      selection.addRange(range);
    } else if (editorRef.current) {
      editorRef.current.appendChild(table);
    }

    handleInput();
  };

  return (
    <div className={`simple-editor ${className}`}>
      <div className={`text-toolbar ${showToolbar ? 'visible' : ''}`}>
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
          <button
            type="button"
            title="Gạch ngang"
            className="toolbar-btn"
            onClick={() => execCommand('strikeThrough')}
          >
            <s>S</s>
          </button>
        </div>
        
        <div className="toolbar-group">
          <button
            type="button"
            title="Căn trái"
            className="toolbar-btn"
            onClick={() => execCommand('justifyLeft')}
          >
            ⇦
          </button>
          <button
            type="button"
            title="Căn giữa"
            className="toolbar-btn"
            onClick={() => execCommand('justifyCenter')}
          >
            ≡
          </button>
          <button
            type="button"
            title="Căn phải"
            className="toolbar-btn"
            onClick={() => execCommand('justifyRight')}
          >
            ⇨
          </button>
          <button
            type="button"
            title="Căn đều"
            className="toolbar-btn"
            onClick={() => execCommand('justifyFull')}
          >
            ⇧⇩
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            title="Danh sách có thứ tự"
            className="toolbar-btn"
            onClick={() => execCommand('insertOrderedList')}
          >
            1.
          </button>
          <button
            type="button"
            title="Danh sách không thứ tự"
            className="toolbar-btn"
            onClick={() => execCommand('insertUnorderedList')}
          >
            •
          </button>
          <button
            type="button"
            title="Lùi vào"
            className="toolbar-btn"
            onClick={() => execCommand('indent')}
          >
            →|
          </button>
          <button
            type="button"
            title="Lùi ra"
            className="toolbar-btn"
            onClick={() => execCommand('outdent')}
          >
            |←
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            title="Chèn liên kết"
            className="toolbar-btn"
            onClick={handleInsertLink}
          >
            🔗
          </button>
          <button
            type="button"
            title="Chèn bảng"
            className="toolbar-btn"
            onClick={handleInsertTable}
          >
            ⊞
          </button>
          <button
            type="button"
            title="Chèn ảnh"
            className="toolbar-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            🖼️
          </button>
        </div>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onPaste={handlePasteInEditor}
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
          width: 100% !important;
          height: auto;
          margin: 8px 0;
          display: block !important;
        }

        .simple-editor .image-wrapper {
          position: relative;
          margin: 10px 0;
        }

        .simple-editor .editor-image {
          max-width: 100%;
          width: 100% !important;
          height: auto;
          transition: width 0.2s ease-in-out;
          display: block !important;
          margin: 0 auto !important;
        }

        .simple-editor .editor-image.resizing {
          opacity: 0.9;
          outline: 2px dashed #2196f3;
        }

        .simple-editor .image-toolbar {
          display: none;
          position: absolute;
          top: -40px;
          left: 0;
          right: 0;
          background-color: rgba(0, 0, 0, 0.75);
          padding: 5px;
          border-radius: 3px;
          text-align: center;
          z-index: 1000;
        }

        .image-toolbar.visible {
          display: flex !important;
          gap: 5px;
          flex-wrap: wrap;
          max-width: 100px; /* Giảm chiều rộng vì ít nút hơn */
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.2);
          z-index: 1000;
        }

        .image-tool-btn {
          background: rgba(50, 50, 50, 0.8);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 3px;
          width: 28px;
          height: 28px;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: all 0.2s ease;
        }

        .image-tool-btn:hover {
          background: rgba(80, 80, 80, 0.9);
          transform: scale(1.05);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .delete-btn {
          background: rgba(244, 67, 54, 0.7);
        }

        .delete-btn:hover {
          background: rgba(244, 67, 54, 0.9);
        }

        .editor-image {
          display: block !important;
          max-width: 100%;
          width: 100% !important; 
          margin: 0 auto !important;
          text-align: center;
          border-radius: 4px;
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }

        .editor-image:hover {
          border-color: rgba(0, 120, 212, 0.5);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
          border-radius: 4px;
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

        .font-size-select,
        .font-color-select,
        .bg-color-select {
          background-color: white;
          border: 1px solid #d1d5db;
          border-radius: 3px;
          height: 28px;
          font-size: 14px;
          cursor: pointer;
          padding: 0 5px;
        }

        /* Định dạng cho bảng */
        .editor-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1rem;
        }

        .editor-table td {
          border: 1px solid #ddd;
          padding: 8px;
          min-width: 50px;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
