export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  imageUrl: string;
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
  version?: string;
  size?: string;
  licenseType?: string;
  createdAt?: string;
  updatedAt?: string;
  isAccount?: boolean;
  type?: string;
  options?: { name: string; price: number }[];
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