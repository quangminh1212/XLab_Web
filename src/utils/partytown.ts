/**
 * Cấu hình Partytown cho Next.js 15.2.4
 * Được sử dụng để chạy các script bên thứ ba trong một web worker
 */

export const partytownConfig = {
  debug: process.env.NODE_ENV === 'development',
  forward: ['dataLayer.push', 'fbq', 'ga', 'gtag', 'gtm'],
  lib: '/~partytown/',
};

/**
 * Hàm khởi tạo Partytown khi cần thiết
 * Gọi hàm này trong _app.tsx hoặc layout.tsx
 */
export function setupPartytown() {
  if (typeof window !== 'undefined') {
    // Khởi tạo Partytown khi cần thiết
    console.log('Partytown được khởi tạo');
  }
} 