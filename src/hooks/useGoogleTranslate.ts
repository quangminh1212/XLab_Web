'use client';

import { useState, useCallback } from 'react';
import { useTranslation } from '@/context/TranslationContext';

interface TranslateOptions {
  targetLanguage?: string;
  format?: 'text' | 'html';
}

interface TranslationResult {
  translatedText: string;
  sourceLanguage: string;
}

export function useGoogleTranslate() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isTranslated, setTranslated, preferredLanguage } = useTranslation();

  const translateText = useCallback(
    async (
      text: string,
      options: TranslateOptions = {}
    ): Promise<TranslationResult | null> => {
      if (!text.trim()) return null;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const targetLanguage = options.targetLanguage || preferredLanguage || 'en';
        
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            targetLanguage,
            format: options.format || 'text',
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Translation failed');
        }

        const data = await response.json();
        const translatedData = data.data.translations[0];
        
        // Update context state after successful translation
        setTranslated(true);
        
        return {
          translatedText: translatedData.translatedText,
          sourceLanguage: translatedData.detectedSourceLanguage || 'vi',
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown translation error';
        setError(errorMessage);
        console.error('Translation error:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [preferredLanguage, setTranslated]
  );

  return {
    translateText,
    isLoading,
    error,
    isTranslated,
  };
} 