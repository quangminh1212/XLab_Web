export interface Product {
  id: number | string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  price: number;
  salePrice: number;
  categoryId: number | string;
  imageUrl: string;
  isFeatured: boolean;
  isNew: boolean;
  downloadCount: number;
  viewCount: number;
  rating: number;
  version: string;
  size: string;
  licenseType: string;
  createdAt: string;
  updatedAt: string;
  storeId: number | string;
  isAccount?: boolean;
  type?: string;
  features?: string[];
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