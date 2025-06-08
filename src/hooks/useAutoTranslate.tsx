'use client';

import React, { useState, useEffect, useMemo, ReactNode, useRef } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';

interface UseAutoTranslateOptions {
  delay?: number;
  initialText?: string;
}

/**
 * Hook để tự động dịch văn bản với hiệu ứng chuyển đổi
 * @param text Văn bản cần dịch
 * @param options Tùy chọn
 * @returns Văn bản đã dịch và trạng thái đang dịch
 */
export const useAutoTranslate = (
  text: string,
  options?: UseAutoTranslateOptions
) => {
  const { language, translate } = useTranslation();
  const [translatedText, setTranslatedText] = useState<string>(text);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  useEffect(() => {
    if (!text) {
      setTranslatedText('');
      return;
    }

    // Nếu là tiếng Việt, không cần dịch
    if (language === 'vi') {
      setTranslatedText(text);
      return;
    }

    // Bắt đầu hiệu ứng dịch
    setIsTranslating(true);

    const timeoutId = setTimeout(async () => {
      try {
        // Dịch văn bản
        const result = translate(text);
        setTranslatedText(result);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedText(text); // Trả về text gốc nếu có lỗi
      } finally {
        setIsTranslating(false);
      }
    }, options?.delay || 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [text, language, translate, options?.delay]);

  return { translatedText, isTranslating };
};

/**
 * Component HOC để tự động dịch văn bản
 */
export const AutoTranslate: React.FC<{
  children: string;
  className?: string;
}> = ({ children, className }) => {
  const { translatedText, isTranslating } = useAutoTranslate(children);

  return (
    <span
      className={`transition-opacity duration-300 ${
        isTranslating ? 'opacity-70' : 'opacity-100'
      } ${className || ''}`}
    >
      {translatedText}
    </span>
  );
};

/**
 * HOC để bọc component và dịch tất cả text children
 * @param Component Component cần bọc
 * @returns Component đã được bọc với khả năng dịch
 */
export function withTranslation<T extends object>(Component: React.ComponentType<T>) {
  return function WrappedComponent(props: T) {
    return (
      <TranslateWrapper>
        <Component {...props} />
      </TranslateWrapper>
    );
  };
}

/**
 * Component wrapper để dịch toàn bộ text nodes bên trong
 */
export const TranslateWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { language } = useTranslation();
  
  // Nếu ngôn ngữ là tiếng Việt, không cần dịch
  if (language === 'vi') {
    return <>{children}</>;
  }
  
  return <>{processChildren(children)}</>;
};

/**
 * Hàm đệ quy xử lý và dịch tất cả text nodes
 */
function processChildren(children: ReactNode): ReactNode {
  // Nếu là string, thì dịch nó
  if (typeof children === 'string') {
    return <AutoTranslate>{children}</AutoTranslate>;
  }
  
  // Nếu là array, xử lý từng phần tử
  if (Array.isArray(children)) {
    return children.map((child, index) => (
      <React.Fragment key={index}>{processChildren(child)}</React.Fragment>
    ));
  }
  
  // Nếu là React element, xử lý các children của nó
  if (React.isValidElement(children)) {
    // Nếu đã là AutoTranslate hoặc có thuộc tính data-no-translate, bỏ qua
    if (
      children.type === AutoTranslate ||
      (children.props && children.props['data-no-translate'] === 'true')
    ) {
      return children;
    }
    
    // Xử lý các children
    if (children.props && children.props.children) {
      return React.cloneElement(
        children,
        { ...children.props },
        processChildren(children.props.children)
      );
    }
    
    return children;
  }
  
  // Trường hợp khác (null, undefined, boolean, number)
  return children;
}

/**
 * Directive để đánh dấu phần tử không cần dịch
 */
export const NoTranslate: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <span data-no-translate="true">{children}</span>;
};

export default useAutoTranslate; 