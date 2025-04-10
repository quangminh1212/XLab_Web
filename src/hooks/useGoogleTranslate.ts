'use client';

import { useState, useCallback } from 'react';
import { useTranslation } from '@/context/TranslationContext';

interface TranslateOptions {
  targetLanguage?: string;
}

export function useGoogleTranslate() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isTranslated, setTranslated, preferredLanguage } = useTranslation();

  const translateText = useCallback(
    (text: string, options: TranslateOptions = {}) => {
      const targetLanguage = options.targetLanguage || preferredLanguage || 'en';
      
      // Tạo URL dịch trang bằng dịch vụ miễn phí của Google
      const translateUrl = `https://translate.google.com/?sl=auto&tl=${targetLanguage}&text=${encodeURIComponent(text)}&op=translate`;
      
      // Mở URL trong tab mới
      window.open(translateUrl, '_blank');
      
      // Cập nhật trạng thái
      setTranslated(true);
      
      return {
        success: true,
        message: 'Opened Google Translate in a new tab'
      };
    },
    [preferredLanguage, setTranslated]
  );

  // Chuyển hướng toàn bộ trang hiện tại sang phiên bản dịch
  const translateCurrentPage = useCallback(
    (targetLanguage?: string) => {
      const currentUrl = window.location.href;
      const lang = targetLanguage || preferredLanguage || 'en';
      
      // Cập nhật trạng thái
      setTranslated(true);
      
      // Chuyển hướng đến phiên bản dịch
      window.location.href = `https://translate.google.com/translate?sl=auto&tl=${lang}&u=${encodeURIComponent(currentUrl)}`;
    },
    [preferredLanguage, setTranslated]
  );

  return {
    translateText,
    translateCurrentPage,
    isLoading: false,
    error: null,
    isTranslated,
  };
} 