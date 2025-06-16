'use client';

import { ReactNode } from 'react';
import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl';

interface ClientI18nProviderProps {
  messages: AbstractIntlMessages;
  locale: string;
  children: ReactNode;
  now?: Date;
  timeZone?: string;
}

/**
 * Bọc nội dung cần dịch ở phía client
 * Giúp tránh lỗi hydration và đảm bảo dịch chính xác
 */
export default function ClientI18nProvider({
  messages,
  locale,
  children,
  now,
  timeZone
}: ClientI18nProviderProps) {
  return (
    <NextIntlClientProvider 
      locale={locale}
      messages={messages}
      defaultTranslationValues={{
        strong: (chunks) => <strong>{chunks}</strong>,
        em: (chunks) => <em>{chunks}</em>,
      }}
      now={now}
      timeZone={timeZone}
    >
      {children}
    </NextIntlClientProvider>
  );
} 