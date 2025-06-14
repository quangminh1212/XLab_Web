<<<<<<< HEAD
import vi from './vi';
import en from './en';
import es from './es';

export type Language = 'vi' | 'en' | 'es';

<<<<<<< HEAD
export const translations = {
=======
export const translations: Record<Language, Record<string, string>> = {
>>>>>>> parent of 8b6c7b2f (Merge commit '2e12e51b9d6fbcf0295e287983cd4b62520f02ad')
  vi,
  en,
  es
};

export default translations; 
=======
export type Language = 'vi' | 'en' | 'es';

export { default as vi } from './vi/index';
export { default as en } from './en/index';
export { default as es } from './es/index';

// Kiểu dữ liệu cho các bản dịch
export type TranslationRecord = Record<string, string>;

// Hàm kiểm tra xem một key có tồn tại trong tất cả các ngôn ngữ hay không
export function validateTranslationKeys() {
  const vi = require('./vi/index').default;
  const en = require('./en/index').default;
  const es = require('./es/index').default;
  
  const allKeys = new Set([
    ...Object.keys(vi),
    ...Object.keys(en),
    ...Object.keys(es)
  ]);
  
  const missingKeys = {
    vi: [] as string[],
    en: [] as string[],
    es: [] as string[]
  };
  
  allKeys.forEach(key => {
    if (!vi[key]) missingKeys.vi.push(key);
    if (!en[key]) missingKeys.en.push(key);
    if (!es[key]) missingKeys.es.push(key);
  });
  
  return {
    hasAllKeys: missingKeys.vi.length === 0 && missingKeys.en.length === 0 && missingKeys.es.length === 0,
    missingKeys
  };
} 
>>>>>>> dev_10
