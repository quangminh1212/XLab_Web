/**
 * Core application types
 * 
 * This file centralizes all shared types used across the application
 */

/**
 * Product related types
 */
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  longDescription?: string;
  imageUrl?: string;
  images?: string[] | { url: string; alt: string }[];
  descriptionImages?: string[];
  price: number;
  originalPrice?: number;
  salePrice?: number;
  categoryId: string;
  storeId?: string;
  discountPercentage?: number;
  tags?: string[];
  features?: string[];
  specifications?: { [key: string]: string };
  stock?: number;
  ratings?: number;
  reviewCount?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  relatedProducts?: string[];
  requiresShipping?: boolean;
  downloadCount?: number;
  viewCount?: number;
  rating?: number;
  weeklyPurchases?: number;
  totalSold?: number;
  version?: string;
  size?: string;
  licenseType?: string;
  createdAt?: string;
  updatedAt?: string;
  isAccount?: boolean;
  type?: string;
  options?: { name: string; price: number }[];
  versions?: {
    name: string;
    description?: string;
    price: number;
    originalPrice: number;
    features: string[];
  }[];
  defaultProductOption?: string;
  optionPrices?: { 
    [key: string]: { 
      price: number; 
      originalPrice: number 
    } 
  };
  productOptions?: string[];
}

/**
 * Category related types
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  productCount: number;
}

/**
 * Store related types
 */
export interface Store {
  id: string;
  name: string;
  slug: string;
  description: string;
  owner: string;
  imageUrl: string;
  website: string;
  active: boolean;
  createdAt: string;
}

/**
 * User related types
 */
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: 'USER' | 'ADMIN' | 'STORE_OWNER';
  stores?: Store[];
}

export interface Session {
  user?: User;
  expires: string;
}

/**
 * Cart related types
 */
export interface CartItem {
  id: string;
  name: string;
  version?: string;
  price: number;
  quantity: number;
  image: string;
  options?: {
    name: string;
    value: string;
  }[];
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

/**
 * Order related types
 */
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: 'processing' | 'confirmed' | 'completed' | 'cancelled';
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  paymentMethod: string;
}
