import { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { products } from '@/data/mockData';
import { Product } from '@/types';
import { Language } from '@/i18n';

// Safe imports to handle potential undefined modules
let clsx: any;
try {
  clsx = require('clsx').clsx;
} catch (error) {
  console.warn('Failed to import clsx, using fallback');
  clsx = (...inputs: any[]) => inputs.filter(Boolean).join(' ');
}

/**
 * CSS & UI Utilities
 */
export function cn(...inputs: ClassValue[]) {
  try {
    return twMerge(clsx(inputs));
  } catch (error) {
    console.warn('Error in cn function, using fallback:', error);
    return inputs.filter(Boolean).join(' ');
  }
}

export function containerClass(...additionalClasses: ClassValue[]) {
  return cn('container-custom', ...additionalClasses);
}

/**
 * Currency & Formatting Utilities
 */
export function getCurrencyByLanguage(language: Language = 'vie') {
  return language === 'eng' ? 'USD' : 'VND';
}

export function getExchangeRate() {
  return 24000; // Tỉ giá ước tính VND/USD
}

export function formatCurrency(amount: number, language?: Language): string {
  let currentLang = language;
  
  if (!currentLang && typeof window !== 'undefined') {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'vie' || savedLanguage === 'eng')) {
      currentLang = savedLanguage as Language;
    } else {
      currentLang = 'vie'; // Mặc định là tiếng Việt
    }
  }
  
  if (currentLang === 'eng') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount / getExchangeRate());
  } else {
    return new Intl.NumberFormat('vi-VN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount) + ' đ';
  }
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * String manipulation utilities
 */
export function truncateString(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

/**
 * User & Permission Utilities
 */
export function isAdmin(user: any): boolean {
  return user?.role === 'ADMIN';
}

export function isStoreOwner(user: any): boolean {
  return user?.role === 'STORE_OWNER';
}

export function ownsStore(user: any, storeId: string): boolean {
  if (!user || !storeId) return false;
  if (isAdmin(user)) return true;
  return user.stores?.some((store: any) => store.id === storeId) || false;
}

/**
 * Data Utilities
 */
export function getCategoryName(categoryId: string, categories: any[]): string {
  const category = categories.find((cat) => cat.id === categoryId);
  return category ? category.name : 'Unknown';
}

export function getStoreName(storeId: string, stores: any[]): string {
  const store = stores.find((store) => store.id === storeId);
  return store ? store.name : 'Unknown';
}

export function calculateDiscountPercentage(originalPrice: number, salePrice: number): number {
  if (!salePrice || originalPrice <= 0) return 0;
  const discount = ((originalPrice - salePrice) / originalPrice) * 100;
  return Math.round(discount);
}

export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }

  return color;
}

/**
 * Performance Utilities
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  ms = 300,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
}

/**
 * Product Related Utilities
 */
const viewCountCache: Record<string, number> = {};
const downloadCountCache: Record<string, number> = {};

// Initialize cache from mockData
products.forEach((product) => {
  viewCountCache[product.slug] = product.viewCount || 0;
  downloadCountCache[product.slug] = product.downloadCount || 0;
});

export function getProductBySlug(slug: string): Product | undefined {
  if (!slug) return undefined;
  return products.find((product) => product.slug === slug);
}

export function incrementViewCount(slug: string): number {
  if (!slug) return 0;
  
  const count = (viewCountCache[slug] || 0) + 1;
  viewCountCache[slug] = count;
  
  // Lưu vào localStorage để giữ dữ liệu giữa các phiên
  try {
    if (typeof window !== 'undefined') {
      const storedCounts = JSON.parse(localStorage.getItem('productViewCounts') || '{}');
      storedCounts[slug] = count;
      localStorage.setItem('productViewCounts', JSON.stringify(storedCounts));
    }
  } catch (error) {
    console.error('Failed to save view count to localStorage', error);
  }
  
  return count;
}

export function incrementDownloadCount(slug: string): number {
  if (!slug) return 0;
  
  const count = (downloadCountCache[slug] || 0) + 1;
  downloadCountCache[slug] = count;
  
  try {
    if (typeof window !== 'undefined') {
      const storedCounts = JSON.parse(localStorage.getItem('productDownloadCounts') || '{}');
      storedCounts[slug] = count;
      localStorage.setItem('productDownloadCounts', JSON.stringify(storedCounts));
    }
  } catch (error) {
    console.error('Failed to save download count to localStorage', error);
  }
  
  return count;
}

export function getViewCount(slug: string): number {
  return viewCountCache[slug] || 0;
}

export function getDownloadCount(slug: string): number {
  return downloadCountCache[slug] || 0;
}

/**
 * Shopping Cart Utilities
 */
export interface CartItem {
  id: string;
  name: string;
  version?: string;
  price: number;
  quantity: number;
  image: string;
}

export const getCartFromLocalStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Failed to get cart from localStorage', error);
    return [];
  }
};

export const saveCartToLocalStorage = (cart: CartItem[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Failed to save cart to localStorage', error);
  }
};

export const addItemToCart = (cart: CartItem[], item: CartItem): CartItem[] => {
  const existingItemIndex = cart.findIndex((cartItem) => cartItem.id === item.id);
  
  if (existingItemIndex >= 0) {
    return cart.map((cartItem, index) =>
      index === existingItemIndex
        ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
        : cartItem
    );
  }
  
  return [...cart, item];
};

export const removeItemFromCart = (cart: CartItem[], itemId: string): CartItem[] => {
  return cart.filter((cartItem) => cartItem.id !== itemId);
};

export const updateItemQuantity = (
  cart: CartItem[],
  itemId: string,
  quantity: number,
): CartItem[] => {
  return cart.map((cartItem) =>
    cartItem.id === itemId ? { ...cartItem, quantity: Math.max(1, quantity) } : cartItem
  );
};

export const clearCart = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('cart');
  }
  return [];
};

export const calculateCartTotals = (cart: CartItem[]) => {
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  
  return { itemCount, subtotal };
};
