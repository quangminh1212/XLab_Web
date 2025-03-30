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
    if (strategy === 'beforeInteractive') {
      return; // Không thể xử lý beforeInteractive trong client component
    }

    // Không làm gì nếu script đã được tạo
    if (scriptRef.current) return;

    // Tạo và thêm script vào DOM
    const script = document.createElement('script');
    if (id) script.id = id;
    if (src) script.src = src;
    if (content) script.innerHTML = content;
    
    script.onload = () => {
      console.log(`Script ${src || id || 'inline'} loaded successfully`);
      if (onLoad) onLoad();
    };
    
    script.onerror = () => {
      console.error(`Error loading script ${src || id || 'inline'}`);
      if (onError) onError();
    };

    // Áp dụng chiến lược
    if (strategy === 'lazyOnload') {
      // Sử dụng Intersection Observer để load script khi nó trở nên visible
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          document.body.appendChild(script);
          observer.disconnect();
        }
      });
      
      const dummy = document.createElement('div');
      document.body.appendChild(dummy);
      observer.observe(dummy);
      
      return () => {
        observer.disconnect();
        if (dummy.parentNode) dummy.parentNode.removeChild(dummy);
      };
    } else {
      // afterInteractive là mặc định - chạy ngay sau khi component mount
      document.body.appendChild(script);
      scriptRef.current = script;
      
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, [src, id, content, strategy, onLoad, onError]);

  return null;
};

export default ScriptComponent; 