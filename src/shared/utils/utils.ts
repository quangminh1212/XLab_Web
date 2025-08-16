import { type ClassValue, clsx as _clsx } from 'clsx';
import { twMerge as _twMerge } from 'tailwind-merge';

const twMerge = _twMerge ?? ((...inputs: ClassValue[]) => inputs.filter(Boolean).join(' '));
const clsx = _clsx ?? ((...inputs: ClassValue[]) => inputs.filter(Boolean).join(' '));

import { products } from '@/data/mockData';
import { Product } from '@/types';

/**
 * Kết hợp các class CSS với clsx và tailwind-merge
 * Cho phép kết hợp nhiều className động và loại bỏ các class trùng lặp
 * @param inputs Danh sách các class cần kết hợp
 * @returns Chuỗi class đã được kết hợp
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function containerClass(...additionalClasses: ClassValue[]) {
  return cn('container-custom', ...additionalClasses);
}

/**
 * Format a number as Vietnamese currency (VND)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

/**
 * Truncate a string to a specified length
 */
export function truncateString(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * Get the category name from its ID
 */
export function getCategoryName(categoryId: string, categories: any[]): string {
  const category = categories.find((cat) => cat.id === categoryId);
  return category ? category.name : 'Unknown';
}

/**
 * Get store name from its ID
 */
export function getStoreName(storeId: string, stores: any[]): string {
  const store = stores.find((store) => store.id === storeId);
  return store ? store.name : 'Unknown';
}

/**
 * Derive a URL-friendly slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Check if a user has admin role
 */
export function isAdmin(user: any): boolean {
  return user?.role === 'ADMIN';
}

/**
 * Check if a user is a store owner
 */
export function isStoreOwner(user: any): boolean {
  return user?.role === 'STORE_OWNER';
}

/**
 * Check if a user owns a specific store
 */
export function ownsStore(user: any, storeId: string): boolean {
  if (!user || !storeId) return false;
  if (isAdmin(user)) return true;
  return user.stores?.some((store: any) => store.id === storeId) || false;
}

/**
 * Calculates the discount percentage
 */
export function calculateDiscountPercentage(originalPrice: number, salePrice: number): number {
  if (!salePrice || originalPrice <= 0) return 0;
  const discount = ((originalPrice - salePrice) / originalPrice) * 100;
  return Math.round(discount);
}

/**
 * Truncates text to a specific length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Generates a random color based on a string
 */
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
 * Gets file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

/**
 * Formats file size to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Creates a debounced function
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
 * Gets a product by slug from mockData
 */
// Caching mechanism for storing view counts
const viewCountCache: Record<string, number> = {};
const downloadCountCache: Record<string, number> = {};

// Initialize cache from mockData
products.forEach((product) => {
  if (product.slug) {
    viewCountCache[product.slug] = product.viewCount ?? 0;
    downloadCountCache[product.slug] = product.downloadCount ?? 0;
  }
});

/**
 * Get product by slug
 */
export function getProductBySlug(slug: string): Product | undefined {
  if (!slug) return undefined;
  return products.find((product) => product.slug === slug);
}

/**
 * Increment and get product view count
 */
export function incrementViewCount(slug: string): number {
  if (!slug) return 0;

  const product = getProductBySlug(slug);
  if (!product) return 0;

  try {
    if (typeof product.viewCount !== 'number') {
      product.viewCount = 0;
    }
    product.viewCount += 1;

    // Cập nhật cache
    viewCountCache[slug] = product.viewCount;

    return product.viewCount;
  } catch (error) {
    console.error(`Lỗi khi tăng lượt xem cho ${slug}:`, error);
    return viewCountCache[slug] || 0;
  }
}

/**
 * Increment and get product download count
 */
export function incrementDownloadCount(slug: string): number {
  if (!slug) return 0;

  const product = getProductBySlug(slug);
  if (!product) return 0;

  try {
    if (typeof product.downloadCount !== 'number') {
      product.downloadCount = 0;
    }
    product.downloadCount += 1;

    // Cập nhật cache
    downloadCountCache[slug] = product.downloadCount;

    return product.downloadCount;
  } catch (error) {
    console.error(`Lỗi khi tăng lượt tải cho ${slug}:`, error);
    return downloadCountCache[slug] || 0;
  }
}

/**
 * Get current view count
 */
export function getViewCount(slug: string): number {
  if (!slug) return 0;
  return viewCountCache[slug] || 0;
}

/**
 * Get current download count
 */
export function getDownloadCount(slug: string): number {
  if (!slug) return 0;
  return downloadCountCache[slug] || 0;
}

// Cart type definitions
export interface CartItem {
  id: string;
  name: string;
  version?: string;
  price: number;
  quantity: number;
  image: string;
}

// Cart utility functions
export const getCartFromLocalStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];

  try {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error('Error getting cart from localStorage:', error);
    return [];
  }
};

export const saveCartToLocalStorage = (cart: CartItem[]): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

export const addItemToCart = (cart: CartItem[], item: CartItem): CartItem[] => {
  const existingItemIndex = cart.findIndex((cartItem) => cartItem.id === item.id);

  if (existingItemIndex >= 0) {
    // Item already exists, update quantity
    const newCart = [...cart];
    const target = newCart[existingItemIndex];
    if (target) {
      target.quantity += item.quantity;
    }
    return newCart;
  } else {
    // Add new item
    return [...cart, item];
  }
};

export const removeItemFromCart = (cart: CartItem[], itemId: string): CartItem[] => {
  return cart.filter((item) => item.id !== itemId);
};

export const updateItemQuantity = (
  cart: CartItem[],
  itemId: string,
  quantity: number,
): CartItem[] => {
  return cart.map((item) => {
    if (item.id === itemId) {
      return { ...item, quantity: Math.max(1, quantity) };
    }
    return item;
  });
};

export const clearCart = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('cart');
  }
  return [];
};

export const calculateCartTotals = (cart: CartItem[]) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = 0; // Không tính thuế
  const total = subtotal; // Tổng cộng bằng tạm tính

  return { subtotal, tax, total };
};
