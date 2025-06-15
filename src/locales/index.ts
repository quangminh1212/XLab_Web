import viNamespace from './vi';
import enNamespace from './en';

// Xuất các bản dịch
const viTranslations = viNamespace;
const enTranslations = enNamespace;

export { viTranslations, enTranslations };

// Định nghĩa kiểu ngôn ngữ
export type Language = 'vi' | 'en';

// Xuất một hàm helper để lấy bản dịch
export function getTranslations(lang: Language) {
  return lang === 'vi' ? viTranslations : enTranslations;
} 