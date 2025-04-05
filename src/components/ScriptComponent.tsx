'use client';

import React, { useEffect, useRef } from 'react';

interface ScriptProps {
  src?: string;
  id?: string;
  content?: string;
  strategy?: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload' | 'worker';
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Component Script tùy chỉnh để thay thế next/script khi cần
 * Hỗ trợ các chiến lược loading scripts khác nhau
 */
const ScriptComponent: React.FC<ScriptProps> = ({
  src,
  id,
  content,
  strategy = 'afterInteractive',
  onLoad,
  onError,
}) => {
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Kiểm tra xem có đang chạy trong trình duyệt không
    if (typeof window === 'undefined') {
      return; // Không thực hiện gì nếu đang trong môi trường server
    }

    if (strategy === 'beforeInteractive') {
      return; // Không thể xử lý beforeInteractive trong client component
    }

    // Không làm gì nếu script đã được tạo
    if (scriptRef.current) return;

    // Sử dụng try/catch bọc toàn bộ logic
    try {
      // Tạo và thêm script vào DOM
      const script = document.createElement('script');
      if (id) script.id = id;
      if (src) script.src = src;
      
      // Đảm bảo content tồn tại trước khi gán
      if (content && typeof content === 'string') {
        script.innerHTML = content;
      }
      
      // Bọc callbacks trong try/catch
      script.onload = () => {
        try {
          console.log(`Script ${src || id || 'inline'} loaded successfully`);
          if (onLoad && typeof onLoad === 'function') onLoad();
        } catch (err) {
          console.error('Error in script onload handler:', err);
        }
      };
      
      script.onerror = () => {
        try {
          console.error(`Error loading script ${src || id || 'inline'}`);
          if (onError && typeof onError === 'function') onError();
        } catch (err) {
          console.error('Error in script onerror handler:', err);
        }
      };

      // Áp dụng chiến lược
      if (strategy === 'lazyOnload') {
        // Kiểm tra IntersectionObserver tồn tại
        if (typeof IntersectionObserver === 'function') {
          const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
              try {
                document.body.appendChild(script);
                observer.disconnect();
              } catch (err) {
                console.error('Error appending script in observer:', err);
              }
            }
          });
          
          const dummy = document.createElement('div');
          document.body.appendChild(dummy);
          observer.observe(dummy);
          
          return () => {
            try {
              observer.disconnect();
              if (dummy.parentNode) dummy.parentNode.removeChild(dummy);
            } catch (err) {
              console.error('Error cleaning up observer:', err);
            }
          };
        } else {
          // Fallback nếu IntersectionObserver không được hỗ trợ
          setTimeout(() => {
            try {
              document.body.appendChild(script);
            } catch (err) {
              console.error('Error appending script in fallback:', err);
            }
          }, 2000);
        }
      } else {
        // afterInteractive là mặc định - chạy ngay sau khi component mount
        try {
          document.body.appendChild(script);
          scriptRef.current = script;
        } catch (err) {
          console.error('Error appending script:', err);
        }
        
        return () => {
          try {
            if (script.parentNode) {
              script.parentNode.removeChild(script);
            }
          } catch (err) {
            console.error('Error removing script:', err);
          }
        };
      }
    } catch (error) {
      console.error('Error in ScriptComponent:', error);
    }
  }, [src, id, content, strategy, onLoad, onError]);

  return null;
};

export default ScriptComponent; 