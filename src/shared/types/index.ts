// Re-export all types from existing types folder
export * from './types/auth';
export * from './types/product';
export * from './types/cart';
export * from './types/order';

// Common shared types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SelectOption {
  label: string;
  value: string | number;
}

export type Status = 'idle' | 'loading' | 'success' | 'error';

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
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  productCount: number;
}

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

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: 'USER' | 'ADMIN';
}

export interface Session {
  user?: User;
  expires: string;
}

export interface Coupon {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: 'percentage' | 'fixed' | 'cashback';
  value: number;
  minOrder?: number;
  maxDiscount?: number;
  usageLimit?: number;
  userLimit?: number;
  usedCount: number;
  userUsage?: { [email: string]: number };
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  applicableProducts?: string[];
  isPublic: boolean;
  forUsers?: string[];
  discountAmount?: number;
  isCashback?: boolean;
}
