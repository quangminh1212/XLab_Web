import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { products } from '@/data/mockData';
import { Product } from '@/types';

/**
 * Combines classNames with Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as Vietnamese currency (VND)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
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
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.name : 'Unknown';
}

/**
 * Get store name from its ID
 */
export function getStoreName(storeId: string, stores: any[]): string {
  const store = stores.find(store => store.id === storeId);
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
    const value = (hash >> (i * 8)) & 0xFF;
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
  ms = 300
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function(...args: Parameters<T>) {
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
products.forEach(product => {
  viewCountCache[product.slug] = product.viewCount;
  downloadCountCache[product.slug] = product.downloadCount;
});

/**
 * Get product by slug
 */
export function getProductBySlug(slug: string): Product | undefined {
  return products.find(product => product.slug === slug);
}

/**
 * Increment and get product view count
 */
export function incrementViewCount(slug: string): number {
  const product = getProductBySlug(slug);
  if (product) {
    if (!product.viewCount) {
      product.viewCount = 0;
    }
    product.viewCount += 1;
    return product.viewCount;
  }
  return 0;
}

/**
 * Increment and get product download count
 */
export function incrementDownloadCount(slug: string): number {
  const product = getProductBySlug(slug);
  if (product) {
    product.downloadCount += 1;
    return product.downloadCount;
  }
  return 0;
}

/**
 * Get current view count
 */
export function getViewCount(slug: string): number {
  return viewCountCache[slug] || 0;
}

/**
 * Get current download count
 */
export function getDownloadCount(slug: string): number {
  return downloadCountCache[slug] || 0;
} 