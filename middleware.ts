import createMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './src/i18n/config';

export default createMiddleware({
  // Cấu hình ngôn ngữ từ i18n/config
  defaultLocale,
  locales,
  
  // Cho phép chuyển đổi ngôn ngữ (locale switching)
  localeDetection: true,
  
  // Bộ lọc đường dẫn không cần middleware
  pathnames: {
    // Các route cần đa ngôn ngữ
    '/': '/',
    '/about': '/about',
    '/contact': '/contact',
    '/products': '/products',
    '/products/[id]': '/products/[id]',
    '/cart': '/cart',
    '/checkout': '/checkout',
    '/login': '/login',
    '/register': '/register',
    '/account': '/account',
    '/orders/history': '/orders/history',
    '/notifications': '/notifications',
    // ...thêm các route khác nếu cần
  }
});

export const config = {
  // Không áp dụng cho API và các route tĩnh
  matcher: ['/((?!api|_next|.*\\..*).*)']
}; 