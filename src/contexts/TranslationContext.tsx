'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Interface cho context
interface TranslationContextType {
  language: string;
  changeLanguage: (lang: string) => void;
  translate: (text: string) => string;
  isLoading: boolean;
}

// Cache dịch để tránh dịch lại các chuỗi đã dịch
interface TranslationCache {
  [key: string]: {
    [text: string]: string;
  };
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>('vi');
  const [cache, setCache] = useState<TranslationCache>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  // Khởi tạo ngôn ngữ từ localStorage khi có thể
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage) {
        setLanguage(savedLanguage);
      } else {
        // Mặc định là tiếng Việt
        setLanguage('vi');
      }
    }
  }, []);

  // Lưu ngôn ngữ vào localStorage khi thay đổi
  useEffect(() => {
    if (typeof window !== 'undefined' && language) {
      localStorage.setItem('language', language);
      document.documentElement.lang = language;
    }
  }, [language]);

  // Tải cache từ server khi component mount
  useEffect(() => {
    const loadCache = async () => {
      if (language === 'vi') return; // Không cần tải cache cho tiếng Việt

      try {
        const response = await fetch(`/api/translate/cache?lang=${language}`);
        if (response.ok) {
          const data = await response.json();
          if (data.cache) {
            setCache((prevCache) => ({
              ...prevCache,
              [language]: data.cache,
            }));
          }
        }
      } catch (error) {
        console.error('Error loading translation cache:', error);
      }
    };

    loadCache();
  }, [language]);

  // Hàm dịch văn bản
  const translateText = useCallback(
    async (text: string, targetLang: string): Promise<string> => {
      // Nếu ngôn ngữ là tiếng Việt hoặc chuỗi trống, trả về text gốc
      if (targetLang === 'vi' || !text) {
        return text;
      }

      // Kiểm tra trong cache trước
      if (cache[targetLang] && cache[targetLang][text]) {
        return cache[targetLang][text];
      }

      try {
        setIsLoading(true);
        // Gọi API dịch
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            targetLang,
          }),
        });

        if (!response.ok) {
          throw new Error('Translation failed');
        }

        const data = await response.json();
        const translatedText = data.translatedText;

        // Lưu vào cache
        setCache((prevCache) => ({
          ...prevCache,
          [targetLang]: {
            ...(prevCache[targetLang] || {}),
            [text]: translatedText,
          },
        }));

        // Lưu cache vào server
        try {
          await fetch('/api/translate/cache', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              lang: targetLang,
              text,
              translation: translatedText,
            }),
          });
        } catch (e) {
          console.error('Error saving translation to cache:', e);
        }

        return translatedText;
      } catch (error) {
        console.error('Translation error:', error);
        return text; // Trả về text gốc nếu có lỗi
      } finally {
        setIsLoading(false);
      }
    },
    [cache]
  );

  // Hàm dịch đồng bộ (trả về từ cache nếu có, hoặc text gốc)
  const translate = useCallback(
    (text: string): string => {
      if (language === 'vi' || !text) {
        return text;
      }

      // Nếu đã có trong cache, trả về ngay
      if (cache[language] && cache[language][text]) {
        return cache[language][text];
      }

      // Kiểm tra xem text có chứa HTML tags không
      const hasHtmlTags = /<[a-z][\s\S]*>/i.test(text);
      if (hasHtmlTags) {
        // Không dịch text chứa HTML để tránh lỗi
        return text;
      }

      // Kiểm tra từ điển cứng (chạy bất đồng bộ)
      Promise.resolve().then(async () => {
        try {
          const { simpleDictionary } = await import('@/utils/translator');
          if (simpleDictionary && simpleDictionary[language] && simpleDictionary[language][text]) {
            const translated = simpleDictionary[language][text];
            
            // Lưu vào cache
            setCache((prevCache) => ({
              ...prevCache,
              [language]: {
                ...(prevCache[language] || {}),
                [text]: translated,
              },
            }));
          }
        } catch (e) {
          // Bỏ qua lỗi nếu không import được
        }
      });

      // Nếu chưa có trong cache, bắt đầu dịch bất đồng bộ
      translateText(text, language).catch(console.error);

      // Trả về text gốc trong khi đợi dịch
      return text;
    },
    [language, cache, translateText, setCache]
  );

  // Hàm thay đổi ngôn ngữ
  const changeLanguage = useCallback(
    (lang: string) => {
      setLanguage(lang);
      router.refresh(); // Refresh trang để cập nhật UI
    },
    [router]
  );

  const value: TranslationContextType = {
    language,
    changeLanguage,
    translate,
    isLoading,
  };

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
};

export default TranslationContext; 