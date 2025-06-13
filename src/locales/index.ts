export type Language = 'vi' | 'en' | 'es';

// Kiểu dữ liệu cho các bản dịch
export type TranslationRecord = Record<string, string>;

// Import các namespace
import { adminVI, adminEN, adminES } from './namespaces/admin';
import { commonVI, commonEN, commonES } from './namespaces/common';
import { homeVI, homeEN, homeES } from './namespaces/home';
import { termsVI, termsEN, termsES } from './namespaces/terms';

// Kết hợp các bản dịch theo ngôn ngữ
const vi = {
  ...adminVI,
  ...commonVI,
  ...homeVI,
  ...termsVI,
};

const en = {
  ...adminEN,
  ...commonEN,
  ...homeEN,
  ...termsEN,
};

const es = {
  ...adminES,
  ...commonES,
  ...homeES,
  ...termsES,
};

export { vi, en, es };

// Hàm kiểm tra xem một key có tồn tại trong tất cả các ngôn ngữ hay không
export function validateTranslationKeys() {
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