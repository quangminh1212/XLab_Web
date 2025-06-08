'use client';

import { useState, useEffect } from 'react';
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

export default useAutoTranslate; 