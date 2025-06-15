import { vi } from './vi';
import { en } from './en';

export type Language = 'vi' | 'en';

export const translations = {
  vi,
  en,
};

export type TranslationKey = keyof typeof vi; 