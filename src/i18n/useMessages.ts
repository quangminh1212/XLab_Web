'use client';

import { usePathname } from 'next/navigation';
import { messages } from './index';
import { getLocaleFromPath } from './index';

export function useMessages() {
  const pathname = usePathname() || '';
  const locale = getLocaleFromPath(pathname);
  
  // Get messages for the current locale, fallback to Vietnamese
  const localeMessages = messages[locale as keyof typeof messages] || messages.vi;
  
  return localeMessages;
} 