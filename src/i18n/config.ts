// Các ngôn ngữ được hỗ trợ
export const locales = ['vi', 'en'] as const;

// Kiểu dữ liệu cho các ngôn ngữ được hỗ trợ
export type Locale = (typeof locales)[number];

// Ngôn ngữ mặc định
export const defaultLocale: Locale = 'vi';

// Tên hiển thị của các ngôn ngữ
export const localeNames: Record<Locale, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
}; 