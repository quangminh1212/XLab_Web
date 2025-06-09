'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';

/**
 * Hook để dịch tiêu đề trang và cập nhật theo ngôn ngữ
 * @param title Tiêu đề trang bằng tiếng Việt
 * @returns Tiêu đề đã được dịch theo ngôn ngữ hiện tại
 */
export function useTranslatedTitle(title: string): string {
  const { language, translate } = useTranslation();
  const [translatedTitle, setTranslatedTitle] = useState<string>(title);
  
  useEffect(() => {
    if (language === 'vi') {
      setTranslatedTitle(title);
    } else {
      // Dịch tiêu đề
      setTranslatedTitle(translate(title));
    }
  }, [title, language, translate]);
  
  return translatedTitle;
}

/**
 * Hook để dịch động một mảng các mục
 * @param items Mảng các mục cần dịch (chứa thuộc tính name)
 * @returns Mảng đã được dịch theo ngôn ngữ hiện tại
 */
export function useTranslatedItems<T extends { name: string }>(items: T[]): T[] {
  const { language, translate } = useTranslation();
  const [translatedItems, setTranslatedItems] = useState<T[]>(items);
  
  useEffect(() => {
    if (language === 'vi') {
      setTranslatedItems(items);
    } else {
      // Dịch tất cả tên các mục
      const translated = items.map(item => ({
        ...item,
        name: translate(item.name)
      }));
      setTranslatedItems(translated);
    }
  }, [items, language, translate]);
  
  return translatedItems;
}

/**
 * Hook để dịch động các trường trong một đối tượng
 * @param object Đối tượng cần dịch
 * @param fields Các trường cần dịch
 * @returns Đối tượng đã được dịch theo ngôn ngữ hiện tại
 */
export function useTranslatedObject<T extends Record<string, any>>(
  object: T, 
  fields: string[]
): T {
  const { language, translate } = useTranslation();
  const [translatedObject, setTranslatedObject] = useState<T>(object);
  
  useEffect(() => {
    if (language === 'vi') {
      setTranslatedObject(object);
    } else {
      // Dịch các trường được chỉ định
      const translated = { ...object } as T;
      fields.forEach(field => {
        if (typeof object[field] === 'string') {
          translated[field as keyof T] = translate(object[field]) as any;
        }
      });
      setTranslatedObject(translated);
    }
  }, [object, fields, language, translate]);
  
  return translatedObject;
}

export default useTranslatedTitle; 