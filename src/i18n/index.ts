import { getRequestConfig } from 'next-intl/server';
import { locales } from './config';
import type { RequestConfig } from 'next-intl/server';

const messages = {
  vi: {
    common: {
      home: "Trang chủ",
      about: "Giới thiệu",
      contact: "Liên hệ"
    }
  },
  en: {
    common: {
      home: "Home",
      about: "About",
      contact: "Contact"
    }
  }
};

export async function getMessages({ locale }: { locale: string }) {
  return messages[locale as keyof typeof messages] || messages.vi;
}

export default getRequestConfig(async ({ locale = 'vi' }) => {
  const config: RequestConfig = {
    locale,
    messages: await getMessages({ locale }),
    timeZone: 'Asia/Ho_Chi_Minh',
    now: new Date(),
  };
  return config;
}); 