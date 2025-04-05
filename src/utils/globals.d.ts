/**
 * Định nghĩa toàn cục cho TypeScript
 * File này chứa các interface global được sử dụng xuyên suốt dự án
 */

// Mở rộng interface Window
declare global {
  interface Window {
    // Analytics
    dataLayer: any[];
    gtag: (command: string, id: string, config?: any) => void;
    
    // Social/tracking
    fbq?: (...args: any[]) => void;
    ga?: (...args: any[]) => void;
    gtm?: (...args: any[]) => void;
    
    // Debug flags
    _jsonChecked?: boolean;
  }
}

export {}; 