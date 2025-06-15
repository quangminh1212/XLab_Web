import { getRequestConfig } from 'next-intl/server';
import { locales } from './config';

export default getRequestConfig(async ({ locale }) => {
  // Chỉ import ngôn ngữ được yêu cầu
  const messages = (await import(`./locales/${locale}`)).default;
  
  return {
    messages,
    // Thời gian tối đa để lưu cache các messages (mặc định là 1 giờ)
    now: new Date(),
  };
});

// Xuất các hàm tiện ích và cấu hình
export * from './config'; 