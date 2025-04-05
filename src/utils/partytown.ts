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
  try {
    if (typeof window !== 'undefined') {
      // Kiểm tra window tồn tại và thực hiện các thao tác an toàn
      console.log('Partytown được khởi tạo');
      
      // Khởi tạo window.dataLayer nếu chưa tồn tại
      if (!window.dataLayer) {
        window.dataLayer = [];
      }
    }
  } catch (error) {
    console.error('Error initializing Partytown:', error);
  }
}

// Thêm interface cho window global để TypeScript không báo lỗi
declare global {
  interface Window {
    dataLayer: any[];
    fbq?: (...args: any[]) => void;
    ga?: (...args: any[]) => void;
    gtm?: (...args: any[]) => void;
  }
} 